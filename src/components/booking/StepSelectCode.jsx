export default function StepSelectCode({ next, formData, setFormData }) {
  const codes = ["Code 8", "Code 10", "Code 14"];

  const handleCodeSelect = (code) => {
    setFormData({ ...formData, selectedCode: code });
    next();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold">Select a Code</h2>
      <p className="text-gray-500 mt-2">
        Choose the driving code you want to book lessons for:
      </p>
      <div className="mt-4 space-y-2">
        {codes.map((code) => (
          <button
            key={code}
            onClick={() => handleCodeSelect(code)}
            className="block w-full text-left p-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors duration-300"
          >
            {code}
          </button>
        ))}
      </div>
    </div>
  );
}
