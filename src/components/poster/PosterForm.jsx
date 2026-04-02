export default function PosterForm({ form, setForm }) {
  const handleChange = ({ target }) => {
    setForm((current) => ({
      ...current,
      [target.name]: target.value,
    }));
  };

  return (
    <section className="poster-card">
      <h2 className="poster-card__title">Poster details</h2>
      <p className="poster-card__text">
        Edit the text and download a simple poster preview.
      </p>

      <div className="form-grid">
        <label className="field">
          <span className="field__label">Label</span>
          <input
            className="field__input"
            name="eyebrow"
            onChange={handleChange}
            type="text"
            value={form.eyebrow || ""}
          />
        </label>
        <label className="field">
          <span className="field__label">Headline</span>
          <input
            className="field__input"
            name="headline"
            onChange={handleChange}
            type="text"
            value={form.headline || ""}
          />
        </label>
        <label className="field">
          <span className="field__label">Description</span>
          <textarea
            className="field__input field__input--multiline"
            name="subtitle"
            onChange={handleChange}
            rows="5"
            value={form.subtitle || ""}
          />
        </label>
        <label className="field">
          <span className="field__label">Call to action</span>
          <input
            className="field__input"
            name="cta"
            onChange={handleChange}
            type="text"
            value={form.cta || ""}
          />
        </label>
      </div>
    </section>
  );
}
