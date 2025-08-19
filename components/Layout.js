import Link from "next/link";

export default function Layout({ children }) {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link href="/" className="navbar-brand">
            TravelApp
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link href="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/catalog" className="nav-link">
                  Catalog
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/bookings" className="nav-link">
                  Bookings
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/signup" className="nav-link">
                  Signup
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container my-4">{children}</main>

      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} TravelApp. All rights reserved.
        </p>
      </footer>
    </>
  );
}
