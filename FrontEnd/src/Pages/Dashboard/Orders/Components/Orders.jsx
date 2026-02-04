import React, { useEffect, useState } from "react";
import "./Orders.css";
import OrderCard from "../../../Component/OrderCard/OrderCard";
import { useParams } from "react-router-dom";
import { getAllCategories } from "../../../CreateProduct/Service/CreateProduct";
import { getOrder } from "../Services/Orders";
import { useLoader } from "../../../../Context/useLoader";

const Orders = () => {
  const { id, role, Active } = useParams();
  const { showLoader, hideLoader } = useLoader();
  const [orderRes, setOrderRes] = useState([]);
  const [category, setCategory] = useState([]);
  const [Type, setType] = useState(role);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const cate = await getAllCategories();
        const res = await getOrder(id, role);
        if (isMounted) {
          setCategory(cate);
          setOrderRes(res);
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

  const handleOrder = async (type) => {
    try {
      showLoader();
      setType(type);
      setOrderRes(null);
      const res = await getOrder(id, type);
      setOrderRes(res);
    } catch (error) {
      console.log(error);
    } finally {
      hideLoader();
    }
  };

  return (
    <div>
      <div className="p-4 overflow-visible">
        {/* <h2 className="heading mb-5 fs-1">Orders History</h2> */}
        <div className="d-flex justify-content-end">
          <button
            className="upcoming mt-4  me-4 subHeading fs-6"
            onClick={() => handleOrder("seller")}
          >
            Sell-Orders <i class="bi bi-bookmark-x-fill"></i>
          </button>
          <button
            className="AllAuction mt-4  me-4 subHeading fs-6"
            onClick={() => handleOrder("buyer")}
          >
            Buy-Orders <i class="bi bi-bookmark-x "></i>
          </button>
        </div>

        <div>
          {orderRes?.length > 0 ? (
            <p className="heading fs-3 w-100">
              {Type === "seller" ? "Sell Orders History" : "Buy Orders History"}
            </p>
          ) : Type === "seller" ? (
            <p className="heading fs-5 w-100 text-muted">
              No Sell Orders Found
            </p>
          ) : (
            <p className="heading fs-5 w-100 text-muted">Get Orders </p>
          )}

          <div className="order-grid">
            {orderRes?.map((order, key) => (
              <div className="OrderWrapper" key={order.orderId || key}>
                <OrderCard
                  order={order}
                  category={category}
                  role={Type}
                  Active={Active}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
