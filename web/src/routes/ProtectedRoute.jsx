import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRole, allowedRoles, children }) {
  const { token, user, isAuthReady } = useContext(AuthContext);
  const location = useLocation();
  const roleList = allowedRoles || (allowedRole ? [allowedRole] : null);

  if (!isAuthReady) {
    return <p className="field__hint">Checking your session...</p>;
  }

  if (!token) {
    const isPlatformRoute = location.pathname.startsWith("/platform");
    return <Navigate to={isPlatformRoute ? "/platform/login" : "/owner/login"} />;
  }

  if (roleList && !roleList.includes(user?.role)) {
    return (
      <Navigate
        replace
        to={user?.role === "super_admin" ? "/platform/dashboard" : "/owner/dashboard"}
      />
    );
  }

  return children;
}
