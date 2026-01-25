import React from "react";
import careerFields from "../../data/career_fields.json";
import Spinner from "../common/Spinner";
import CareerMatchChart from "./CareerMatchChart";

export default function CareerOptions({
  scores = [],
  careers = [],
  economicStatus,
  language,
  readOnly = false,
  onSelectCareer = () => {},
}) {

  /* ------------------ PREPARE CHART DATA ------------------ */
  const prepareChartData = () => {
    if (!scores.length || careers.length === 0) return [];

    // Convert scores array → object { R: 18, I: 22, ... }
    const userScoresObj = scores.reduce((acc, item) => {
      if (item.assessmentType === "RIASEC") {
        acc[item.traitOrCategoryCode] = item.score;
      }
      return acc;
    }, {});

    const categories = [...new Set(careers.map(c => c.category))];

    return categories
      .map(cat => {
        const field = careerFields.find(
          f =>
            f.careerField?.en === cat ||
            f.careerField?.mr === cat
        );

        if (!field?.scores) return null;

        let weighted = 0;

        ["R", "I", "A", "S", "E", "C"].forEach(key => {
          const userTrait = userScoresObj[key];
          const idealWeight = field.scores[key];

          if (userTrait !== undefined && idealWeight !== undefined) {
            weighted += (userTrait / 30) * idealWeight;
          }
        });

        return {
          name:
            language === "mr"
              ? field.careerField.mr
              : field.careerField.en,
          value: Math.round(weighted * 100),
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.value - a.value);
  };

  const chartData = prepareChartData();

  /* ------------------ EMPTY STATE ------------------ */
  if (!scores.length) {
    return (
      <div className="w-full flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  console.log(careers)
  /* ------------------ RENDER ------------------ */
  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      {/* Header */}
      <div className="max-w-7xl w-full text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {language === "mr" ? "करिअर पर्याय" : "Career Options"}
        </h2>
        <p className="text-gray-600 mt-2">
          {language === "mr"
            ? "तुमच्या प्रोफाइल आणि आवडींवर आधारित, तुमच्यासाठी शिफारस केलेले करिअर मार्ग येथे आहेत."
            : "Based on your profile and preferences, here are the career paths recommended for you."}
        </p>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="w-full max-w-7xl mt-10">
          <CareerMatchChart
            chartData={chartData}
            language={language}
          />
        </div>
      ) : (
        <div className="w-full text-center py-12 text-gray-500">
          {language === "mr"
            ? "कोणत्याही करिअर शिफारसी आढळल्या नाहीत"
            : "No career recommendations found"}
        </div>
      )}

      {/* Career Cards */}
      {careers.length > 0 && (
        <div className="max-w-7xl w-full mt-10 space-y-10">
          {/* Professional */}
          {careers.some(c => c.career_type === "professional") && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {language === "mr"
                  ? "व्यावसायिक करिअर"
                  : "Recommended Professional Careers"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
                {careers
                  .filter(c => c.career_type === "professional")
                  .map(career => (
                    <CareerCard
                      key={career.id}
                      career={career}
                      language={language}
                      readOnly={readOnly}
                      onSelectCareer={onSelectCareer}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Vocational */}
          {careers.some(c => c.career_type === "vocational") && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {language === "mr"
                  ? "व्यावसायिक प्रशिक्षण करिअर"
                  : "Recommended Vocational Careers"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
                {careers
                  .filter(c => c.career_type === "vocational")
                  .map(career => (
                    <CareerCard
                      key={career.id}
                      career={career}
                      language={language}
                      readOnly={readOnly}
                      onSelectCareer={onSelectCareer}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------ CARD ------------------ */
function CareerCard({ career, language, readOnly, onSelectCareer }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-between transition">
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {career.title?.value}
      </h3>

      <p className="text-gray-600 text-sm mb-5 line-clamp-3">
        {career.description?.value}
      </p>

      <div className="flex items-center justify-between mt-auto">
        {!readOnly && (
          <button
            onClick={() => {
              onSelectCareer(career);
              window.open(`/career/${career.id}`, "_blank");
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            {language === "mr" ? "मार्ग पहा" : "Show Path"}
          </button>
        )}

        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
          {career.similarity}%{" "}
          {language === "mr" ? "जुळणारे" : "match"}
        </span>
      </div>
    </div>
  );
}
