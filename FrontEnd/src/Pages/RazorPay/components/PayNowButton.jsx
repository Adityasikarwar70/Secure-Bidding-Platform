import "./PayNowButton.css"
import { useNavigate } from "react-router-dom";
import { openRazorpayCheckout } from "../services/razorpay.service";
import { createPaymentOrder } from "../services/Service";


const PayNowButton = ({ buyOrderId , text}) => {
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      const  data  = await createPaymentOrder(buyOrderId);
      console.log(data);
      

       openRazorpayCheckout({
        razorpayOrderId: data.razorpayOrderId,
        amount: data.amount,
        key: data.razorpayKey, // rzp_test_XXXX
        buyOrderId,
        navigate,
      });
    } catch (err) {
      navigate("/payment-failed");
    }
  };

  return <button className="PayNow" onClick={handlePayment}>{text} <i className="bi bi-credit-card ms-2"></i></button>;
};

export default PayNowButton;
