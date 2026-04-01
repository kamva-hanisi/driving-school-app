export default function PosterForm() {
  return (
    <section className="poster-card">
      <h2 className="poster-card__title">Poster details</h2>
      <p className="poster-card__text">
        Fill in the content you want to feature in your promo poster.
      </p>

      <div className="form-grid">
        <label className="field">
          <span className="field__label">Headline</span>
          <input
            className="field__input"
            defaultValue="Driving lessons made simple"
            type="text"
          />
        </label>

        <label className="field">
          <span className="field__label">Subtitle</span>
          <input
            className="field__input"
            defaultValue="Code 8, 10 and 14 bookings available"
            type="text"
          />
        </label>

        <label className="field">
          <span className="field__label">Call to action</span>
          <input
            className="field__input"
            defaultValue="Book your lesson today"
            type="text"
          />
        </label>
      </div>
    </section>
  );
}
