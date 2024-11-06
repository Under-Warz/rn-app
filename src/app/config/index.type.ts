export type Config = {
  apiHostname: string;
  apiHostnameEditable: boolean;
  maxFileSize: number; // in Mb
  validExtensions: string[];
  maxBitrate: number; // in Kbps
  targetBitrate: number; // in Kbps
  maxWidth: number; // in px
  maxHeight: number; // in px
  targetFramerate: number; // in fps
  crf: Record<number, Record<number, number>>;
  targetAudioBitrate: number; // in Kbps
  uploadTimeout?: number; // in ms
};
