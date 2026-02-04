import JavaAxiosInstance from "../../../../Shared/Ajax/JavaAjax";

export const BecomeSellerAPI = async (form) => {
  const response = await JavaAxiosInstance.post(
    `users/become-seller`,form
  );
  return response.data;
};