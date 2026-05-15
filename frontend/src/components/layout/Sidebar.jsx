import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const bookingPath = user?.school_id
    ? `/booking?school_id=${user.school_id}`
    : "/booking";
  const isPlatformAdmin = user?.role === "super_admin";

  return (
    <aside className="sidebar">
      <h2>{isPlatformAdmin ? "DrivePlatform" : "DriveAdmin"}</h2>
      <p className="sidebar__meta">{`${user?.name || "Admin"} | ${user?.role || "admin"}`}</p>

      <nav>
        <Link to={isPlatformAdmin ? "/platform/dashboard" : "/owner/dashboard"}>
          {isPlatformAdmin ? "Platform overview" : "Dashboard overview"}
        </Link>
        <Link to="/owner/settings">Admin settings</Link>
        {!isPlatformAdmin ? (
          <Link to={bookingPath}>Public booking page</Link>
        ) : null}
        <Link to="/">Website home</Link>
      </nav>
    </aside>
  );
}
