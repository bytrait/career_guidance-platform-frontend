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

return (
    <div className="w-full max-w-7xl mx-auto p-12 bg-white rounded-xl shadow-md">
        <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold">
                {language === "en" ? "Top Career Matches" : "सर्वोत्तम करिअर पर्याय"}
            </h2>
        </div>

        <ResponsiveContainer width="100%" height={50 + chartData.length * 60}>
            <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 10, right: 80, left: 60, bottom: 10 }} // Increased right margin
                barCategoryGap="30%"
            >
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                    type="category"
                    dataKey="name"
                    width={200}
                    tick={{ fontSize: 15, fontWeight: 500 }}
                />
                <Tooltip
                    formatter={(value) => `${value}%`}
                    cursor={{ fill: "transparent" }}
                />
                <Bar dataKey="percent" fill="#2563eb" radius={[0, 8, 8, 0]}>
                    <LabelList
                        dataKey="percent"
                        position="right"
                        formatter={(v) => `${v}%`}
                        style={{
                            fontWeight: "bold",
                            fontSize: 16,
                            fill: "#2563eb",
                            textShadow: "0 1px 4px rgba(0,0,0,0.08)",
                        }}
                        offset={20}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
);
}
