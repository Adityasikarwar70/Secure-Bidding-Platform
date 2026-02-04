import DotNetAxiosInstance from "../../../../Shared/Ajax/DotNetAjax";


    export const fetchAllCategory = async () => {

    const response = await DotNetAxiosInstance.get(
        `categories`);
        return response.data;
  }


    export const addCategory = async (form) => {

    const response = await DotNetAxiosInstance.post(
        `categories`,form);
        return response.data;
  }

      export const DeleteCategory = async (id) => {

    const response = await DotNetAxiosInstance.delete(
        `categories/${id}`);
        return response.data;
  }