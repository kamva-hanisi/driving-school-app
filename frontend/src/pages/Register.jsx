import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";

function GoogleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.6 32.9 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.9 6.1 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        fill="#1877F2"
        d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0 0 22 12z"
      />
    </svg>
  );
}

const socialLinks = [
  {
    href: "https://www.google.com/",
    icon: <GoogleIcon />,
    label: "Google",
  },

  {
    href: "https://www.facebook.com/",
    icon: <FacebookIcon />,
    label: "Facebook",
  },
];

export default function Register() {
  const [form, setForm] = useState({});
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please check your details and try again.");
    }
  };

  return (
    <div className="sign-R-L-wrapper">
      <div className="R-L-box">
        <h2>Register</h2>

        <label>Full Name:</label>
        <input
          type="text"
          placeholder="Lucas Hanisi"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label>Email:</label>
        <input
          type="email"
          placeholder="lucashanisi@gmail.com"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>Password:</label>
        <input
          type={show ? "text" : "password"}
          placeholder="Enter password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <label>Confirm Password:</label>
        <input
          type={show ? "text" : "password"}
          placeholder="Confirm password"
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />

        <div className="show-password">
          <input type="checkbox" onChange={() => setShow(!show)} />
          <span>Show Password</span>
        </div>

        <Button onClick={handleRegister}>Register</Button>

        <div className="divider">
          <span>or</span>
        </div>
        <div className="site-signup__socials">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="site-signup__social-link"
            >
              {link.icon}
            </a>
          ))}
        </div>
        <div className="R-L-links">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
