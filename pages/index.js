import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/catalog/packages/");
        if (!res.ok) throw new Error("Failed to fetch packages");
        const data = await res.json();

        // handle pagination or array
        const items = Array.isArray(data) ? data : data.results || [];

        // take last 3 items
        setPackages(items.slice(-3));
      } catch (err) {
        console.error("Error fetching packages:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  return (
    <>
      <div className="p-5 mb-4 bg-light rounded-3">
        <div className="container py-5">
          <h1 className="display-4 fw-bold">Discover Your Next Adventure</h1>
          <p className="col-md-8 fs-5">
            Explore amazing destinations and travel packages tailored just for
            you.
          </p>
          <Link href="/catalog" className="btn btn-primary btn-lg">
            Browse Packages
          </Link>
        </div>
      </div>

      <div className="container my-5">
        <h2 className="mb-4">Featured Packages</h2>

        {loading ? (
          <p>Loading featured packages...</p>
        ) : packages.length === 0 ? (
          <p>No packages available.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {packages.map((pkg) => (
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
                      {pkg.summery
                        ? pkg.summery.slice(0, 100)
                        : "No description"}
                      ...
                    </p>
                    <Link
                      href={`/catalog/${pkg.id}`}
                      className="btn btn-outline-primary"
                    >
                      View Package
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
