import {
  useCreateMediaMutation,
  useUploadMediaMutation,
} from "@/app/services/streamlike";
import { useAppDispatch } from "@/app/technical/hooks/useAppDispatch";
import { useAppSelector } from "@/app/technical/hooks/useAppSelector";
import { E_MEDIA_TYPE } from "@/app/technical/types";
import { fancyTimeFormat } from "@/app/technical/utils/fancyTimeFormat";
import {
  cancelAllSessions,
  getAudioInformationsForOptimization,
  getVideoInformationsForOptimization,
  optimizeMedia,
} from "@/app/technical/utils/ffmpegQueries";
import { getPermalink } from "@/app/technical/utils/getPermalink";
import { addEntry } from "@/features/settings/state/logs.slice";
import { useConnectionPermission } from "@/features/upload/hooks/useConnectionPermission";
import { useMediaChecks } from "@/features/upload/hooks/useMediaChecks";
import { selectUploadProgress } from "@/features/upload/state/upload.slice";
import {
  getCRF,
  getMaxVideoResolution,
  getOptimizedAudioBitrate,
  getOptimizedVideoFramerate,
} from "@/features/upload/utils/mediaOptimizations";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FileSystem } from "react-native-file-access";

const I18N_KEY = "features.upload.processingMedia";

export const useMediaProcessFlow = ({
  fileUri,
  fileSize,
  fileName,
  fileMimeType,
  mediaType,
}: {
  fileUri: string;
  fileSize: number;
  fileName: string;
  fileMimeType: string;
  mediaType: E_MEDIA_TYPE;
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const requestConnectionPermission = useConnectionPermission();
  const {
    isLoading: isCheckingMedia,
    checkValidity,
    checkOptimizationCapabilities,
  } = useMediaChecks({
    fileUri,
    fileSize,
    fileMimeType,
  });

  const [createMedia, { isLoading: isCreatingMedia }] =
    useCreateMediaMutation();
  const [
    uploadMedia,
    {
      isLoading: isUploadingMedia,
      isSuccess: isUploaded,
      startedTimeStamp,
      fulfilledTimeStamp,
    },
  ] = useUploadMediaMutation();

  const uploadProgress = useAppSelector(selectUploadProgress);

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [mediaId, setMediaId] = useState<string>();
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState<string>(
    t(`${I18N_KEY}.status.initializing`)
  );
  const [isCancelled, setIsCancelled] = useState(false);
  const [onResume, setOnResume] = useState<() => Promise<void>>();

  const createMediaEntry = useCallback(
    async ({
      fileName,
      mediaType,
    }: {
      fileName: string;
      mediaType: E_MEDIA_TYPE;
    }) => {
      try {
        const { id } = await createMedia({
          permalink: getPermalink(fileName),
          name: fileName,
          type: mediaType,
        }).unwrap();

        setMediaId(id);
        return id;
      } catch (e) {
        if (e.status === "FETCH_ERROR") {
          throw new Error(t("errors.FETCH_ERROR"));
        } else {
          throw new Error(
            e.data?.data?.errors[0] || t(`${I18N_KEY}.errors.createMedia`)
          );
        }
      }
    },
    []
  );

  const uploadMediaFile = useCallback(
    async ({
      id,
      uri,
      name,
      mimeType,
      deleteFileOnSucceed,
    }: {
      id: string;
      uri: string;
      name: string;
      mimeType: string;
      deleteFileOnSucceed: boolean;
    }) => {
      // Reset state on upload
      setOnResume(undefined);
      setError(undefined);

      try {
        const formData = new FormData();
        formData.append("source[encode][media_file]", {
          uri,
          name,
          type: mimeType,
        });

        await uploadMedia({
          id,
          formData,
        });

        // Delete optimized file
        if (deleteFileOnSucceed) {
          try {
            await FileSystem.unlink(uri);
          } catch (e) {
            console.error(`Cannot delete optimized file at ${uri}`);
          }
        }
      } catch (e) {
        // Display resume button on connection loss
        if (e.status === "FETCH_ERROR") {
          setOnResume(() => {
            return () =>
              uploadMediaFile({
                id,
                uri,
                name,
                mimeType,
                deleteFileOnSucceed,
              });
          });

          setError(t("errors.FETCH_ERROR"));
        } else {
          setError(
            e.data?.data?.errors[0] || t(`${I18N_KEY}.errors.uploadMedia`)
          );
        }
      }
    },
    []
  );

  useEffect(() => {
    if (uploadProgress > 0 && isUploadingMedia) {
      setStatus(
        t(`${I18N_KEY}.status.uploading`, { progress: uploadProgress ?? 0 })
      );
    }
  }, [uploadProgress, isUploadingMedia]);

  useEffect(() => {
    if (isUploaded) {
      const duration = fulfilledTimeStamp - startedTimeStamp;
      dispatch(
        addEntry(`${fileName} uploaded in ${fancyTimeFormat(duration / 1000)}`)
      );
    }
  }, [isUploaded]);

  useEffect(() => {
    (async () => {
      let fileToUploadUri = fileUri;

      try {
        // Get connection authorization
        const hasConnectionPermission = await requestConnectionPermission();
        if (!hasConnectionPermission) {
          setIsCancelled(true);
          return;
        }

        // Check media validity
        const isValid = await checkValidity();

        // Create media entry & check if media can be optimized
        if (isValid) {
          const id = await createMediaEntry({
            fileName,
            mediaType,
          });

          const canBeOptimized =
            mediaType === E_MEDIA_TYPE.VIDEO
              ? await checkOptimizationCapabilities()
              : false;
          let optimizationCompleted = canBeOptimized ? false : true;

          // Optimized media
          if (canBeOptimized) {
            const [{ width, height, framerate }, { bitrate }] =
              await Promise.all([
                getVideoInformationsForOptimization({ fileUri }),
                getAudioInformationsForOptimization({ fileUri }),
              ]);
            const maxVideoResolution = getMaxVideoResolution({ width, height });

            setStatus(t(`${I18N_KEY}.status.optimizing`));
            setIsOptimizing(true);

            const optimizedFramerate = getOptimizedVideoFramerate({
              framerate,
            });

            const { outputUri, duration, cancel } = await optimizeMedia({
              fileUri,
              fileName,
              resolution: maxVideoResolution,
              framerate: optimizedFramerate,
              crf: getCRF({
                framerate: optimizedFramerate,
                width: maxVideoResolution.width,
                height: maxVideoResolution.height,
              }),
              audioBitrate: getOptimizedAudioBitrate({ bitrate }),
            });

            if (!cancel) {
              optimizationCompleted = true;

              dispatch(
                addEntry(
                  `${fileName} optimized in ${fancyTimeFormat(duration / 1000)}`
                )
              );
              setIsOptimizing(false);
              fileToUploadUri = outputUri;
            }
          }

          // Upload media
          if (optimizationCompleted) {
            await uploadMediaFile({
              id,
              uri: fileToUploadUri,
              name: fileName,
              mimeType: fileMimeType,
              deleteFileOnSucceed: canBeOptimized,
            });
          }
        }
      } catch (e) {
        console.error(e);
        setError(e.message);
        setIsOptimizing(false);
        setStatus("");
      } finally {
        // Remove cache file
        FileSystem.unlink(fileUri).catch(() => {
          console.error(`Cannot delete source file at ${fileUri}`);
        });
      }
    })();

    return () => {
      // TODO: cancel executing requests on unmount (depend on axios)
      cancelAllSessions();
    };
  }, []);

  return {
    isLoading:
      isCheckingMedia || isOptimizing || isCreatingMedia || isUploadingMedia,
    isUploaded,
    status,
    error,
    mediaId,
    isCancelled,
    onResume,
  };
};
