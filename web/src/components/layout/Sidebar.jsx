import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const bookingPath = user?.school_id
    ? `/booking?school_id=${user.school_id}`
    : "/booking";

  return (
    <aside className="sidebar">
      <h2>DriveEasy Admin</h2>
      <p className="sidebar__meta">{user?.name || "Admin"}</p>

      <nav>
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/posters">Posters</Link>
        <Link to="/admin/settings">Settings</Link>
        <Link to={bookingPath}>Client booking page</Link>
        <Link to="/">Client site</Link>
      </nav>
    </aside>
  );
}
