import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import Features from "./Features";
import Testimonials from "./Testimonials";
import About from "./About";
import FAQAccordion from "../components/common/FAQAccordion";
import useSchoolLink from "../hooks/useSchoolLink";

import AboutImage from "../assets/about-drive.webp";

function CarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M5.2 15h13.6l-1-4.1a2 2 0 0 0-1.9-1.5H8.1a2 2 0 0 0-1.9 1.5L5.2 15Zm14.8.8v2.4a.8.8 0 0 1-.8.8h-.9a.8.8 0 0 1-.8-.8V17H6.5v1.2a.8.8 0 0 1-.8.8h-.9a.8.8 0 0 1-.8-.8v-2.4c0-1 .8-1.8 1.8-1.8h12.4c1 0 1.8.8 1.8 1.8ZM7.8 18.1a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Zm8.4 0a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M3 7.5c0-.8.7-1.5 1.5-1.5h8c.8 0 1.5.7 1.5 1.5V9h2.9c.5 0 .9.2 1.2.6l1.8 2.2c.1.2.2.4.2.7v3c0 .8-.7 1.5-1.5 1.5h-.7a2.6 2.6 0 0 1-5.1 0H9.1a2.6 2.6 0 0 1-5.1 0h-.5A1.5 1.5 0 0 1 2 15.5v-2.1c0-.3.1-.5.2-.7l.8-1.1V7.5Zm3.2 9.6a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Zm10.7 0a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2ZM14 12h4.2l-1.2-1.5H14V12Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BigTruckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M2.5 8A2.5 2.5 0 0 1 5 5.5h8A2.5 2.5 0 0 1 15.5 8v1H18c.7 0 1.3.3 1.8.8l1.5 1.7c.5.5.7 1.1.7 1.8v2.2a1.5 1.5 0 0 1-1.5 1.5h-.8a2.7 2.7 0 0 1-5.4 0H9.7a2.7 2.7 0 0 1-5.4 0H4A1.5 1.5 0 0 1 2.5 15V8Zm4.5 9.1a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Zm10 0a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4ZM15.5 12h3.8l-1.3-1.5h-2.5V12Z"
        fill="currentColor"
      />
    </svg>
  );
}

const codes = [
  { name: "Code 8", icon: <CarIcon /> },
  { name: "Code 10", icon: <TruckIcon /> },
  { name: "Code 14", icon: <BigTruckIcon /> },
];

const journeySteps = [
  {
    title: "Choose your code",
    text: "Pick Code 8, Code 10, or Code 14 and start with the lesson path that fits your licence goal.",
  },
  {
    title: "Reserve a time",
    text: "Select an available date and time without waiting for calls, messages, or manual back-and-forth.",
  },
  {
    title: "Track the booking",
    text: "Use your reference number to follow the booking status and keep the lesson details close.",
  },
];

export default function Home() {
  const { hash } = useLocation();
  const { withSchoolId } = useSchoolLink();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);

      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return (
    <>
      <section className="hero-banner">
        <div className="hero-banner__content">
          <div className="hero_top">
            <span className="hero__label">Flat, fast, learner-first</span>
            <h1 className="hero__title">
              Book your next driving lesson with confidence.
            </h1>
            <p className="hero__text">
              Schedule Code 8, Code 10, or Code 14 lessons through a cleaner
              booking flow designed for speed, trust, and a more professional
              client experience and get your license faster.
            </p>
            <div className="hero__actions">
              <Link to={withSchoolId("/booking")}>
                <Button>Book now</Button>
              </Link>
              <Link className="hero__ghost-link" to={withSchoolId("/track-booking")}>
                Track booking
              </Link>
            </div>
          </div>
        </div>
      </section>
      <main className="hero">
        <section className="hero__content">
          <span className="hero__eyebrow">Modern driving school bookings</span>
        </section>

        <div className="feature-grid">
          {codes.map((code) => (
            <article className="feature-card" key={code.name}>
              <div className="feature-card__icon">{code.icon}</div>
              <div className="feature-card__body">
                <h2 className="feature-card__title">{code.name}</h2>
                <p className="feature-card__text">
                  Professional driving lessons with a smoother digital booking
                  experience.
                </p>
              </div>
            </article>
          ))}
        </div>
      </main>

      <section className="journey-strip" aria-label="Booking journey">
        <div className="section-kicker">Simple process</div>
        <div className="journey-strip__header">
          <h2>From first click to confirmed lesson</h2>
          <p>
            A clean three-step structure keeps learners focused and gives the
            school better information from the start.
          </p>
        </div>

        <div className="journey-strip__grid">
          {journeySteps.map((step, index) => (
            <article className="journey-card" key={step.title}>
              <span className="journey-card__number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="features home-band">
        <h2 className="features__title">Why Choose DriveEasy?</h2>
        <Features />
      </section>

      <section id="testimonials" className="testimonials home-band home-band--split">
        <h2 className="testimonials__title">What Our Learners Say</h2>
        <Testimonials />
      </section>

      <section id="about" className="about-section">
        <div className="about-image">
          <img src={AboutImage} alt="About DriveEasy" />
        </div>
        <About embedded />
      </section>

      <FAQAccordion />

      <section className="home-cta">
        <div>
          <span className="section-kicker">Ready when you are</span>
          <h2>Book the lesson, keep the reference, follow the status.</h2>
        </div>
        <Link to={withSchoolId("/booking")}>
          <Button>Start booking</Button>
        </Link>
      </section>
    </>
  );
}
