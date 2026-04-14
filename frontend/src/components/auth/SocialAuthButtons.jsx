const apiBaseUrl = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

function GoogleIcon() {
  return (
    <svg aria-hidden="true" height="24" viewBox="0 0 48 48" width="24">
      <path
        d="M43.6 20.5H42V20H24v8h11.3C33.6 32.9 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.9 6.1 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
        fill="#FFC107"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" height="24" viewBox="0 0 24 24" width="24">
      <path
        d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0 0 22 12z"
        fill="#1877F2"
      />
    </svg>
  );
}

const providers = [
  {
    id: "google",
    href: `${apiBaseUrl}/auth/google`,
    icon: <GoogleIcon />,
    label: "Continue with Google",
  },
  {
    id: "facebook",
    href: `${apiBaseUrl}/auth/facebook`,
    icon: <FacebookIcon />,
    label: "Continue with Facebook",
  },
];

export default function SocialAuthButtons() {
  return (
    <div className="social-auth">
      {providers.map((provider) => (
        <a
          className="social-auth__button"
          href={provider.href}
          key={provider.id}
        >
          {provider.icon}
          <span>{provider.label}</span>
        </a>
      ))}
    </div>
  );
}
