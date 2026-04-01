import { useState } from "react";
import StepSelectCode from "../components/booking/StepSelectCode";
import StepService from "../components/booking/StepService";
import StepDateTime from "../components/booking/StepDateTime";
import StepUserDetails from "../components/booking/StepUserDetails";

export default function Booking() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const steps = ["Code", "Service", "Schedule", "Details"];

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

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
          setFormData={setFormData}
          next={next}
          prev={prev}
        />
      )}
    </main>
  );
}
