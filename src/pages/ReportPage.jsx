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
import { getPreference } from "../services/preferenceService";
import AptitudeChart from "../components/report/AptitudeChart";

export default function ReportPage() {
  const [scores, setScores] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [language, setLanguage] = useState("en");
  const [economicStatus, setEconomicStatus] = useState(null);
  const [topCareers, setTopCareers] = useState([]);

  const careerPathRef = useRef(null);
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

  async function fetchPreference() {
    const res = await getPreference()
    setLanguage(res.preferredLanguage)
    setEconomicStatus(res.economicStatus)
  }
  useEffect(() => {
    fetchPreference();
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
      {/* 🔹 Language Toggle UI - Made responsive */}
      <div className="flex justify-end gap-2 px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm border">
          <button
            onClick={() => setLanguage("en")}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${
              language === "en" 
                ? "bg-blue-600 text-white shadow-md" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage("mr")}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${
              language === "mr" 
                ? "bg-blue-600 text-white shadow-md" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            मराठी
          </button>
        </div>
      </div>

      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Personality Strengths Section */}
        <section className="mb-12 sm:mb-16">
          <PersonalityStrengths scores={scores} language={language} />
        </section>

        {/* Career Interests Section */}
        <section className="mb-12 sm:mb-16">
          <CareerInterests scores={scores} language={language} />
        </section>

        <section className="mb-12 sm:mb-16">
          <AptitudeChart scores={scores} language={language} />
        </section>

        {/* Career Match Chart Section */}
        {/* <section className="mb-12 sm:mb-16">
          <CareerMatchChart topCareers={topCareers} language={language} />
        </section> */}

        {/* Career Options Section */}
        
        {economicStatus && language ? (
        <section className="mb-12 sm:mb-16">
          <CareerOptions
            // scores={scores}
            economicStatus={economicStatus}
            language={language}
            onSelectCareer={handleSelectCareer}
          />
        </section>
        ) : null}


        {/* Career Path Section (conditional) */}
        {selectedCareer && (
          <section ref={careerPathRef} className="mt-16">
            <CareerPath selectedCareer={selectedCareer} language={language} />
          </section>
        )}
      </div>
    </>
  );
}
