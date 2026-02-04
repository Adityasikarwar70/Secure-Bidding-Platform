import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Components/Home";
import MainLayout from "../Pages/Home/Components/MainLayout";
import Register from "../Pages/Security/Register/Components/Register";
import About from "../Pages/About/About";
import BidDetail from "../Pages/BidDetail/Component/BidDetail";
import ForgetPassword from "../Pages/ForgetPassword/Component/ForgetPassword";
import Profile from "../Pages/Profile/Component/Profile";
import CreateProduct from "../Pages/CreateProduct/CreateProduct";
import ActiveAuction from "../Pages/Dashboard/AllActiveAuction/Component/ActiveAuction";
import UpcomingAuction from "../Pages/Dashboard/UpcommingAuction/Component/UpcomingAuction";
import ApproveAuction from "../Pages/Dashboard/ApproveAuction/Component/ApproveAuction";
import ApproveUser from "../Pages/Dashboard/ApproveUser/Component/ApproveUser";
import AllUser from "../Pages/Dashboard/AllUser/Component/AllUser";
import LiveAuction from "../Pages/Dashboard/LiveAuction/Component/LiveAuction";
import ClosedAuction from "../Pages/Dashboard/ClosedAuction/Component/ClosedAuction";
import AllCategory from "../Pages/Dashboard/AllCategory/Component/AllCategory";
import AllAuction from "../Pages/AllAuctions/Component/AllAuction";
import RejectedProducts from "../Pages/Dashboard/RejectedProducts/Component/RejectedProducts";
import AllProductsBS from "../Pages/Dashboard/AllProductsBS/Component/AllProductsBS";
import AllAuctionsBS from "../Pages/Dashboard/AllAuctionsBS/Components/AllAuctionsBS";
import Orders from "../Pages/Dashboard/Orders/Components/Orders";
import AllBidsBS from "../Pages/Dashboard/AllBidsBS/Components/AllBidsBS";
import PaymentFailed from "../Pages/Component/PaymentStatusPages/PaymentFailed";
import PaymentSuccess from "../Pages/Component/PaymentStatusPages/PaymentSuccess";


const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "bid-detail/:id/:AuctionId?",
        element: <BidDetail />,
      },
      {
        path: "all-auction/:id?",
        element: <AllAuction />,
      },
      {
        path: "forgetPassword",
        element: <ForgetPassword />,
      },
      {
        path: "create-product",
        element: <CreateProduct />,
      },
      {
        path: "profile/:id",
        element: <Profile />,
        children: [
          {
            path: "active",
            element: <ActiveAuction />,
          },
          {
            path: "upcoming",
            element: <UpcomingAuction />,
          },
          {
            path: "approveAuction",
            element: <ApproveAuction />,
          },
          {
            path: "approveUser",
            element: <ApproveUser />,
          },
          {
            path: "all-users",
            element: <AllUser />,
          },
          {
            path: "live-auction",
            element: <LiveAuction />,
          },
          {
            path: "closed-auction",
            element: <ClosedAuction />,
          },
          {
            path: "allCategory",
            element: <AllCategory />,
          },
          {
            path: "rejectedProducts",
            element: <RejectedProducts />,
          },
          {
            path: "AllProductsB-S",
            element: <AllProductsBS />,
          },
          {
            path: "AllAuctionsB-S",
            element: <AllAuctionsBS />,
          },
          {
            path: "orders/:id/:role/:Active?",
            element: <Orders />,
          },
          {
            path: "allBids/:id",
            element: <AllBidsBS />,
          },
        ],
      },
      {
        path: "/payment-failed",
        element: <PaymentFailed />,
      },
      {
        path: "/payment-success",
        element: <PaymentSuccess />,
      },
      




    ],
  },
]);

export default routes;
