export default function Testimonials() {
  return (
    <section className="testimonials">
      <p className="testimonials__subtitle">
        Trusted by learners across Code 8, 10, and 14 driving lessons.
      </p>

      <div className="testimonials__grid">
        <div className="testimonial-card">
          <p>
            “The booking process was smooth and fast. I got my Code 8 first
            time!”
          </p>
          <strong>- Lucas M.</strong>
        </div>

        <div className="testimonial-card">
          <p>
            “Very professional instructors and easy scheduling. Highly
            recommended.”
          </p>
          <strong>- Thando K.</strong>
        </div>

        <div className="testimonial-card">
          <p>“The online tracking and reminders saved me so much time.”</p>
          <strong>- Zanele P.</strong>
        </div>
      </div>
    </section>
  );
}
