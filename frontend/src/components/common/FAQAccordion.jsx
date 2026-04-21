import { useState } from "react";

const faqData = [
  {
    question: "How do I book a driving lesson?",
    answer:
      "Go to the booking page, choose your driving code (8, 10, or 14), select a date and time, then confirm your booking.",
  },
  {
    question: "Can I reschedule my lesson?",
    answer:
      "Yes, you can reschedule your lesson from the track booking page using your booking reference number.",
  },
  {
    question: "Do I need an account to book?",
    answer:
      "No, clients do not need an account. Only the owner/admin logs in to manage bookings and posters.",
  },
  {
    question: "Which driving codes do you offer?",
    answer:
      "We offer Code 8, Code 10, and Code 14 driving lessons and test preparation.",
  },
  {
    question: "How do payments work?",
    answer:
      "Payments can be made online through the booking platform, and you will receive a booking reference after successful payment.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq">
      <h2 className="faq__title">Frequently Asked Questions</h2>
      <p className="faq__subtitle">
        Everything you need to know about booking and lessons.
      </p>

      <div className="faq__list">
        {faqData.map((item, index) => (
          <div className="faq__item" key={index}>
            <button
              className="faq__question"
              onClick={() => handleToggle(index)}
              type="button"
            >
              <span>{item.question}</span>
              <span>{openIndex === index ? "-" : "+"}</span>
            </button>

            {openIndex === index && (
              <div className="faq__answer">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
