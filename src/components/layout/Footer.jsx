function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M13.5 21v-7h2.3l.4-3h-2.7V9.1c0-.9.2-1.6 1.6-1.6H16V4.8c-.2 0-.9-.1-1.8-.1-1.8 0-3.1 1.1-3.1 3.3V11H9v3h2.1v7h2.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M20 11.9A8 8 0 0 1 8.4 19l-3.4.9.9-3.3a8 8 0 1 1 14.1-4.7Zm-8-6.2a6.2 6.2 0 0 0-5.3 9.5l.3.4-.5 1.8 1.9-.5.3.2A6.2 6.2 0 1 0 12 5.7Zm3.7 7.9c-.2-.1-1.1-.5-1.3-.6-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.2-.4.1a5.2 5.2 0 0 1-2.5-2.2c-.1-.2 0-.3.1-.4l.5-.6c.1-.1.1-.2.2-.3 0-.1 0-.2 0-.3l-.6-1.4c-.1-.2-.2-.2-.4-.2h-.3c-.1 0-.3.1-.4.2-.4.4-.6.9-.6 1.5s.4 1.4.5 1.5a7.4 7.4 0 0 0 2.8 2.6c1.6.7 1.6.5 1.9.5.3 0 1.1-.4 1.2-.8.2-.4.2-.8.1-.8 0-.1-.2-.1-.4-.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M7.8 3h8.4A4.8 4.8 0 0 1 21 7.8v8.4a4.8 4.8 0 0 1-4.8 4.8H7.8A4.8 4.8 0 0 1 3 16.2V7.8A4.8 4.8 0 0 1 7.8 3Zm0 1.8A3 3 0 0 0 4.8 7.8v8.4a3 3 0 0 0 3 3h8.4a3 3 0 0 0 3-3V7.8a3 3 0 0 0-3-3H7.8Zm8.8 1.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7.6a4.4 4.4 0 1 1 0 8.8 4.4 4.4 0 0 1 0-8.8Zm0 1.8a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 2v.2l8 5.4 8-5.4V8H4Zm16 8V10.4l-7.4 5a1 1 0 0 1-1.2 0L4 10.4V16h16Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.3 1 .3 2 .4 3 .4.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4.5c0-.6.4-1 1-1h3.7c.6 0 1 .4 1 1 0 1 .1 2 .4 3 .1.4 0 .8-.3 1l-2.2 2.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Zm0-9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
        fill="currentColor"
      />
    </svg>
  );
}

const socialLinks = [
  {
    href: "https://www.facebook.com/",
    icon: <FacebookIcon />,
    label: "Facebook",
  },
  {
    href: "https://wa.me/27123456789",
    icon: <WhatsAppIcon />,
    label: "WhatsApp",
  },
  {
    href: "https://www.instagram.com/",
    icon: <InstagramIcon />,
    label: "Instagram",
  },
  {
    href: "mailto:info@driveeasy.com",
    icon: <MailIcon />,
    label: "Email",
  },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <p className="site-footer__name">DriveEasy</p>
          <p className="site-footer__text">
            Bookings and support for Code 8, 10, and 14 lessons and get your
            license faster.
          </p>
          <div className="site-footer__socials" aria-label="Social media links">
            {socialLinks.map((item) => (
              <a
                aria-label={item.label}
                className="site-footer__social-link"
                href={item.href}
                key={item.label}
                rel="noreferrer"
                target="_blank"
                title={item.label}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="site-footer__group">
          <h3 className="site-footer__heading">Company</h3>
          <a href="/">About Us</a>
          <a href="/">Contact Us</a>
          <a href="/">Privacy Policy</a>
          <a href="/">Terms &amp; Conditions</a>
        </div>

        <div className="site-footer__group">
          <h3 className="site-footer__heading">Contact</h3>
          <a className="site-footer__contact" href="/">
            <LocationIcon />
            <span>
              1771 Umqalothi Cres Greenfield, Katlehong, 1458 Johannesburg,
              South Africa
            </span>
          </a>
          <a
            className="site-footer__contact"
            href="mailto:lucashaisi@driveeasy.com"
          >
            <MailIcon />
            <span>lucashaisi@driveeasy.com</span>
          </a>
          <a className="site-footer__contact" href="tel:+275864843">
            <PhoneIcon />
            <span>+27 586 4843</span>
          </a>
        </div>

        <div className="site-footer__group">
          <h3 className="site-footer__heading">Opening</h3>
          <p>Monday - Saturday</p>
          <p>07:00 AM - 16:00 PM</p>
          <p>Sunday</p>
          <p>10:00 AM - 15:00 PM</p>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>@{new Date().getFullYear()} DriveEasy</p>
        <p>Designed by Kamva Haisi</p>
        <div className="site-footer__bottom-links">
          <a href="/">Home</a>
          <a href="/">Help</a>
          <a href="/">FAQs</a>
          <a href="/">Support</a>
        </div>
      </div>
    </footer>
  );
}
