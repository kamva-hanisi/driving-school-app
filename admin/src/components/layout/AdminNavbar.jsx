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

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { token, user, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMenu = () => setIsOpen(false);
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  return (
    <div className="site-nav-shell">
      <header className="site-nav site-nav--owner">
        <Link className="site-nav__brand" onClick={closeMenu} to={token ? "/dashboard" : "/login"}>
          <AdminIcon />
          <span>DriveEasy Admin</span>
        </Link>

        <Menu isOpen={isOpen} onToggle={() => setIsOpen((open) => !open)} />

        <nav
          aria-label="Admin navigation"
          className={`site-nav__links${isOpen ? " site-nav__links--open" : ""}`}
          id="admin-navigation"
        >
          {isAuthRoute || !token ? (
            <>
              <Link className="site-nav__link" onClick={closeMenu} to="/login">Sign in</Link>
              <Link className="site-nav__link" onClick={closeMenu} to="/register">Register</Link>
            </>
          ) : (
            <>
              <Link className="site-nav__link" onClick={closeMenu} to="/dashboard">Dashboard</Link>
              <Link className="site-nav__link" onClick={closeMenu} to="/posters">Posters</Link>
              <Link className="site-nav__link" onClick={closeMenu} to="/settings">Settings</Link>
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
