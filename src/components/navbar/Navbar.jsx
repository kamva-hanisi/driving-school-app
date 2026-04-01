import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "../menu/Menu";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    return () => setIsOpen(false);
  }, [pathname]);

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
    <div className="site-nav-shell">
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
          <Link className="site-nav__link" to="/">
            Home
          </Link>
          <Link className="site-nav__link" to="about">
            About
          </Link>
          <Link className="site-nav__link" to="contact">
            Contact Us
          </Link>
        </nav>
      </header>
    </div>
  );
}
