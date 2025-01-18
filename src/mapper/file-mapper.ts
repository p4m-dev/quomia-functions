import { FileSchema, FileHelper, FileType } from "../models/types";

const mapFileHelper = (fileSchema: FileSchema): FileHelper => {
  return {
    name: fileSchema?.name ?? "",
    content: fileSchema?.content ?? "",
    fileType: fileSchema?.fileType ?? FileType.TEXT,
  };
};

export { mapFileHelper };
