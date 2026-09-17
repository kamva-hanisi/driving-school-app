import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const clientUrl = (
    import.meta.env.VITE_CLIENT_URL || "http://localhost:5173"
  ).replace(/\/+$/, "");
  const bookingPath = `${clientUrl}/booking${
    user?.school_id ? `?school_id=${user.school_id}` : ""
  }`;

  return (
    <aside className="sidebar">
      <h2>DriveEasy Admin</h2>
      <p className="sidebar__meta">{user?.name || "Admin"}</p>

      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/posters">Posters</Link>
        <Link to="/settings">Settings</Link>
        <a href={bookingPath} rel="noreferrer" target="_blank">
          Client booking page
        </a>
      </nav>
    </aside>
  );
}
