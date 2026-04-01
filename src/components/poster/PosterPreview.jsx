export default function PosterPreview() {
  return (
    <section className="poster-preview">
      <div>
        <span className="poster-preview__eyebrow">DriveEasy campaign</span>
        <h2 className="poster-preview__title">Driving lessons made simple</h2>
        <p className="poster-preview__text">
          Book Code 8, Code 10, and Code 14 lessons with a clean digital
          experience built for speed and trust.
        </p>
      </div>

      <div>
        <div className="poster-preview__badge-row">
          <span className="poster-preview__badge">Code 8</span>
          <span className="poster-preview__badge">Code 10</span>
          <span className="poster-preview__badge">Code 14</span>
        </div>
        <div className="poster-preview__footer">Book your lesson today</div>
      </div>
    </section>
  );
}
