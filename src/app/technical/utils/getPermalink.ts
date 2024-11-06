import slugify from "slugify";
import uuid from "react-native-uuid";

export const getPermalink = (str: string, length: number = 128) => {
  const permalink =
    slugify(str.split(".")[0], {
      strict: true,
    }) +
    "-" +
    uuid.v4();

  if (permalink.length > length) {
    return permalink.substring(0, length);
  }

  return permalink;
};
