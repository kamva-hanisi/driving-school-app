import SteeringImage from "../assets/Steering.jpg";
import LearnerImage from "../assets/LearnerImage.avif";
import Driver from "../assets/Driving-school.jpg";

export default function Features() {
  return (
    <section className="features">
      <p className="features__subtitle">
        A modern driving school platform built to save time, simplify bookings,
        and help learners get on the road faster.
      </p>

      <div className="features__grid">
        <div className="feature-box">
          <img src={Driver} alt="Easy online booking" />
          <h3>Easy Online Booking</h3>
          <p>
            Book Code 8, 10, and 14 driving lessons in minutes with a clean and
            professional booking flow.
          </p>
        </div>

        <div className="feature-box">
          <img src={SteeringImage} alt="Flexible scheduling" />
          <h3>Flexible Scheduling</h3>
          <p>
            Choose your preferred lesson date and time without manual calls or
            WhatsApp delays.
          </p>
        </div>

        <div className="feature-box">
          <img src={LearnerImage} alt="Track bookings" />
          <h3>Track Your Booking</h3>
          <p>
            Stay updated with booking status, payment reference, and lesson
            confirmation.
          </p>
        </div>
      </div>
    </section>
  );
}
