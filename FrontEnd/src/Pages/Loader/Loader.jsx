import React from 'react'
import loaderImage from "../../assets/Images/BidLogoImg.png"

const Loader = () => {
  return (
   <div id="loaderouterid">
  <div className="loading">
    <img src={loaderImage} alt="loading" />
  </div>
</div>

  )
}

export default Loader
