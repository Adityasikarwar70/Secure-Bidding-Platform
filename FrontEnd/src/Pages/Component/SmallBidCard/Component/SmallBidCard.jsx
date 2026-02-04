import React from 'react'
import "./SmallBidCard.css"
import { Link } from 'react-router-dom'
import { formatDateTime, formatMoney } from '../../../../Shared/CommonFunction/CommonFunction'
import { useAuth } from '../../../../Context/useAuth'

const SmallBidCard = ({bid}) => {
        const {userDetails} = useAuth();
    console.log(bid);
    
  return (
    <Link
    to={`/bid-detail/${bid?.productId}/${bid?.auctionId}`}
     className="bid-card-small text-decoration-none subHeading" >
      {/* LEFT */}
      <div className="bid-left">
        <p className="bid-amount">{formatMoney(bid?.bidAmount)}</p>
        <p className="bid-user">Bidder: {userDetails?.id == bid?.bidderUserId ? "You" : "An User"}</p>
      </div>

      {/* MIDDLE */}
      <div className="bid-middle">
        <p className="bid-auction">Auction #{bid?.auctionId}</p>
        <p className="bid-time">{formatDateTime(bid?.createdAt)}</p>
      </div>

      
    </Link>
  )
}

export default SmallBidCard