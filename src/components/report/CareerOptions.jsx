import React, { useEffect, useState } from "react";
import { getScores } from "../../services/assessmentService";
import { getRecommendedCareers } from "../../services/careerService";

export default function CareerOptions({ economic_status = "weak", language = "mr", onSelectCareer }) {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCareers() {
      try {
        const scoresRes = await getScores();
        if (scoresRes.data?.success) {
          const recRes = await getRecommendedCareers(
            scoresRes.data.data,
            economic_status,
            language
          );

          if (recRes.data?.recommendations) {
            let recs = [];
            if (economic_status === "weak") {
              recs = [
                ...(recRes.data.recommendations.vocational || []),
                ...(recRes.data.recommendations.professional || []),
              ];
            } else {
              recs = recRes.data.recommendations.professional || [];
            }
            setCareers(recs);
          }
        }
      } catch (err) {
        console.error("Failed to fetch careers", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCareers();
  }, [economic_status, language]);

  return (
    <div className="w-full min-h-screen p-6 flex flex-col items-center">
      {/* Header */}
      <div className="max-w-7xl w-full text-center">
        <h2 className="text-2xl font-bold text-gray-900">Career Options</h2>
        <p className="text-gray-600 mt-2">
          Based on your profile and preferences, here are the career paths recommended for you.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-10 text-gray-500">Loading recommended careers...</div>
      )}

      {/* Career Cards */}
      {!loading && careers.length > 0 && (
        <div className="max-w-7xl w-full mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((career) => (
            <div
              key={career.id}
              className="bg-white rounded-xl shadow hover:shadow-lg p-6 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                  {career.title?.value}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {career.description?.value}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => {
                    // pass full career object to parent
                    if (onSelectCareer) onSelectCareer(career);
                  }}
                  className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-sm"
                >
                  See Path
                </button>

                <div className="text-sm text-gray-500">
                  {Math.round((career.similarity ?? 0) * 100) / 100}% match
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && careers.length === 0 && (
        <div className="mt-10 text-gray-500">No recommendations available.</div>
      )}
    </div>
  );
}
