
import loadRazorpay from "../../../Shared/Utils/loadRazorpay";
import { verifyPayment } from "./Service";

export const openRazorpayCheckout = async ({
  razorpayOrderId,
  amount,
  key,
  buyOrderId,
  navigate,
}) => {
  const loaded = await loadRazorpay();

  if (!loaded) {
    navigate("/payment-failed");
    return;
  }

  const options = {
    key, // TEST MODE KEY
    order_id: razorpayOrderId,
    amount,
    currency: "INR",
    name: "BidX (Test Mode)",
    description: "Test Payment",

    handler: async function (response) {
      try {
        await verifyPayment({
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          orderId:buyOrderId,
        });

        navigate("/payment-success");
      } catch (err) {
        navigate("/payment-failed");
        console.log(err);
        
      }
    },

    modal: {
      ondismiss: () => {
        navigate("/payment-failed");
      },
    },

    theme: {
      color: "#3399cc",
    },
  };

  const rzp = new window.Razorpay(options);

  rzp.on("payment.failed", () => {
    navigate("/payment-failed");
  });

  rzp.open();
};
