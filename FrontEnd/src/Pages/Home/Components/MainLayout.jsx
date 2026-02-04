import React, { useEffect, useRef } from 'react'
import { gsap } from "gsap";
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../../HeaderFooter/Components/Header'
import Footer from '../../HeaderFooter/Components/Footer'
import Login from '../../Security/Login/Components/Login'
import ScrollToTop from '../../Component/ScrollToTop/ScrollToTop';

const MainLayout = () => {

const pageRef = useRef(null);
const location = useLocation();

useEffect(() => {
  gsap.fromTo(
    pageRef.current,
    {
      opacity: 0,
      filter: "blur(8px)",
    },
    {
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.6,
      ease: "power3.out",
    }
  );
}, [location.pathname]);
  return (
   <>
   <ScrollToTop/>
      <Header />
      <Login/>
      <main ref={pageRef} className="page-wrapper">
      <Outlet />   
      </main>
      <Footer />
    </>
  )
}

export default MainLayout