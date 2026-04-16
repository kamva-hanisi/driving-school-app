import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
  const { user } = useContext(AuthContext);

  return (
    <aside className="sidebar">
      <h2>DriveAdmin</h2>
      <p className="sidebar__meta">{`${user?.name || "Owner"} | ${user?.role || "owner"}`}</p>

      <nav>
        <Link to="/dashboard">Dashboard overview</Link>
        <Link to="/booking">Public booking page</Link>
        <Link to="/">Website home</Link>
      </nav>
    </aside>
  );
}
