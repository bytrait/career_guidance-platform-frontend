// src/components/PersonalityStrengths.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronRight } from "lucide-react";
import traitsData from "../../data/personality_traits.json";

// NOTE: This mapping MUST match the keys in personality_traits.json
const TRAIT_JSON_KEY = {
  O: "Openness",
  C: "Conscientiousness",
  E: "Extroversion", // match JSON key exactly
  A: "Agreeableness",
  N: "Neuroticism",
};

// Display names for chart in English + Marathi
const TRAIT_DISPLAY = {
  O: { en: "Openness", mr: "मोकळेपणा" },
  C: { en: "Conscientiousness", mr: "कर्मठपणा" },
  E: { en: "Extroversion", mr: "बहिर्मुखता" },
  A: { en: "Agreeableness", mr: "सहमतता" },
  N: { en: "Neuroticism", mr: "भावनिक अस्थिरता" },
};

// Helper to get category based on score
function getCategory(traitJsonKey, score, lang = "en") {
  let traitInfo = traitsData?.traits?.[traitJsonKey];

  // fallback alternate spellings
  if (!traitInfo) {
    const alternates = {
      Extroversion: "Extraversion",
      Extraversion: "Extroversion",
    };
    const altKey = alternates[traitJsonKey];
    if (altKey) traitInfo = traitsData?.traits?.[altKey];
  }

  if (!traitInfo) return null;

  for (const cat of traitInfo.categories) {
    const [min, max] = String(cat.range).split("-").map(Number);
    if (!Number.isNaN(min) && !Number.isNaN(max) && score >= min && score <= max) {
      return {
        label: (cat.label && (cat.label[lang] || cat.label["en"])) || null,
        summary: (cat.summary && (cat.summary[lang] || cat.summary["en"])) || null,
      };
    }
  }
  return null;
}

export default function PersonalityStrengths({ scores = [], language = "en" }) {
  const [chartData, setChartData] = useState([]);
  const [accordions, setAccordions] = useState({});
  const [openTrait, setOpenTrait] = useState(null);

  useEffect(() => {
    if (!scores || scores.length === 0) return;

    const oceanScores = scores.filter((item) => item.assessmentType === "OCEAN");

    // Build chart data
    const orderedCodes = ["O", "C", "E", "A", "N"];
    const chart = orderedCodes
      .map((code) => {
        const item = oceanScores.find((s) => s.traitOrCategoryCode === code);
        if (item) {
          return {
            name: TRAIT_DISPLAY[code]?.[language] || TRAIT_JSON_KEY[code] || item.traitOrCategoryCode,
            value: item.score,
          };
        }
        return null;
      })
      .filter(Boolean);
    setChartData(chart);

    // Build accordions
    const acc = {};
    oceanScores.forEach((item) => {
      const jsonKey = TRAIT_JSON_KEY[item.traitOrCategoryCode];
      const cat = getCategory(jsonKey, item.score, language);
      if (cat) {
        const displayName =
          TRAIT_DISPLAY[item.traitOrCategoryCode]?.[language] || jsonKey;
        acc[displayName] = {
          label: cat.label,
          summary: cat.summary,
          score: item.score,
        };
      }
    });
    setAccordions(acc);
    setOpenTrait(null);
  }, [scores, language]);

  const toggleAccordion = (trait) => {
    setOpenTrait((prev) => (prev === trait ? null : trait));
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header */}
      <div className="max-w-7xl w-full px-0 sm:px-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">
              {language === "mr"
                ? "तुमचे प्रमुख व्यक्तिमत्त्वाचे गुण"
                : "Your Top Personality Strengths"}
            </h2>
            <p className="text-gray-600 mt-3">
              {language === "mr"
                ? "खालील विभाग तुमच्या प्रतिसादांवर आधारित व्यक्तिमत्त्वाचे गुण दाखवतो."
                : "The following section shows your personality traits based on your responses."}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl w-full mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 px-0 sm:px-2">
        {/* Left side - Accordions */}
        <div className="space-y-4">
          {Object.keys(accordions).length === 0 && (
            <div className="text-gray-500">
              {language === "mr" ? "अद्याप कोणतेही OCEAN डेटा उपलब्ध नाही." : "No OCEAN data available yet."}
            </div>
          )}

          {Object.entries(accordions).map(([trait, info]) => {
            const isOpen = openTrait === trait;
            return (
              <div
                key={trait}
                className="bg-white rounded-xl overflow-hidden border border-gray-200"
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-3 cursor-pointer focus:outline-none"
                  onClick={() => toggleAccordion(trait)}
                  aria-expanded={isOpen}
                  aria-controls={`panel-${trait}`}
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
                        {info.label}
                      </div>
                    </div>
                  </div>
                </button>

                <div
                  id={`panel-${trait}`}
                  className={`px-4 overflow-hidden transition-all duration-200 ${
                    isOpen ? "py-4" : "py-0"
                  }`}
                  style={{ maxHeight: isOpen ? "400px" : "0px" }}
                >
                  <div className="text-gray-700">
                    {info.summary || (language === "mr" ? "सारांश उपलब्ध नाही." : "No summary available.")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right side - Chart */}
        <div className="bg-white p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="5 5" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
