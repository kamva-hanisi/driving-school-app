const testimonials = [
  {
    name: "Lucas Mokoena",
    quote:
      "The booking process felt professional from start to finish. I booked quickly, downloaded my reference, and knew exactly when my lesson was confirmed.",
    image: "../../public/images.jfif",
    outcome: "Passed Code 8 test",
  },
  {
    name: "Khanyisile Sibanyoni",
    quote:
      "I liked how easy it was to track my booking without calling the school all the time. It saved me stress and made everything feel organized.",
    image: "../../public/khanyi.jpg",
    outcome: "Booked test preparation",
  },
  {
    name: "John Phiri",
    quote:
      "This system gave me confidence because I could see my booking status clearly. It feels like a real modern driving school service.",
    image: "../../public/images (1).jfif",
    outcome: "Confirmed weekend lessons",
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials" id="testimonials">
      <p className="testimonials__subtitle">
        Trusted by learners who want a smoother, more professional booking
        experience.
      </p>

      <div className="testimonials__grid">
        {testimonials.map((item) => (
          <article className="testimonial-card" key={item.name}>
            <span className="testimonial-card__quote-mark">"</span>
            <p>{item.quote}</p>

            <div className="testimonial-user">
              <img src={item.image} alt={item.name} />
              <div>
                <strong>{item.name}</strong>
                <span>{item.outcome}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
