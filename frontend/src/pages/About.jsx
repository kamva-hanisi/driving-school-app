export default function About() {
  return (
    <div className="about">
      <div className="about-content">
        <p className="about__eyebrow">About DriveEasy</p>
        <h2 className="about__title">A smoother way to book driving lessons</h2>
        <p className="about__subtitle">
          We built DriveEasy to help learners and driving school owners manage
          bookings with less stress, clearer communication, and a more
          professional online experience.
        </p>

        <div className="about-copy">
          <p>
            At <strong>DriveEasy</strong>, we believe booking a driving lesson
            should feel simple and reliable from the first click. Learners can
            choose their code, service, date, and time without phone call
            confusion or long delays.
          </p>

          <p>
            Our platform supports Code 8, Code 10, and Code 14 lesson bookings,
            booking tracking, and a cleaner admin workflow so school owners can
            stay focused on helping clients succeed.
          </p>
        </div>

        <div className="about-highlights">
          <article className="about-highlight">
            <h3>Our mission</h3>
            <p>
              Make driving school booking faster, clearer, and easier for every
              learner.
            </p>
          </article>

          <article className="about-highlight">
            <h3>Our vision</h3>
            <p>
              Give local driving schools a modern digital experience that feels
              trustworthy and easy to manage.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
