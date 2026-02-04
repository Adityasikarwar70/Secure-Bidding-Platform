import { useNavigate } from "react-router-dom";
import "./PaymentStatus.css";

const PaymentFailed = () => {
  const navigate = useNavigate();


  return (
    <div className="payment-container failed">
      <div className="card">
        <div className="icon failed-icon">✕</div>

        <h1>Payment Failed</h1>
        <p>
          Your payment could not be completed.  
          Please try again or use a different payment method.
        </p>

        <div className="actions">
          <button onClick={() => navigate(-1)}>
            Retry Payment
          </button>

          <button className="secondary" onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
