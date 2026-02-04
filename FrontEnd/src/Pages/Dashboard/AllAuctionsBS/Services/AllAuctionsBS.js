import DotNetAxiosInstance from "../../../../Shared/Ajax/DotNetAjax";

export const getAllAuctionsOfSeller = async (id) => {
  const response = await DotNetAxiosInstance.get(
    `auctions/seller/${id}`
  );
  return response.data;
};


export const ChangeDecision = async (id,decision) => {
    console.log(id);
    
  const response = await DotNetAxiosInstance.post(
    `auctions/${id}/decision`,{
        approve:decision
    }
  );
  return response.data;
};