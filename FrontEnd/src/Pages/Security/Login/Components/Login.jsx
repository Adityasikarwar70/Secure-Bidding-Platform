import { useState } from "react";
import "./Login.css";
import { checkCredentials } from "../Services/LoginService";
import logo from "../../../../assets/Images/bidX.svg";
import { useLoader } from "../../../../Context/useLoader";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import { useAuth } from "../../../../Context/useAuth";
import { errorToast, successToast } from "../../../../Shared/Utils/Toast";

const Login = () => {
  // const appName = import.meta.env.VITE_APP_NAME;
  const { showLoader, hideLoader } = useLoader();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    UserName: "",
    Password: "",
  });
  const [showPass, setShowPass] = useState(false);

  const [errors, setErrors] = useState({});

  // const validate = () => {
  //   const newErrors = {};
  //   showLoader();
  //   // Email validation
  //   if (!form.UserName.trim()) {
  //     newErrors.UserName = "Email is required";
  //   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.UserName)) {
  //     newErrors.UserName = "Invalid email format";
  //   }

  //   // Password validation
  //   if (!form.Password.trim()) {
  //     newErrors.Password = "Password is required";
  //   } else if (form.Password.length < 6) {
  //     newErrors.Password = "Password must be at least 6 characters";
  //   }

  //   setErrors(newErrors);
  //      hideLoader();
  //   return Object.keys(newErrors).length === 0;
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // clear error on typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const hideLoginModal = () => {
    const modalEl = document.getElementById("loginModal");
    if (!modalEl) return;

    const modal = Modal.getInstance(modalEl) || new Modal(modalEl);

    modal.hide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    showLoader();
    try {
      // if (!validate()) return;
    const response = await checkCredentials(form);
    if (response) login(response);
    navigate("/", { replace: true });
    hideLoginModal();
    successToast("Logged In")
    } catch (error) {
      errorToast(error.response.data.message)
      
    }finally{
      hideLoader();
    }
    
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log(form);
    
  // }

  return (
    <div
      className="modal fade"
      id="loginModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content login-modal">
          <button
            type="button"
            className="ptr btn btn-close position-absolute top-0 end-0 m-3 z-3 "
            data-bs-dismiss="modal"
          ></button>

          <div className="modal-body text-center p-5 position-relative">
            <div className=" mx-auto mb-3 ">
              <img src={logo} alt="logo" height={50} />
            </div>

            <h4 className="fw-semibold mb-4">
              Sign in with <br />
              your <strong style={{ color: "#1b4332" }}>User-ID</strong>
            </h4>
            <form action="post" onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="text" //email should be here
                  name="UserName"
                  className="form-control"
                  id="floatingInputEmail"
                  placeholder="name@example.com"
                  value={form.UserName}
                  onChange={handleChange}
                />
                {form.UserName && (
                  <i
                    className="bi bi-x-circle-fill clear-icon"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, UserName: "" }))
                    }
                  />
                )}
                <label htmlFor="floatingInputEmail">Email address</label>
              </div>
              {errors.Email && (
                <div className="invalid-feedback d-block">{errors.email}</div>
              )}

              <div className="form-floating mb-1">
                <input
                  type={showPass ? "text" : "password"}
                  name="Password"
                  className="form-control"
                  id="floatingInputPass"
                  placeholder="******"
                  value={form.Password}
                  onChange={handleChange}
                />
                {form.Password && (
                  <i
                    className="bi bi-x-circle-fill clear-icon"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, Password: "" }))
                    }
                  />
                )}
                <label htmlFor="floatingInputPass">Password</label>
              </div>

              <div className="mb-3 me-1 d-flex align-content-center justify-content-end">
                <input
                  className="me-1"
                  type="checkbox"
                  onClick={() => setShowPass(!showPass)}
                />{" "}
                Show Password{" "}
              </div>
              {errors.Password && (
                <div className="invalid-feedback d-block">
                  {errors.Password}
                </div>
              )}

              {errors.form && (
                <div className="alert alert-danger mt-2">{errors.form}</div>
              )}

              <div className="d-flex align-content-center justify-content-start mb-3 ms-1">
                <Link to={"/forgetPassword"} onClick={hideLoginModal} className="text-decoration-none subHeading fs-6 text-primary">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="btn main-bg w-100 btn-lg ">Login</button>
            </form>

            <div className="d-flex align-items-center justify-content-between  ">
              <div className="hr"></div> <b className="mx-2 fs-5">or</b>{" "}
              <div className="hr"></div>
            </div>
            <div>
              <Link
                to={"/register"} onClick={hideLoginModal}
                className="create text-decoration-none main-font fw-medium subHeading fs-6 text-primary"
              >
                {" "}
                Create Account{" "}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
