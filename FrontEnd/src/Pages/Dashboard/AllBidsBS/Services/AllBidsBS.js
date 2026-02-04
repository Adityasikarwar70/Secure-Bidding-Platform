import DotNetAxiosInstance from "../../../../Shared/Ajax/DotNetAjax";

export const getAllBids = async (id) => {
  const response = await DotNetAxiosInstance.get(
    `bids/user/${id}`
  );
  return response.data;
};