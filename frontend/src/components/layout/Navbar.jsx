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

  const isOwnerRoute = pathname.startsWith("/owner");
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

  const closeMenus = () => {
    setCheckDropdown(false);
    setProfileDropdown(false);
    setIsOpen(false);
  };

  if (isOwnerRoute) {
    return (
      <div className="site-nav-shell">
        <header className="site-nav site-nav--owner">
          <Link className="site-nav__brand" onClick={closeMenus} to="/owner/dashboard">
            DriveEasy Admin
          </Link>

          <Menu isOpen={isOpen} onToggle={() => setIsOpen((open) => !open)} />

          <nav
            aria-label="Owner navigation"
            className={`site-nav__links${isOpen ? " site-nav__links--open" : ""}`}
            id="owner-navigation"
          >
            <Link
              className="site-nav__link"
              onClick={closeMenus}
              to="/owner/dashboard"
            >
              Dashboard
            </Link>

            <Link
              className="site-nav__link"
              onClick={closeMenus}
              to="/owner/posters"
            >
              Posters
            </Link>

            <div className="site-nav__dropdown">
              <button
                className="site-nav__link site-nav__link--button"
                onClick={() => setProfileDropdown((open) => !open)}
                type="button"
              >
                Profile v
              </button>

              {profileDropdown && (
                <div className="site-nav__dropdown-menu">
                  {!token ? (
                    <Link onClick={closeMenus} to="/owner/login">
                      Login
                    </Link>
                  ) : (
                    <>
                      <span className="dropdown-user">
                        {user?.name || "Admin"}
                      </span>
                      <Link onClick={closeMenus} to="/owner/dashboard">
                        Dashboard
                      </Link>
                      <Link onClick={closeMenus} to="/owner/posters">
                        Posters
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          closeMenus();
                        }}
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>
        </header>
      </div>
    );
  }

  return (
    <div
      className={`site-nav-shell${
        isHomePage ? " site-nav-shell--overlay" : ""
      }`}
    >
      <header className="site-nav">
        <Link className="site-nav__brand" onClick={closeMenus} to="/">
          DriveEasy
        </Link>

        <Menu isOpen={isOpen} onToggle={() => setIsOpen((open) => !open)} />

        <nav
          aria-label="Primary"
          className={`site-nav__links${isOpen ? " site-nav__links--open" : ""}`}
          id="primary-navigation"
        >
          <Link className="site-nav__link" onClick={closeMenus} to="/">
            Home
          </Link>

          <div className="site-nav__dropdown">
            <button
              className="site-nav__link site-nav__link--button"
              onClick={() => setCheckDropdown((open) => !open)}
              type="button"
            >
              Info v
            </button>

            {checkDropdown && (
              <div className="site-nav__dropdown-menu">
                <Link onClick={closeMenus} to="/about">
                  About
                </Link>
                <Link onClick={closeMenus} to="/contact">
                  Contact
                </Link>
                <Link onClick={closeMenus} to="/owner/login">
                  Owner
                </Link>
              </div>
            )}
          </div>

          <Link className="site-nav__link" onClick={closeMenus} to="/booking">
            Book lesson
          </Link>

          <Link
            className="site-nav__link"
            onClick={closeMenus}
            to="/track-booking"
          >
            Track booking
          </Link>
        </nav>
      </header>
    </div>
  );
}
