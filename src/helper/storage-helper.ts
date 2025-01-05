import { bucket } from "../config/config";
import { ContentType, File } from "../models/types";

export const handleFileSave = async (fileInput: File, sender: string) => {
  const contentType = retrieveContentType(fileInput.name);

  if (contentType != null) {
    const filePath = buildFilePath(fileInput.name, contentType, sender);

    const file = bucket.file(filePath);

    await file.save(fileInput.content, {
      metadata: { contentType: contentType },
    });
  }
};

const retrieveContentType = (fileName: string) => {
  const extension = getFileExtension(fileName);

  switch (extension) {
    case "jpg":
      return ContentType.JPG;
    case "png":
      return ContentType.PNG;
    case "wav":
      return ContentType.WAV;
    case "mp4":
      return ContentType.MP4;
    default:
      return null;
  }
};

const getFileExtension = (fileName: string) => {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
};

const buildFilePath = (
  fileName: string,
  contentType: ContentType,
  sender: string
) => {
  const basePath = `files/${sender}`;
  let contentPath = "";

  switch (contentType) {
    case ContentType.PNG:
      contentPath = "image";
      break;
    case ContentType.JPG:
      contentPath = "image";
      break;
    case ContentType.WAV:
      contentPath = "audio";
      break;
    case ContentType.MP4:
      contentPath = "video";
      break;
  }
  return `${basePath}/${contentPath}/${fileName}`;
};
