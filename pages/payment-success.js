import { useRouter } from "next/router";

export default function PaymentSuccess() {
  const router = useRouter();
  const { transaction_id, amount } = router.query;

  return (
    <div className="container text-center mt-5">
      <h2 className="text-success">✅ Payment Successful!</h2>
      <p className="mt-3">
        Thank you for your payment. Your booking has been confirmed.
      </p>

      <div className="card shadow p-3 mt-4">
        <h5>Payment Details</h5>
        <p>
          <strong>Transaction ID:</strong> {transaction_id}
        </p>
        <p>
          <strong>Amount Paid:</strong> ₹{amount}
        </p>
      </div>

      <button
        className="btn btn-primary mt-4"
        onClick={() => router.push("/bookings")}
      >
        Go to My Bookings
      </button>
    </div>
  );
}
