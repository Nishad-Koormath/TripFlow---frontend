import Link from "next/link";

export default function Home() {
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
        <div className="row row-cols-1 row-cols-md-3 g-4">
          <div className="col">
            <div className="card h-100 shadow-sm">
              <img
                src="https://via.placeholder.com/400x250"
                className="card-img-top"
                alt="Beach Paradise"
              />
              <div className="card-body">
                <h5 className="card-title">Beach Paradise</h5>
                <p className="card-text">
                  Relax on the golden sands and enjoy crystal-clear waters.
                </p>
                <Link href="/catalog" className="btn btn-outline-primary">
                  View Package
                </Link>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card h-100 shadow-sm">
              <img
                src="https://via.placeholder.com/400x250"
                className="card-img-top"
                alt="Mountain Adventure"
              />
              <div className="card-body">
                <h5 className="card-title">Mountain Adventure</h5>
                <p className="card-text">
                  Hike, climb, and explore breathtaking landscapes.
                </p>
                <Link href="/catalog" className="btn btn-outline-primary">
                  View Package
                </Link>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card h-100 shadow-sm">
              <img
                src="https://via.placeholder.com/400x250"
                className="card-img-top"
                alt="City Explorer"
              />
              <div className="card-body">
                <h5 className="card-title">City Explorer</h5>
                <p className="card-text">
                  Discover culture, cuisine, and nightlife in vibrant cities.
                </p>
                <Link href="/catalog" className="btn btn-outline-primary">
                  View Package
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
