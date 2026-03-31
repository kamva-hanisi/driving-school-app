export default function StepDateTime({ next, prev }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Pick Date & Time</h2>
      <p className="text-gray-500 mb-4">
        Choose a date and time for your booking:
      </p>
      <input type="date" className="border p-3 w-full mb-4 rounded" />
      <input type="time" className="border p-3 w-full mb-4 rounded" />

      <button onClick={next} className="bg-black text-white px-6 py-3">
        Continue
      </button>
      <button
        onClick={prev}
        className="ml-4 text-gray-500 hover:text-gray-700 transition-colors duration-300"
      >
        Back
      </button>
    </div>
  );
}
