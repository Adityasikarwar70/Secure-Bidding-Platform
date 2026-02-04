import DotNetAxiosInstance from "../../../../Shared/Ajax/DotNetAjax";



  export const getAuctionByStatus = async (status) => {

    const response = await DotNetAxiosInstance.get(
        `products/status/${status}`);

        return response.data;
  }

  // products/{id}/ status