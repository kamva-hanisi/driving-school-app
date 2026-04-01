export default function StepService({ next, prev, formData, setFormData }) {
  const services = ["Driving Lesson", "Test Booking", "Car Hire"];

  const handleServiceSelect = (service) => {
    setFormData({ ...formData, selectedService: service });
    next();
  };

  return (
    <section className="booking-card">
      <h2 className="booking-card__title">Select a service</h2>
      <p className="booking-card__text">
        Pick the service you want so we can tailor the rest of the booking flow.
      </p>
      <div className="option-list">
        {services.map((service) => (
          <button
            key={service}
            onClick={() => handleServiceSelect(service)}
            className="option-button"
            type="button"
          >
            {service}
          </button>
        ))}
      </div>

      <div className="button-row">
        <button className="button button--secondary" onClick={prev} type="button">
          Back
        </button>
      </div>
    </section>
  );
}
