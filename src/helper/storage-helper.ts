import { getDownloadURL } from "firebase-admin/storage";
import { bucket } from "../config/config";
import { ContentType, FileHelper } from "../models/types";

export const saveAndRetrieveFileUrl = async (
  fileInput: FileHelper,
  sender: string
): Promise<string> => {
  const contentType = retrieveContentType(fileInput.name);

  if (contentType != null && fileInput.content) {
    const filePath = buildFilePath(fileInput.name, contentType, sender);

    const file = bucket.file(filePath);

    const buffer = Buffer.from(fileInput.content, "base64");

    try {
      await file.save(buffer, {
        metadata: {
          contentType: contentType,
        },
      });

      const url = await getDownloadURL(file);

      return url;
    } catch (error) {
      console.error(error);
      return "";
    }
  }
  return "";
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
