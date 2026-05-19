import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "../common/Menu";
import { AuthContext } from "../../context/AuthContext";

function AdminIcon() {
  return (
    <span className="site-nav__brand-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M12 2 4 5.8v5.9c0 5 3.4 9.6 8 10.8 4.6-1.2 8-5.8 8-10.8V5.8L12 2Zm0 3.1 5 2.4v4.2c0 3.5-2 6.7-5 7.8-3-1.1-5-4.3-5-7.8V7.5l5-2.4Zm-1 4.1v3.1l3 1.8.9-1.5-2.2-1.3V9.2H11Z" />
      </svg>
    </span>
  );
}

function PlatformIcon() {
  return (
    <span className="site-nav__brand-icon site-nav__brand-icon--platform" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M12 3 3.8 7.6v8.8L12 21l8.2-4.6V7.6L12 3Zm0 2.3 5.8 3.3L12 11.9 6.2 8.6 12 5.3Zm-6.2 5.2 5.2 3v5.1l-5.2-2.9v-5.2Zm7.2 8.1v-5.1l5.2-3v5.2L13 18.6Z" />
      </svg>
    </span>
  );
}

function ChevronDown() {
  return (
    <svg className="site-nav__chevron" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5.3 7.4a1 1 0 0 1 1.4 0L10 10.7l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
    </svg>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [checkDropdown, setCheckDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const { pathname } = useLocation();
  const { token, user, logout } = useContext(AuthContext);

  const isOwnerRoute =
    pathname.startsWith("/owner") || pathname.startsWith("/platform");
  const isPlatformRoute = pathname.startsWith("/platform");
  const isAuthRoute =
    pathname.endsWith("/login") || pathname.endsWith("/register");
  const isHomePage = pathname === "/";
  const portalBrand = isPlatformRoute || user?.role === "super_admin"
    ? "Platform Owner"
    : "Company Admin";
  const portalHome = isPlatformRoute || user?.role === "super_admin"
    ? "/platform/dashboard"
    : "/owner/dashboard";
  const PortalIcon = isPlatformRoute || user?.role === "super_admin"
    ? PlatformIcon
    : AdminIcon;

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
          <Link
            className="site-nav__brand"
            onClick={closeMenus}
            to={token ? portalHome : isPlatformRoute ? "/platform/login" : "/owner/login"}
          >
            <PortalIcon />
            <span>{portalBrand}</span>
          </Link>

          <Menu isOpen={isOpen} onToggle={() => setIsOpen((open) => !open)} />

          {isAuthRoute ? (
            <nav
              aria-label="Portal navigation"
              className={`site-nav__links${isOpen ? " site-nav__links--open" : ""}`}
              id="owner-navigation"
            >
              {isPlatformRoute ? (
                <>
                  <Link className="site-nav__link" onClick={closeMenus} to="/platform/login">
                    Super Admin
                  </Link>
                  <Link className="site-nav__link" onClick={closeMenus} to="/platform/register">
                    Platform Register
                  </Link>
                </>
              ) : (
                <>
                  <Link className="site-nav__link" onClick={closeMenus} to="/owner/login">
                    Company Login
                  </Link>
                  <Link className="site-nav__link" onClick={closeMenus} to="/owner/register">
                    Company Register
                  </Link>
                  <Link className="site-nav__link" onClick={closeMenus} to="/">
                    Client Site
                  </Link>
                </>
              )}
            </nav>
          ) : (
          <nav
            aria-label="Owner navigation"
            className={`site-nav__links${isOpen ? " site-nav__links--open" : ""}`}
            id="owner-navigation"
          >
            <Link
              className="site-nav__link"
              onClick={closeMenus}
              to={portalHome}
            >
              {user?.role === "super_admin" ? "Platform" : "Dashboard"}
            </Link>

            {user?.role !== "super_admin" ? (
              <Link
                className="site-nav__link"
                onClick={closeMenus}
                to="/owner/posters"
              >
                Posters
              </Link>
            ) : null}

            <Link
              className="site-nav__link site-nav__link--icon"
              onClick={closeMenus}
              title="Settings"
              to={user?.role === "super_admin" ? "/platform/settings" : "/owner/settings"}
            >
              <AdminIcon />
              <span>Settings</span>
            </Link>

            <div
              className="site-nav__dropdown"
              onMouseEnter={() => setProfileDropdown(true)}
              onMouseLeave={() => setProfileDropdown(false)}
            >
              <button
                className="site-nav__link site-nav__link--button"
                aria-expanded={profileDropdown}
                onClick={() => setProfileDropdown((open) => !open)}
                type="button"
              >
                <span>Profile</span>
                <ChevronDown />
              </button>

              <div
                className={`site-nav__dropdown-menu${
                  profileDropdown ? " site-nav__dropdown-menu--open" : ""
                }`}
              >
                {!token ? (
                  <Link onClick={closeMenus} to="/owner/login">
                    Login
                  </Link>
                ) : (
                  <>
                    <span className="dropdown-user">
                      {user?.name || "Admin"}
                    </span>
                    <Link
                      onClick={closeMenus}
                      to={
                        user?.role === "super_admin"
                          ? "/platform/dashboard"
                          : "/owner/dashboard"
                      }
                    >
                      {user?.role === "super_admin" ? "Platform" : "Dashboard"}
                    </Link>
                    {user?.role !== "super_admin" ? (
                      <Link onClick={closeMenus} to="/owner/posters">
                        Posters
                      </Link>
                    ) : null}
                    <Link
                      onClick={closeMenus}
                      to={
                        user?.role === "super_admin"
                          ? "/platform/settings"
                          : "/owner/settings"
                      }
                    >
                      Settings
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
            </div>
          </nav>
          )}
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

          <div
            className="site-nav__dropdown"
            onMouseEnter={() => setCheckDropdown(true)}
            onMouseLeave={() => setCheckDropdown(false)}
          >
            <button
              className="site-nav__link site-nav__link--button"
              aria-expanded={checkDropdown}
              onClick={() => setCheckDropdown((open) => !open)}
              type="button"
            >
              <span>Info</span>
              <ChevronDown />
            </button>

            <div
              className={`site-nav__dropdown-menu${
                checkDropdown ? " site-nav__dropdown-menu--open" : ""
              }`}
            >
              <Link onClick={closeMenus} to="/about">
                About
              </Link>
              <Link onClick={closeMenus} to="/contact">
                Contact
              </Link>
            </div>
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
