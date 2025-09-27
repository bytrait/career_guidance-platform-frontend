import React, { useEffect, useState } from "react";
import { getScores } from "../../services/assessmentService";
import { getRecommendedCareers } from "../../services/careerService";
import careerFields from "../../data/career_fields.json";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList
} from "recharts";

export default function CareerOptions({ economicStatus, language, onSelectCareer }) {
  const [careers, setCareers] = useState([]);
  const [userScores, setUserScores] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCareers() {
      try {
        const scoresRes = await getScores();
        if (scoresRes.data?.success) {
          const user = scoresRes.data.data; // { R, I, A, S, E, C }
          setUserScores(user);

          const recRes = await getRecommendedCareers(user, economicStatus, language);
          console.log(recRes)
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
    }
    fetchCareers();
  }, [economicStatus, language]);

  // Prepare chart data with proper score processing
  const prepareChartData = () => {
    if (!userScores || careers.length === 0) return [];

    // Transform userScores array into an object for easier access
    const userScoresObj = userScores.reduce((acc, item) => {
      if (item.assessmentType === 'RIASEC') {
        acc[item.traitOrCategoryCode] = item.score;
      }
      return acc;
    }, {});

    // Extract all unique categories from recommendations
    const categories = [...new Set(careers.map((c) => c.category))];

    return categories
      .map((cat) => {
        const field = careerFields.find(
          (f) => f.careerField?.en === cat || f.careerField?.mr === cat
        );

        if (!field || !field.scores) return null;

        // Calculate match score using the transformed userScores
        const fieldScores = field.scores;
        let matchScore = 0;
        
        // Only calculate for RIASEC scores that exist in both userScores and fieldScores
        ['R', 'I', 'A', 'S', 'E', 'C'].forEach(key => {
          if (userScoresObj[key] !== undefined && fieldScores[key] !== undefined) {
            matchScore += userScoresObj[key] * fieldScores[key];
          }
        });

        // Normalize the score to a 0-100 range
        const normalizedScore = Math.min(100, Math.max(0, Math.round(matchScore)));

        return {
          name: language === "mr" ? field.careerField.mr : field.careerField.en,
          value: normalizedScore,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.value - a.value); // Sort by score descending
  };

  const chartData = prepareChartData();

  return (
    <div className="w-full min-h-screen p-6 flex flex-col items-center">
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
      {loading && (
        <div className="mt-10 text-gray-500">
          {language === "mr"
            ? "शिफारस केलेली करिअर लोड करत आहे..."
            : "Loading recommended careers..."}
        </div>
      )}

      {/* Chart */}
      {!loading && chartData.length > 0 && (
        <div className="w-full max-w-7xl mt-10">
          <h3 className="text-xl font-bold text-center mb-4">
            {language === "mr"
              ? "श्रेणी अनुरूपता चार्ट"
              : "Career Category Match Chart"}
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                type="number" 
                domain={[0, 100]}
                tickFormatter={(value) => `${value}`}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={180}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                formatter={(value) => [`${value}`, language === "mr" ? "स्कोर" : "Score"]}
                labelFormatter={(value) => `${value}`}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              />
              <Bar 
                dataKey="value" 
                fill="#3B82F6"
                radius={[0, 4, 4, 0]}
                name={language === "mr" ? "स्कोर" : "Score"}
                animationDuration={1500}
              >
                <LabelList 
                  dataKey="value" 
                  position="right" 
                  formatter={(value) => `${value}`}
                  style={{ fontSize: '12px', fill: '#4b5563' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Career Cards */}
      {!loading && careers.length > 0 && (
        <div className="max-w-7xl w-full mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((career) => (
            <div
              key={career.id}
              className="bg-white rounded-xl shadow hover:shadow-lg p-6 transition flex flex-col justify-between"
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
                  onClick={() => onSelectCareer?.(career)}
                  className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-sm cursor-pointer"
                >
                  {language === "mr" ? "मार्ग पहा" : "Show Path"}
                </button>

                <div className="text-sm text-gray-500">
                  {Math.round((career.similarity ?? 0) * 100) / 100}%{" "}
                  {language === "mr" ? "जुळणारे" : "match"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
