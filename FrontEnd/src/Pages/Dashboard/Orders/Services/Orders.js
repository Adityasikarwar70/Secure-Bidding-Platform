import DotNetAxiosInstance from "../../../../Shared/Ajax/DotNetAjax";


export const getOrder = async (id , role) => {
  const response = await DotNetAxiosInstance.get(
    `orders/${role}/${id}`
  );
  return response.data;
};