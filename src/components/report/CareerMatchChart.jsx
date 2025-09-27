import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { TrendingUp } from "lucide-react";

export default function CareerMatchChart({ topCareers, language = "en" }) {
  if (!topCareers || topCareers.length === 0) {
    return <p className="text-center text-gray-500">No career matches found</p>;
  }

  // 🔹 Convert to % out of highest score
  const maxScore = Math.max(...topCareers.map((c) => c.matchScore));
  const chartData = topCareers.map((career) => ({
    name: career.careerField[language],
    percent: Math.round((career.matchScore / maxScore) * 100),
  }));

  // Calculate dynamic height based on number of items
  const barHeight = 60; // height per bar
  const minHeight = 300; // minimum height
  const maxHeight = 600; // maximum height
  const calculatedHeight = chartData.length * barHeight + 100; // 100px for header and padding
  const chartHeight = Math.min(maxHeight, Math.max(minHeight, calculatedHeight));

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <TrendingUp className="text-blue-600" size={20} />
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          {language === "en" ? "Top Career Matches" : "सर्वोत्तम करिअर पर्याय"}
        </h2>
      </div>

      <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 20,
              right: 20,
              left: window.innerWidth < 640 ? 10 : 20, // Reduced left margin
              bottom: 20,
            }}
            barSize={24}
            barGap={4}
          >
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              hide={window.innerWidth < 640}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={window.innerWidth < 640 ? 100 : 150}
              tick={{
                fontSize: window.innerWidth < 640 ? 12 : 14,
                fontWeight: 500,
              }}
              tickLine={false}
              axisLine={false}
              interval={0}
              dx={5}
              dy={0}
              style={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, 'Match Score']}
              labelFormatter={(label) => `Career: ${label}`}
              contentStyle={{
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                fontSize: '14px',
                padding: '8px 12px',
              }}
            />
            <Bar 
              dataKey="percent" 
              fill="#2563eb" 
              radius={[0, 4, 4, 0]}
              animationDuration={1500}
            >
              <LabelList
                dataKey="percent"
                position="right"
                formatter={(v) => `${v}%`}
                style={{
                  fontWeight: 600,
                  fontSize: window.innerWidth < 640 ? 12 : 14,
                  fill: "#2563eb",
                }}
                offset={window.innerWidth < 640 ? 5 : 10}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
