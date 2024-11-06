import Config from "@/app/config";
import { getDivisibleValue } from "@/app/technical/utils/getDivisibleValue";

export const getMaxVideoResolution = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  let targetWidth = width;
  let targetHeight = height;

  if (width > Config.maxWidth || height > Config.maxHeight) {
    if (width / Config.maxWidth > height / Config.maxHeight) {
      targetWidth = Config.maxWidth;
      targetHeight = getDivisibleValue(
        Math.round(height * (Config.maxWidth / width))
      );
    } else {
      targetHeight = Config.maxHeight;
      targetWidth = getDivisibleValue(
        Math.round(width * (Config.maxHeight / height))
      );
    }
  }

  return {
    width: targetWidth,
    height: targetHeight,
  };
};

export const getOptimizedVideoFramerate = ({
  framerate,
}: {
  framerate: number;
}) => Math.min(framerate, Config.targetFramerate);

export const getCRF = ({
  framerate,
  width,
  height,
}: {
  framerate: number;
  width: number;
  height: number;
}) => {
  const crfFramerateKeys = Object.keys(Config.crf).sort(
    (a, b) => Number(b) - Number(a)
  );

  // Get resolution depend on orientation
  const actualResolution = height < width ? height : width;

  // Get max framerate options by default
  let resolutions: Record<number, number> = Config.crf[crfFramerateKeys[0]];

  // Search matched framerate in config
  for (const crfFramerate of crfFramerateKeys) {
    if (framerate < Number(crfFramerate)) {
      resolutions = Config.crf[crfFramerate];
    }
  }

  // Search matched resolution in config
  for (const resolution of Object.keys(resolutions).sort(
    (a, b) => Number(b) - Number(a)
  )) {
    if (actualResolution >= Number(resolution)) {
      return resolutions[resolution];
    }
  }
};

export const getOptimizedAudioBitrate = ({ bitrate }: { bitrate: number }) =>
  Math.min(bitrate, Config.targetAudioBitrate);
