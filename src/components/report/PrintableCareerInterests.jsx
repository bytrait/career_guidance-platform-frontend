import React, { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  LabelList
} from "recharts";

import riasecData from "../../data/riasec_interests.json";
import interestImg from "../../assets/interest.png";

/* ------------------ TEXT ------------------ */

const UI_TEXT = {
  en: {
    heading: "Your Career Interests",
    description:
      "These interests show the type of activities and careers you may enjoy.",
  },
  mr: {
    heading: "तुमच्या करिअर आवडी",
    description:
      "या आवडी तुम्हाला कोणत्या प्रकारच्या कामांमध्ये रस आहे हे दाखवतात.",
  },
};

/* ------------------ ICON MAP ------------------ */

const RIASEC_ICONS = {
  R: "bi-tools",
  I: "bi-search",
  A: "bi-palette",
  S: "bi-people",
  E: "bi-megaphone",
  C: "bi-clipboard-check",
};

/* ------------------ HELPERS ------------------ */

function getTraitInfo(code, lang = "en") {
  const trait = riasecData.riasec.find((t) => t.code === code);
  if (!trait) return null;

  return {
    name: trait.name?.[lang] || trait.name?.en || code,
    summary: trait.summary?.[lang] || trait.summary?.en || "",
  };
}

/* ------------------ COMPONENT ------------------ */

export default function PrintableCareerInterests({
  scores = [],
  language = "en",
}) {
  const [chartData, setChartData] = useState([]);
  const [top3, setTop3] = useState([]);

  useEffect(() => {
    if (!scores.length) return;

    const riasecScores = scores.filter(
      (s) => s.assessmentType === "RIASEC"
    );

    const data = riasecData.riasec.map((trait) => {
      const found = riasecScores.find(
        (s) => s.traitOrCategoryCode === trait.code
      );
      return {
        subject: trait.name?.[language] || trait.name?.en,
        value: found ? found.score : 0,
        code: trait.code,
      };
    });

    setChartData(data);

    const sortedTop3 = [...riasecScores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => {
        const info = getTraitInfo(item.traitOrCategoryCode, language);
        return {
          code: item.traitOrCategoryCode,
          label: info?.name,
          summary: info?.summary,
        };
      });

    setTop3(sortedTop3);
  }, [scores, language]);

  const renderRadarValue = ({ x, y, value, cx, cy }) => {
    const dx = cx - x;
    const dy = cy - y;

    return (
      <text
        x={x + dx * 0.12}   // 👈 pulls label toward center
        y={y + dy * 0.12}
        fontSize={12}
        fontWeight={400}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {value}
      </text>
    );
  };


  return (
    <div
      style={{
        width: "210mm",
        height: "292mm",
        background: "#ffffff",
        pageBreakAfter: "always",
        position: "relative",
      }}
      className="py-10 text-gray-800"
    >
      {/* ================= HEADER ================= */}
      <div className="text-center mb-10">
        {/* Icon + Title */}
        <div className="flex justify-center items-center gap-4 mb-2">
          <i className="bi bi-compass text-4xl text-blue-600" />

          <h1 className="text-4xl font-bold text-blue-800 tracking-tight">
            {UI_TEXT[language]?.heading}
          </h1>
        </div>


        {/* Description */}
        <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
          {UI_TEXT[language]?.description}
        </p>
        {/* light horizontal line */}
        <div className="mt-6 mb-6">
          <hr
            style={{ border: "none", height: 1, backgroundColor: "#eef2f7" }}
          />
        </div>
      </div>



      {/* ================= TWO COLUMN LAYOUT ================= */}
      <div className="grid grid-cols-12 gap-2 items-center">

        {/* ===== ROW 1 ===== */}
        {/* IMAGE | CONTENT */}
        <div className="col-span-7 flex justify-center items-center">
          <img
            src={interestImg}
            alt="Career Interests Illustration"
            width={360}
            height={360}
          />
        </div>

        <div className="col-span-5">
          <div
          >
            <p className="text-xl text-gray-600"
            >
              {language === "mr"
                ? "हा विभाग तुम्हाला नैसर्गिकरित्या आवडणाऱ्या क्रिया आणि करिअर क्षेत्रांवर प्रकाश टाकतो. तुमच्या मूल्यांकनाच्या निकालांवर आधारित टॉप 3 आवडी निवडल्या आहेत, ज्या क्षेत्रांमध्ये तुम्ही अधिक आत्मविश्वासाने आणि उत्साहाने पुढे जाऊ शकता हे दाखवतात."
                : "This section highlights the activities and career areas you naturally enjoy. Your Top 3 interests are selected based on your assessment results and show where you are most likely to feel confident and motivated."}
            </p>
          </div>
        </div>

        {/* ===== ROW 2 ===== */}
        {/* RADAR | TOP 3 CARDS */}
        <div className="col-span-7 flex flex-col items-center">
          {/* RADAR CHART */}
          <RadarChart
            width={400}
            height={400}
            cx={200}
            cy={200}
            outerRadius={130}
            data={chartData}
          >
            <PolarGrid stroke="#cbd5e1" />

            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 13, fill: "#374151" }}
              tickMargin={18}
            />

            <Radar
              dataKey="value"
              stroke="#2563eb"
              fill="#3b82f6"
              fillOpacity={0.4}
              isAnimationActive={false}
            >
              <LabelList content={renderRadarValue} />


            </Radar>
          </RadarChart>

          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            {language === "mr"
              ? "तुमचे करिअर इंटरेस्ट प्रोफाइल"
              : "Your Career Interest Profile"}
          </h3>
        </div>

        <div className="col-span-5 space-y-4">
          {top3.map((item) => (
            <div
              key={item.code}
              style={{
                border: "2px solid #cbd5e1",
                borderRadius: 18,
                padding: 20,
                backgroundColor: "#ffffff",
                pageBreakInside: "avoid",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <i
                  className={`bi ${RIASEC_ICONS[item.code]}`}
                  style={{ fontSize: 28, color: "#2563eb" }}
                />
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#1e3a8a",
                  }}
                >
                  {item.label}
                </div>
              </div>

              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "#374151",
                }}
              >
                {item.summary}
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
          2
        </div>
      </div>


    </div>
  );
}
