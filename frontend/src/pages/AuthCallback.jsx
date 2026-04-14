import { useContext, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const authError = searchParams.get("error");
  const token = searchParams.get("token");
  const userParam = searchParams.get("user");
  const message = useMemo(() => {
    if (authError) {
      return authError;
    }

    if (!token || !userParam) {
      return "Authentication response was incomplete.";
    }

    return "Please wait while we finish your social login.";
  }, [authError, token, userParam]);

  useEffect(() => {
    if (authError) {
      return;
    }

    if (!token || !userParam) {
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userParam));
      login(token, user);
      navigate("/dashboard", { replace: true });
    } catch {
      // The message above already handles malformed callback payloads.
    }
  }, [authError, login, navigate, token, userParam]);

  return (
    <main className="auth-callback">
      <section className="booking-card">
        <h1 className="booking-card__title">Signing you in</h1>
        <p className="booking-card__text">{message}</p>
      </section>
    </main>
  );
}
