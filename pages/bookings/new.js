import BookingForm from "@/components/BookingForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function NewBooking() {
  const router = useRouter();
  const { packageId } = router.query;

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!packageId) return;

    async function fetchPackage() {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/catalog/packages/${packageId}/`
        );
        if (!res.ok) throw new Error("Failed to fetch package");
        const data = await res.json();
        setPkg(data);
      } catch (err) {
        console.error("Error fetching package:", err);
        toast.error("Failed to load package. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchPackage();
  }, [packageId]);

  if (loading)
    return (
      <p className="text-center my-5 text-primary">
        Loading package details...
      </p>
    );

  if (!pkg)
    return <p className="text-center my-5 text-danger">Package not found.</p>;

  return (
    <div className="container my-5">
      <h2>Book Your Trip</h2>
      <div className="card shadow p-4">
        <h4>{pkg.title}</h4>
        <p className="text-muted">
          {pkg.base_price} {pkg.currency}
        </p>

        {/* Pass package info to form */}
        <BookingForm packageId={pkg.id} basePrice={pkg.base_price} />
      </div>
    </div>
  );
}
