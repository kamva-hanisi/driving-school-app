export default function StepService({ next, prev }) {
  const services = ["Driving Lesson", "Test Booking", "Car Hire"];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Select a Service</h2>
      {services.map((service) => (
        <button
          key={service}
          onClick={next}
          className="block w-full p-4 mb-3  bg-blue-100 shodow rounded hover:bg-blue-200  transition-colors duration-300"
        >
          {service}
        </button>
      ))}

      <button
        onClick={prev}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300"
      >
        Back
      </button>
    </div>
  );
}
