import React, { useEffect, useState } from 'react'
import SmallBidCard from '../../../Component/SmallBidCard/Component/SMallBidCard'
import { getAllBids } from '../Services/AllBidsBS';
import { useAuth } from '../../../../Context/useAuth';

const AllBidsBS = () => {
    const {userDetails} = useAuth();
    const [AllBids, setAllBids] = useState()

    useEffect(() => {
        let isMounted = true;
    
        const fetchData = async () => {
          try {
            const auctionsRes = await getAllBids(userDetails?.id);
    
            if (isMounted) {
              setAllBids(auctionsRes);
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
    <div className='py-3 px-5'>
        <h3 className="heading pb-5">Your Bids History </h3>
        <div className='d-flex gap-4 flex-wrap'>

        {AllBids?.map((bid,key)=><SmallBidCard key={key} bid={bid}  />)}
        </div>
    </div>
  )
}

export default AllBidsBS