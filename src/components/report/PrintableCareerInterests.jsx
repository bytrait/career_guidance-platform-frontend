import React, { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
} from "recharts";

import riasecData from "../../data/riasec_interests_v2.json";
import InterestImg from "../../assets/interest.png";

/* ---------------- UI ---------------- */

const UI_TEXT = {
  en: {
    heading: "Your Career Interests",
    description: "These are your top interest areas based on your responses.",
    section: "Your Top Interests",
  },
  mr: {
    heading: "तुमच्या करिअर आवडी",
    description: "तुमच्या प्रतिसादांवर आधारित तुमच्या मुख्य आवडी खाली दिल्या आहेत.",
    section: "तुमच्या प्रमुख आवडी",
  },
};

/* ---------------- CARD ---------------- */

function InterestCard({ trait, language }) {
  const c = trait.content;
  if (!c) return null;

  const renderShort = (list) => list?.slice(0, 2).join(", ");

  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
      style={{ pageBreakInside: "avoid" }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-base flex items-center" style={{ color: "#1e3a8a" }}>
          <i className="bi bi-compass mr-2" style={{ color: "#2563eb" }}></i>
          {trait.name?.[language] || trait.name?.en}
        </h3>

        <div
          className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold border"
          style={{ backgroundColor: "#eff6ff", color: "#1d4ed8", borderColor: "#bfdbfe" }}
        >
          {trait.code}
        </div>
      </div>

      <div
        className="rounded-xl p-3 mb-3 border"
        style={{ backgroundColor: "#f8fafc", borderColor: "#f1f5f9" }}
      >
        <p className="text-xs leading-relaxed font-medium" style={{ color: "#1e293b" }}>
          {c.meaning?.[language]}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div
          className="rounded-lg p-2 border"
          style={{ backgroundColor: "#f8fafc", borderColor: "#f1f5f9" }}
        >
          <p className="text-[11px] font-semibold mb-0.5" style={{ color: "#64748b" }}>Behavior</p>
          <p className="text-xs font-medium" style={{ color: "#334155" }}>
            {renderShort(c.how_it_shows?.[language])}
          </p>
        </div>

        <div
          className="rounded-lg p-2 border"
          style={{ backgroundColor: "#f8fafc", borderColor: "#f1f5f9" }}
        >
          <p className="text-[11px] font-semibold mb-0.5" style={{ color: "#64748b" }}>Learning</p>
          <p className="text-xs font-medium" style={{ color: "#334155" }}>
            {renderShort(c.learning_preference?.[language])}
          </p>
        </div>
      </div>

      <div
        className="rounded-xl p-2.5 mb-2.5 border"
        style={{ backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }}
      >
        <p className="text-[11px] font-bold mb-0.5" style={{ color: "#1e3a8a" }}>Strength</p>
        <p className="text-xs font-semibold" style={{ color: "#1d4ed8" }}>
          {renderShort(c.strengths?.[language])}
        </p>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <p className="text-[11px] font-medium" style={{ color: "#64748b" }}>Reflection</p>
        <p className="text-xs italic" style={{ color: "#475569" }}>
          {c.reflection_prompts?.[language]?.[0]}
        </p>
      </div>
    </div>
  );
}

/* ---------------- MAIN (2 CLEAN PAGES) ---------------- */

export default function PrintableCareerInterestsA4({
  scores = [],
  language = "en",
}) {
  const [data, setData] = useState([]);
  const [topInterests, setTopInterests] = useState([]);

  useEffect(() => {
    if (!scores?.length) return;

    const riasecScores = scores.filter(
      (item) => item.assessmentType === "RIASEC"
    );

    const chartData = riasecData.riasec.map((trait) => {
      const item = riasecScores.find(
        (s) => s.traitOrCategoryCode === trait.code
      );
      return {
        subject: trait.name?.[language] || trait.name?.en,
        value: item ? item.score : 0,
      };
    });

    setData(chartData);

    const top3 = [...riasecScores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) =>
        riasecData.riasec.find((t) => t.code === item.traitOrCategoryCode)
      );

    setTopInterests(top3);
  }, [scores, language]);

  const page1Interests = topInterests.slice(0, 2);
  const page2Interests = topInterests.slice(2);

  return (
    <>
      {/* ---------------- PAGE 1 of Interests (Report Page 5) ---------------- */}
      <div
        className="print-page font-sans"
        style={{
          width: "210mm",
          minHeight: "297mm",
          boxSizing: "border-box",
          padding: "10mm 14mm",
          background: "#ffffff",
          pageBreakAfter: "always",
          breakAfter: "page",
        }}
      >
        {/* HEADER */}
        <div className="text-center mb-4">
          <div className="flex justify-center items-center gap-3 mb-1">
            <i className="bi bi-compass text-3xl" style={{ color: "#2563eb" }} />
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#1e3a8a" }}>
              {UI_TEXT[language]?.heading}
            </h1>
          </div>

          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            {UI_TEXT[language]?.description}
          </p>

          <div className="mt-3 mb-3">
            <hr style={{ border: "none", height: 1, backgroundColor: "#e2e8f0" }} />
          </div>
        </div>

        {/* TOP SECTION (CHART + IMAGE) */}
        <div className="grid grid-cols-12 gap-4 items-center mb-4">
          {/* RADAR CHART */}
          <div className="col-span-8 flex justify-center">
            <RadarChart
              width={380}
              height={240}
              outerRadius={90}
              data={data}
            >
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Radar
                dataKey="value"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.5}
                isAnimationActive={false}
              />
            </RadarChart>
          </div>

          {/* IMAGE */}
          <div className="col-span-4 flex justify-center">
            <img
              src={InterestImg}
              alt="interest"
              className="w-[200px] h-[180px] object-contain"
            />
          </div>
        </div>

        {/* SUBTITLE */}
        <div className="w-full mb-3">
          <h3 className="text-xl font-bold" style={{ color: "#1e3a8a" }}>
            {UI_TEXT[language]?.section}
          </h3>
        </div>

        {/* CARDS ROW (FIRST 2 CARDS) */}
        <div className="grid grid-cols-2 gap-4">
          {page1Interests.map((t) => (
            <InterestCard key={t.code} trait={t} language={language} />
          ))}
        </div>
      </div>

      {/* ---------------- PAGE 2 of Interests (Report Page 6) ---------------- */}
      <div
        className="print-page font-sans"
        style={{
          width: "210mm",
          minHeight: "297mm",
          boxSizing: "border-box",
          padding: "14mm 14mm",
          background: "#ffffff",
          pageBreakAfter: "always",
          breakAfter: "page",
        }}
      >
        <div className="grid grid-cols-2 gap-6 h-full items-start">
          {page2Interests.map((t) => (
            <InterestCard key={t.code} trait={t} language={language} />
          ))}

          {/* Motivation Card */}
          <div
            className="rounded-2xl p-8 flex items-center justify-center text-center border min-h-[320px]"
            style={{
              backgroundColor: "#eff6ff",
              borderColor: "#bfdbfe",
              pageBreakInside: "avoid",
            }}
          >
            <p className="text-4xl font-extrabold leading-relaxed">
              <span style={{ color: "#1e3a8a" }}>
                {language === "mr" ? "तुमच्या आवडी करिअरचा मार्ग घडवतात" : "Your interests shape your path"}
              </span>
              <br />
              <span style={{ color: "#2563eb" }}>
                {language === "mr" ? "तुम्हाला जे आवडते ते करा" : "Follow what excites you"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}