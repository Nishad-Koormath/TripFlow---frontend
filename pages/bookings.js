import axios from "axios";
import { useEffect, useState } from "react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await axios.get("http://127.0.0.1:8000/api/bookings/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(res.data.results);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <p className="text-center">Loading bookings...</p>;

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

                  <p className="card-text mb-2">
                    <strong>Number of People:</strong> {booking.num_people}
                  </p>
                  <p className="card-text mb-2">
                    <strong>Total Price:</strong> ₹{booking.total_price}
                  </p>

                  {booking.package?.description && (
                    <p className="text-muted small mb-3">
                      {booking.package.description}
                    </p>
                  )}

                  <p className="text-muted small">
                    Booked on:{" "}
                    {new Date(booking.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
