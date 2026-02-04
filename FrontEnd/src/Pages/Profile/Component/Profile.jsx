import React, { useEffect, useState } from "react";
import "./Profile.css";
import icon from "../../../assets/Images/icon.png";
import { useAuth } from "../../../Context/useAuth";
import Bidx from "../../../assets/Images/bidX.svg"
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { ApproveUser, fetchUserDetails } from "../Service/Profile";
import { useLoader } from "../../../Context/useLoader";

const Profile = () => {
  const { isLoggedIn, userDetails } = useAuth();
//   console.log("userDetails?", userDetails?);
const {showLoader , hideLoader } = useLoader();
const location = useLocation();
const path = location.pathname;
const [approveRes, setApproveRes] = useState();
const [CurrentUserRole, setCurrentUserRole] = useState();
const { id } = useParams();
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
      verified:false,
      roles:[]
    });
    const [disabled, setDisabled] = useState(true)

    const getCurrentUser= async()=>{
        const res = await fetchUserDetails(id);
        // console.log("UserById", res);
        setForm((prev) => ({
      ...prev, 
      firstName: res.firstName || "",
      lastName: res.lastName || "",
      email: res.email || "",
      mobileNo: res.mobileNo || "",
      userName: res.username || "",
      aadharNo: res.aadharNo || "",
      pancardNo: res.pancardNo || "",
      address: res.address || "",
      panCardUrl: res.panCardUrl || "",
      aadharCardUrl: res.aadharCardUrl || "",
      livePhotoUrl: res.livePhotoUrl || "",
      verified:res.verified || false,
      roles:res.roles || []
    }));

    }

useEffect(() => {
  if (userDetails?.id == id) {
    setForm((prev) => ({
      ...prev, // 
      firstName: userDetails?.firstName || "",
      lastName: userDetails?.lastName || "",
      email: userDetails?.email || "",
      mobileNo: userDetails?.mobileNo || "",
      userName: userDetails?.username || "",
      aadharNo: userDetails?.aadharCardNumber || "",
      pancardNo: userDetails?.panCardNumber || "",
      address: userDetails?.address || "",
      panCardUrl: userDetails?.panCardUrl || "",
      aadharCardUrl: userDetails?.aadharCardUrl || "",
      livePhotoUrl: userDetails?.livePhotoUrl || "",
      verified:userDetails?.verified || false,
      roles:userDetails?.roles || []
    }));

    setCurrentUserRole(userDetails?.roles.some((r) => r.name === "ADMIN") ? "ADMIN" : (userDetails?.roles.some((r) => r.name === "SELLER") ? "SELLER" : "BUYER"))
  }
  else getCurrentUser();
}, [userDetails,id,approveRes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // console.log(userDetails?);

  const handleApprove = async(e) =>{
    e.preventDefault();
    showLoader();
    try {
      const res = await ApproveUser(id);
      setApproveRes(res);
      
    } catch (error) {
      console.log(error);
      
    }finally{
      hideLoader();
    }

  }
  
  

  // console.log(form);
  



  return (
    <div className="profileWrapper sectionMargin">
      <div>
        <div className="p-4 ">
            {(isLoggedIn && id == userDetails?.id) && <div className="w-100 d-flex justify-content-end">
            <button className="dashboard-btn col-1.5" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">Dashboard <i className="bi bi-body-text ms-2"></i></button>
            </div>}
            
          <div className="accordion" id="accordionPanelsStayOpenExample">
            <div className="accordion-item">
              <h2 className="accordion-header heading ">
                <button
                  className="accordion-button text-white"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseOne"
                //   aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseOne"
                >
                  <img src={icon} height={35} alt="" className="me-3" />{" "}
                  Personal Details  <div className="RoleTag">{form.roles.some((r) => r.name === "ADMIN") ? "ADMIN" : (form.roles.some((r) => r.name === "SELLER") ? "SELLER" : "BUYER")}</div>
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseOne"
                className="accordion-collapse collapse show"
              >
                <div className="accordion-body">
                  <div className="d-flex gap-5">
                    <div className="ProfileImgWrapper">
                      <img src={form.livePhotoUrl ? form?.livePhotoUrl : "https://i.pinimg.com/1200x/97/16/65/971665fe7fbbe2e6e5ab8153d21bc54f.jpg"} alt="" />
                      
                    {form.verified == true && <i className=" verifyTick bi bi-patch-check-fill green ms-2"></i>}
                    </div>
                      <form action="" className="w-75">
                    <div className="detailWrapper row gx-3">
                        <div className="form-floating mb-3 col-4">
                          <input
                            type="text"
                            className="form-control"
                            id="firstname"
                            placeholder="firstname"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            disabled={disabled}
                          />
                          <label htmlFor="firstname">FirstName</label>
                        </div>
                        <div className="form-floating mb-3 col-4">
                          <input
                            type="text"
                            className="form-control"
                            id="lastname"
                            placeholder="lastname"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                             disabled={disabled}
                          />
                          <label htmlFor="lastname">LastName</label>
                        </div>
                        <div className="form-floating mb-3 col-4">
                          <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="username"
                            name="username"
                            value={form.userName}
                            onChange={handleChange}
                             disabled={disabled}
                          />
                          <label htmlFor="username">UserName</label>
                        </div>
                        <div className="form-floating mb-3 col-4">
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="name@example.com"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                             disabled={disabled}
                          />
                          <label htmlFor="email">Email address</label>
                        </div>
                        <div className="form-floating mb-3 col-4">
                          <input
                            type="number"
                            className="form-control"
                            id="mobileNo"
                            placeholder="1234567899"
                            name="mobileNo"
                            value={form.mobileNo}
                            onChange={handleChange}
                             disabled={disabled}
                          />
                          <label htmlFor="mobileNo">Mobile No</label>
                        </div>
                        {(isLoggedIn && id == userDetails?.id) &&(<><div className="form-floating mb-3 col-4">
                          <input
                            type="text"
                            className="form-control"
                            id="pancard"
                            placeholder="1234567899"
                            name="pancardNo"
                            value={form.pancardNo}
                            onChange={handleChange}
                             disabled={disabled}
                          />
                          <label htmlFor="pancard">PanCard No</label>
                        </div>
                        <div className="form-floating mb-3 col-4">
                          <input
                            type="number"
                            className="form-control"
                            id="aadharcard"
                            placeholder="1234567899"
                            name="aadharNo"
                            value={form.aadharNo}
                            onChange={handleChange}
                             disabled={disabled}
                          />
                          <label htmlFor="aadharcard">AadhadCard No</label>
                        </div></>)}
                        <div className="form-floating mb-3 col-8">
                          <textarea
                            type="number"
                            className="form-control"
                            id="address"
                            placeholder="XYZ"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                             disabled={disabled}
                          />
                          <label htmlFor="address">Address</label>
                        </div>
                    </div>
                      </form>
                  </div>

                          {(userDetails?.roles?.some((role) => role.name === "ADMIN") && form.verified==false ) && (<div className="Approve-User subHeading fs-6 w-100 ">
                            <button onClick={handleApprove} >Approve User</button>
                          </div>)}
                          

                </div>
              </div>
            </div>
          </div>

          {(isLoggedIn && id == userDetails?.id) && <div className="dashboard-body ">
            { path == `/profile/${userDetails?.id}` && <div className="WelcomeScreen">
                <h2 className="heading fs-3">Welcome <span className="nameSpan rounded-3"> {userDetails?.firstName}</span></h2>
                <img src={Bidx} height={200} alt="" />
            </div>}
            <Outlet />   
          </div>}




        </div>
      </div>

{/* //sidebar  */}
<div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
  <div className="offcanvas-header">
    <h5 className="offcanvas-title heading fs-5" id="offcanvasWithBothOptionsLabel">{CurrentUserRole} DashBoard</h5>
    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div className="offcanvas-body">


{/* ONLY ADMIN ACCESS END-POINTS */ }
    {CurrentUserRole === "ADMIN" &&
    <div className="linkWrapper">

      {/* Approve USer */}
    <div className={path == `/profile/${userDetails?.id}/approveUser` ? "dashboard-Activelink" : "dashboard-link"}>
    <Link className="links" to={`/profile/${userDetails?.id}/approveUser`}> Verify Users
    </Link>
    </div>

    {/* All Users */}
    <div className={path == `/profile/${userDetails?.id}/all-users` ? "dashboard-Activelink" : "dashboard-link"}>
    <Link className="links" to={`/profile/${userDetails?.id}/all-users`}> All Users
    </Link>
    </div>

    {/* All Category */}
    <div className={path == `/profile/${userDetails?.id}/allCategory` ? "dashboard-Activelink" : "dashboard-link"}>
    <Link className="links" to={`/profile/${userDetails?.id}/allCategory`}> All Category
    </Link>
    </div>

            {/* Approve Products */}
    <div className={path == `/profile/${userDetails?.id}/approveAuction` ? "dashboard-Activelink" : "dashboard-link"}>
    <Link className="links" to={`/profile/${userDetails?.id}/approveAuction`}> Verify Products
    </Link>
    </div>

    {/* Approved Products */}
    <div className={path == `/profile/${userDetails?.id}/active` ? "dashboard-Activelink" : "dashboard-link"}>
    <Link className="links" to={`/profile/${userDetails?.id}/active`}> All Approved Products
    </Link>
    </div>
    {/* rejected Products  */}
    <div className={path == `/profile/${userDetails?.id}/rejectedProducts` ? "dashboard-Activelink" : "dashboard-link"}>
    <Link className="links" to={`/profile/${userDetails?.id}/rejectedProducts`}> All Rejected Products
    </Link>
    </div>
    {/* Upcoming Auction */}
    <div className={path == `/profile/${userDetails?.id}/upcoming` ? "dashboard-Activelink" : "dashboard-link"}>
    <Link className="links" to={`/profile/${userDetails?.id}/upcoming`}> Upcoming Auction
    </Link>
    </div>
    {/* Live Auction */}
    <div className={path == `/profile/${userDetails?.id}/live-auction` ? "dashboard-Activelink" : "dashboard-link"}>
    <Link className="links" to={`/profile/${userDetails?.id}/live-auction`}> Live Auction
    </Link>
    </div>
    {/* Closed Auction */}
    <div className={path == `/profile/${userDetails?.id}/closed-auction` ? "dashboard-Activelink" : "dashboard-link"}>
    <Link className="links" to={`/profile/${userDetails?.id}/closed-auction`}> Closed Auction
    </Link>
    </div>



      {/* All Products */}
      <div className={path == `/profile/${userDetails?.id}/AllProductsB-S` ? "dashboard-Activelink" : "dashboard-link"}>
    <Link className="links" to={`/profile/${userDetails?.id}/AllProductsB-S`}> Your Products
    </Link>
    </div>


      {/* All Auctions */}
      <div className={path == `/profile/${userDetails?.id}/AllAuctionsB-S` ? "dashboard-Activelink" : "dashboard-link"}>
    <Link className="links" to={`/profile/${userDetails?.id}/AllAuctionsB-S`}> Your Auctions
    </Link>
    </div>

           {/* All Orders History  */}
    <div className={path == `/profile/${userDetails?.id}/orders/${userDetails?.id}/seller` ? "dashboard-Activelink" : "dashboard-link"}>
    <Link className="links" to={`/profile/${userDetails?.id}/orders/${userDetails?.id}/seller`}> Order History 
    </Link>
    </div>

      {/* All Bids  */}
    <div className={path == `/profile/${userDetails?.id}/allBids/${userDetails?.id}` ? "dashboard-Activelink" : "dashboard-link"}>
    <Link className="links" to={`/profile/${userDetails?.id}/allBids/${userDetails?.id}`}> Your Bids 
    </Link>
    </div>

    </div>
    }





 {CurrentUserRole === "SELLER" &&
    <div className="linkWrapper">

      {/* All Products */}
      <div className={path == `/profile/${userDetails?.id}/AllProductsB-S` ? "dashboard-Activelink" : "dashboard-link"}>
    <Link className="links" to={`/profile/${userDetails?.id}/AllProductsB-S`}> Your Products
    </Link>
    </div>


      {/* All Auctions */}
      <div className={path == `/profile/${userDetails?.id}/AllAuctionsB-S` ? "dashboard-Activelink" : "dashboard-link"}>
    <Link className="links" to={`/profile/${userDetails?.id}/AllAuctionsB-S`}> Your Auctions
    </Link>
    </div>

    
    {/* All Orders History  */}
    <div className={path == `/profile/${userDetails?.id}/orders/${userDetails?.id}/seller` ? "dashboard-Activelink" : "dashboard-link"}>
    <Link className="links" to={`/profile/${userDetails?.id}/orders/${userDetails?.id}/seller`}> Order History 
    </Link>
    </div>

    {/* All Bids History */}
    <div className={path == `/profile/${userDetails?.id}/allBids/${userDetails?.id}` ? "dashboard-Activelink" : "dashboard-link"}>
    <Link className="links" to={`/profile/${userDetails?.id}/allBids/${userDetails?.id}`}> Bids History 
    </Link>
    </div>

    </div>
}

{CurrentUserRole === "BUYER" &&
    <div className="linkWrapper">

       {/* All Orders History  */}
    <div className={path == `/profile/${userDetails?.id}/orders/${userDetails?.id}/seller` ? "dashboard-Activelink" : "dashboard-link"}>
    <Link className="links" to={`/profile/${userDetails?.id}/orders/${userDetails?.id}/seller`}> Order History 
    </Link>
    </div>

    {/* All Bids History */}
    <div className={path == `/profile/${userDetails?.id}/allBids/${userDetails?.id}` ? "dashboard-Activelink" : "dashboard-link"}>
    <Link className="links" to={`/profile/${userDetails?.id}/allBids/${userDetails?.id}`}> Your Bids 
    </Link>
    </div>
    


    </div>
}

  </div>
</div>
    </div>
  );
};

export default Profile;
