import React, { useState } from "react";
import "./BecomeSeller.css"
import { BecomeSellerAPI } from "../Service/BecomeSeller";
import { errorToast, successToast } from "../../../../Shared/Utils/Toast";
import { useAuth } from "../../../../Context/useAuth";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import { useLoader } from "../../../../Context/useLoader";
import { useNavigate } from "react-router-dom";

const BecomeSeller = () => {
  const { userDetails ,logout } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const [form, setForm] = useState({
    aadharNumber: "",
    panNumber: "",
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    aadharNumber: "",
    panNumber: "",
  });

  const validateAadhar = (value) => {
    if (!value) return "Aadhar number is required";
    if (!/^\d+$/.test(value)) return "Aadhar must contain only digits";
    if (value.length !== 12) return "Aadhar must be exactly 12 digits";
    return "";
  };

  const validatePan = (value) => {
    if (!value) return "PAN number is required";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value))
      return "Invalid PAN format (ABCDE1234F)";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedValue = name === "panNumber" ? value.toUpperCase() : value;

    setForm((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    let error = "";
    if (name === "aadharNumber") error = validateAadhar(updatedValue);
    if (name === "panNumber") error = validatePan(updatedValue);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };
//   console.log(userDetails.verified);

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader();
    const aadharError = validateAadhar(form.aadharNumber);
    const panError = validatePan(form.panNumber);

    setErrors({
      aadharNumber: aadharError,
      panNumber: panError,
    });

    if (aadharError || panError) return;

    try {
      const res = await BecomeSellerAPI(form);
      console.log(res);
      if (res.success == true) {
        successToast("You are a Seller now");
        logout();
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log(error);
      errorToast(error.response.data.message);
    } finally {
      Modal.getOrCreateInstance(
        document.getElementById("BecomeSellerMedel"),
      ).hide();
      hideLoader();
    }
  };

  const isFormValid =
    !errors.aadharNumber &&
    !errors.panNumber &&
    form.aadharNumber &&
    form.panNumber;

  return (
    <>
      {userDetails?.verified == true ? (
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">Aadhar Number</label>
            <input
              type="text"
              name="aadharNumber"
              value={form.aadharNumber}
              onChange={handleChange}
              maxLength={12}
              className={`form-control ${
                errors.aadharNumber ? "is-invalid" : ""
              }`}
              placeholder="Enter 12 digit Aadhar"
            />
            {errors.aadharNumber && (
              <div className="invalid-feedback">{errors.aadharNumber}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">PAN Number</label>
            <input
              type="text"
              name="panNumber"
              value={form.panNumber}
              onChange={handleChange}
              maxLength={10}
              className={`form-control ${errors.panNumber ? "is-invalid" : ""}`}
              placeholder="ABCDE1234F"
            />
            {errors.panNumber && (
              <div className="invalid-feedback">{errors.panNumber}</div>
            )}
          </div>

          <div className="col-12 text-end">
            <button
              type="submit"
              className="btn btn-success px-4"
              disabled={!isFormValid}
            >
              Submit <i className="ms-2 bi bi-dash-square-fill"></i>
            </button>
          </div>
          <p className="note text-uppercase">Note: You will be required to log in again after this action.</p>
        </form>
      ) : (
        <h1 className="heading fs-3">You Are Not Verified Yet</h1>
      )}
    </>
  );
};

export default BecomeSeller;
