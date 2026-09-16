import Button from "../common/Button";

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
          <Button
            key={service}
            onClick={() => handleServiceSelect(service)}
            className="option-button"
            variant="option"
          >
            {service}
          </Button>
        ))}
      </div>

      <div className="button-row">
        <Button onClick={prev} variant="secondary">
          Back
        </Button>
      </div>
    </section>
  );
}
