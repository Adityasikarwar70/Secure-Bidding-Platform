import React from "react";
import "./OrderCard.css";
import {
  formatDateTime,
  formatMoney,
} from "../../../Shared/CommonFunction/CommonFunction";
import { Link, useLocation } from "react-router-dom";
import PayNowButton from "../../RazorPay/components/PayNowButton";

const OrderCard = ({ order, category, role , Active}) => {
const location = useLocation();
  const paidStatus = ["Pending", "Paid", "Cancelled"];

  return (
    <div className={`order-card ${Active == order?.auction?.product?.productId ? "Active " : " " }`}>
      {/* TOP */}
      <div className="order-header">
        <img
          src={order?.auction?.product?.imageUrls[0]}
          alt="Product"
          className="order-image"
        />

        <div className="order-info">
          <h4 className="order-title subHeading">
            {order?.auction?.product?.title}
          </h4>
          <p className="order-id subHeading">
            Order ID: <strong>#ORD-00{order?.orderId}</strong>
          </p>
          <span className="order-category">
            {category?.find((c) => c.categoryId === order?.auction?.categoryId)
              ?.name || "Unknown"}
          </span>
        </div>
      </div>

      {/* MIDDLE */}
      <div className="order-middle subHeading">
        <div>
          <p className="label subHeading">Bid Price</p>
          <p className="value price subHeading">{formatMoney(order?.amount)}</p>
        </div>

        <div>
          <p className="label subHeading">Status</p>
          <span className={`status subHeading ${order?.status == 1 ? "completed" : order?.status == 0 ?" " : "failed"}  `}>
            {paidStatus[order?.status]}
          </span>
        </div>
      </div>

      {/* TIME */}
      <div className="order-time subHeading">
        <p>From: {formatDateTime(order?.auction?.startTime)}</p>
        <p>To: {formatDateTime(order?.auction?.endTime)}</p>
      </div>

      {/* ACTIONS */}
      <div className="order-actions">
        {role == "seller" ? (
          <Link
            to={`/bid-detail/${order?.auction?.product?.productId}/${order?.auction?.auctionId}`}
            className="btn-primary text-decoration-none subHeading fs-6"
          >
            View Auction
          </Link>
        ) : (
           <PayNowButton buyOrderId={order?.orderId} text={`Pay ${formatMoney(order?.amount)}`} path={location.pathname} />
        )}
      </div>
    </div>
  );
};

export default OrderCard;
