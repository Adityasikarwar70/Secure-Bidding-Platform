import DotNetAxiosInstance from "../../../Shared/Ajax/DotNetAjax";

export const getAllAuctionByCategory = async (id) => {
  const response = await DotNetAxiosInstance.get(
    `auctions/category/${id}/live`
  );
  return response.data;
};