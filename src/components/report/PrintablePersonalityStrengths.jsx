import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  Cell,
} from "recharts";
import traitsData from "../../data/personality_traits.json";

import personalityimg from "../../assets/personality.png";

/* ---------------- CONSTANTS ---------------- */

const ORDER = ["O", "C", "E", "A", "N"];

const TRAIT_JSON_KEY = {
  O: "Openness",
  C: "Conscientiousness",
  E: "Extroversion",
  A: "Agreeableness",
  N: "Neuroticism",
};

const TRAIT_DISPLAY = {
  O: {
    en: "Openness",
    mr: "मोकळेपणा",
    color: "#6ea8fe",
  },
  C: {
    en: "Conscientiousness",
    mr: "जबाबदारी",
    color: "#63d2a3",
  },
  E: {
    en: "Extroversion",
    mr: "बहिर्मुखता",
    color: "#f6c453",
  },
  A: {
    en: "Agreeableness",
    mr: "सहकार्यशीलता",
    color: "#f28bb8",
  },
  N: {
    en: "Neuroticism",
    mr: "भावनिक संवेदनशीलता",
    color: "#b197fc",
  },
};

/* ---------------- HELPERS ---------------- */

function getCategory(traitJsonKey, score, lang = "en") {
  const traitInfo = traitsData?.traits?.[traitJsonKey];
  if (!traitInfo) return { label: "", summary: "", icon: "" };

  for (const cat of traitInfo.categories) {
    const [min, max] = cat.range.split("-").map(Number);
    if (score >= min && score <= max) {
      return {
        label: cat.label?.[lang] || cat.label?.en,
        summary: cat.summary?.[lang] || cat.summary?.en,
        icon: cat.icon,
      };
    }
  }
  return { label: "", summary: "", icon: "" };
}

/* ---------------- COMPONENT ---------------- */

export default function PrintablePersonalityA4({
  scores = [],
  language = "en",
}) {
  if (!scores.length) return null;

  const traits = ORDER.map((code) => {
    const item = scores.find(
      (s) => s.assessmentType === "OCEAN" && s.traitOrCategoryCode === code
    );

    const score = Number(item?.score || 0);
    const category = getCategory(TRAIT_JSON_KEY[code], score, language);

    return {
      code,
      score,
      name: TRAIT_DISPLAY[code][language] || TRAIT_DISPLAY[code].en,
      color: TRAIT_DISPLAY[code].color,
      label: category.label,
      summary: category.summary,
      icon: category.icon,
    };
  });

  const chartData = traits.map((t) => ({
    name: t.name,
    value: t.score,
    fill: t.color,
  }));

  return (
    /* ================= A4 PAGE ================= */
    <div
      style={{
        width: "210mm",
        height: "292mm", // 👈 adjusted to fit footer
        background: "#ffffff",
        pageBreakAfter: "always",
        position: "relative", // 👈 required for footer
      }}
      className="text-gray-800"
    >
      {/* ---------- TOP HEADING ---------- */}
      <div className="text-center mb-6">
        <div className="flex justify-center items-center gap-3">
          <i className="bi bi-lightbulb text-yellow-400 text-4xl" />
          <h1 className="text-4xl font-bold text-blue-800">
            {language === "mr"
              ? "तुमचे व्यक्तिमत्त्व विश्लेषण"
              : "Your Personality Snapshot"}
          </h1>
        </div>

        <p className="text-xl text-gray-600 mt-1">
          {language === "mr"
            ? "तुम्ही कसे विचार करता आणि कसे शिकता हे समजून घ्या"
            : "Understanding how you think and learn"}
        </p>

        <div className="mt-6 mb-6">
          <hr style={{ border: "none", height: 1, backgroundColor: "#eef2f7" }} />
        </div>

        <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
          {language === "mr"
            ? "तुमचे विचार, भावना आणि शिकण्याची पद्धत समजून घेण्यासाठी तुमच्या व्यक्तिमत्त्व गुणांचा अभ्यास करूया."
            : "Let's explore your personality traits to see what makes you unique and how you like to think and learn."}
        </p>
      </div>

      {/* ---------- TWO COLUMN SECTION ---------- */}
      <div className="grid grid-cols-12 gap-2">
        {/* ===== LEFT : IMAGE + CHART ===== */}
        <div className="col-span-7" style={{ pageBreakInside: "avoid" }}>
          <img
            src={personalityimg}
            alt="Personality"
            width={420}
            height={420}
            className="mx-auto"
          />

          <div className="bg-white" style={{ pageBreakInside: "avoid" }}>
            <BarChart
              width={460}
              height={380}
              data={chartData}
              margin={{ top: 8, right: 15, left: -10, bottom: 20 }}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#475569" }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={false}
                width={0}
              />

              <Bar dataKey="value" radius={[8, 8, 0, 0]} isAnimationActive={false}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
                <LabelList
                  dataKey="value"
                  position="middle"
                  fontSize={12}
                  fill="white"
                  fontWeight={600}
                  dy={-4}
                />
              </Bar>
            </BarChart>

          </div>

          <div style={{ marginTop: 8, textAlign: "center" }}>
            <h3 className="text-lg font-semibold text-blue-900">
              {language === "mr"
                ? "तुमचे व्यक्तिमत्व गुणधर्म"
                : "Your Personality Traits"}
            </h3>
          </div>
        </div>

        {/* ===== RIGHT : CARDS ===== */}
        <div className="col-span-5 space-y-2">
          {traits.map((t) => (
            <div
              key={t.code}
              className="rounded-2xl p-4"
              style={{
                pageBreakInside: "avoid",
                border: `2px solid ${t.color}`,
              }}
            >
              <span className="flex items-center gap-3 mb-2">
                <i
                  className={`text-4xl bi ${t.icon}`}
                  style={{ color: t.color }}
                />
                <div className="font-semibold text-lg text-blue-900">
                  {t.label || t.name}
                </div>
              </span>

              <div className="text-sm text-gray-600 leading-relaxed">
                {t.summary}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- FOOTER ---------- */}
      <div
        style={{
          position: "absolute",
          bottom: "-12mm",
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "#d1d5db",
            margin: "0 auto 6px auto",
          }}
        />
        <div
          style={{
            fontSize: "12px",
            color: "#6b7280",
            letterSpacing: "1px",
          }}
        >
          1
        </div>
      </div>
    </div>
  );
}
