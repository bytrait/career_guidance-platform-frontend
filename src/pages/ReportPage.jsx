import React, { useRef, useState, useEffect } from "react";
import PersonalityStrengths from "../components/report/PersonalityStrengths";
import CareerInterests from "../components/report/CareerInterests";
import CareerOptions from "../components/report/CareerOptions";
import CareerPath from "../components/report/CareerPath";
import CareerMatchChart from "../components/report/CareerMatchChart";

import { getScores } from "../services/assessmentService";
import { getUserRiasecScores, getTopCareers } from "../utils/riasecUtils";

// ✅ Pre-generated JSON file (from your Excel) with EN + MR fields
import careerFields from "../data/career_fields.json";

export default function ReportPage() {
  const [scores, setScores] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [language, setLanguage] = useState("en");
  const [topCareers, setTopCareers] = useState([]);

  const careerPathRef = useRef(null);

  useEffect(() => {
    async function fetchScores() {
      try {
        const res = await getScores();
        if (res?.data?.success) {
          setScores(res.data.data);

          // 🔹 Extract RIASEC scores
          const riasec = getUserRiasecScores(res.data.data);

          // 🔹 Calculate top 10 career matches
          const top = getTopCareers(riasec, careerFields, 10);
          setTopCareers(top);
        }
      } catch (err) {
        console.error("Failed to fetch scores", err);
      }
    }
    fetchScores();
  }, []);

  const handleSelectCareer = (career) => {
    setSelectedCareer(career);
    setTimeout(() => {
      if (careerPathRef.current) {
        careerPathRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <>
      {/* 🔹 Language Toggle UI */}
      <div className="flex justify-end gap-2 pr-[350px] py-5">
        <button
          onClick={() => setLanguage("en")}
          className={`px-3 py-1 rounded-full text-sm ${
            language === "en" ? "bg-blue-600 text-white" : "bg-white border text-gray-700"
          }`}
        >
          English
        </button>
        <button
          onClick={() => setLanguage("mr")}
          className={`px-3 py-1 rounded-full text-sm ${
            language === "mr" ? "bg-blue-600 text-white" : "bg-white border text-gray-700"
          }`}
        >
          मराठी
        </button>
      </div>

      {/* 🔹 Existing components */}
      <PersonalityStrengths scores={scores} language={language} />
      <CareerInterests scores={scores} language={language} />
      {/* 🔹 New Horizontal Career Match Chart */}
      <CareerMatchChart topCareers={topCareers} language={language} />
      <CareerOptions
        scores={scores}
        language={language}
        onSelectCareer={handleSelectCareer}
      />

      

      {/* 🔹 Career Path (when user selects one option) */}
      {selectedCareer && (
        <div ref={careerPathRef}>
          <CareerPath selectedCareer={selectedCareer} language={language} />
        </div>
      )}
    </>
  );
}
