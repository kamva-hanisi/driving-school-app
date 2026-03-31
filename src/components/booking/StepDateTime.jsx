export default function StepDateTime({ next, prev }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Pick Date & Time</h2>
      <p className="text-gray-500 mb-4">
        Choose a date and time for your booking:
      </p>
      <input type="date" className="border p-3 w-full mb-4 rounded" />
      <input type="time" className="border p-3 w-full mb-4 rounded" />

      <button
        onClick={next}
        className="bg-black text-white px-4 py-3  hover:bg-gray-800 rounded-lg transition-colors duration-300"
      >
        Continue
      </button>
      <button
        onClick={prev}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300"
      >
        Back
      </button>
    </div>
  );
}
