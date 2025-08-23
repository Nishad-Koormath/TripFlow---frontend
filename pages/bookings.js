import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_BASE = "http://127.0.0.1:8000";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pagination, setPagination] = useState({
    next: null,
    previous: null,
    count: 0,
  });

  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.push("/login");
      } else {
        fetchBookings();
      }
    }
  }, [isLoggedIn, loading]);

  const fetchBookings = async (url = `${API_BASE}/api/bookings/`) => {
    setPageLoading(true);
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(res.data.results || res.data);
      setPagination({
        next: res.data.next,
        previous: res.data.previous,
        count: res.data.count,
      });
    } catch (err) {
      console.error("Error fetching bookings:", err);
      if (err.response?.status === 401) {
        router.push("/login");
      } else {
        toast.error("Failed to load bookings.");
      }
    } finally {
      setPageLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      setActionLoading(bookingId);
      const token = localStorage.getItem("access");

      await axios.patch(
        `${API_BASE}/api/bookings/${bookingId}/`,
        { status: "cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Booking cancelled!");
      fetchBookings();
    } catch (err) {
      console.error("Cancel failed:", err);
      toast.error("Failed to cancel booking");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePayment = async (bookingId) => {
    setActionLoading(bookingId);
    try {
      const token = localStorage.getItem("access");
      const res = await axios.post(
        `${API_BASE}/api/bookings/${bookingId}/pay/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Payment successful!");
      router.push(`/thank-you?transaction=${res.data.transaction_id}`);
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed. Try again.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading || pageLoading) {
    return <p className="text-center">Loading bookings...</p>;
  }

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "badge bg-warning text-dark";
      case "confirmed":
        return "badge bg-success";
      case "cancelled":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-center text-muted">No bookings yet.</p>
      ) : (
        <>
          <div className="row">
            {bookings.map((booking) => (
              <div className="col-md-6 mb-4" key={booking.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title text-primary">
                        {booking.package?.title || "Unknown Package"}
                      </h5>
                      <span className={getStatusBadge(booking.status)}>
                        {booking.status}
                      </span>
                    </div>

                    <p>
                      <strong>Number of People:</strong> {booking.num_people}
                    </p>
                    <p>
                      <strong>Total Price:</strong> ₹{booking.total_price}
                    </p>

                    {booking.package?.description && (
                      <p className="text-muted small mb-3">
                        {booking.package.description}
                      </p>
                    )}

                    <p className="text-muted small">
                      Booked on:{" "}
                      {new Date(booking.created_at).toLocaleDateString("en-IN")}
                    </p>
                    <p>
                      <strong>Travel Date:</strong>{" "}
                      {new Date(booking.travel_date).toLocaleDateString(
                        "en-IN"
                      )}
                    </p>

                    {booking.status.toLowerCase() === "pending" && (
                      <div className="d-flex gap-2 mt-2">
                        <button
                          className="btn btn-sm btn-primary"
                          disabled={actionLoading === booking.id}
                          onClick={() => handlePayment(booking.id)}
                        >
                          {actionLoading === booking.id
                            ? "Processing..."
                            : "Pay Now"}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={actionLoading === booking.id}
                          onClick={() => handleCancel(booking.id)}
                        >
                          {actionLoading === booking.id
                            ? "Processing..."
                            : "Cancel Booking"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-outline-secondary mx-2"
              disabled={!pagination.previous}
              onClick={() => fetchBookings(pagination.previous)}
            >
              Previous
            </button>
            <button
              className="btn btn-outline-secondary mx-2"
              disabled={!pagination.next}
              onClick={() => fetchBookings(pagination.next)}
            >
              Next
            </button>
          </div>
          <p className="text-center text-muted mt-2">
            Showing {bookings.length} of {pagination.count} bookings
          </p>
        </>
      )}
    </div>
  );
}
