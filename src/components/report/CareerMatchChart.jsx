// src/components/report/CareerMatchChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";

// Language-based insights
function getInsightLabel(value, lang) {
  if (value >= 70) {
    return lang === "mr" ? "उत्तम जुळणारे" : "Great Fit";
  } else if (value >= 40) {
    return lang === "mr" ? "मध्यम जुळणारे" : "Moderate Fit";
  }
  return lang === "mr" ? "कमी जुळणारे" : "Low Fit";
}

// Dynamic bar color
function getBarColor(value) {
  if (value >= 70) return "#16a34a";     // green
  if (value >= 40) return "#f59e0b";     // yellow
  return "#dc2626";                      // red
}

export default function CareerMatchChart({ chartData, language = "en" }) {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="w-full text-center text-gray-500 py-10">
        {language === "mr" ? "डेटा उपलब्ध नाही" : "No chart data available"}
      </div>
    );
  }

  return (
    <div className="w-full bg-white shadow-lg rounded-xl p-6">
      {/* Heading */}
      <h3 className="text-xl font-bold text-center mb-4 text-gray-800">
        {language === "mr"
          ? "श्रेणी जुळण्याचे चार्ट"
          : "Career Category Match Chart"}
      </h3>

      <ResponsiveContainer width="100%" height={420}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 40, left: 100, bottom: 20 }}
        >
          {/* Soft background */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />

          {/* X-axis (score) */}
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: "#4b5563" }}
            tickLine={false}
            axisLine={false}
          />

          {/* Y-axis (categories) */}
          <YAxis
            dataKey="name"
            type="category"
            width={180}
            tick={{ fontSize: 13, fill: "#111827", fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
          />

          {/* Tooltip with insight
          <Tooltip
            cursor={{ fill: "transparent" }}
            formatter={(value) => [
              `${value} (${getInsightLabel(value, language)})`,
              language === "mr" ? "स्कोर" : "Score",
            ]}
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              backgroundColor: "white",
              boxShadow:
                "0 6px 12px -1px rgba(0,0,0,0.1), 0 4px 6px -1px rgba(0,0,0,0.05)",
            }}
          /> */}

          {/* Background bar */}
          {/* <Bar
            dataKey="value"
            fill="#2563eb"
            radius={[0, 6, 6, 0]}
            opacity={0.5}
          /> */}

          {/* Actual dynamic bar */}
          <Bar
            dataKey="value"
            radius={[0, 6, 6, 0]}
            animationDuration={1500}
            shape={(props) => {
              const { x, y, width, height, value } = props;
              return (
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill="#2563eb"
                  rx={6}
                  ry={6}
                />
              );
            }}
          >
            {/* Score Label */}
            <LabelList
              dataKey="value"
              position="middle"
              style={{
                fontSize: "13px",
                fill: "white",
                fontWeight: 400,
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
