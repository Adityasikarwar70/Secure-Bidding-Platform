import React, { useEffect, useState } from 'react'
import "./ClosedAuction.css"
import { formatDateTime, formatMoney } from '../../../../Shared/CommonFunction/CommonFunction'
import { getAllCategories } from '../../../CreateProduct/Service/CreateProduct';
import { getAllAuctionByStatus } from '../../UpcommingAuction/Service/UpcommingAuction';
import { Link } from 'react-router-dom';

const ClosedAuction = () => {
    const [auction, setAuction] = useState([]);
      const [category, setCategory] = useState([]);
    
      useEffect(() => {
        let isMounted = true;
    
        const fetchData = async () => {
          try {
            const categories = await getAllCategories();
            const auctionsRes = await getAllAuctionByStatus(2);
    
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
      }, []);
  return (
     <div>
      <div className="p-4 overflow-visible">
        <h2 className="heading mb-5 fs-1 text-danger">Closed Auction</h2>
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
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {auction.length > 0 ? (
                auction.map((data, index) => (
                  <tr  key={data.productId || index}>
                    <td>{index + 1}</td>

                    <td className="fw-semibold">{data.product.title.length > 10 ? data.product.title.slice(0, 16) + "..." : data.product.title }</td>

                    <td><span className="badge bg-success-subtle text-success">
                        {category.find((c) => c.categoryId === data.categoryId)
                          ?.name || "Unknown"}
                      </span></td>

                    <td className="text-success fw-semibold">
                      {formatDateTime(data.startTime)}
                    </td>

                    <td className='text-danger fw-semibold'>
                        {formatDateTime(data.endTime)}
                    </td>
                    <td> {formatMoney(data.startingPrice)}</td>

                    <td className="text-center">
                      <div className="py-1">

                      <Link to={`/bid-detail/${data?.product?.productId}/${data?.auctionId}`} className="go-button subHeading fs-6 "> View Auction</Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 subHeading">
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

export default ClosedAuction