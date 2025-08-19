import Link from "next/link";
import { useEffect, useState } from "react";

export default function Catalog() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/catalog/packages/");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        console.log("data:", data);
        setPackages(data.results);
      } catch (error) {
        console.error("Error fetching packages:", error);
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
        {console.log("packages:", packages)}
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
                    style={{height:200}}
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
                  <p className="card-text">{pkg.summery?.slice(0, 100)}...</p>
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
