import React, { useEffect, useState } from 'react'
import "./AllProductsBS.css"
import { getAllCategories } from '../../../CreateProduct/Service/CreateProduct';
import { getAllProductsOfSeller } from '../Service/AllProductsBS';
import { useAuth } from '../../../../Context/useAuth';
import { Link } from 'react-router-dom';
import { formatMoney } from '../../../../Shared/CommonFunction/CommonFunction';

const AllProductsBS = () => {
      const { userDetails } = useAuth();
    const [Products, setProducts] = useState([]);
      const [category, setCategory] = useState([]);
     const STATUS = ["Pending", "Approved", "Rejected"];
    
      useEffect(() => {
        let isMounted = true;
    
        const fetchUser = async () => {
          try {
            const cate = await getAllCategories();
            const res = await getAllProductsOfSeller(userDetails.id);
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
    
  return (
  <div>
      <div className="p-4 overflow-visible">
        <h2 className="heading mb-5 fs-1">All Products</h2>
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover table-dark align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Status</th>
                <th>Expected Price</th>
                <th>Category</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {Products.data?.length > 0 ? (
                Products?.data?.map((data, index) => (
                  <tr  key={data.productId || index}>
                    <td>{index + 1}</td>

                    <td className="fw-semibold">{data.title}</td>

                    <td>{STATUS[data?.approvalStatus]}</td>

                    <td className="text-success fw-semibold">
                      ₹{formatMoney(data.expectedPrice)}
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
  )
}

export default AllProductsBS