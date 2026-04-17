import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "../common/Menu";
import { AuthContext } from "../../context/AuthContext";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [checkDropdown, setCheckDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const { pathname } = useLocation();
  const { token, user, logout } = useContext(AuthContext);

  const isOwnerRoute =
    pathname.startsWith("/login") || pathname.startsWith("/dashboard");

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
    <div
      className={`site-nav-shell${
        isHomePage ? " site-nav-shell--overlay" : ""
      }`}
    >
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
          <Link
            className="site-nav__link"
            onClick={() => setIsOpen(false)}
            to="/"
          >
            Home
          </Link>

          {/* CHECK DROPDOWN */}
          <div className="site-nav__dropdown">
            <button
              className="site-nav__link site-nav__link--button"
              onClick={() => setCheckDropdown(!checkDropdown)}
              type="button"
            >
              CHECK ▾
            </button>

            {checkDropdown && (
              <div className="site-nav__dropdown-menu">
                <Link to="/#about" onClick={() => setCheckDropdown(false)}>
                  About
                </Link>
                <Link to="/contact" onClick={() => setCheckDropdown(false)}>
                  Contact
                </Link>
                <Link to="/owner" onClick={() => setCheckDropdown(false)}>
                  Owner
                </Link>
              </div>
            )}
          </div>

          <Link
            className="site-nav__link"
            onClick={() => setIsOpen(false)}
            to="/booking"
          >
            Book lesson
          </Link>

          <Link
            className="site-nav__link"
            onClick={() => setIsOpen(false)}
            to="/track-booking"
          >
            Track booking
          </Link>

          {/* PROFILE DROPDOWN */}
          {isOwnerRoute && (
            <div className="site-nav__dropdown">
              <button
                className="site-nav__link site-nav__link--button"
                onClick={() => setProfileDropdown(!profileDropdown)}
                type="button"
              >
                Profile ▾
              </button>

              {profileDropdown && (
                <div className="site-nav__dropdown-menu">
                  {!token ? (
                    <Link to="/login">Login</Link>
                  ) : (
                    <>
                      <span className="dropdown-user">
                        {user?.name || "Admin"}
                      </span>
                      <Link to="/dashboard">Dashboard</Link>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setProfileDropdown(false);
                        }}
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </nav>
      </header>
    </div>
  );
}
