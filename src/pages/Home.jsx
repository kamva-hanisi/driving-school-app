export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">
          Book a Driving Lessons Early 🚗
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Code 8, 10 & 14 - Fast & Simple Booking
        </p>
        <a
          href="/booking"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Book Now
        </a>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-10">
        {["Code 8", "Code 10", "Code 14"].map((Code) => (
          <div key={Code} className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold">{Code}</h2>
            <p className="text-gray-500 mt-2">Professional driving lessons</p>
          </div>
        ))}
      </div>
    </div>
  );
}
