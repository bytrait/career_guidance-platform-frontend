import React, { useEffect, useState } from "react";
import { getScores } from "../../services/assessmentService";
import { getRecommendedCareers } from "../../services/careerService";
import careerFields from "../../data/career_fields.json";
import Spinner from "../common/Spinner";
import CareerMatchChart from "./CareerMatchChart";

export default function CareerOptions({ economicStatus, language, onSelectCareer }) {
  const [careers, setCareers] = useState([]);
  const [userScores, setUserScores] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCareers = async () => {
    setLoading(true);
    try {
      const scoresRes = await getScores();
      if (scoresRes.data?.success) {
        const user = scoresRes.data.data; // { R, I, A, S, E, C }
        console.log(user);
        setUserScores(user);

        const recRes = await getRecommendedCareers(user, economicStatus, language);

        if (recRes.data?.recommendations) {
          let recs = [];
          if (economicStatus === "weak") {
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
  };

  // Initial fetch
  useEffect(() => {
    fetchCareers();
  }, []);

  console.log("Fetched careers:", careers);
  // Refetch when language or economic status changes
  useEffect(() => {
    if (userScores) { // Only refetch if we already have initial data
      fetchCareers();
    }
  }, [economicStatus, language]);

  // Prepare chart data with proper score processing
  const prepareChartData = () => {
    if (!userScores || careers.length === 0) return [];

    // Convert array into object {R: 18, I: 22, ...}
    const userScoresObj = userScores.reduce((acc, item) => {
      if (item.assessmentType === "RIASEC") {
        acc[item.traitOrCategoryCode] = item.score; // already normalized by backend (0–30)
      }
      return acc;
    }, {});

    const categories = [...new Set(careers.map((c) => c.category))];

    return categories
      .map((cat) => {
        const field = careerFields.find(
          (f) => f.careerField?.en === cat || f.careerField?.mr === cat
        );

        if (!field || !field.scores) return null;

        const fieldScores = field.scores;

        let weighted = 0;

        // --- Correct weighted scoring ---
        ["R", "I", "A", "S", "E", "C"].forEach((key) => {
          const userTrait = userScoresObj[key];
          const idealWeight = fieldScores[key];

          if (userTrait !== undefined && idealWeight !== undefined) {
            weighted += (userTrait / 30) * idealWeight; // convert user 0-30 → 0–1
          }
        });

        // Convert weighted score (0–1) → percentage (0–100%)
        const percentage = Math.round(weighted * 100);

        return {
          name: language === "mr" ? field.careerField.mr : field.careerField.en,
          value: percentage,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.value - a.value);
  };



  const chartData = prepareChartData();
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

      {/* Loading */}
      {/* {loading && (
        <div className="mt-10 text-gray-500">
          {language === "mr"
            ? "शिफारस केलेली करिअर लोड करत आहे..."
            : "Loading recommended careers..."}
        </div>
      )} */}

      {/* Chart */}
      {loading ? (
        <div className="w-full flex justify-center items-center py-12">
          {/* <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div> */}
          <span className="ml-3 text-gray-600">
            <Spinner />
            {language === "mr"
              ? "करिअर शिफारसी लोड करत आहे..."
              : "Loading career recommendations..."}
          </span>
        </div>
      ) : chartData.length > 0 ? (
        <div className="w-full max-w-7xl mt-10">
          <CareerMatchChart chartData={chartData} language={language} />
        </div>
      ) : (
        <div className="w-full text-center py-12 text-gray-500">
          {language === "mr"
            ? "कोणत्याही करिअर शिफारसी आढळल्या नाहीत"
            : "No career recommendations found"}
        </div>
      )}

      {/* Career Cards */}
      {!loading && careers.length > 0 && (
        <div className="max-w-7xl w-full mt-10 space-y-10">
          {/* Professional Careers */}
          {careers.some((career) => career.career_type === "professional") && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {language === "mr" ? "व्यावसायिक करिअर" : "Recommended Professional Careers"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
                {careers
                  .filter((career) => career.career_type === "professional")
                  .map((career) => (
                    <div
                      key={career.id}
                      className="
                  bg-white border border-gray-200 
                  rounded-xl 
                  transition-all duration-300 
                  p-6 flex flex-col justify-between 
                  group
                "
                    >
                      <h3 className="
                  text-xl font-semibold text-gray-900 mb-3 
                  group-hover:text-blue-600 transition
                ">
                        {career.title?.value}
                      </h3>
                      <p className="
                  text-gray-600 text-sm mb-5 
                  line-clamp-3 leading-relaxed
                ">
                        {career.description?.value}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <button
                          onClick={() => onSelectCareer(career)}
                          className="
                      bg-blue-600 text-white 
                      px-4 py-2 rounded-lg text-sm font-medium 
                      hover:bg-blue-700 transition hover:cursor-pointer
                    "
                        >
                          {language === "mr" ? "मार्ग पहा" : "Show Path"}
                        </button>
                        <span
                          className="
                      bg-blue-50 text-blue-700 
                      px-3 py-1 rounded-full 
                      text-sm font-semibold
                    "
                        >
                          {career.similarity}% {language === "mr" ? "जुळणारे" : "match"}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Vocational Careers */}
          {careers.some((career) => career.career_type === "vocational") && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {language === "mr" ? "व्यावसायिक प्रशिक्षण करिअर" : "Recommended Vocational Careers"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
                {careers
                  .filter((career) => career.career_type === "vocational")
                  .map((career) => (
                    <div
                      key={career.id}
                      className="
                  bg-white border border-gray-200 
                  rounded-xl 
                  transition-all duration-300 
                  p-6 flex flex-col justify-between 
                  group
                "
                    >
                      <h3 className="
                  text-xl font-semibold text-gray-900 mb-3 
                  group-hover:text-blue-600 transition
                ">
                        {career.title?.value}
                      </h3>
                      <p className="
                  text-gray-600 text-sm mb-5 
                  line-clamp-3 leading-relaxed
                ">
                        {career.description?.value}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <button
                          onClick={() => onSelectCareer(career)}
                          className="
                      bg-blue-600 text-white 
                      px-4 py-2 rounded-lg text-sm font-medium 
                      hover:bg-blue-700 transition hover:cursor-pointer
                    "
                        >
                          {language === "mr" ? "मार्ग पहा" : "Show Path"}
                        </button>
                        <span
                          className="
                      bg-blue-50 text-blue-700 
                      px-3 py-1 rounded-full 
                      text-sm font-semibold
                    "
                        >
                          {career.similarity}% {language === "mr" ? "जुळणारे" : "match"}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
