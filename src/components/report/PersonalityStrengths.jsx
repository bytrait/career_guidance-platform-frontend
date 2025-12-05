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
  LabelList
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
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsSmallScreen(window.innerWidth < 640); // tailwind 'sm'
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);


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

    // auto-open first accordion
    const firstKey = Object.keys(acc)[0];
    setOpenTrait(firstKey || null);

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
      <div className="max-w-7xl w-full mt-8 grid grid-cols-1 lg:grid-cols-2 lg:gap-8">

        {/* LEFT PANEL (scrollable, equal height) */}
        <div className="lg:h-[420px] space-y-4">
          {Object.entries(accordions).map(([trait, info]) => {
            const isOpen = openTrait === trait;
            return (
              <div
                key={trait}
                className="bg-white rounded-xl overflow-hidden border border-gray-300"
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-4 cursor-pointer"
                  onClick={() => toggleAccordion(trait)}
                >
                  <div className="flex items-center">
                    <ChevronRight
                      className={`text-blue-600 mr-3 transform transition-transform duration-200 ${isOpen ? "rotate-90" : ""
                        }`}
                      size={18}
                    />
                    <div className="font-semibold text-gray-800">{info.label}</div>
                  </div>
                </button>

                <div
                  className={`px-4 overflow-hidden transition-all duration-300 ${isOpen ? "py-4" : "py-0"
                    }`}
                  style={{ maxHeight: isOpen ? "300px" : "0px" }}
                >
                  <div className="text-gray-700">{info.summary}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT PANEL */}
        <div
          className="w-full px-2 mt-6 lg:mt-0 lg:p-4">
          <div
            className="w-full h-64 lg:h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 0, right: 30, left: -35, bottom: 10 }}
              >
                <CartesianGrid stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  tick={{
                    fontSize: isSmallScreen ? 10 : 12,
                    fill: "#4b5563",
                  }}
                  angle={isSmallScreen ? 30 : 0}
                  textAnchor={isSmallScreen ? "top" : "middle"}
                  height={isSmallScreen ? 45 : 30}
                />

                <YAxis tick={{ fontSize: 12, fill: "#4b5563" }} />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]}>
                  <LabelList
                    dataKey="value"
                    position="middle"
                    fill="white"
                    style={{ fontWeight: 500 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>



      </div>

    </div>
  );
}
