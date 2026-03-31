import { useState } from "react";
import StepSelectCode from "../components/booking/StepSelectCode";
import StepService from "../components/booking/StepService";
import StepDateTime from "../components/booking/StepDateTime";
import StepUserDetails from "../components/booking/StepUserDetails";

export default function Booking() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  return (
    <div className="p-10">
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
    </div>
  );
}
