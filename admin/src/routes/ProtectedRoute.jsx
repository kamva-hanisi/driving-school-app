import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, user, isAuthReady } = useContext(AuthContext);

  if (!isAuthReady) {
    return <p className="field__hint">Checking your session...</p>;
  }

  if (!token) {
    return <Navigate replace to="/login" />;
  }

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  return children;
}
