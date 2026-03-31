export default function SepUserDetails({ next, prev, formData, setFormData }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold">Your Details</h2>
      <p className="text-gray-500 mt-2">
        Please provide your contact information:
      </p>
      <div className="mt-4 space-y-4">
        <input
          placeholder="Name"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />
        <input
          placeholder="Email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />
        <input
          placeholder="Phone"
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />
      </div>

      <button className="bg-green-600 text-white px-4 py-3 rounded-lg mt-6  hover:bg-green-700 transition-colors duration-300">
        Confirm Booking
      </button>
      <div className="mt-6 flex justify-between">
        <button
          onClick={prev}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300"
        >
          Back
        </button>
        <button
          onClick={next}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}
