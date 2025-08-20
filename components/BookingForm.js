import { useState } from "react";

export default function BookingForm({ packageId, basePrice }) {
  const [travelDate, setTravelDate] = useState("");
  const [numPeople, setNumPeople] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const token = localStorage.getItem("access");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/bookings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          package: packageId,
          travel_date: travelDate,
          num_people: numPeople,
        }),
      });
      if (!res.ok) throw new Error("Booking failed");
      setSuccess("Booking successful!");
      setTravelDate("");
      setNumPeople(1);
    } catch (err) {
      console.error(err);
      setSuccess("Booking failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Travel Date</label>
        <input
          type="date"
          className="form-control"
          value={travelDate}
          onChange={(e) => setTravelDate(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Number of People</label>
        <input
          type="number"
          className="form-control"
          value={numPeople}
          min="1"
          onChange={(e) => setNumPeople(e.target.value)}
          required
        />
      </div>

      <p>
        <strong>Total Price: </strong>
        {numPeople * basePrice}
      </p>

      <button type="submit" className="btn btn-success" disabled={loading}>
        {loading ? "Booking..." : "Confirm Booking"}
      </button>

      {success && <p className="mt-3">{success}</p>}
    </form>
  );
}
