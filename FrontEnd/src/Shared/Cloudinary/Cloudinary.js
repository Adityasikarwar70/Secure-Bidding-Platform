import axios from "axios";
const CLOUD_NAME = "dyqnk0vmv";
const UPLOAD_PRESET = "bidding-images";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const uploadToCloudinary = async (file) => {
  if (!file) {
    throw new Error("No file provided");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "bidding-images");

const response = await axios.post(
    "https://api.cloudinary.com/v1_1/dyqnk0vmv/image/upload",
    formData
  );

  return response.data.secure_url;
;
};

export const uploadMultipleImages = async (files) => {
  if (!files) throw new Error("No files provided");

  const fileArray = Array.isArray(files) ? files : Array.from(files);

  const uploadPromises = fileArray.map((file) => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files allowed");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    return axios
      .post(CLOUDINARY_URL, formData)
      .then((res) => res.data.secure_url);
  });


  return Promise.all(uploadPromises);
};
