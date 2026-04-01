import { Link } from "react-router-dom";
import { Menu } from "../menu/Menu";

export function Navbar() {
  return (
    <header className="site-nav">
      <Link className="site-nav__brand" to="/">
        DriveEasy
      </Link>
      <Menu />
      <nav className="site-nav__links" aria-label="Primary">
        <Link className="site-nav__link" to="/">
          Home
        </Link>
        <Link className="site-nav__link" to="/booking">
          Booking
        </Link>
      </nav>
    </header>
  );
}
