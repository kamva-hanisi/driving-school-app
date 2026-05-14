import AboutImage from "../assets/about-drive.webp";
import DrivingSchool from "../assets/Driving-school.jpg";
import LearnerImage from "../assets/LearnerImage.avif";

const stats = [
  { value: "Code 8", label: "Light motor vehicle lessons" },
  { value: "Code 10", label: "Truck and commercial preparation" },
  { value: "Code 14", label: "Heavy vehicle learner support" },
];

const features = [
  {
    title: "Guided online bookings",
    text: "Learners choose a service, licence code, date, and time through a clear booking flow that reduces missed details.",
  },
  {
    title: "Trackable references",
    text: "Every booking gets a reference clients can download and use later to check their status without phoning the office.",
  },
  {
    title: "Owner dashboard",
    text: "Driving school owners can view bookings, filter by status, confirm lessons, complete lessons, and keep the day organized.",
  },
  {
    title: "Cleaner communication",
    text: "The system keeps names, phone numbers, lesson details, and booking updates together so the school can respond faster.",
  },
];

const services = [
  "Learner-focused lesson booking",
  "Admin login and booking management",
  "Public booking status tracking",
  "Downloadable booking reference cards",
  "Contact form records for client enquiries",
  "WhatsApp notification hooks for production",
];

export default function About({ embedded = false }) {
  const Shell = embedded ? "div" : "main";

  return (
    <Shell className={`about${embedded ? " about--embedded" : ""}`}>
      <section className="about-hero">
        {!embedded && (
          <div className="about-hero__media">
            <img src={AboutImage} alt="Driving instructor helping a learner" />
          </div>
        )}

        <div className="about-content">
          <p className="about__eyebrow">About DriveEasy</p>
          <h1 className="about__title">
            A smoother way to book driving lessons
          </h1>
          <p className="about__subtitle">
            DriveEasy helps learners book lessons with confidence and gives
            driving school owners a calmer way to manage clients, schedules, and
            follow-ups.
          </p>

          <div className="about-copy">
            <p>
              At <strong>DriveEasy</strong>, we believe booking a driving lesson
              should feel simple and reliable from the first click. Learners can
              choose their code, service, date, and time without phone call
              confusion or long delays.
            </p>

            <p>
              The platform supports Code 8, Code 10, and Code 14 lesson
              bookings, booking tracking, downloadable references, and a focused
              admin workflow so owners can spend less time sorting messages and
              more time helping clients succeed.
            </p>
          </div>

          <div className="about-highlights">
            <article className="about-highlight">
              <h3>Our mission</h3>
              <p>
                Make driving school booking faster, clearer, and easier for
                every learner.
              </p>
            </article>

            <article className="about-highlight">
              <h3>Our vision</h3>
              <p>
                Give local driving schools a modern digital experience that
                feels trustworthy and easy to manage.
              </p>
            </article>
          </div>
        </div>
      </section>

      {!embedded && (
        <>
          <section className="about-stats" aria-label="Supported licence codes">
            {stats.map((stat) => (
              <article className="about-stat" key={stat.value}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </section>

          <section className="about-feature-section">
            <div className="about-feature-section__content">
              <p className="about__eyebrow">What the platform does</p>
              <h2>Built for learners and school owners</h2>
              <p>
                DriveEasy brings the public booking journey and the owner’s
                daily workflow into one practical system. Learners get a simple
                path to reserve a lesson, while owners get the information they
                need to confirm, update, and manage every booking.
              </p>

              <div className="about-feature-list">
                {features.map((feature) => (
                  <article className="about-feature" key={feature.title}>
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="about-feature-section__image">
              <img src={DrivingSchool} alt="Driving school vehicle" />
            </div>
          </section>

          <section className="about-services">
            <div>
              <p className="about__eyebrow">Features included</p>
              <h2>Everything needed for the core booking flow</h2>
            </div>
            <ul>
              {services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </section>

          <section className="about-closing">
            <img src={LearnerImage} alt="Learner driver inside a car" />
            <div>
              <p className="about__eyebrow">Why it matters</p>
              <h2>Less admin, more confident learners</h2>
              <p>
                A driving school grows through trust. DriveEasy makes the first
                interaction feel organized, professional, and easy to follow, so
                learners know what they booked and owners can keep the next
                lesson moving.
              </p>
            </div>
          </section>
        </>
      )}
    </Shell>
  );
}
