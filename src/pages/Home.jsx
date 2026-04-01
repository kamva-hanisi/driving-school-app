import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="nav_section">
        <div className="hero_top">
          <h1 className="hero__title">
            Book your next driving lesson with confidence.
          </h1>
          <p className="hero__text">
            Schedule Code 8, Code 10, or Code 14 lessons through a cleaner
            booking flow designed for speed, trust, and a more professional
            client experience.
          </p>
        </div>
      </section>
      <main className="hero">
        <section className="hero__content">
          <span className="hero__eyebrow">Modern driving school bookings</span>
        </section>

        <div className="feature-grid">
          {["Code 8", "Code 10", "Code 14"].map((code) => (
            <article className="feature-card" key={code}>
              <h2 className="feature-card__title">{code}</h2>
              <p className="feature-card__text">
                Professional driving lessons with a smoother digital booking
                experience.
              </p>
            </article>
          ))}
        </div>
        <div className="Btn-move">
          <Link className="button button--primary" to="/booking">
            Book now
          </Link>
        </div>
      </main>
    </>
  );
}
