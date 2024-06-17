import { supportedMimes } from "../config/fileSystem.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

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

export const removeImage = (imageName) => {
  const path = process.cwd() + "/public/images/" + imageName;
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

// upload image
export const uploadImage = (image) => {
  const imageExt = image?.name.split(".");
  const imageName = generateRandomNum() + "." + imageExt[imageExt.length - 1];
  const uploadPath = process.cwd() + "/public/images/" + imageName;

  image.mv(uploadPath, (err) => {
    if (err) throw err;
  });

  return imageName;
};
