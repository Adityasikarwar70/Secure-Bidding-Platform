import * as React from "react";
import "./Register.css";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import ImageUpload from "../../../Component/ImageUpload/ImageUpload";
import { uploadToCloudinary } from "../../../../Shared/Cloudinary/Cloudinary";
import { GetOtp, registerUser, verifyOtp } from "../Services/RegisterService";
import { useLoader } from "../../../../Context/useLoader";
import { errorToast, successToast } from "../../../../Shared/Utils/Toast";
import { useNavigate } from "react-router-dom";

const steps = ["Verify Email", "Personal Details", "Id Proof Upload"];

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { showLoader, hideLoader } = useLoader();
   const navigate = useNavigate();
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    userName: "",
    password: "",
    aadharNo: "",
    pancardNo: "",
    address: "",
    panCardUrl: "",
    aadharCardUrl: "",
    livePhotoUrl: "",
  });
  const [errors, setErrors] = useState({});
  const [pancard, setPancard] = useState();
  const [aadhar, setAadhar] = useState();
  const [profile, setProfile] = useState();
  const [otp, setOtp] = useState();
  const [otpres, setOtpres] = useState();
  // const [profileImage, setProfileImage] = useState(null); // for single upload

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstName":
        if (!value.trim()) error = "First name is required";
        else if (value.length < 2) error = "Minimum 2 characters required";
        break;

      case "lastName":
        if (!value.trim()) error = "Last name is required";
        else if (value.length < 2) error = "Minimum 2 characters required";
        break;

      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Enter a valid email address";
        break;

      case "mobileNo":
        if (!value.trim()) error = "Mobile number is required";
        else if (!/^\d{10}$/.test(value))
          error = "Mobile number must be 10 digits";
        break;

      case "userName":
        if (!value.trim()) error = "Username is required";
        else if (value.length < 4)
          error = "Username must be at least 4 characters";
        break;

      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 6)
          error = "Password must be at least 6 characters";
        break;

      case "aadharNo":
        if (!value.trim()) error = "Aadhar number is required";
        else if (!/^\d{12}$/.test(value)) error = "Aadhar must be 12 digits";
        break;

      case "pancardNo":
        if (!value.trim()) error = "PAN card number is required";
        else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value))
          error = "Invalid PAN card format";
        break;

      case "address":
        if (!value.trim()) error = "Address is required";
        break;

      default:
        break;
    }

    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const errorMessage = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));

    console.log(errors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadImageasync = async () => {
    showLoader();
    const aadharUrl = await uploadToCloudinary(aadhar);
    const panUrl = await uploadToCloudinary(pancard);
    const profileUrl = await uploadToCloudinary(profile);

    setForm((prev) => ({
      ...prev,
      aadharCardUrl: aadharUrl,
      panCardUrl: panUrl,
      livePhotoUrl: profileUrl,
    }));

    hideLoader();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader()
    try {
      const response = await registerUser(form);
    // console.log("response", response);
    // console.log(form);
    successToast("User registered successfully");
    } catch (error) {
      errorToast("Something Went Wrong")
    }finally{
      navigate("/", { replace: true });
      hideLoader()
    }
    
  };

  const verifyEmail = async (e) => {
    e.preventDefault();
    showLoader();
    const res = await GetOtp(form.email);
    setOtpres(res);
    successToast("OTP Sent")

    console.log("Email response", res);
    hideLoader();
  };

  const submitOtp = async (e) => {
    e.preventDefault();
    showLoader();

    try {
      const res = await verifyOtp(form.email, otp,"VERIFY_EMAIL");

      console.log("SubmitOtp", res);

      if (res?.success) {
        setActiveStep((prev) => prev + 1);
        successToast(res.message);
      } else {

        errorToast("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      
      errorToast("OTP verification failed");
    } finally {
      hideLoader(); 
    }
  };

  return (
    <div className="register d-flex flex-column align-items-center ">
      <form className="w-100">
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{ width: "100%" }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === 0 && (
            <div className=" my-4 steps ">
              <div className="step1 container p-3 ">
                <h3 className="text-start heading fs-4  "> Verify Email</h3>
                <div className="my-4 row g-3 ">
                  <div className="form-floating col-12 col-lg-12">
                    <input
                      type="number"
                      className="form-control"
                      id="mobileNo"
                      placeholder="mobileNo"
                      name="mobileNo"
                      value={form.mobileNo}
                      onChange={handleChange}
                      min="0"
                      required
                      onBlur={handleBlur}
                      disabled={otpres}
                    />
                    <label htmlFor="mobileNo">Mobile No</label>
                  </div>
                  {errors.mobileNo && (
                    <div className="text-danger mt-2 ms-2 subHeading fs-6">
                      *{errors.mobileNo}
                    </div>
                  )}
                  <div className="form-floating  col-12 col-lg-12">
                    <input
                      type="email"
                      className="form-control"
                      id="floatingInput"
                      placeholder="name@example.com"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      onBlur={handleBlur}
                      disabled={otpres}
                    />
                    <label htmlFor="floatingInput">Email address</label>
                  </div>
                  {errors.email && (
                    <div className="text-danger mt-2 ms-2 subHeading fs-6">
                      *{errors.email}
                    </div>
                  )}
                  <div className="form-floating col-12">
                    <button
                      className="verifyBtn col-4 col-lg-4 float-end subHeading yellow"
                      disabled={otpres}
                      onClick={verifyEmail}
                    >
                      Verify <i className="bi bi-envelope-at-fill"></i>{" "}
                    </button>
                  </div>
                  {otpres && (
                    <>
                      <div className="form-floating col-12 col-lg-12">
                        <input
                          type="number"
                          className="form-control"
                          id="otp"
                          placeholder="OTP"
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                        <label htmlFor="otp" className="">
                          OTP
                        </label>
                      </div>
                      <div className="form-floating col-12 mt-3">
                        <button
                          type="button"
                          className="verifyBtn col-12 col-lg-12 float-end subHeading"
                          onClick={submitOtp}
                        >
                          Submit Otp
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* <div className="mt-4 col-12 d-flex justify-content-between">
                <Button
                  className="back"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  <i className="bi bi-caret-left-fill me-2"></i> Back
                </Button>

                <Button
                id="OTPNext"
                  className="next"
                  variant="contained"
                  onClick={handleNext}
                  disabled={!form.email || !form.mobileNo}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}{" "}
                  <i className="ms-2 bi bi-caret-right-fill"></i>
                </Button>
              </div> */}
            </div>
          )}

          {/* STEP 2 */}
          {activeStep === 1 && (
            <div className=" my-4  ">
              <div className="step2 container p-3 ">
                <h3 className="text-start heading fs-4  "> Personal Details</h3>
                <div className="my-4 row g-3 ">
                  <div className="form-floating col-12 col-lg-6">
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      placeholder="FirstName"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      onBlur={handleBlur}
                    />
                    <label htmlFor="firstName">First Name</label>
                    {errors.firstName && (
                      <div className="text-danger mt-2 ms-2 subHeading fs-6">
                        *{errors.firstName}
                      </div>
                    )}
                  </div>

                  <div className="form-floating col-12 col-lg-6">
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      placeholder="LastName"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      onBlur={handleBlur}
                    />
                    <label htmlFor="lastName">Last Name</label>
                    {errors.lastName && (
                      <div className="text-danger mt-2 ms-2 subHeading fs-6">
                        *{errors.lastName}
                      </div>
                    )}
                  </div>
                  <div className="form-floating col-12 col-lg-6">
                    <input
                      type="text"
                      className="form-control"
                      id="userName"
                      placeholder="UserName"
                      name="userName"
                      value={form.userName}
                      onChange={handleChange}
                      required
                      onBlur={handleBlur}
                    />
                    <label htmlFor="userName">UserName</label>
                    {errors.userName && (
                      <div className="text-danger mt-2 ms-2 subHeading fs-6">
                        *{errors.userName}
                      </div>
                    )}
                  </div>
                  <div className="form-floating col-12 col-lg-6">
                    <input
                      type={show ? "text" : "password"}
                      className="form-control"
                      id="password"
                      placeholder="Password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      onBlur={handleBlur}
                    />
                    <label htmlFor="password">Password</label>
                    {errors.password && (
                      <div className="text-danger mt-2 ms-2 subHeading fs-6">
                        *{errors.password}
                      </div>
                    )}
                  </div>
                  <div className="col-12 ">
                    <div className="form-check float-end showPassword ">
                      <input
                        className="form-check-input  "
                        type="checkbox"
                        value=""
                        id="showPassword"
                        required
                        onClick={() => setShow(!show)}
                      />
                      <label
                        className="form-check-label subHeading fs-6 ps-0"
                        htmlFor="showPassword"
                      >
                        Show Password
                      </label>
                    </div>
                  </div>

                  <div className="form-floating col-12 col-lg-6">
                    <input
                      type="number"
                      className="form-control"
                      id="aadharNo"
                      placeholder="Aadhar no"
                      name="aadharNo"
                      value={form.aadharNo}
                      onChange={handleChange}
                      required
                      onBlur={handleBlur}
                    />
                    <label htmlFor="aadharNo">Aadhar No</label>
                    {errors.aadharNo && (
                      <div className="text-danger mt-2 ms-2 subHeading fs-6">
                        *{errors.aadharNo}
                      </div>
                    )}
                  </div>

                  <div className="form-floating col-12 col-lg-6">
                    <input
                      type="text"
                      className="form-control"
                      id="pancardNo"
                      placeholder="PancardNo"
                      name="pancardNo"
                      value={form.pancardNo}
                      onChange={handleChange}
                      required
                      onBlur={handleBlur}
                    />
                    <label htmlFor="pancardNo">Pancard No (ALL CAPS)</label>
                    {errors.pancardNo && (
                      <div className="text-danger mt-2 ms-2 subHeading fs-6">
                        *{errors.pancardNo}
                      </div>
                    )}
                  </div>
                  <div className="form-floating col-12 col-lg-12">
                    <textarea
                      type="text"
                      className="form-control"
                      id="address"
                      placeholder="Address"
                      name="address"
                      style={{ height: "100px" }}
                      value={form.address}
                      onChange={handleChange}
                      required
                      onBlur={handleBlur}
                    />
                    <label htmlFor="address">Full Address</label>
                    {errors.address && (
                      <div className="text-danger mt-2 ms-2 subHeading fs-6">
                        *{errors.address}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 col-12 d-flex justify-content-end">
                {/* <Button
                  className="back"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  <i className="bi bi-caret-left-fill me-2"></i> Back
                </Button> */}

                <Button
                  className="next"
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    !form.address ||
                    !form.pancardNo ||
                    !form.aadharNo ||
                    !form.password ||
                    !form.userName ||
                    !form.lastName ||
                    !form.firstName
                  }
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}{" "}
                  <i className="ms-2 bi bi-caret-right-fill"></i>
                </Button>
              </div>
            </div>
          )}
          {activeStep === 2 && (
            <div className=" my-4  ">
              <div className="step2 container p-3 ">
                <h3 className="text-start heading fs-4  "> Id Proof Upload</h3>
                <div className="my-4 row g-3 ">
                  <ImageUpload
                    value={aadhar}
                    onFileSelect={setAadhar}
                    text={"Upload Aadhar"}
                  />
                  <ImageUpload
                    value={pancard}
                    onFileSelect={setPancard}
                    text={"Upload Pancard"}
                  />
                  <ImageUpload
                    value={profile}
                    onFileSelect={setProfile}
                    text={"Upload Profile"}
                  />
                  <div className="mt-4 col-12 ">
                    <button
                      className="uploadImage col-4 float-end "
                      type="button"
                      onClick={uploadImageasync}
                    >
                      Upload Image <i className="bi bi-file-earmark-image"></i>
                    </button>
                  </div>

                  <div className="mt-4 col-12 d-flex justify-content-between">
                    <Button
                      className="back"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                    >
                      <i className="bi bi-caret-left-fill me-2"></i> Back
                    </Button>

                    <Button
                      onClick={handleSubmit}
                      className="next"
                      variant="contained"
                      type="submit"
                      disabled={
                        !form.aadharCardUrl ||
                        !form.panCardUrl ||
                        !form.panCardUrl
                      }
                    >
                      {activeStep === steps.length - 1 ? "Submit" : "Next"}{" "}
                      <i className="ms-2 bi bi-caret-right-fill"></i>
                    </Button>
                  </div>
                  {/* <button className="btn btn-success">Submit</button> */}
                </div>
              </div>
            </div>
          )}
        </Box>

        {/* <div className="mt-4 mx-5 w-50 d-flex justify-content-between">
          <Button
            className="back"
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            <i className="bi bi-caret-left-fill me-2"></i> Back
          </Button>

          <Button className="next" variant="contained" onClick={handleNext}>
            {activeStep === steps.length - 1 ? "Finish" : "Next"}{" "}
            <i className="ms-2 bi bi-caret-right-fill"></i>
          </Button>
        </div> */}
      </form>
    </div>
  );
};

export default Register;
