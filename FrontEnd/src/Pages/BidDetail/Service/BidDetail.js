import DotNetAxiosInstance from "../../../Shared/Ajax/DotNetAjax";


export const getDetailById = async (id) => {
  const response = await DotNetAxiosInstance.get(`products/${id}`);
  return response.data;
};

export const changeStatusOfProduct = async (id, form) => {
  const response = await DotNetAxiosInstance.put(`products/${id}/status`, {
    Status: Number(form.Status),
    BasePrice: Number(form.BasePrice),
    Remark: form.Review?.trim() || null,
  });
  return response.data;
};

export const getAuctionById = async (id) => {
  const response = await DotNetAxiosInstance.get(`auctions/${id}`);
  return response.data;
};

export const getHighestBid = async (id) => {
  const response = await DotNetAxiosInstance.get(`bids/auction/${id}/highest`);
  return response.data;
};

export const getTopBid = async (id) => {
  const response = await DotNetAxiosInstance.get(`bids/auction/${id}/top`);
  return response.data;
};

export const bidAuction = async (id, amount) => {
  const response = await DotNetAxiosInstance.post(`bids`, {
    auctionId: id,
    amount: amount,
  });
  return response.data;
};
