import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "../common/Menu";
import useSchoolLink from "../../hooks/useSchoolLink";

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
  const { withSchoolId } = useSchoolLink();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className={`site-nav-shell${pathname === "/" ? " site-nav-shell--overlay" : ""}`}>
      <header className="site-nav">
        <Link className="site-nav__brand" onClick={closeMenu} to={withSchoolId("/")}>
          <DriveEasyLogo />
          <span>DriveEasy</span>
        </Link>

        <Menu isOpen={isOpen} onToggle={() => setIsOpen((open) => !open)} />

        <nav
          aria-label="Client navigation"
          className={`site-nav__links${isOpen ? " site-nav__links--open" : ""}`}
          id="client-navigation"
        >
          <Link className="site-nav__link" onClick={closeMenu} to={withSchoolId("/")}>Home</Link>
          <Link className="site-nav__link" onClick={closeMenu} to={withSchoolId("/booking")}>Book lesson</Link>
          <Link className="site-nav__link" onClick={closeMenu} to={withSchoolId("/track-booking")}>Track booking</Link>
        </nav>
      </header>
    </div>
  );
}
