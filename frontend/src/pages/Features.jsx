import SteeringImage from "../../public/Steering.jpg";
import LearnerImage from "../assets/LearnerImage.avif";
import Driver from "../assets/Driving-school.jpg";

const features = [
  {
    image: Driver,
    title: "Professional lesson booking",
    description:
      "Clients can book Code 8, Code 10, and Code 14 lessons through a guided flow that feels fast, clear, and trustworthy.",
    tag: "Client experience",
  },
  {
    image: SteeringImage,
    title: "Flexible scheduling with live slots",
    description:
      "Available time slots help learners choose practical lesson times without back-and-forth calls or WhatsApp confusion.",
    tag: "Operations",
  },
  {
    image: LearnerImage,
    title: "Reference-based booking tracking",
    description:
      "Every booking gets a downloadable reference card so clients can track whether their booking is pending or confirmed.",
    tag: "Visibility",
  },
];

export default function Features() {
  return (
    <section className="features">
      <p className="features__subtitle">
        Built for modern driving schools that want a cleaner client journey and
        a more organized daily workflow.
      </p>

      <div className="features__grid">
        {features.map((feature) => (
          <article className="feature-box" key={feature.title}>
            <img src={feature.image} alt={feature.title} />
            <span className="feature-box__tag">{feature.tag}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
