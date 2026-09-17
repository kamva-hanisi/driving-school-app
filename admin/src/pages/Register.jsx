import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import Button from "../components/common/Button";

export default function Register() {
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (
      !form.name?.trim() ||
      !form.email?.trim() ||
      !form.password?.trim()
    ) {
      setError("Name, email, and password are required.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await API.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/login", { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Admin registration failed. Please check your details.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  return (
    <div className="sign-R-L-wrapper">
      <div className="R-L-box">
        <h2>Create Company Account</h2>

        <label htmlFor="admin-name">Full name</label>
        <input id="admin-name" type="text" onChange={updateField("name")} />

        <label htmlFor="admin-email">Email</label>
        <input id="admin-email" type="email" onChange={updateField("email")} />

        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          type={showPassword ? "text" : "password"}
          onChange={updateField("password")}
        />

        <label htmlFor="admin-confirm-password">Confirm password</label>
        <input
          id="admin-confirm-password"
          type={showPassword ? "text" : "password"}
          onChange={updateField("confirmPassword")}
        />

        <div className="show-password">
          <input
            id="show-admin-passwords"
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword((visible) => !visible)}
          />
          <label htmlFor="show-admin-passwords">Show passwords</label>
        </div>

        {error ? <p className="form-status form-status--error">{error}</p> : null}

        <Button disabled={isSubmitting} onClick={handleRegister}>
          {isSubmitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
        </Button>

        <div className="R-L-links">
          <p>
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
