import Config from "@/app/config";
import { formatMegaByteToByte } from "@/app/technical/utils/format";

const VALID_EXTENSIONS: string[] = Config.validExtensions || [];

export const isFileExensionValid = (fileExtension: string) =>
  VALID_EXTENSIONS.some((ext) => fileExtension.includes(ext));

export const isFileSizeValid = (fileSize: number) =>
  Config.maxFileSize > 0 &&
  fileSize <= formatMegaByteToByte(Config.maxFileSize);

export const isFileBitrateValid = (fileBitrate: number) =>
  fileBitrate > Config.maxBitrate;

export const hasEnoughSpace = (fileDuration: number, freeSpace: number) => {
  const targetFileSize = Config.targetBitrate * fileDuration;

  return freeSpace > 1.1 * targetFileSize;
};
