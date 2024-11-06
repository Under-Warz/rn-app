import type { Config } from "@/app/config/index.type";

export const STREAMLIKE: Config = {
  apiHostname: "api.streamlike.com",
  apiHostnameEditable: false,
  maxFileSize: 2000,
  validExtensions: ["audio/", "video/"],
  maxBitrate: 12000,
  targetBitrate: 5500,
  maxWidth: 1920,
  maxHeight: 1080,
  targetFramerate: 30,
  crf: {
    30: {
      2160: 30,
      1080: 28,
      720: 28,
      480: 28,
    },
    60: {
      2160: 27,
      1080: 24,
      720: 24,
      480: 24,
    },
  },
  targetAudioBitrate: 192,
  uploadTimeout: 900000, // 15 min
};
