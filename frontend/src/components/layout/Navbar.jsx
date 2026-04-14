import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "../common/Menu";
import { AuthContext } from "../../context/AuthContext";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { token, user, logout } = useContext(AuthContext);

  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`site-nav-shell${isHomePage ? " site-nav-shell--overlay" : ""}`}>
      <header className="site-nav">
        <Link className="site-nav__brand" to="/">
          DriveEasy
        </Link>
        <Menu isOpen={isOpen} onToggle={() => setIsOpen((open) => !open)} />
        <nav
          aria-label="Primary"
          className={`site-nav__links${isOpen ? " site-nav__links--open" : ""}`}
          id="primary-navigation"
        >
          <Link className="site-nav__link" onClick={() => setIsOpen(false)} to="/">
            Home
          </Link>
          <Link
            className="site-nav__link"
            onClick={() => setIsOpen(false)}
            to="/booking"
          >
            Booking
          </Link>
          <Link
            className="site-nav__link"
            onClick={() => setIsOpen(false)}
            to="/dashboard"
          >
            Dashboard
          </Link>
          {token ? (
            <>
              <span className="site-nav__link site-nav__link--label">
                {user?.name || "Admin"}
              </span>
              <button
                className="site-nav__link site-nav__link--button"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              className="site-nav__link"
              onClick={() => setIsOpen(false)}
              to="/login"
            >
              Login
            </Link>
          )}
        </nav>
      </header>
    </div>
  );
}
