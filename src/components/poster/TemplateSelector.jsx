const templates = [
  {
    id: "standard",
    name: "Standard",
    description: "Neutral and professional.",
  },
  {
    id: "warm",
    name: "Warm",
    description: "A softer promotional look.",
  },
  {
    id: "dark",
    name: "Dark",
    description: "Simple dark layout.",
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
