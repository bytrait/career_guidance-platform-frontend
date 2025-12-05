// src/components/report/AptitudeStrengths.jsx
import React, { useEffect, useState } from "react";
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

import { ChevronRight } from "lucide-react";
import "bootstrap-icons/font/bootstrap-icons.css";
import aptitudeTraits from "../../data/aptitude_traits.json";

// Trait mapping
const APT_CODES = {
  NA: "Numerical Ability",
  MR: "Mechanical Reasoning",
  LA: "Language Ability",
  LR: "Logical Reasoning",
  SA: "Spatial Ability",
};

const APT_DISPLAY = {
  NA: { en: "Numerical Ability", mr: "सांख्यिक क्षमता" },
  MR: { en: "Mechanical Reasoning", mr: "यांत्रिक तर्क" },
  LA: { en: "Language Ability", mr: "भाषिक क्षमता" },
  LR: { en: "Logical Reasoning", mr: "तार्किक तर्क" },
  SA: { en: "Spatial Ability", mr: "स्थानिक क्षमता" },
};

// Find meaning using JSON
// function getMeaning(code, score, lang = "en") {
//   const fullName = APT_CODES[code];
//   const info = aptitudeTraits?.aptitudes?.[fullName];
//   if (!info) return null;

//   for (const cat of info.categories) {
//     const [min, max] = cat.range.split("-").map(Number);
//     if (score >= min && score <= max) {
//       return {
//         label: cat.label[lang] || cat.label.en,
//         summary: cat.summary[lang] || cat.summary.en,
//       };
//     }
//   }
//   return null;
// }

export default function AptitudeStrengths({ scores = [], language = "en" }) {
  const [chartData, setChartData] = useState([]);
  const [accordions, setAccordions] = useState({});
  const [openTrait, setOpenTrait] = useState(null);

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const check = () => setIsSmallScreen(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);


  useEffect(() => {
    const aptitudeScores = scores.filter(
      (s) => s.assessmentType === "APTITUDE"
    );

    const ordered = ["NA", "MR", "LA", "LR", "SA"];
    const chart = ordered
      .map((code) => {
        const item = aptitudeScores.find((i) => i.traitOrCategoryCode === code);
        if (!item) return null;

        return {
          code,
          name: APT_DISPLAY[code][language],
          score: item.score,
        };
      })
      .filter(Boolean);

    setChartData(chart);

    const acc = {};
    chart.forEach((item) => {
      const m = getMeaning(item.code, item.score, language);

      acc[item.name] = {
        score: item.score,
        key: m.key,  // → "Weak" | "Moderate" | "Strong"
        label: language === "mr" ? m.label_mr : m.label_en,
        summary: language === "mr" ? m.summary_mr : m.summary_en,
      };
    });


    setAccordions(acc);
    const openTrait = accordions ? Object.keys(accordions)[0] : null;
    setOpenTrait(openTrait);
  }, [scores, language]);

  const toggle = (trait) => {
    setOpenTrait((prev) => (prev === trait ? null : trait));
  };

  // Styles
  const strengthColors = {
    Weak: "bg-red-100 text-red-700 border-red-300",
    Moderate: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Strong: "bg-green-100 text-green-700 border-green-300",
  };

  const strengthIcons = {
    Weak: "bi-graph-down-arrow text-red-600",
    Moderate: "bi-arrow-right-circle text-yellow-600",
    Strong: "bi-graph-up-arrow text-green-600",
  };


  function getMeaning(code, score, lang = "en") {
    const fullName = APT_CODES[code];
    const info = aptitudeTraits?.aptitudes?.[fullName];
    if (!info) return null;

    for (const cat of info.categories) {
      const [min, max] = cat.range.split("-").map(Number);

      if (score >= min && score <= max) {
        return {
          key: cat.label.en,  // ALWAYS English key for logic
          label_en: cat.label.en,
          label_mr: cat.label.mr,
          summary_en: cat.summary.en,
          summary_mr: cat.summary.mr,
        };
      }
    }
    return null;
  }



  return (
    <>
      {/* HEADER SECTION */}
      <div className="max-w-7xl w-full mb-6">
        <h2 className="text-3xl font-semibold text-gray-900">
          {language === "mr"
            ? "तुमच्या क्षमता सामर्थ्य"
            : "Your Aptitude Strengths"}
        </h2>

        <p className="text-gray-600 mt-2">
          {language === "mr"
            ? "हे गुण तुमच्या नैसर्गिक क्षमतांबद्दल आणि समस्या सोडवण्याच्या कौशल्याबद्दल माहिती देतात."
            : "These scores help you understand your natural abilities and problem-solving potential."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">

        {/* LEFT — Accordions */}
        <div className="h-[420px] space-y-4">
          {Object.entries(accordions).map(([trait, info]) => {
            const isOpen = openTrait === trait;
            const badgeColor = strengthColors[info.key];
            const badgeIcon = strengthIcons[info.key];


            return (
              <div
                key={trait}
                className="bg-white rounded-xl border border-gray-300"
              >
                <button
                  className="w-full px-4 py-4 flex items-center justify-between text-left"
                  onClick={() => toggle(trait)}
                >
                  {/* LEFT SIDE: Chevron + Trait Name */}
                  <div className="flex items-center gap-3">
                    <ChevronRight
                      size={18}
                      className={`text-blue-600 transform transition-transform ${isOpen ? "rotate-90" : ""
                        }`}
                    />

                    <div className="font-semibold text-gray-900">{trait}</div>
                  </div>

                  {/* RIGHT SIDE: Badge */}
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 text-xs rounded-full border flex items-center gap-1 ${badgeColor}`}
                    >
                      <i className={`bi ${badgeIcon} text-sm`}></i>
                      {info.label}
                    </span>
                  </div>
                </button>

                {/* Dropdown Section */}
                <div
                  className={`px-4 overflow-hidden transition-all duration-300 ${isOpen ? "py-4 max-h-96" : "py-0 max-h-0"
                    }`}
                >
                  <p className="text-gray-700 text-sm">{info.summary}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT — Chart (fixed height) */}
        <div className="w-full px-2 mt-6 lg:mt-0 lg:p-4">
          <div className="w-full h-64 lg:h-[420px] mx-auto">
            <ResponsiveContainer width="100%" height="100%">

              <BarChart
                data={chartData}
                margin={{ top: 0, right: 30, left: -30, bottom: 20 }}
              >
                <CartesianGrid stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  tick={{
                    fontSize: isSmallScreen ? 10 : 12,
                    fill: "#4b5563",
                  }}
                  angle={isSmallScreen ? 30 : 10}
                  textAnchor={isSmallScreen ? "top" : "top"}
                  height={isSmallScreen ? 60 : 30}
                  tickLine={false}
                />

                <YAxis tick={{ fontSize: 12, fill: "#4b5563" }} domain={[0, 10]} />

                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                />

                <Bar
                  dataKey="score"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                  className="transition-colors duration-200 hover:fill-[#1d4ed8]"
                >
                  <LabelList
                    dataKey="score"
                    position="middle"
                    fill="white"
                    style={{ fontWeight: 400 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
