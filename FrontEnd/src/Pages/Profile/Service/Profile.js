import axios from "../../../Shared/Ajax/JavaAjax";

export const fetchUserDetails = async (id) => {
  const response = await axios.get(`users/${id}`);

  return response.data;
};

export const ApproveUser = async (id) => {
  const response = await axios.put(`users/verify/${id}`);
  return response.data;
};