import React, { useEffect, useState } from "react";
import "./AllAuction.css";
import { fetchAllCategory } from "../../Dashboard/AllCategory/Service/AllCategory";
import { CategoryCarousel } from "../../Component/BidCard/CategoryCarousel";
import { useParams } from "react-router-dom";
import { getAllAuctionByStatus } from "../../Dashboard/UpcommingAuction/Service/UpcommingAuction";
import BidCard from "../../Component/BidCard/BidCard";
import { getAllAuctionByCategory } from "../Service/AllAuction";
// import { useLoader } from "../../../Context/useLoader";

const AllAuction = () => {
  const [categories, setCategories] = useState([]);
  const [now, setNow] = useState(Date.now);
  // const {showLoader , hideLoader } = useLoader();
  const [auction, setAuction] = useState();
  const [activeAuction, setActiveAuction] = useState();
  const [activeAuctionByCate, setActiveAuctionByCate] = useState();

  const { id } = useParams();

  
  
  const handleAuction = async (status) => {
    console.log(Date.now(),"--------" , now );
    try {
      const res = await getAllAuctionByStatus(status);

      if (status === 0) {
        setAuction(res || []);
        setActiveAuction(null);
        setActiveAuctionByCate(null);
        console.log("sdcascasvdsv  ", Date.now(res[0].startTime) );

      } else if (status === 1) {
        setActiveAuction(res || []);
        setAuction(null);
        setActiveAuctionByCate(null);

      }
    } catch (error) {
      console.log(error);
    }
  };

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
  // console.log(auction);



  useEffect(() => {
  const fetchData = async () => {
    try {

      const categoriesRes = await fetchAllCategory();
      setCategories(categoriesRes);

      if (id) {
        const auctionsRes = await getAllAuctionByCategory(id);
        setActiveAuctionByCate(auctionsRes);
        setAuction(null);
        setActiveAuction(null);
      } else {

        setActiveAuctionByCate([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchData();
}, [id]);



  return (
    <div className="profileWrapper sectionMargin">
      <div className="auctionWrapper">
        <div className="auctionCategory">
          <CategoryCarousel categories={categories} />

          <button
            className="upcoming mt-4 float-end me-4 subHeading fs-6"
            onClick={() => handleAuction(0)}
          >
            Upcoming <i className="bi bi-app-indicator"></i>
          </button>
          <button
            className="AllAuction mt-4 float-end me-4 subHeading fs-6"
            onClick={() => handleAuction(1)}
          >
            All Auctions <i className="bi bi-app-indicator"></i>
          </button>
        </div>
        <div className="allAuctions sectionMargin">
          <div>

            {(activeAuctionByCate && id) &&  (
              <div className="CategoryAuction p-3 fade-slide">
                <h3 className="heading">
                  {activeAuctionByCate.length > 0
                    ? `All Active Auctions for ${categories.find((c) => c.categoryId == id) ?.name || "Unknown"}`
                    : `No Active For ${categories.find((c) => c.categoryId == id)
                          ?.name || "Unknown"}`}
                </h3>

                {activeAuctionByCate.length > 0 && (
                  <div className="p-5 d-flex justify-content-center align-items-center flex-wrap gap-4">
                    {activeAuctionByCate.map((bid) => (
                      <BidCard key={bid.auctionId} bid={bid} now={now} type={"Active"} category={categories.find((c) => c.categoryId === bid.product.categoryId)?.name || "Unknown"} />
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeAuction && (
              <div className="LiveAuction p-3 fade-slide">
                <h3 className="heading">
                  {activeAuction.length > 0
                    ? "All Active Auctions "
                    : "No Active Auctions"}
                </h3>

                {activeAuction.length > 0 && (
                  <div className="p-5 d-flex justify-content-center align-items-center flex-wrap gap-4">
                    {activeAuction.map((bid) => (
                      <BidCard key={bid.auctionId} bid={bid} now={now} type={"Active"} category={categories.find((c) => c.categoryId === bid.product.categoryId)?.name || "Unknown"} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {auction && (
              <div className="UpComingAuction p-3 fade-slide">
                <h3 className="heading">
                  {auction.length > 0
                    ? "Upcoming Auctions"
                    : "No Upcoming Auctions"}
                </h3>
                {auction.length > 0 && (
                  <div className="p-5 d-flex justify-content-center align-items-center flex-wrap gap-4">
                    {auction?.map((bid) => (
                      <BidCard key={bid.auctionId} bid={bid} now={now} type={"Upcoming"} category={categories.find((c) => c.categoryId === bid.product.categoryId)?.name || "Unknown"} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllAuction;
