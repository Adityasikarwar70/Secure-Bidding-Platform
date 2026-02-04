import React, { useEffect, useRef } from "react";
import "./BidCard.css"
import { formatMoney } from "../../../Shared/CommonFunction/CommonFunction";
import {getTimeDifference} from "./BidService"
import TimeBlock from "../TimeBlock/TimeBlock";
import { Link } from "react-router-dom";
import { successToast } from "../../../Shared/Utils/Toast";

 const BidCard = React.memo(({ bid, now,type ,category}) => {
  
  const time = type=="Upcoming" ? bid.startTime : bid.endTime ;
  
  const timeLeft = getTimeDifference(time, now)
  // console.log("category",category);
  
const hasReloaded = useRef(false)
    useEffect(() => {
    const isZero =
      timeLeft.days == 0 &&
      timeLeft.hours == 0 &&
      timeLeft.minutes == 0 &&
      timeLeft.seconds == 0;

    if (isZero && !hasReloaded.current) {
      hasReloaded.current = true;

      // small delay for smooth UX
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }, [timeLeft]);

  const copyCurrentUrl = async (e) => {
    e.preventDefault();
   e.stopPropagation();
  try {
    const baseUrl = window.location.origin;
    await navigator.clipboard.writeText(bid.auctionId ? `${baseUrl}/bid-detail/${bid.product.productId}/${bid.auctionId}` : `${baseUrl}/bid-detail/${bid.product.productId}`);
    successToast("Linked Copied")
  } catch (err) {
    console.error("Failed to copy URL", err);
  }
};


  return (
    <Link to={bid.auctionId ? `/bid-detail/${bid.product.productId}/${bid.auctionId}` : `/bid-detail/${bid.product.productId}`} className="auction-card heading fs-5 text-decoration-none">
      <div className="countdown">
        <TimeBlock value={timeLeft.days} label="Days" />
        <TimeBlock value={timeLeft.hours} label="Hours" />
        <TimeBlock value={timeLeft.minutes} label="Minutes" />
        <TimeBlock value={timeLeft.seconds} label="Seconds" />
      </div>

      <div className="imgContainer">
        <img
          src={bid.product.imageUrls[0]}
          alt="Auction Item"
          className="auction-img"
        />
      </div>

      <div className="bidDetails">
        <h5>
          {bid.product.title.length > 20
            ? bid.product.title.substring(0, 20) + "..."
            : bid.product.title}
        </h5>

        <p className="subHeading fs-6 my-0">Category: {category}</p>

        <p className="subHeading">
          Base Price: <strong>{formatMoney(bid.product.basePrice)}</strong>
        </p>

        <div className="w-100 d-flex justify-content-between align-items-center">
          <button className="w-50 bid-btn subHeading">
            Place a Bid <i className="bi bi-rocket-takeoff-fill"></i>
          </button>
          <i className="share bi bi-share-fill" title="Share" onClick={copyCurrentUrl} ></i>
        </div>
      </div>
    </Link>
  );
});

export default BidCard;
