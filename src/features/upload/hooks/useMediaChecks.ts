import { useConnectionState } from "@/app/technical/hooks/useConnectionState";
import { getMediaInformation } from "@/app/technical/utils/ffmpegQueries";
import {
  hasEnoughSpace,
  isFileBitrateValid,
  isFileExensionValid,
  isFileSizeValid,
} from "@/features/upload/utils/mediaChecks";
import { NetInfoStateType } from "@react-native-community/netinfo";
import { MediaInformation } from "ffmpeg-kit-react-native";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FileSystem } from "react-native-file-access";

enum E_OPTIMIZATION_KEYS {
  BITRATE = "BITRATE",
  DISK_SPACE = "DISK_SPACE",
  NO_WIFI = "NO_WIFI",
}

const I18N_KEY = "features.upload.processingMedia.errors";

export const useMediaChecks = ({
  fileUri,
  fileSize,
  fileMimeType,
}: {
  fileUri: string;
  fileSize: number;
  fileMimeType: string;
}) => {
  const { t } = useTranslation();
  const { getConnectionState } = useConnectionState();

  const [isLoading, setLoading] = useState(false);

  const checkValidity = useCallback(
    () =>
      new Promise<boolean>((resolve, reject) => {
        let errors = [];

        if (!isFileExensionValid(fileMimeType)) {
          errors.push(t(`${I18N_KEY}.mimeType`));
        }

        if (!isFileSizeValid(fileSize)) {
          errors.push(t(`${I18N_KEY}.fileSize`));
        }

        if (errors.length === 0) {
          return resolve(true);
        }

        return reject(errors);
      }),
    [fileUri, fileSize, fileMimeType]
  );

  const checkOptimizationCapabilities = useCallback(
    () =>
      new Promise<boolean>((resolve, reject) => {
        setLoading(true);

        const checks = {
          [E_OPTIMIZATION_KEYS.BITRATE]: false,
          [E_OPTIMIZATION_KEYS.DISK_SPACE]: false,
          [E_OPTIMIZATION_KEYS.NO_WIFI]: false,
        };

        Promise.all([
          getMediaInformation({ fileUri }),
          FileSystem.df(),
          getConnectionState(),
        ])
          .then(([properties, { internal_free }, connectionType]) => {
            // No optimization if bitrate not reach
            if (
              isFileBitrateValid(
                Number(properties[MediaInformation.KEY_BIT_RATE])
              )
            ) {
              checks[E_OPTIMIZATION_KEYS.BITRATE] = true;
            }

            // No optimization if not enough disk space
            if (
              hasEnoughSpace(
                Number(properties[MediaInformation.KEY_DURATION]),
                internal_free
              )
            ) {
              checks[E_OPTIMIZATION_KEYS.DISK_SPACE] = true;
            }

            // No optimization if wifi connection
            checks[E_OPTIMIZATION_KEYS.NO_WIFI] =
              connectionType !== NetInfoStateType.wifi;

            resolve(Object.values(checks).every(Boolean));
          })
          .catch(() => {
            reject([t(`${I18N_KEY}.fileInfos`)]);
          })
          .finally(() => {
            setLoading(false);
          });
      }),
    []
  );

  return {
    isLoading,
    checkValidity,
    checkOptimizationCapabilities,
  };
};
