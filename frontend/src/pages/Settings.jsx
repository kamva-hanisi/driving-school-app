import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../components/layout/Sidebar";
import { AuthContext } from "../context/AuthContext";

export default function Settings() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const accountSummary = useMemo(
    () => ({
      name: user?.name || "Admin",
      email: user?.email || "No email saved",
      role: user?.role || "admin",
    }),
    [user],
  );

  const handleAccountAction = async (mode) => {
    const message =
      mode === "permanent"
        ? "Permanently delete your admin account? This cannot be undone."
        : "Temporarily deactivate your admin account for 30 days?";

    if (!window.confirm(message)) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setStatus("");
      await API.delete("/auth/me", { data: { mode } });
      logout();
      navigate("/owner/login", { replace: true });
    } catch (requestError) {
      console.error("Failed to update account:", requestError);
      setError(
        requestError.response?.data?.message ||
          "We could not update your account right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyAccountSummary = async () => {
    const text = `DriveEasy Admin\nName: ${accountSummary.name}\nEmail: ${accountSummary.email}\nRole: ${accountSummary.role}`;

    try {
      await navigator.clipboard.writeText(text);
      setStatus("Account summary copied.");
      setError("");
    } catch {
      setError("Could not copy account summary.");
      setStatus("");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main settings-page">
        <section className="dashboard-hero">
          <div>
            <p className="dashboard-eyebrow">Admin settings</p>
            <h1>Manage your admin account</h1>
            <p className="dashboard-intro">
              Review your profile, keep a quick account summary, and choose how
              your account should be handled if you step away.
            </p>
          </div>
        </section>

        {error ? <p className="form-status form-status--error">{error}</p> : null}
        {status ? <p className="form-status form-status--success">{status}</p> : null}

        <section className="settings-grid">
          <article className="dashboard-panel settings-card">
            <div className="dashboard-panel__header">
              <div>
                <h2>Profile</h2>
                <p>Your current signed-in admin details.</p>
              </div>
            </div>

            <dl className="settings-list">
              <div>
                <dt>Name</dt>
                <dd>{accountSummary.name}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{accountSummary.email}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{accountSummary.role}</dd>
              </div>
            </dl>

            <button
              className="btn btn--dark"
              onClick={copyAccountSummary}
              type="button"
            >
              Copy account summary
            </button>
          </article>

          <article className="dashboard-panel settings-card settings-card--danger">
            <div className="dashboard-panel__header">
              <div>
                <h2>Account removal</h2>
                <p>Choose a temporary pause or a permanent delete.</p>
              </div>
            </div>

            <div className="settings-actions">
              <button
                className="btn btn--secondary"
                disabled={isSubmitting}
                onClick={() => handleAccountAction("temporary")}
                type="button"
              >
                Deactivate for 30 days
              </button>
              <button
                className="btn btn--danger"
                disabled={isSubmitting}
                onClick={() => handleAccountAction("permanent")}
                type="button"
              >
                Delete permanently
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
