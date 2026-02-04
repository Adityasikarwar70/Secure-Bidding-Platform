import { Link, useParams } from "react-router-dom";
import "./BidDetail.css";
import {
  bidAuction,
  changeStatusOfProduct,
  getAuctionById,
  getDetailById,
  getHighestBid,
  getTopBid,
} from "../Service/BidDetail";
import { useEffect, useRef, useState } from "react";
import { useLoader } from "../../../Context/useLoader";
import { getAllCategories } from "../../CreateProduct/Service/CreateProduct";
// import { fetchUserDetails } from "../../Profile/Service/Profile";
import { useAuth } from "../../../Context/useAuth";
import { errorToast, successToast } from "../../../Shared/Utils/Toast";
import { getTimeDifference } from "../../Component/BidCard/BidService";
import { formatMoney } from "../../../Shared/CommonFunction/CommonFunction";
import { showLoginModal } from "../../Security/Login/Services/LoginService";

const BidDetail = () => {
  const { id, AuctionId } = useParams();
  const { isLoggedIn, userDetails } = useAuth();
  // console.log(userDetails);

  const [productDetail, setProductDetail] = useState();
  const [aductionDetail, setAuctionDetail] = useState();
  const [now, setNow] = useState(Date.now);
  const [auctionTime, setAuctionTime] = useState(null);
  const [category, setCategory] = useState([]);
  const [highestBid, setHighestBid] = useState();
  const [topFiveBid, setTopFiveBid] = useState();
  const [approvalStatusRes, setApprovalStatusRes] = useState();
  const { showLoader, hideLoader } = useLoader();
  const [form, setForm] = useState({
    BasePrice: "",
    Status: "",
    Review: "",
  });

    const [bidAmount, setBidAmount] = useState(0);
    const [bidAmountres, setBidAmountres] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updatedForm = {
        ...prev,
        [name]: value,
      };


      if (name === "Status" && value === "1") {
        updatedForm.Review = "";
      }
      return updatedForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      showLoader();
      const res = await changeStatusOfProduct(productDetail?.productId, form);
      setApprovalStatusRes(res);
      successToast("Status Changed");
    } catch (error) {
      console.log(error);
    } finally {
      hideLoader();
    }
  };

  const submitBid = async() =>{
    showLoader();
    try {
      if(isLoggedIn){
        const res = await bidAuction(AuctionId,bidAmount);
        setBidAmountres(res)
        successToast("Bid Added")
      }else{
        showLoginModal()
        errorToast("Login First")
      }
    } catch (error) {
      console.log(error);
      
    }finally{
      hideLoader();
    }
    
  }

// to run timer
  useEffect(() => {
    let interval = null;

    const startTimer = () => {
      if (!interval) {
        interval = setInterval(() => {
          setNow(Date.now());
        }, 1000);
      }
    };
    const stopTimer = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    };
    startTimer();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const timeLeft = getTimeDifference(auctionTime, now);
const hasReloaded = useRef(false)
   useEffect(() => {
      const isZero =
        timeLeft.days == 0 &&
        timeLeft.hours == 0 &&
        timeLeft.minutes == 0 &&
        timeLeft.seconds == 0;
  
      if (isZero && !hasReloaded.current) {
        hasReloaded.current = true;
  
     
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    }, [timeLeft]);

  

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        if (AuctionId) {
          try {
            const auctionRes = await getAuctionById(AuctionId);
            setAuctionDetail(auctionRes);

            const auctionId = auctionRes?.auctionId;
            if (auctionId) {
              const [highBidRes, topFiveRes] = await Promise.allSettled([
                getHighestBid(auctionId),
                getTopBid(auctionId),
              ]);

              if (highBidRes.status === "fulfilled") {
                setHighestBid(highBidRes.value);
              }

              if (topFiveRes.status === "fulfilled") {
                setTopFiveBid(topFiveRes.value);
              }
            }

            const auctionTime =
              auctionRes?.auctionStatus === 0
                ? auctionRes.startTime
                : auctionRes.endTime;

            setAuctionTime(auctionTime);
          } catch (err) {
            console.warn("Auction-related data failed:", err);
          }
        }

        try {
          const [productRes, categoryRes] = await Promise.all([
            getDetailById(id),
            getAllCategories(),
          ]);

          setProductDetail(productRes);
          setCategory(categoryRes);
        } catch (err) {
          console.warn("Product/Category fetch failed:", err);
        }
      } catch (err) {
        console.error("Unexpected error in fetchDetail:", err);
      }
    };

    fetchDetail();
  }, [id, AuctionId, approvalStatusRes,bidAmountres]);

  return (
    <div className="bidDetailContainer sectionMargin mb-1">
      <section id="carouselExampleIndicators" className="carousel slide">
        <div className="carousel-indicators">
          {Array.isArray(productDetail?.imageUrls) &&
            productDetail.imageUrls.length > 0 &&
            productDetail.imageUrls.map((url, index) => (
              <button
              key={index}
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="0"
                className="active"
                aria-current="true"
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
        </div>
        <div className="carousel-inner corouselImages">
          {Array.isArray(productDetail?.imageUrls) &&
          productDetail.imageUrls.length > 0 ? (
            productDetail.imageUrls.map((url, index) => (
              <div
                key={url || index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <img
                  src={url}
                  className="d-block w-100"
                  alt={`Auction image ${index + 1}`}
                />
              </div>
            ))
          ) : (
      
            <div className="carousel-item active">
              <img
                src="/placeholder.png"
                className="d-block w-100"
                alt="No image available"
              />
            </div>
          )}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </section>

      <section className="bidDetailContent ">
        <div className="bidleft sectionMargin p-3">
          <h2 className="bit-title heading green">
            {productDetail?.title ? productDetail?.title : "Loading...."}
          </h2>
          <p className="bit-category subHeading mb-0">
            <strong>Category: </strong>
            {category.find((c) => c.categoryId === productDetail.categoryId)
              ?.name || "Unknown"}
          </p>
          <div className="desc subHeading d-flex">
            <p className="fw-bold fs-6 me-1 mb-0">Description: </p>
            <p className="descText fs-6">
              {productDetail?.description
                ? productDetail.description
                : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur recusandae itaque ipsam minus exercitationem doloribus consequuntur alias hic cumque quo quibusdam id rem quidem reiciendis corrupti autem perspiciatis, possimus dolorum tenetur magni eius eos? Dolores, accusantium fugiat. Sint, libero sed!"}
            </p>
          </div>
        </div>

        <div className="bidright sectionMargin">
          <div className=" bidright-left d-flex flex-column align-items-start">
            {aductionDetail?.auctionStatus === 0 ||
            aductionDetail?.auctionStatus === 1 ? (
              <div className="countWrapper d-flex flex-column ">
                <h3 className="subHeading text-start text-danger fs-5 fw-bold mb-3">
                  {aductionDetail?.auctionStatus === 0
                    ? "Upcoming In . . ."
                    : "Ends In . . ."}
                </h3>
                <div className="countdown">
                  <div className="numWrapper">
                    <strong
                      className={
                        timeLeft.days && timeLeft.hours && timeLeft.minutes < 5
                          ? "heading text-danger"
                          : "heading "
                      }
                    >
                      {timeLeft.days}
                    </strong>
                    <span className="subHeading fs-6">Days</span>
                  </div>
                  <div className="numWrapper">
                    <strong
                      className={
                        timeLeft.days && timeLeft.hours && timeLeft.minutes < 5
                          ? "heading text-danger"
                          : "heading "
                      }
                    >
                      {timeLeft.hours}
                    </strong>
                    <span className="subHeading fs-6">Hours</span>
                  </div>
                  <div className="numWrapper">
                    <strong
                      className={
                        timeLeft.days && timeLeft.hours && timeLeft.minutes < 5
                          ? "heading text-danger"
                          : "heading "
                      }
                    >
                      {timeLeft.minutes}
                    </strong>
                    <span className="subHeading fs-6">Minutes</span>
                  </div>
                  <div className="numWrapper">
                    <strong
                      className={
                        timeLeft.days && timeLeft.hours && timeLeft.minutes < 5
                          ? "heading text-danger"
                          : "heading "
                      }
                    >
                      {timeLeft.seconds}
                    </strong>
                    <span className="subHeading fs-6">Seconds</span>
                  </div>
                </div>
              </div>
            ) : AuctionId ? (
              <h4 className="heading me-5 w-100 text-danger text-start mb-3">
                {" "}
                Auction <br /> Closed!
              </h4>
            ) : productDetail?.approvalStatus == 0 ? (
              <h3 className="heading fs-3 text-start mb-3 text-light">
                Not Started Yet
              </h3>
            ) : productDetail?.approvalStatus == 1 ? (
              <h3 className="heading fs-3 text-start">
                Expected: <br />{" "}
                <p className="mt-2 green">
                  {formatMoney(productDetail?.expectedPrice)}
                </p>
              </h3>
            ) : (
              <h3 className="heading fs-1 text-start text-danger mb-3">
                Product <br /> Rejected
              </h3>
            )}

            <div className="d-flex gap-3">
              <div className="currentBid">
                <h6 className="heading fs-4 m-0">
                  {productDetail?.approvalStatus == 0 ||
                  productDetail?.approvalStatus == 2
                    ? formatMoney(productDetail?.expectedPrice)
                    : productDetail?.approvalStatus == 1
                      ? formatMoney(productDetail?.basePrice)
                      : null}
                </h6>

                <p className="subHeading text-white m-0 fs-5">
                  {productDetail?.approvalStatus == 0 ||
                  productDetail?.approvalStatus == 2
                    ? "Expected Price"
                    : productDetail?.approvalStatus == 1
                      ? "Base Price"
                      : null}
                </p>
              </div>

              {AuctionId &&
                !(
                  aductionDetail?.auctionStatus == 0 ||
                  aductionDetail?.auctionStatus == 3
                ) && (
                  <div className="currentBid">
                    <h6 className="heading fs-4 m-0">
                      {aductionDetail?.auctionStatus === 1 ||
                      aductionDetail?.auctionStatus === 2
                        ? formatMoney(
                            highestBid?.bidAmount ? highestBid?.bidAmount : 0,
                          )
                        : null}
                    </h6>

                    <p className="subHeading m-0 fs-5 text-info">
                      {(aductionDetail?.auctionStatus === 1 ||
                        aductionDetail?.auctionStatus === 2) &&
                        "Highest Bid"}
                    </p>
                  </div>
                )}
            </div>

            {productDetail?.approvalStatus == 0 ? (
              <div className="placeBidForm subHeading mt-3 mx-0">
                <h2 className="text-white">Status: </h2>
                <button>Pending</button>
              </div>
            ) : aductionDetail?.auctionStatus == 2 ? (
              <div className="placeBidForm subHeading mt-3 mx-0">
                <h2 className="text-white">Status: </h2>
                <button className="bg-danger">Closed</button>
              </div>
            ) :productDetail?.approvalStatus==2 || aductionDetail?.auctionStatus == 3 ? (
              <div className="placeBidForm subHeading mt-3 mx-0">
                <h2 className="text-white">Status: </h2>
                <button className="bg-danger">Rejected</button>
              </div>
            ) : productDetail?.approvalStatus == 1 && aductionDetail?.auctionStatus==1 ? (
              <div className="placeBidForm mt-2">
                <div className="form-floating fs-6 subHeading col-6 col-md-5">
                  <input
                    type="number"
                    className="form-control"
                    id="floatingInput"
                    placeholder="2500"
                    name="bidAmount"
                    disabled={ userDetails?.id == aductionDetail?.product?.sellerUserId}
                    onChange={(e)=>setBidAmount(e.target.value)}
                  />
                  <label htmlFor="floatingInput">Bid Amount</label>
                </div>
                <button className="submitbid subHeading" disabled={bidAmount <= highestBid?.bidAmount || bidAmount <= productDetail?.basePrice  || userDetails?.id == aductionDetail?.product?.sellerUserId} onClick={submitBid}>
                  {userDetails?.id == aductionDetail?.product.sellerUserId ? "Your Auction" : "Place Bid" } <i className="bi bi-arrow-right-short"></i>
                </button>
              </div>
            ): ""}
            
          </div>
          {aductionDetail?.auctionStatus == 1 ||
          aductionDetail?.auctionStatus == 2 ? (
            <div className="w-100">
              <div className="bidHistory">
                <div className="hr d-block d-md-none"></div>
                <h5 className="heading mb-3 fs-5 mt-4 mt-md-0">
                  Top Bid History
                </h5>
                <div className="biduser">
                  {topFiveBid?.length > 0 ? (
                    topFiveBid?.map((bids,key) => (
                      <p className="subHeading" key={key}>
                        <i className="bi bi-person-fill-check green me-2"></i>{" "}
                        {bids?.bidderUserId==userDetails?.id ? "Your Bid added: " : "An User bid: "} <strong>{formatMoney(bids.bidAmount)}</strong>
                      </p>
                    ))
                  ) : (
                    <p className="subHeading fs-5">No Bids Yet..</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            productDetail?.approvalStatus == 2 && (
              <p className="subHeading fs-5 text-start text-danger">
                <span className="text-white">Remark:</span> <br />
                {productDetail?.remark}
              </p>
            )
          )}
        </div>
      </section>
      {userDetails?.roles?.some((role) => role.name === "ADMIN") && (
        <section className="sectionMargin admin">
          <div className="container ">
            <h6 className="heading fs-2 mt-3">Admin Approval</h6>

            <div className="accordion" id="accordionExample">
              <div className="accordion-item border-0">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button subHeading fs-5"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    Admin Approval Section
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <form
                      className="row g-3 align-items-start"
                      onSubmit={handleSubmit}
                    >
                    
                      <div className="col-12 col-md-3">
                        <label className="form-label subHeading">
                          Decision
                        </label>
                        <select
                          className="form-select p-3 subHeading"
                          name="Status"
                          value={form.Status}
                          onChange={handleChange}
                        >
                          <option value="">Approve or Reject</option>
                          <option value="1">Approve</option>
                          <option value="2">Reject</option>
                        </select>
                      </div>

                      
                      <div className="col-12 col-md-3">
                        <label className="form-label subHeading">
                          Base Amount
                        </label>
                        <input
                          type="number"
                          className="form-control p-3"
                          placeholder="Base Amount"
                          name="BasePrice"
                          value={form.BasePrice}
                          onChange={handleChange}
                        />
                      </div>

                      
                      {form.Status == "2" && (
                        <div className="col-12 col-md-6">
                          <label className="form-label subHeading">
                            Comment
                          </label>
                          <textarea
                            className="form-control p-3"
                            rows="1"
                            placeholder="Leave a comment here..."
                            name="Review"
                            value={form.Review}
                            onChange={handleChange}
                          />
                        </div>
                      )}
                      <div className="col-12 text-end">
                        <button
                          type="submit"
                          className="btn btn-success px-4 py-2"
                        >
                          Submit Decision
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BidDetail;
