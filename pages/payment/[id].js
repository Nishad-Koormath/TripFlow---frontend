import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PaymentPage() {
  const router = useRouter();
  const { id } = router.query;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchBooking() {
      try {
        const token = localStorage.getItem("access");
        const res = await fetch(`http://127.0.0.1:8000/api/bookings/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch booking");
        const data = await res.json();
        setBooking(data);
      } catch (error) {
        console.error("Error fetching booking:", error);
        toast.error("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [id]);

  async function handlePayNow() {
    if (!id) return;
    setProcessing(true);
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`http://127.0.0.1:8000/api/payments/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ booking: id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Payment failed");
      }

      const data = await res.json(); // ✅ contains transaction_id + amount
      toast.success("Payment successful!");

      router.push(
        `/payment-success?transaction_id=${data.transaction_id}&amount=${data.amount}`
      );
    } catch (err) {
      console.error(err);
      toast.error("Payment failed: " + err.message);
    } finally {
      setProcessing(false);
    }
  }

  function handlePayLater() {
    toast("You can pay later from My Bookings.");
    router.push("/bookings");
  }

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!booking) return <p className="text-center mt-5">Booking not found.</p>;

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-center">Complete Your Payment</h1>
      <div className="card p-4 shadow-sm">
        <h4 className="text-primary">{booking.package?.title}</h4>
        <p>
          <strong>Travel Date:</strong>{" "}
          {new Date(booking.travel_date).toLocaleDateString("en-IN")}
        </p>
        <p>
          <strong>Travelers:</strong> {booking.num_people}
        </p>
        <p>
          <strong>Total:</strong> ₹{booking.total_price}
        </p>
        <div className="d-flex gap-3 mt-3">
          <button
            onClick={handlePayNow}
            className="btn btn-success"
            disabled={processing}
          >
            {processing ? "Processing..." : "Pay Now"}
          </button>
          <button
            onClick={handlePayLater}
            className="btn btn-outline-secondary"
            disabled={processing}
          >
            Pay Later
          </button>
        </div>
      </div>
    </div>
  );
}
