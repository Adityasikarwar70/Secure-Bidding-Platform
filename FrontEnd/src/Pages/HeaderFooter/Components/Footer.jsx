import "./Footer.css"
import logo from "../../../assets/Images/bidX.svg"
import { Link, useNavigate } from "react-router-dom"

const Footer = () => {
  const navigate = useNavigate();
  return ( 
  <footer className="footer-main position-relative overflow-hidden">
  <div className="container py-5">
    <div className="row gy-4">

 
      <div className="col-12 col-md-4">
        <Link to={"/"} className="footer-logo mb-3"><img height={"50px"} src={logo} alt="" /></Link>
        <p className="footer-text mt-3 subHeading">
          A secure live bidding platform to buy, sell and collect premium items
          in real-time auctions.
        </p>
      </div>

  
      <div className="col-6 col-md-2">
        <h6 className="footer-title heading">Quick Links</h6>
        <ul className="footer-links subHeading">
          <li><a href="#section2" className="text-decoration-none ">Categories</a></li>
          <li><a href="#section3" className="text-decoration-none ">Live Auctions</a></li>
          <li><a href="#section4" className="text-decoration-none ">Upcoming Auctions</a></li>
          <li><p className="text-decoration-none text-white" onClick={()=>navigate("/all-auction")}>All Auctions</p></li>
        </ul>
      </div>


      <div className="col-6 col-md-3">
        <h6 className="footer-title heading ">Legal</h6>
        <ul className="footer-links subHeading">
          <li>About</li>
          <li>Terms & Conditions</li>
          <li>Cookies</li>
        </ul>
      </div>


      <div className="col-12 col-md-3">
        <h6 className="footer-title heading subHeading">Social</h6>
        <div className="footer-social">
          <i className="bi bi-linkedin"></i>
          <i className="bi bi-github"></i>
          <i className="bi bi-instagram"></i>
        </div>
      </div>



    </div>


      <a href="#scrollToTop" className="scroll-top-btn">
  <i className="bi bi-arrow-up-short"></i>
</a>

  </div>

  <div className="footer-bottom text-center py-3">
    © {new Date().getFullYear()} BidX. All rights reserved.
  </div>
</footer>

  )
}

export default Footer