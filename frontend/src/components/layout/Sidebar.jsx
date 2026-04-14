import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
  const { user } = useContext(AuthContext);

  return (
    <aside className="sidebar">
      <h2>DriveAdmin</h2>
      <p className="sidebar__meta">
        {user?.name || "Owner"} • {user?.role || "owner"}
      </p>

      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/booking">Client booking form</Link>
        <Link to="/">Website home</Link>
      </nav>
    </aside>
  );
}
