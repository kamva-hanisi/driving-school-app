import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  if (!token) {
    const isOwnerRoute =
      location.pathname.startsWith("/owner") ||
      location.pathname.startsWith("/admin");
    return <Navigate to={isOwnerRoute ? "/owner/login" : "/owner/login"} />;
  }

  return children;
}
