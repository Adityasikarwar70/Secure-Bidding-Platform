import React, { useEffect, useState } from "react";
import "./ApproveAuction.css";
import { getAuctionByStatus, } from "../Service/ApproveAuction";
import { getAllCategories } from "../../../CreateProduct/Service/CreateProduct";
import { Link } from "react-router-dom";

const ApproveAuction = () => {
  const [Products, setProducts] = useState();
  const [category, setCategory] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const cate = await getAllCategories();
        const res = await getAuctionByStatus(0);
        if (isMounted) {
          setCategory(cate);
          setProducts(res);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  console.log(Products);

  return (
    <div>
      <div className="p-4 overflow-visible">
        <h2 className="heading mb-5 fs-1">Verify Products</h2>
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover table-dark align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Base Price</th>
                <th>Expected Price</th>
                <th>Category</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {Products?.length > 0 ? (
                Products.map((data, index) => (
                  <tr  key={data.productId || index}>
                    <td>{index + 1}</td>

                    <td className="fw-semibold">{data.title}</td>

                    <td>₹{data.basePrice}</td>

                    <td className="text-success fw-semibold">
                      ₹{data.expectedPrice}
                    </td>

                    <td>
                      <span className="badge bg-success-subtle text-success">
                        {category.find((c) => c.categoryId === data.categoryId)
                          ?.name || "Unknown"}
                      </span>
                    </td>

                    <td className="text-center">
                      <div className="py-1">

                      <Link to={`/bid-detail/${data.productId}`} className="go-button subHeading fs-6 "> View Product</Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 subHeading">
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

export default ApproveAuction;
