import Category from "../../Component/category/Category"

import "./Home.css"
// import {bidData} from "../Services/home"
import BidCard from "../../Component/BidCard/BidCard"
import { CategoryCarousel } from "../../Component/BidCard/CategoryCarousel"
import { fetchAllCategory } from "../../Dashboard/AllCategory/Service/AllCategory"
import { useEffect, useState } from "react"
import { getAllAuctionByStatus } from "../../Dashboard/UpcommingAuction/Service/UpcommingAuction"
import { useNavigate } from "react-router-dom"

const Home = () => {
const [categories, setCategories] = useState([])
const [auction, setAuction] = useState();
  const [activeAuction, setActiveAuction] = useState();
    const [now, setNow] = useState(Date.now);
    const navigate = useNavigate();

 useEffect(() => {
     let isMounted = true;
 
     const fetchData = async () => {
       try {
         const res = await fetchAllCategory();
         const upcoming = await getAllAuctionByStatus(0);
         const active = await getAllAuctionByStatus(1);
         if (isMounted) {
           setCategories(res);
           setAuction(upcoming);
           setActiveAuction(active);
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

    //  console.log("categoryId" , categories);
     


  return (
    <div className="home sectionMargin">
      <section className="sec1" id="section1">

        <div className="col-12 col-md-6">
          <p className="subHeading subHeadingText">Welcome to <span className="back"> Our Website </span> </p>
          <div>
          <h2 className="heading headingText">
            Build, Sell & Collect
          </h2>
          <h2 className="heading headingText">
            Digital Items.
          </h2>

          <span className="description">
          <button className="explore" onClick={()=>navigate("/all-auction")}>Explore More </button>
          </span>
          
          </div>
          
        </div>

      </section>
      <section className="sec2  " id="section2">
        <div  className="  container d-flex justify-content-center align-items-center flex-wrap gap-4">
          {/* {categories.map((category) => (
            <Category key={category.id} path={category.icon} name={category.name} />
          ))} */}

          <CategoryCarousel categories={categories} />
           
        </div>
      </section>

      <section className="sec3 py-5" id="section3">
        <div className="">
          <div className="d-flex flex-column justify-content-center align-items-center text-center px-3 py-5">
            <h2 className="heading fs-2 text-center mb-4"> Live Auction </h2>
            <p className="text-center subHeading fs-5 w-50">Join live auctions in real time, place competitive bids instantly, track activity, and win exclusive items before anyone else.</p>
          </div>

          <div  className=" container d-flex justify-content-center align-items-center flex-wrap gap-4">
            {activeAuction && (
              <div className="LiveAuction p-3 fade-slide">
                <h3 className="heading">
                  {activeAuction.length == 0 && "No Active Auctions"}
                </h3>

                {activeAuction.length > 0 && (
                  <div className="py-5 d-flex justify-content-center align-items-center flex-wrap gap-3">
                    {activeAuction.slice(0, 4).map((bid) => (
                      <BidCard key={bid.auctionId} bid={bid} now={now} type={"Active"} category={categories.find((c) => c.categoryId === bid.product.categoryId)?.name || "Unknown"} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

<section className="sec4 py-5 sectionMargin mb-2" id="section4">
        <div className="">
          <div className="d-flex flex-column justify-content-center align-items-center text-center px-3 py-5">
            <h2 className="heading fs-2 text-center mb-4"> Upcoming Auction </h2>
            <p className="text-center subHeading fs-5 w-50">Discover auctions launching soon. <br />
Preview items and track when bidding begins.</p>
          </div>

          <div  className=" container d-flex justify-content-center align-items-center flex-wrap gap-4">
            {auction && (
              <div className="UpComingAuction p-3 fade-slide">
                <h3 className="heading">
                  {auction.length == 0 && "No Upcoming Auctions"}
                </h3>
                {auction.length > 0 && (
                  <div className="p-5 d-flex justify-content-center align-items-center flex-wrap gap-4">
                    {auction?.slice(0, 4).map((bid) => (
                      <BidCard key={bid.auctionId} bid={bid} now={now} type={"Upcoming"} category={categories.find((c) => c.categoryId === bid.product.categoryId)?.name || "Unknown"} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>




        </div>
      </section>



    </div>
  )
}

export default Home