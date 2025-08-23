import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Catalog() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/catalog/packages/");
        if (!res.ok) {
          throw new Error("Failed to fetch packages");
        }
        const data = await res.json();
        setPackages(data.results || data);
      } catch (error) {
        console.error("Error fetching packages:", error);
        toast.error("Failed to load packages. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4">Travel Packages</h1>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {packages.length > 0 ? (
          packages.map((pkg) => (
            <div className="col" key={pkg.id}>
              <div className="card h-100 shadow-sm">
                {pkg.thumbnail ? (
                  <img
                    src={
                      pkg.thumbnail.startsWith("http")
                        ? pkg.thumbnail
                        : `http://127.0.0.1:8000${pkg.thumbnail}`
                    }
                    className="card-img-top"
                    alt={pkg.title}
                    style={{ height: 200, objectFit: "cover" }}
                  />
                ) : (
                  <img
                    src="https://via.placeholder.com/400x250"
                    className="card-img-top"
                    alt="placeholder"
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{pkg.title}</h5>
                  <p className="card-text">
                    {pkg.summery ? pkg.summery.slice(0, 100) : "No description"}
                    ...
                  </p>
                  <p className="fw-bold">
                    {pkg.base_price} {pkg.currency}
                  </p>
                  <Link
                    href={`/catalog/${pkg.id}`}
                    className="btn btn-outline-primary"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No packages available.</p>
        )}
      </div>
    </div>
  );
}
