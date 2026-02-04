import React from "react";
import "./About.css";
import aboutImage from "../../assets/Images/hire.png";
import whyWe from "../../assets/Images/whyWe.png";

const About = () => {
  return (
    <div className="about sectionMargin">
      <section className="section1 ">
        <div className="col-12 col-md-6">
          <h2 className="heading text-white">About Us</h2>
        </div>
      </section>

      <section className="section2 pb-0 text-white">
        <div className="image">
          <img src={aboutImage} alt="" />
        </div>

        <div className="textWrapper">
          <p className="subHeading fs-5 fw-bold">WHO WE ARE</p>
          <h2 className="heading mb-4 fs-3 text-start">
            We Build Secure & Transparent Bidding Experiences
          </h2>
          <div className="description mb-4 subHeading">
            <p>
              <i class="bi bi-caret-right-fill me-2"></i>Our platform enables
              individuals and businesses to participate in auctions through a
              secure, competitive, and fully transparent digital environment.
            </p>
            <p>
              <i class="bi bi-caret-right-fill me-2"></i>We simplify the auction
              process while ensuring data protection, fair bidding, and
              real-time tracking—so users can focus on winning, not worrying.
            </p>
            <p>
              <i class="bi bi-caret-right-fill me-2"></i>By combining modern
              security standards with intuitive design, we make online bidding
              reliable, accessible, and efficient for everyone.
            </p>
          </div>
        </div>
      </section>


      <section className="section3 pt-3 ">
        <div className=" text-center text-white d-flex flex-column justify-content-center align-items-center">
          <h1 className="heading">Why Choose Us</h1>
          <div className="div2  w-100 d-flex justify-content-center align-items-center  flex-wrap">
            <div className="imageWrapper p-0">
              <img src={whyWe} alt="" />
            </div>
            <div className="textDesc subHeading fs-5 text-start" >
            <p><i class="bi bi-caret-right-fill me-2"></i>End-to-end secure bidding with encrypted transactions</p>
            <p><i class="bi bi-caret-right-fill me-2"></i>Real-time bid updates with complete transparency</p>
            <p><i class="bi bi-caret-right-fill me-2"></i>Verified users and fraud-prevention mechanisms</p>
            <p><i class="bi bi-caret-right-fill me-2"></i>Fast, reliable, and mobile-friendly experience</p>
            <p><i class="bi bi-caret-right-fill me-2"></i>Built for trust, performance, and scalability</p>
            </div>
          </div>

        </div>


      </section>
    </div>
  );
};

export default About;
