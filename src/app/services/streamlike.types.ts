import type { Media } from "@/app/technical/types";

export type GetUniqueTokenBody = {
  login: string;
  password: string;
  apiHostname: string;
};
export type GetUniqueTokenResponse = {
  kind: string;
  token: string;
  expiration: string;
};

export type GetTokenResponse = GetUniqueTokenResponse;

export type CreateMediaBody = Pick<Media, "name" | "permalink" | "type">;
export type CreateMediaResponse = Media;

export type UploadMediaBody = {
  id: Media["id"];
  formData: FormData;
};
export type UploadMediaResponse = Media;

export type UpdateMediaBody = Pick<
  Media,
  "id" | "name" | "description" | "credits"
>;
export type UpdateMediaResponse = Media;
