import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PackageDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchPackage() {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/catalog/packages/${id}/`
        );
        if (!res.ok) throw new Error("Failed to fetch package");
        const data = await res.json();
        setPkg(data);
      } catch (err) {
        console.error("Error fetching package:", err);
        toast.error("Failed to load package. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchPackage();
  }, [id]);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return <p className="text-center my-5 text-danger">Package not found.</p>;
  }

  return (
    <div className="container my-5">
      <Link href="/catalog" className="btn btn-outline-secondary mb-3">
        ← Back to Packages
      </Link>

      <div className="card shadow-lg">
        {pkg.thumbnail && (
          <img
            src={
              pkg.thumbnail.startsWith("http")
                ? pkg.thumbnail
                : `http://127.0.0.1:8000${pkg.thumbnail}`
            }
            className="card-img-top"
            alt={pkg.title}
            style={{ height: 400, objectFit: "contain" }}
          />
        )}
        <div className="card-body">
          <h2 className="card-title">{pkg.title}</h2>
          <p className="text-muted">
            {pkg.base_price} {pkg.currency}
          </p>
          <p className="card-text">{pkg.summery}</p>

          {pkg.description && (
            <div className="mt-3">
              <h5>About this trip</h5>
              <p>{pkg.description}</p>
            </div>
          )}

          <Link
            href={`/bookings/new?packageId=${pkg.id}`}
            className="btn btn-primary mt-3"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
