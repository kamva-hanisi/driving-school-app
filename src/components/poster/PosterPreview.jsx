const templateClasses = {
  emerald: "poster-preview--emerald",
  sunset: "poster-preview--sunset",
  midnight: "poster-preview--midnight",
};

export default function PosterPreview({ form, template, posterRef }) {
  return (
    <section
      className={`poster-preview ${templateClasses[template] || templateClasses.emerald}`}
      ref={posterRef}
    >
      <div>
        <span className="poster-preview__eyebrow">{form.eyebrow}</span>
        <h2 className="poster-preview__title">{form.headline}</h2>
        <p className="poster-preview__text">
          {form.subtitle}
        </p>
      </div>

      <div>
        <div className="poster-preview__badge-row">
          <span className="poster-preview__badge">Code 8</span>
          <span className="poster-preview__badge">Code 10</span>
          <span className="poster-preview__badge">Code 14</span>
        </div>
        <div className="poster-preview__footer">{form.cta}</div>
      </div>
    </section>
  );
}
