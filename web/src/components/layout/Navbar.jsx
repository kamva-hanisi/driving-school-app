import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Menu } from "../common/Menu";

function AdminIcon() {
  return (
    <span className="site-nav__brand-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M12 2 4 5.8v5.9c0 5 3.4 9.6 8 10.8 4.6-1.2 8-5.8 8-10.8V5.8L12 2Zm0 3.1 5 2.4v4.2c0 3.5-2 6.7-5 7.8-3-1.1-5-4.3-5-7.8V7.5l5-2.4Zm-1 4.1v3.1l3 1.8.9-1.5-2.2-1.3V9.2H11Z" />
      </svg>
    </span>
  );
}

function DriveEasyLogo() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32">
        <path d="M5 18.5 9.1 10c.5-1 1.5-1.6 2.6-1.6h8.6c1.1 0 2.1.6 2.6 1.6l4.1 8.5v5.3c0 .8-.6 1.4-1.4 1.4h-1.8c-.8 0-1.4-.6-1.4-1.4v-1H9v1c0 .8-.6 1.4-1.4 1.4H5.8c-.8 0-1.4-.6-1.4-1.4v-5.3H5Zm5.1-1.4h11.8l-2.2-4.6h-7.4l-2.2 4.6Zm-.2 4.1a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8Zm12.2 0a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8Z" />
      </svg>
    </span>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { token, user, logout } = useContext(AuthContext);
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminAuthRoute = pathname === "/admin/login" || pathname === "/admin/register";
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMenu = () => setIsOpen(false);

  if (isAdminRoute) {
    return (
      <div className="site-nav-shell">
        <header className="site-nav site-nav--owner">
          <Link
            className="site-nav__brand"
            onClick={closeMenu}
            to={token ? "/admin/dashboard" : "/admin/login"}
          >
            <AdminIcon />
            <span>DriveEasy Admin</span>
          </Link>

          <Menu isOpen={isOpen} onToggle={() => setIsOpen((open) => !open)} />

          <nav
            aria-label="Admin navigation"
            className={`site-nav__links${isOpen ? " site-nav__links--open" : ""}`}
            id="admin-navigation"
          >
            {isAdminAuthRoute || !token ? (
              <>
                <Link className="site-nav__link" onClick={closeMenu} to="/admin/login">
                  Sign in
                </Link>
                <Link className="site-nav__link" onClick={closeMenu} to="/admin/register">
                  Register
                </Link>
                <Link className="site-nav__link" onClick={closeMenu} to="/">
                  Client site
                </Link>
              </>
            ) : (
              <>
                <Link className="site-nav__link" onClick={closeMenu} to="/admin/dashboard">
                  Dashboard
                </Link>
                <Link className="site-nav__link" onClick={closeMenu} to="/admin/posters">
                  Posters
                </Link>
                <Link className="site-nav__link" onClick={closeMenu} to="/admin/settings">
                  Settings
                </Link>
                <span className="dropdown-user">{user?.name || "Admin"}</span>
                <button
                  className="site-nav__link site-nav__link--button"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  type="button"
                >
                  Sign out
                </button>
              </>
            )}
          </nav>
        </header>
      </div>
    );
  }

  return (
    <div className={`site-nav-shell${isHomePage ? " site-nav-shell--overlay" : ""}`}>
      <header className="site-nav">
        <Link className="site-nav__brand" onClick={closeMenu} to="/">
          <DriveEasyLogo />
          <span>DriveEasy</span>
        </Link>

        <Menu isOpen={isOpen} onToggle={() => setIsOpen((open) => !open)} />

        <nav
          aria-label="Client navigation"
          className={`site-nav__links${isOpen ? " site-nav__links--open" : ""}`}
          id="client-navigation"
        >
          <Link className="site-nav__link" onClick={closeMenu} to="/">Home</Link>
          <Link className="site-nav__link" onClick={closeMenu} to="/about">About</Link>
          <Link className="site-nav__link" onClick={closeMenu} to="/contact">Contact</Link>
          <Link className="site-nav__link" onClick={closeMenu} to="/booking">Book lesson</Link>
          <Link className="site-nav__link" onClick={closeMenu} to="/track-booking">Track booking</Link>
          <Link className="site-nav__link" onClick={closeMenu} to="/admin/login">Admin</Link>
        </nav>
      </header>
    </div>
  );
}
