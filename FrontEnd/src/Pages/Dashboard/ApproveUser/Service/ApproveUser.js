import JavaAxiosInstance from "../../../../Shared/Ajax/JavaAjax";

    export const fetchAllUnverifiedUser = async () => {

    const response = await JavaAxiosInstance.get(
        `users/unverified`);
        return response.data;
  }