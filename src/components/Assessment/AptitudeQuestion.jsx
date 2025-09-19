export default function AptitudeQuestion({ data, value, onChange }) {
  if (!data) return null;
  const options = Array.isArray(data.options) ? data.options : [];

  let enQuestion = "";
  let mrQuestion = "";
  let questionImage = "";

  if (data.text) {
    // English
    if (typeof data.text.en === "string") {
      const [enText, enImg] = data.text.en.split("img:");
      enQuestion = enText?.trim() || "";
      if (enImg) questionImage = enImg.trim();
    }

    // Marathi
    if (typeof data.text.mr === "string") {
      const [mrText, mrImg] = data.text.mr.split("img:");
      mrQuestion = mrText?.trim() || "";
      if (!questionImage && mrImg) questionImage = mrImg.trim(); // fallback
    }
  }

  return (
    <div className="mt-6">
      {/* English + Marathi */}
      {enQuestion && (
        <h3 className="text-xl font-semibold text-gray-700">{enQuestion}</h3>
      )}
      {mrQuestion && (
        <h4 className="text-lg font-semibold text-gray-600 mb-2">
          {mrQuestion}
        </h4>
      )}

      {/* Image if exists */}
      {questionImage && (
        <div className="my-3">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/assessment/static/${questionImage}`}
            alt="Question illustration"
            className="max-h-64 object-contain"
          />
        </div>
      )}

      {/* Options */}
      <div className="flex flex-col gap-3">
        {options.length > 0 ? (
          options.map((opt) => (
            <label
              key={opt.id}
              className={`p-3 border rounded-lg cursor-pointer ${
                value === opt.id ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              <input
                type="radio"
                name={`aptitude-${data.id}`}
                value={opt.id}
                checked={value === opt.id}
                onChange={() => onChange(opt.id)}
                className="hidden"
              />
              {opt.text?.en && <span className="block">{opt.text.en}</span>}
              {opt.text?.mr && (
                <span className="block text-gray-600">{opt.text.mr}</span>
              )}
            </label>
          ))
        ) : (
          <p className="text-gray-500 italic">No options available.</p>
        )}
      </div>
    </div>
  );
}
