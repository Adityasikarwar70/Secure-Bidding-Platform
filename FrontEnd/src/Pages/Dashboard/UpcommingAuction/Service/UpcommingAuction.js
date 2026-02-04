import DotNetAxiosInstance from "../../../../Shared/Ajax/DotNetAjax";


export const getAllAuctionByStatus = async (status) => {
  const response = await DotNetAxiosInstance.get(
    `auctions?status=${status}`
  );
  return response.data;
};
