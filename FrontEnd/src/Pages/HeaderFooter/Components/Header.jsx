import React from "react";
import "./Header.css";
import logo from "../../../assets/Images/bidX.svg";
import { useAuth } from "../../../Context/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoader } from "../../../Context/useLoader";
import BecomeSeller from "../../Component/BecomeSeller/Components/BecomeSeller";
const Header = () => {
  //  const appName = import.meta.env.VITE_APP_NAME;
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const { pathname } = useLocation();
  const { isLoggedIn, userDetails, logout } = useAuth();
  // console.log(userDetails);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Auctions", path: "/all-auction" },
    { name: "About", path: "/about" },
    // { name: "Register", path: "/register" },
  ];

  //  console.log(import.meta.env.VITE_DOTNET_URL);
  return (
    <>
      <div className="w-100" id="scrollToTop">
        <nav className="navbar navbar-expand-lg custom-navbar px-4 py-2">
          {/* Logo */}
          <Link
            to={"/"}
            className="navbar-brand d-flex align-items-center fw-bold"
          >
            {/* <span className="fs-4">{logo}</span> */}
            <img src={logo} alt="logo" height={40} />
          </Link>

          {/* Toggle */}
          <button
            className="navbar-toggler bg-dark border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu */}
          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav mx-auto gap-lg-4 text-center align-items-center">
              {navLinks.map((link, index) => (
                <li className="nav-item fw-semibold" key={index}>
                  <Link
                    to={link.path}
                    className="link"
                    style={{
                      color: pathname === link.path ? "#1b4332" : "white",
                      textDecoration: "none",
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              {/*  MOBILE LOGIN BUTTON */}
              <div className="d-flex justify-content-between ">
                {isLoggedIn && (
                  <div className="subHeading info me-3 d-lg-none">
                    <p className="name m-0">
                      Hello <strong> {userDetails?.firstName}</strong>
                    </p>
                    <p className="email m-0">{userDetails?.email}</p>
                  </div>
                )}
                {!isLoggedIn ? (
                  <li className="nav-item d-lg-none mt-2">
                    <button
                      className="btn login w-100"
                      data-bs-toggle="modal"
                      data-bs-target="#loginModal"
                    >
                      Log in
                    </button>
                  </li>
                ) : (
                  <div className="dropdown d-lg-none ">
                    {/* Toggle */}
                    <div
                      className="profile login d-flex align-items-center justify-content-center dropdown-toggle"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {userDetails?.livePhotoUrl ? (
                        <img
                          src={userDetails?.livePhotoUrl}
                          alt="profile"
                          className="rounded-circle"
                        />
                      ) : (
                        <b className="mb-0 text-white">
                          {userDetails?.firstName?.charAt(0).toUpperCase()}
                          {userDetails?.lastName?.charAt(0).toUpperCase()}
                        </b>
                      )}
                    </div>

                    {/* Menu */}
                    <ul className="dropdown-menu profile-menu dropdown-menu-end">
                      <li>
                        <Link
                          to={`/profile/${userDetails?.id}`}
                          className="dropdown-item profile-item"
                        >
                          <i className="bi bi-person-fill me-1"></i>
                          <span>Profile</span>
                        </Link>
                      </li>

                      <li>
                        <hr className="dropdown-divider" />
                      </li>

                      <li>
                        <button
                          className="dropdown-item profile-item logout"
                          onClick={() => {
                            showLoader();
                            logout();
                            navigate("/", { replace: true });
                            hideLoader();
                          }}
                        >
                          <i className="bi bi-box-arrow-right me-1"></i>
                          <span>Logout</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </ul>
          </div>

          {/*  DESKTOP RIGHT ACTION */}
          {isLoggedIn &&
          userDetails?.roles?.some((r) => r.name === "SELLER") ? (
            <Link
              to={"/create-product"}
              className="createButton subHeading d-none d-lg-block px-3 py-2 fs-6 fw-semibold rounded-2 "
            >
              Create Product
            </Link>
          ) : (
            isLoggedIn && (
              <button
                type="button"
                className="createButton subHeading d-none d-lg-block px-3 py-2 fs-6 fw-semibold rounded-2"
                data-bs-toggle="modal"
                data-bs-target="#BecomeSellerMedel"
              >
                Become Seller
              </button>
            )
          )}

          {isLoggedIn && (
            <div className="subHeading info me-3 d-none d-lg-block">
              <p className="name m-0">
                Hello <strong> {userDetails?.firstName}</strong>
              </p>
              <p className="email m-0">{userDetails?.email}</p>
            </div>
          )}

          {!isLoggedIn ? (
            <div className="d-none d-lg-block">
              <button
                className=" btn fw-semibold px-4 login"
                data-bs-toggle="modal"
                data-bs-target="#loginModal"
              >
                Log in
              </button>
            </div>
          ) : (
            <div className="dropdown d-none d-lg-block">
              {/* Toggle */}
              <div
                className="profile login d-flex align-items-center justify-content-center dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {userDetails?.livePhotoUrl ? (
                  <img
                    src={userDetails?.livePhotoUrl}
                    alt="profile"
                    className="rounded-circle"
                  />
                ) : (
                  <b className="mb-0 text-white">
                    {userDetails?.firstName?.charAt(0).toUpperCase()}
                    {userDetails?.lastName?.charAt(0).toUpperCase()}
                  </b>
                )}
              </div>

              {/* Menu */}
              <ul className="dropdown-menu profile-menu dropdown-menu-end subHeading">
                <li>
                  <Link
                    to={`/profile/${userDetails?.id}`}
                    className="dropdown-item profile-item"
                  >
                    <i className="bi bi-person-fill me-1"></i>
                    <span>Profile</span>
                  </Link>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <button
                    className="dropdown-item profile-item logout"
                    onClick={() => {
                      showLoader();
                      logout();
                      navigate("/", { replace: true });
                      hideLoader();
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </div>

      <div
  className="modal fade"
  id="BecomeSellerMedel"
  tabIndex={-1}
  data-bs-backdrop="static"
  data-bs-keyboard="false"
  aria-labelledby="BecomeSellerMedelLabel"
  aria-hidden="true"
>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-body">
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="heading fs-6 bg">Become a Seller</h3>

          {/* ONLY way to close */}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div className="py-3">
          <BecomeSeller />
        </div>
      </div>
    </div>
  </div>
</div>

    </>
  );
};

export default Header;
