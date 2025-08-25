import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";

const API_BASE = "http://127.0.0.1:8000";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_users: 0,
    total_bookings: 0,
    revenue: 0,
    pending_bookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("access");

        const [statsRes, bookingsRes, paymentsRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/stats/`, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => null),
          fetch(`${API_BASE}/api/bookings/?page_size=5&ordering=-created_at`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/payments/?page_size=5&ordering=-created_at`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (statsRes && statsRes.ok) {
          const s = await statsRes.json();
          setStats({
            total_users: s.total_users ?? 0,
            total_bookings: s.total_bookings ?? 0,
            revenue: s.revenue ?? 0,
            pending_bookings: s.pending_bookings ?? 0,
          });
        } else {
          // Fallback quick-calculation via list endpoints if stats API not ready
          // (Optional) You can remove this if you implement /api/admin/stats/
        }

        if (bookingsRes.ok) {
          const b = await bookingsRes.json();
          setRecentBookings(b.results ?? b);
        }

        if (paymentsRes.ok) {
          const p = await paymentsRes.json();
          setRecentPayments(p.results ?? p);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <AdminGuard>
        <div className="container my-5 text-center">Loading dashboard…</div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="container my-4">
        <h2 className="mb-4">Admin Dashboard</h2>

        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="text-muted">Total Users</h6>
                <h3 className="mb-0">{stats.total_users}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="text-muted">Total Bookings</h6>
                <h3 className="mb-0">{stats.total_bookings}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="text-muted">Revenue</h6>
                <h3 className="mb-0">
                  ₹{Number(stats.revenue).toLocaleString("en-IN")}
                </h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="text-muted">Pending Bookings</h6>
                <h3 className="mb-0">{stats.pending_bookings}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">
            <strong>Recent Bookings</strong>
          </div>
          <div className="table-responsive">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Package</th>
                  <th>User</th>
                  <th>People</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.package?.title ?? "-"}</td>
                    <td>{b.user ?? "-"}</td>
                    <td>{b.num_people}</td>
                    <td>₹{b.total_price}</td>
                    <td>
                      <span
                        className={`badge ${
                          (b.status || "").toLowerCase() === "confirmed"
                            ? "bg-success"
                            : (b.status || "").toLowerCase() === "pending"
                            ? "bg-warning text-dark"
                            : "bg-danger"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {new Date(b.created_at).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
                {recentBookings.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <strong>Recent Payments</strong>
          </div>
          <div className="table-responsive">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Booking</th>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.booking ?? "-"}</td>
                    <td>{p.transaction_id ?? "-"}</td>
                    <td>₹{p.amount}</td>
                    <td>
                      <span
                        className={`badge ${
                          (p.status || "").toLowerCase() === "success"
                            ? "bg-success"
                            : (p.status || "").toLowerCase() === "failed"
                            ? "bg-danger"
                            : "bg-secondary"
                        }`}
                      >
                        {p.status ?? "—"}
                      </span>
                    </td>
                    <td>
                      {p.created_at
                        ? new Date(p.created_at).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
                {recentPayments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
