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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const steps = ["Code", "Service", "Schedule", "Details"];

  // Moves the learner through the booking steps while preserving form state.
  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  const handleConfirm = async () => {
    const requiredFields = [
      formData.name?.trim(),
      formData.phone?.trim(),
      formData.selectedCode,
      formData.selectedService,
      formData.bookingDate,
      formData.bookingTime,
    ];

    if (requiredFields.some((value) => !value)) {
      setError("Please complete every booking step before continuing.");
      return;
    }

    const bookingData = {
      name: formData.name.trim(),
      email: formData.email?.trim(),
      phone: formData.phone.trim(),
      selectedCode: formData.selectedCode,
      selectedService: formData.selectedService,
      bookingDate: formData.bookingDate,
      bookingTime: formData.bookingTime,
    };

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      await API.post("/bookings", bookingData);

      const res = await API.post("/payment", {
        amount: 500,
        item_name: "Driving Lesson",
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
        return;
      }

      setSuccess(
        res.data?.message ||
          "Your booking was submitted successfully. We will contact you soon.",
      );
      setFormData({});
      setStep(1);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "We could not complete the booking right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDetailsStepIncomplete = !formData.name?.trim() || !formData.phone?.trim();

  return (
    <main className="booking-page">
      <div className="booking-card booking-card--intro">
        <h1 className="booking-card__title">Client booking form</h1>
        <p className="booking-card__text">
          Clients can book lessons here without creating an account. Every
          booking goes straight to the admin dashboard.
        </p>
        {success ? <p className="form-status form-status--success">{success}</p> : null}
        {error ? <p className="form-status form-status--error">{error}</p> : null}
      </div>

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
          submitDisabled={isDetailsStepIncomplete}
        />
      )}
    </main>
  );
}
