import React, { useEffect, useState } from 'react'
import "./RejectedProduct.css"
import { getAllCategories } from '../../../CreateProduct/Service/CreateProduct';
import { getAuctionByStatus } from '../../ApproveAuction/Service/ApproveAuction';
import { Link } from 'react-router-dom';

const RejectedProducts = () => {
  const [user, setUser] = useState([]);
      const [category, setCategory] = useState([]);
    
      useEffect(() => {
        let isMounted = true;
    
        const fetchUser = async () => {
          try {
            const cate = await getAllCategories();
            const res = await getAuctionByStatus(2);
            if (isMounted) {
              setCategory(cate);
              setUser(res);
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
  return (
     <div>
      <div className="p-4 overflow-visible">
        <h2 className="heading mb-5 fs-1 text-danger">Rejected Products</h2>
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
              {user.length > 0 ? (
                user.map((data, index) => (
                  <tr  key={data.productId || index}>
                    <td>{index + 1}</td>

                    <td className="fw-semibold text-danger">{data.title}</td>

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

                      <Link to={`/bid-detail/${data.productId}`} className="go-button subHeading fs-6 "> View Auction</Link>
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
  )
}

export default RejectedProducts