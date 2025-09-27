import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const aptitudeLabels = {
  en: {
    NA: "Numerical Ability",
    MR: "Mechanical Reasoning",
    LA: "Language Ability",
    LR: "Logical Reasoning",
    SA: "Spatial Ability",
  },
  mr: {
    NA: "सांख्यिक क्षमता",
    MR: "यांत्रिक तर्क",
    LA: "भाषिक क्षमता",
    LR: "तार्किक तर्क",
    SA: "स्थानिक क्षमता",
  },
};

export default function AptitudeChart({ scores, language = "en" }) {
  // ✅ Pick the right labels based on selected language
  const labels = aptitudeLabels[language] || aptitudeLabels.en;

  // ✅ Prepare chart data
  const aptitudeScores = scores
    .filter((item) => item.assessmentType === "APTITUDE")
    .map((item) => ({
      name: labels[item.traitOrCategoryCode] || item.traitOrCategoryCode,
      score: item.score,
    }));

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-lg font-bold mb-4 text-gray-800">
        {language === "mr" ? "क्षमता चाचणी निकाल" : "Aptitude Test Results"}
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={aptitudeScores}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, "dataMax + 2"]} />
          <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
          <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]}>
            {/* ✅ Show values on top of bars */}
            <LabelList dataKey="score" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
