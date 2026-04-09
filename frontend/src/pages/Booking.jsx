import { useState } from "react";
import API from "../services/api";
import StepSelectCode from "../components/booking/StepSelectCode";
import StepService from "../components/booking/StepService";
import StepDateTime from "../components/booking/StepDateTime";
import StepUserDetails from "../components/booking/StepUserDetails";

export default function Booking() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const steps = ["Code", "Service", "Schedule", "Details"];

  // Moves the learner through the booking steps while preserving form state.
  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  const handleConfirm = async () => {
    const bookingData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      selectedCode: formData.selectedCode,
      selectedService: formData.selectedService,
      bookingDate: formData.bookingDate,
      bookingTime: formData.bookingTime,
    };

    try {
      setIsSubmitting(true);

      await API.post("/bookings", bookingData);

      const res = await API.post("/payment", {
        amount: 500,
        item_name: "Driving Lesson",
      });

      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="booking-page">
      <div className="booking-progress" aria-label="Booking progress">
        {steps.map((label, index) => (
          <span
            className={`booking-progress__step${
              step === index + 1 ? " booking-progress__step--active" : ""
            }`}
            key={label}
          >
            {index + 1}. {label}
          </span>
        ))}
      </div>

      {step === 1 && (
        <StepSelectCode
          formData={formData}
          setFormData={setFormData}
          next={next}
        />
      )}
      {step === 2 && (
        <StepService
          formData={formData}
          setFormData={setFormData}
          next={next}
          prev={prev}
        />
      )}
      {step === 3 && (
        <StepDateTime
          formData={formData}
          setFormData={setFormData}
          next={next}
          prev={prev}
        />
      )}
      {step === 4 && (
        <StepUserDetails
          formData={formData}
          handleConfirm={handleConfirm}
          isSubmitting={isSubmitting}
          setFormData={setFormData}
          prev={prev}
        />
      )}
    </main>
  );
}
