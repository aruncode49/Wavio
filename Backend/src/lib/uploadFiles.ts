import type { UploadedFile } from "express-fileupload";
import cloudinary from "@/lib/cloudinaryConfig.js";

const uploadFile = async (file: UploadedFile) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error while uploading file", error);
    throw new Error("Failed to upload file");
  }
};

export default uploadFile;
