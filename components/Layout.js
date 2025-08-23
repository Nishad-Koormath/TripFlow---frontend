import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

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
                <Link
                  href="/"
                  className={`nav-link ${isActive("/") ? "active" : ""}`}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/catalog"
                  className={`nav-link ${
                    router.pathname.startsWith("/catalog") ? "active" : ""
                  }`}
                >
                  Catalog
                </Link>
              </li>

              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link
                      href="/bookings"
                      className={`nav-link ${
                        isActive("/bookings") ? "active" : ""
                      }`}
                    >
                      Bookings
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={logout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link
                      href="/login"
                      className={`nav-link ${
                        isActive("/login") ? "active" : ""
                      }`}
                    >
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      href="/signup"
                      className={`nav-link ${
                        isActive("/signup") ? "active" : ""
                      }`}
                    >
                      Signup
                    </Link>
                  </li>
                </>
              )}
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
