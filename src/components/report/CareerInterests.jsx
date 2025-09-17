// src/components/CareerInterests.jsx
import React, { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChevronRight } from "lucide-react";
import riasecData from "../../data/riasec_interests.json";

// Map codes to full names
const RIASEC_NAMES = {
  R: "Realistic",
  I: "Investigative",
  A: "Artistic",
  S: "Social",
  E: "Enterprising",
  C: "Conventional",
};

// Helper to get summary from JSON
function getSummary(code, lang = "en") {
  const trait = riasecData.riasec.find((t) => t.code === code);
  if (!trait) return null;
  return {
    name: trait.name,
    summary: trait.summary[lang] || trait.summary.en,
  };
}

export default function CareerInterests({ scores = [], language = "en" }) {
  const [data, setData] = useState([]);
  const [accordions, setAccordions] = useState([]);
  const [openCode, setOpenCode] = useState(null);

  useEffect(() => {
    if (!scores || scores.length === 0) return;

    const riasecScores = scores.filter(
      (item) => item.assessmentType === "RIASEC"
    );

    // Radar chart data
    const chartData = Object.keys(RIASEC_NAMES).map((code) => {
      const item = riasecScores.find((s) => s.traitOrCategoryCode === code);
      return {
        subject: RIASEC_NAMES[code],
        value: item ? item.score : 0,
        code,
      };
    });
    setData(chartData);

    // Top 3 interests
    const top3 = [...riasecScores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => {
        const info = getSummary(item.traitOrCategoryCode, language);
        return {
          code: item.traitOrCategoryCode,
          score: item.score,
          label: info?.name || item.traitOrCategoryCode,
          summary: info?.summary || "",
        };
      });
    setAccordions(top3);
  }, [scores, language]);

  const toggleAccordion = (code) => {
    setOpenCode((prev) => (prev === code ? null : code));
  };

  return (
    <div className="w-full p-6 flex flex-col items-center">
      {/* Header */}
      <div className="max-w-7xl w-full flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-gray-900">
            Your career interests
          </h2>
          <p className="text-gray-600 mt-2">
            These are your RIASEC scores showing your strongest interests.
          </p>
        </div>
        {/* 🔹 Language toggle removed — handled in ReportPage */}
      </div>

      {/* Content */}
      <div className="max-w-7xl w-full mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side - Accordions */}
        <div className="space-y-4">
          {accordions.map((item) => {
            const isOpen = openCode === item.code;
            return (
              <div
                key={item.code}
                className="bg-white rounded-xl overflow-hidden border border-gray-200"
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-3 cursor-pointer focus:outline-none"
                  onClick={() => toggleAccordion(item.code)}
                >
                  <div className="flex items-center">
                    <ChevronRight
                      className={`text-blue-600 mr-3 transform transition-transform duration-200 ${
                        isOpen ? "rotate-90" : ""
                      }`}
                      size={18}
                    />
                    <div className="text-left">
                      <div className="font-semibold text-gray-800">
                        {item.label}
                      </div>
                    </div>
                  </div>
                </button>

                <div
                  className={`px-4 overflow-hidden transition-all duration-200 ${
                    isOpen ? "py-4" : "py-0"
                  }`}
                  style={{ maxHeight: isOpen ? "400px" : "0px" }}
                >
                  <div className="text-gray-700">{item.summary}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right side - Radar Chart */}
        <div className="bg-white shadow rounded-xl p-5 flex flex-col items-center">
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Tooltip />
              <Radar
                name="RIASEC"
                dataKey="value"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
