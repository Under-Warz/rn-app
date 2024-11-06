import {
  FFmpegKit,
  FFmpegKitConfig,
  FFprobeKit,
  Session,
  SessionState,
} from "ffmpeg-kit-react-native";
import { Platform } from "react-native";
import { Dirs } from "react-native-file-access";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { ReturnCode } from "ffmpeg-kit-react-native";

const getUri = ({ fileUri }: { fileUri: string }) =>
  new Promise<string>((resolve, reject) => {
    if (Platform.OS === "ios") {
      resolve(fileUri);
    } else {
      FFmpegKitConfig.getSafParameterForRead(fileUri)
        .then((uri) => {
          resolve(uri);
        })
        .catch((e) => {
          reject(e);
        });
    }
  });

export const getMediaInformation = ({ fileUri }: { fileUri: string }) =>
  new Promise<Record<string, unknown>>((resolve, reject) => {
    getUri({ fileUri }).then((uri) => {
      FFprobeKit.getMediaInformation(uri)
        .then((session) => {
          const information = session.getMediaInformation();

          if (information) {
            const properties = information.getFormatProperties();
            resolve(properties);
          } else {
            reject();
          }
        })
        .catch((error) => reject(error));
    });
  });

export const getVideoInformationsForOptimization = ({
  fileUri,
}: {
  fileUri: string;
}) =>
  new Promise<{
    width: number;
    height: number;
    framerate: number;
  }>((resolve, reject) => {
    getUri({ fileUri }).then((uri) => {
      FFprobeKit.execute(
        `-v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -of json -loglevel error ${uri}`
      )
        .then(async (session) => {
          const raw = await session.getOutput();

          if (raw) {
            const output = JSON.parse(raw);
            const framerateValues = output.streams[0].r_frame_rate.split("/");

            resolve({
              width: output.streams[0].width,
              height: output.streams[0].height,
              framerate: framerateValues[0] / framerateValues[1],
            });
          } else {
            reject(new Error("Cannot get media information for optimization"));
          }
        })
        .catch((error) => reject(error));
    });
  });

export const getAudioInformationsForOptimization = ({
  fileUri,
}: {
  fileUri: string;
}) =>
  new Promise<{
    bitrate: number;
  }>((resolve, reject) => {
    getUri({ fileUri }).then((uri) => {
      FFprobeKit.execute(
        `-v error -select_streams a:0 -show_entries stream=bit_rate -of json -loglevel error ${uri}`
      )
        .then(async (session) => {
          const raw = await session.getOutput();

          if (raw) {
            const output = JSON.parse(raw);
            resolve({
              bitrate: output.streams[0]?.bit_rate || 150,
            });
          } else {
            reject(new Error("Cannot get media information for optimization"));
          }
        })
        .catch((error) => reject(error));
    });
  });

export const optimizeMedia = ({
  fileUri,
  fileName,
  resolution,
  framerate,
  crf,
  audioBitrate,
}: {
  fileUri: string;
  fileName: string;
  resolution: {
    width: number;
    height: number;
  };
  framerate: number;
  crf: number;
  audioBitrate: number;
}) =>
  new Promise<{
    outputUri?: string;
    duration?: number;
    cancel?: boolean;
  }>((resolve, reject) => {
    const outputFileName = `${fileName.split(".")[0]}_optimized.${
      fileName.split(".")[1]
    }`;
    const outputUri = `${Dirs.CacheDir}/${outputFileName}`;

    getUri({ fileUri }).then(async (uri) => {
      if (__DEV__) {
        console.log(
          `FFMPEG Query : -noautorotate -i ${uri} -c:v libx264 -r ${framerate} -s:v ${resolution.width}x${resolution.height} -crf ${crf} -c:a aac -b:a ${audioBitrate}K -ar 44100 -loglevel error '${outputUri}'`
        );
      }

      await activateKeepAwakeAsync();

      FFmpegKit.execute(
        `-y -noautorotate -i ${uri} -c:v libx264 -r ${framerate} -s:v ${
          resolution.width
        }x${
          resolution.height
        } -crf ${crf} -c:a aac -b:a ${audioBitrate}K -ar 44100 ${
          __DEV__ ? "" : "-loglevel error"
        } '${outputUri}'`
      )
        .then(async (session: Session) => {
          const returnCode = await session.getReturnCode();
          const duration = await session.getDuration();

          if (ReturnCode.isSuccess(returnCode)) {
            return resolve({
              outputUri: `file://${outputUri}`,
              duration,
            });
          }

          resolve({
            cancel: true,
          });
        })
        .catch((error) => reject(error))
        .finally(async () => {
          await deactivateKeepAwake();
        });
    });
  });

export const cancelAllSessions = () => FFmpegKit.cancel();
