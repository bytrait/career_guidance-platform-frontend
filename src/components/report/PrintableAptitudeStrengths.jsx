import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";

import aptitudeTraits from "../../data/aptitude_traits.json";
import aptitudeImg from "../../assets/aptitude.png";

/* ------------------ CONSTANTS ------------------ */

const ORDER = ["NA", "MR", "LA", "LR", "SA"];

const APT_CODES = {
  NA: "Numerical Ability",
  MR: "Mechanical Reasoning",
  LA: "Language Ability",
  LR: "Logical Reasoning",
  SA: "Spatial Ability",
};

const APT_META = {
  NA: { en: "Numbers", mr: "संख्या", icon: "bi-calculator" },
  MR: { en: "Machines", mr: "यंत्र", icon: "bi-gear-fill" },
  LA: { en: "Language", mr: "भाषा", icon: "bi-chat-dots-fill" },
  LR: { en: "Logic", mr: "तर्क", icon: "bi-lightbulb-fill" },
  SA: { en: "Spatial", mr: "अवकाशीय", icon: "bi-bounding-box" },
};

const BRAND_BLUE = "#2563eb";

/* ------------------ HELPERS ------------------ */

function getSummary(code, score, lang) {
  const trait = aptitudeTraits?.aptitudes?.[APT_CODES[code]];
  if (!trait) return "";

  const category = trait.categories.find((c) => {
    const [min, max] = c.range.split("-").map(Number);
    return score >= min && score <= max;
  });

  return category?.summary?.[lang] || category?.summary?.en || "";
}

/* ------------------ COMPONENT ------------------ */

export default function PrintableAptitudeStrengths({
  scores = [],
  language = "en",
}) {
  const { chartData, strongest, others } = useMemo(() => {
    const aptitudeScores = scores.filter(
      (s) => s.assessmentType === "APTITUDE"
    );

    const items = ORDER.map((code) => {
      const found = aptitudeScores.find(
        (s) => s.traitOrCategoryCode === code
      );
      const score = found?.score || 0;

      return {
        code,
        title: APT_META[code][language],
        icon: APT_META[code].icon,
        score,
        summary: getSummary(code, score, language),
      };
    });

    const sorted = [...items].sort((a, b) => b.score - a.score);

    return {
      chartData: items.map((i) => ({
        name: i.title,
        value: i.score,
      })),
      strongest: sorted[0],
      others: sorted.slice(1),
    };
  }, [scores, language]);

  return (
    <div
      style={{
        width: "210mm",
        height: "292mm", // reserve footer space
        background: "#ffffff",
        pageBreakAfter: "always",
        position: "relative", // required for footer
      }}
      className="text-gray-800"
    >
      {/* ================= HEADER ================= */}
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-3">
          <i className="bi bi-graph-up-arrow text-4xl text-blue-600" />
          <h1 className="text-4xl font-bold text-blue-800">
            {language === "mr" ? "तुमच्या क्षमता" : "Your Learning Abilities"}
          </h1>
        </div>
        <p className="text-sm text-gray-600 mt-2 max-w-xl mx-auto">
          {language === "mr"
            ? "या गुणांमुळे तुम्हाला कोणत्या गोष्टी सहज जमतात ते समजते."
            : "These scores show what skills come naturally to you."}
        </p>
        {/* light horizontal line */}
        <div className="mt-6 mb-6">
          <hr
            style={{ border: "none", height: 1, backgroundColor: "#eef2f7" }}
          />
        </div>
        <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
          {language === "mr"
            ? "हा विभाग तुमच्या क्षमता चाचणीवर आधारित ताकदी आणि सुधारण्याच्या क्षेत्रांना दाखवतो, ज्यामुळे योग्य करिअर निवडता येते."
            : "This section shows your strengths and areas to improve, helping identify careers that suit you best."}
        </p>
      </div>

      {/* ================= TWO COLUMN LAYOUT ================= */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* -------- LEFT : CHART + IMAGE -------- */}
        <div className="col-span-7">
          {/* Image */}
          <div className="flex justify-center mt-4">
            <img
              src={aptitudeImg}
              alt="Aptitude Illustration"
              width={360}
              height={360}
            />
          </div>
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl px-4 py-5">
            <BarChart
              width={460}
              height={460}
              data={chartData}
              margin={{ top: 20, right: 15, left: -10, bottom: 20 }}
            >


              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#475569" }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={false}
                width={0}
              />

              <Bar
                dataKey="value"
                // barSize={24}
                radius={[8, 8, 0, 0]}
                fill={BRAND_BLUE}
                isAnimationActive={false}
              >
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
          <div
            style={{
              textAlign: "center",
              pageBreakInside: "avoid",
            }}
          >
            <h3 className="text-lg font-semibold text-blue-900">
              {language === "mr"
                ? "शिकण्याच्या क्षमतांचा प्रोफाइल"
                : "Learning Ability Profile"}
            </h3>
          </div>

        </div>

        {/* -------- RIGHT : SIMPLE INFO CARDS -------- */}
        <div className="col-span-5 space-y-3">
          {[strongest, ...others].map((item) => (
            <div
              key={item.code}
              className="items-start rounded-2xl px-5 py-4 bg-white"
              style={{
                border: "2px solid #cbd5e1",
                pageBreakInside: "avoid",
              }}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="text-3xl text-blue-600">
                  <i className={`bi ${item.icon}`} />
                </div>

                <h3 className="text-lg font-semibold text-blue-900 mb-1">
                  {item.title}
                </h3>
              </div>
              <p className="text-sm text-gray-700 leading-snug">
                {item.summary}
              </p>
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
        {/* horizontal line */}
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "#d1d5db",
            margin: "0 auto 6px auto",
          }}
        />

        {/* page number */}
        <div
          style={{
            fontSize: "12px",
            color: "#6b7280",
            letterSpacing: "1px",
          }}
        >
          3
        </div>
      </div>

    </div>
  );
}
