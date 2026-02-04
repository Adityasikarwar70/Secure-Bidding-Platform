import React, { useEffect, useState } from "react";
import "./AllAuctionsBS.css";
import { getAllCategories } from "../../../CreateProduct/Service/CreateProduct";
import {
  ChangeDecision,
  getAllAuctionsOfSeller,
} from "../Services/AllAuctionsBS";
import { useAuth } from "../../../../Context/useAuth";
import {
  formatDateTime,
  formatMoney,
} from "../../../../Shared/CommonFunction/CommonFunction";
import { Link } from "react-router-dom";
import { useLoader } from "../../../../Context/useLoader";
import { errorToast, successToast } from "../../../../Shared/Utils/Toast";

const AllAuctionsBS = () => {
  const { userDetails } = useAuth();
  const [auction, setAuction] = useState([]);
  const [category, setCategory] = useState([]);
  const [DecisionRes, setDecisionRes] = useState();
  const AuctionStatus = ["UpComing", "Live", "Closed", "Cancelled"];
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const categories = await getAllCategories();
        const auctionsRes = await getAllAuctionsOfSeller(userDetails?.id);

        if (isMounted) {
          setCategory(categories);
          setAuction(auctionsRes);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [DecisionRes]);

  const handleDecision = async (id, decision) => {
    showLoader();
    try {
      const res = await ChangeDecision(id, decision);
      setDecisionRes(res);
      successToast(`Status ${decision == true ? "Approved" : "Rejected"}`);
    } catch (error) {
      console.log(error);
      errorToast("Something Went Wrong");
    } finally {
      hideLoader();
    }
  };

  return (
    <div>
      <div className="p-4 overflow-visible">
        <h2 className="heading mb-5 fs-1">Live Auction</h2>
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover table-dark align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Auction Name</th>
                <th>Category</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Starting Price</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody className="subHeading fs-6">
              {auction.length > 0 ? (
                auction.map((data, index) => (
                  <tr key={data?.auction.auctionId || index}>
                    <td>{index + 1}</td>

                    <td className="fw-semibold">
                      {data?.auction?.product?.title?.length > 16
                        ? data?.auction?.product?.title.slice(0, 16) + "..."
                        : data?.auction?.product?.title}
                    </td>

                    {((data?.auction?.auctionStatus == 2 &&
                      data?.highestBid >=
                        data?.auction?.product?.expectedPrice) ||
                      data?.auction?.auctionStatus != 2 ||
                      data?.auction?.resultStatus == 3) && (
                      <td>
                        <span className="badge bg-success-subtle text-success">
                          {category.find(
                            (c) => c.categoryId === data?.auction?.categoryId,
                          )?.name || "Unknown"}
                        </span>
                      </td>
                    )}

                    {((data?.auction?.auctionStatus == 2 &&
                      data?.highestBid >=
                        data?.auction?.product?.expectedPrice) ||
                      data?.auction?.auctionStatus != 2 ||
                      data?.auction?.resultStatus == 3) && (
                      <td className="text-success fw-semibold">
                        {formatDateTime(data?.auction?.startTime)}
                      </td>
                    )}

                    {((data?.auction?.auctionStatus == 2 &&
                      data?.highestBid >=
                        data?.auction?.product?.expectedPrice) ||
                      data?.auction?.auctionStatus != 2 ||
                      data?.auction?.resultStatus == 3) && (
                      <td className="text-danger fw-semibold">
                        {formatDateTime(data?.auction?.endTime)}
                      </td>
                    )}

                    {((data?.auction?.auctionStatus == 2 &&
                      data?.highestBid >=
                        data?.auction?.product?.expectedPrice) ||
                      data?.auction?.auctionStatus != 2 ||
                      data?.auction?.resultStatus == 3) && (
                      <td>{formatMoney(data?.auction?.startingPrice)}</td>
                    )}

                    {/* logic------------- */}
                    {data?.auction?.auctionStatus == 2 &&
                      data?.auction?.resultStatus == 5 && (
                        <td className="text-warning" colSpan={4}>
                          This auction has ended with no bids placed.
                        </td>
                      )}

                    {data?.auction?.auctionStatus == 2 &&
                      data?.auction?.resultStatus == 2 &&
                      (data?.highestBid ?? 0) <
                        data?.auction?.product?.expectedPrice && (
                        <td className="text-warning" colSpan={4}>
                          The highest bid received is{" "}
                          <span className="fw-bold fs-6">
                            {data?.highestBid == null
                              ? formatMoney(0)
                              : formatMoney(data?.highestBid)}
                          </span>
                          , which does not meet your expected price of{" "}
                          <span className="fw-bold fs-6">
                            {formatMoney(data?.auction?.product?.expectedPrice)}
                          </span>
                          .
                          <br />
                          <span>
                            Kindly decide whether you would like to approve or
                            reject this bid.
                          </span>
                        </td>
                      )}

                    {/* ends---------------------- */}

                    <td>
                      <span
                        className={`p-2 text-white rounded-3 fw-semibold ${
                          Number(data?.auction?.auctionStatus) > 1
                            ? "closed"
                            : "approve"
                        }`}
                      >
                        {AuctionStatus[data?.auction?.auctionStatus]}
                      </span>
                    </td>

                    <td className="text-center">
                      <div className="py-1">
                        {data?.auction?.auctionStatus == 2 &&
                        (data?.auction?.resultStatus == 3 ||
                          data?.highestBid >=
                            data?.auction?.product?.expectedPrice) ? (
                          <Link
                            to={`/profile/${userDetails.id}/orders/${data?.auction?.product?.sellerUserId}/seller/${data?.auction?.product?.productId}`}
                            className="order-button subHeading fs-6"
                          >
                            View Order
                          </Link>
                        ) : data?.auction?.auctionStatus == 2 &&
                          data?.auction?.resultStatus == 2 &&
                          (data?.highestBid ?? 0) <
                            data?.auction?.product?.expectedPrice ? (
                          <div className="d-flex align-items-center justify-content-center gap-4">
                            <i
                              className="action-icon red bi bi-x-circle-fill"
                              onClick={() =>
                                handleDecision(data?.auction?.auctionId, false)
                              }
                            ></i>
                            <i
                              className="action-icon green bi bi-check-circle-fill"
                              onClick={() =>
                                handleDecision(data?.auction?.auctionId, true)
                              }
                            ></i>
                          </div>
                        ) : (
                          (data?.auction?.auctionStatus == 1 ||
                            data?.auction?.auctionStatus == 0 ||
                            (data?.auction?.auctionStatus == 2 &&
                              data?.auction?.resultStatus == 5) ||
                            data?.auction?.resultStatus == 0) && (
                            <Link
                              to={`/bid-detail/${data?.auction?.product?.productId}/${data?.auction?.auctionId}`}
                              className="go-button subHeading fs-6"
                            >
                              View Auction
                            </Link>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 subHeading">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllAuctionsBS;
