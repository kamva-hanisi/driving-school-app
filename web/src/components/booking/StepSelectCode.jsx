import Button from "../common/Button";

export default function StepSelectCode({ next, formData, setFormData }) {
  const codes = ["Code 8", "Code 10", "Code 14"];

  const handleCodeSelect = (code) => {
    setFormData({ ...formData, selectedCode: code });
    next();
  };

  return (
    <section className="booking-card">
      <h2 className="booking-card__title">Select a code</h2>
      <p className="booking-card__text">
        Choose the driving code you want to book lessons for:
      </p>
      <div className="option-list">
        {codes.map((code) => (
          <Button
            key={code}
            onClick={() => handleCodeSelect(code)}
            className="option-button"
            variant="option"
          >
            {code}
          </Button>
        ))}
      </div>
    </section>
  );
}
