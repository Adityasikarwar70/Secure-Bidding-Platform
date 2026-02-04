import { useNavigate, useParams } from "react-router-dom";
import "./PaymentStatus.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
    const {path} = useParams();

  return (
    <div className="payment-container success">
      <div className="card">
        <div className="icon success-icon">✓</div>

        <h1>Payment Successful</h1>
        <p>Your payment has been completed successfully.</p>

        <div className="actions">
          <button onClick={() => navigate(-1)}>
            View Order
          </button>

          <button className="secondary" onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
