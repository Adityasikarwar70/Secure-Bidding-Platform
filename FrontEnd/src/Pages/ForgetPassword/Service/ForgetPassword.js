import axios from "../../../Shared/Ajax/JavaAjax";


export async function GetOtp(email) {
  const response = await axios.post(
    "auth/verify-email",
    {
      email: email,
      type: "RESET_PASSWORD",
    },
  );

  return response.data;
}

export async function setNewPassword(email,password) {
  const response = await axios.post(
    "auth/reset-password",
    {
      email: email,
      newPassword: password,
    },
  );

  return response.data;
}
