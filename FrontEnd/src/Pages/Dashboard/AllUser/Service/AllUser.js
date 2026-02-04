import JavaAxiosInstance from "../../../../Shared/Ajax/JavaAjax";

    export const fetchAllUser = async () => {

    const response = await JavaAxiosInstance.get(
        `users/allUser`);
        return response.data;
  }