import React, { useRef, useState, useEffect } from "react";
import PersonalityStrengths from "../components/report/PersonalityStrengths";
import CareerInterests from "../components/report/CareerInterests";
import CareerOptions from "../components/report/CareerOptions";
import CareerPath from "../components/report/CareerPath";
import { getScores } from "../services/assessmentService";

export default function ReportPage() {
  const [scores, setScores] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [language, setLanguage] = useState("en"); // 🔹 shared language state
  const careerPathRef = useRef(null);

  useEffect(() => {
    async function fetchScores() {
      try {
        const res = await getScores();
        if (res?.data?.success) {
          setScores(res.data.data);
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
      <div className="flex justify-end gap-2 px-6 py-2">
        <button
          onClick={() => setLanguage("en")}
          className={`px-3 py-1 rounded-full text-sm ${
            language === "en" ? "bg-blue-600 text-white" : "bg-white border text-gray-700"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage("mr")}
          className={`px-3 py-1 rounded-full text-sm ${
            language === "mr" ? "bg-blue-600 text-white" : "bg-white border text-gray-700"
          }`}
        >
          MR
        </button>
      </div>

      <PersonalityStrengths scores={scores} language={language} />
      <CareerInterests scores={scores} language={language} />
      <CareerOptions scores={scores} language={language} onSelectCareer={handleSelectCareer} />
      {selectedCareer && (
        <div ref={careerPathRef}>
          <CareerPath selectedCareer={selectedCareer} language={language} />
        </div>
      )}
    </>
  );
}
