import type { E_MEDIA_TYPE } from "@/app/technical/types";

export type UploadStackParamsList = {
  SELECT_MEDIA: undefined;
  AUDIO_RECORDING: undefined;
  UPLOAD_MEDIA: {
    uri: string;
    name: string;
    mediaType: E_MEDIA_TYPE;
    size: number;
    mimeType: string;
  };
};
