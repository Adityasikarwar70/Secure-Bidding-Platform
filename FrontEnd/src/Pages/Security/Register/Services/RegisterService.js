import axios from "../../../../Shared/Ajax/JavaAjax";

export async function registerUser(user) {
  const response = await axios.post("auth/register", {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobileNo: user.mobileNo,
    username: user.userName,
    password: user.password,
    aadharNo: user.aadharNo,
    pancardNo: user.pancardNo,
    address: user.address,
    panCardUrl: user.panCardUrl,
    aadharCardUrl: user.aadharCardUrl,
    livePhotoUrl: user.livePhotoUrl,
  });

  return response.data;
}

export async function GetOtp(email) {
  const response = await axios.post(
    "auth/verify-email",
    {
      email: email,
      type: "VERIFY_EMAIL",
    },
  );

  return response.data;
}

export async function verifyOtp(email,otp,type) {
  const response = await axios.post(
    "auth/verify-code",
    {
      email: email,
      type: type,
      code:otp
    },
  );

  return response.data;
}
