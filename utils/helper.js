import { supportedMimes } from "../config/fileSystem.js";
import { v4 as uuidv4 } from "uuid";

export const imageValidator = (size, mime) => {
  if (bytesToMb(size) > 2) {
    return "Image size should be less than 2 MB";
  } else if (!supportedMimes.includes(mime)) {
    return "image format should be jpeg, jpg, png, gif, bmp, webp, avif, tiff";
  }

  return null;
};

export const bytesToMb = (bytes) => {
  return (bytes / (1024 * 1024)).toFixed(2);
};

export const generateRandomNum = () => uuidv4();

export const getImageUrl = (imageName) =>
  `${process.env.APP_URL}/images/${imageName}`;
