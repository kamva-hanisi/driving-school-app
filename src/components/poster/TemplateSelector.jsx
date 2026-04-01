const templates = [
  {
    id: "emerald",
    name: "Emerald",
    description: "Clean, modern, and trustworthy.",
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm and energetic promo style.",
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Bold dark look for premium branding.",
  },
];

export default function TemplateSelector({ setTemplate, template }) {
  return (
    <section className="poster-card">
      <h2 className="poster-card__title">Choose a template</h2>
      <p className="poster-card__text">
        Switch the poster mood before you download your design.
      </p>

      <div className="template-selector">
        {templates.map((item) => (
          <button
            className={`template-option${
              template === item.id ? " template-option--active" : ""
            }`}
            key={item.id}
            onClick={() => setTemplate(item.id)}
            type="button"
          >
            <span className="template-option__name">{item.name}</span>
            <span className="template-option__description">{item.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
