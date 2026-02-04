import React, { useState } from "react";
import "./ForgetPassword.css";
import { GetOtp, setNewPassword } from "../Service/ForgetPassword";
import { errorToast, successToast } from "../../../Shared/Utils/Toast";
import { useLoader } from "../../../Context/useLoader";
import { verifyOtp } from "../../Security/Register/Services/RegisterService";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
    const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const [email, setEmail] = useState("");
  const [emailRes, setEmailRes] = useState();
  const [otp, setOtp] = useState("");
  const [otpRes, setOtpRes] = useState("");
  const [time, setTime] = useState({
    min: 2,
    sec: 0,
  });
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const startReverseTimer = (minutes) => {
    let totalSeconds = minutes * 60;

    const timer = setInterval(() => {
      const min = Math.floor(totalSeconds / 60);
      const sec = totalSeconds % 60;

      setTime({ min, sec });

      if (totalSeconds <= 0) {
        clearInterval(timer);
      }

      totalSeconds--;
    }, 1000);
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    showLoader();
    try {
      const res = await GetOtp(email);
      if (res?.success == true) {
        setEmailRes(res);
        successToast("OTP Sent");
        startReverseTimer(5);
      } else errorToast(res.message);
    } catch (error) {
      console.log(error);
      errorToast("Something Went Wrong");
    } finally {
      hideLoader();
    }
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    showLoader();
    try {
      const res = await verifyOtp(email, otp, "RESET_PASSWORD");
      if (res?.success == true) {
        setOtpRes(res);
        successToast(res.message);
      } else errorToast(res.message);
    } catch (error) {
      console.log(error);
      errorToast("Something Went Wrong");
    } finally {
      hideLoader();
    }
  };

  const validateField = (name, value) => {
    let error = "";

    if (name === "password") {
      if (!value) {
        error = "Password is required";
      } else if (value.length < 6) {
        error = "Password must be at least 6 characters";
      }
    }

    if (name === "confirmPassword") {
      if (!value) {
        error = "Confirm password is required";
      } else if (value !== form.password) {
        error = "Passwords do not match";
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const error = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      password: validateField("password", form.password),
      confirmPassword: validateField("confirmPassword", form.confirmPassword),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    showLoader();
    try {
      const res = await setNewPassword(email,form.password);
      if (res?.success == true) {
        setOtpRes(res);
        successToast(res.message);
      } else errorToast(res.message);
    } catch (error) {
      console.log(error);
      errorToast("Something Went Wrong");
    } finally {
      hideLoader();
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="forget sectionMargin">
      <h3 className="heading fs-4 text-start mb-4">Reset Password</h3>
      {!emailRes && (
        <div className="forget-wrapper p-3">
          <h3 className="heading fs-4 text-start mb-4">Verify Email</h3>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control "
              id="floatingInput"
              placeholder="name@example.com"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="text-end">
            <button className="sendOTP subHeading fs-6" onClick={handleEmail}>
              Send OTP <i className="ms-2 bi bi-envelope-fill"></i>
            </button>
          </div>
        </div>
      )}

      {emailRes && !otpRes && (
        <form className="forget-wrapper p-3" onSubmit={handleSubmit}>
          <h3 className="heading fs-4 text-start mb-4">Verify OTP</h3>
          <div className="form-floating">
            <input
              type="number"
              className="form-control "
              id="floatingInput"
              placeholder="XXXXXX"
              required
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <label htmlFor="floatingInput">Enter OTP</label>
          </div>
          <div className="m-0 text-end me-2 subHeading fs-6 fw-bold text-danger">
            <span>{String(time.min).padStart(2, "0")}</span>:
            <span>{String(time.sec).padStart(2, "0")}</span>
          </div>
          <div className="text-end">
            <button className="sendOTP subHeading fs-6" onClick={handleOtp}>
              Verify OTP <i className="ms-2 bi bi-envelope-fill"></i>
            </button>
          </div>
        </form>
      )}

      {otpRes && (
        <div className="forget-wrapper p-3 pb-5">
          <h3 className="heading fs-4 text-start mb-4">Set New Password</h3>
          <div className="form-floating">
            <input
              type="password"
              className="form-control "
              id="floatingInput"
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <label htmlFor="floatingInput">New Password</label>
            {errors.password && (
              <div className="subHeading fs-6 text-danger">
                {errors.password}
              </div>
            )}
          </div>

          <div className="form-floating">
            <input
              type="password"
              className="form-control "
              id="floatingInput"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <label htmlFor="floatingInput">Confirm Password</label>
            {errors.confirmPassword && (
              <div className="subHeading fs-6 text-danger">
                {errors.confirmPassword}
              </div>
            )}
          </div>

          <div className="text-end">
            <button
              type="button"
              className="sendOTP subHeading fs-6"
              disabled={
                !form.password ||
                !form.confirmPassword ||
                form.password != form.confirmPassword
              }
              onClick={handleSubmit}
            >
              Set Password <i className="ms-2 bi bi-check-circle-fill"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
