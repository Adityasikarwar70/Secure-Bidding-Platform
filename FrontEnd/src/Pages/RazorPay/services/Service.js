import DotNetAxiosInstance from "../../../Shared/Ajax/DotNetAjax";



export const createPaymentOrder  = async (id) => {
  const response = await DotNetAxiosInstance.post(`payments/order/${id}`);
  return response.data;
};

export const verifyPayment  = async (data) => {
  const response = await DotNetAxiosInstance.post("payments/verify",data);
  return response.data;
};

