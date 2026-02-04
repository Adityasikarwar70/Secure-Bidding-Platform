import DotNetAxiosInstance from "../../../../Shared/Ajax/DotNetAjax";

export const getAllProductsOfSeller = async (id) => {
  const response = await DotNetAxiosInstance.get(
    `products/seller/${id}`
  );
  return response.data;
};