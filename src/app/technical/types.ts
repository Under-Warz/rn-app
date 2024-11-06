export enum E_MEDIA_TYPE {
  AUDIO = "audio",
  VIDEO = "video",
}

export enum E_MEDIA_VISIBILITY_STATE {
  ONLINE = "online",
  OFFLINE = "offline",
}

export type Media = {
  id: string;
  name: string;
  description: string;
  credits: string;
  permalink: string;
  type: E_MEDIA_TYPE;
};
