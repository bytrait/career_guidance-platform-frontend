import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setScores,
  setLanguage,
  setEconomicStatus,
  setRecommendedCareers,
  setSelectedCareer,
} from "../store/reportSlice";

import { getScores } from "../services/assessmentService";
import { getPreference } from "../services/preferenceService";
import { getRecommendedCareers } from "../services/careerService";

import PersonalityStrengths from "../components/report/PersonalityStrengths";
import CareerInterests from "../components/report/CareerInterests";
import AptitudeChart from "../components/report/AptitudeChart";
import CareerOptions from "../components/report/CareerOptions";
import CareerPath from "../components/report/CareerPath";
import Spinner from "../components/common/Spinner";
import { useNavigate } from "react-router-dom";

export default function ReportPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const {
    scores,
    language,
    economicStatus,
    selectedCareer,
    recommendedCareers,
  } = useSelector((state) => state.report);

  const careerPathRef = useRef(null);

  // Load user preference + scores
  useEffect(() => {
    async function load() {
      try {
        const pref = await getPreference();
        if (!language) {
          dispatch(setLanguage(pref.preferredLanguage || "en"));
        }

        if (!economicStatus) {
          dispatch(setEconomicStatus(pref.economicStatus || null));
        }


        const scoreRes = await getScores();
        if (scoreRes.data?.success) {
          dispatch(setScores(scoreRes.data.data));
        }
      } catch (err) {
        console.error("Failed initial load", err);
      }
    }

    load();
  }, []);

  // Fetch recommended careers
  useEffect(() => {
    async function loadCareers() {
      if (!scores || scores.length === 0 || !language || !economicStatus) return;

      try {
        const res = await getRecommendedCareers(scores, economicStatus, language);

        let recs = [];
        if (res.data?.recommendations) {
          if (economicStatus === "weak") {
            recs = [
              ...(res.data.recommendations.vocational || []),
              ...(res.data.recommendations.professional || []),
            ];
          } else {
            recs = res.data.recommendations.professional || [];
          }
        }

        dispatch(setRecommendedCareers(recs));
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
      }
    }

    loadCareers();
  }, [scores, language, economicStatus]);

  const handleSelectCareer = (career) => {
    dispatch(setSelectedCareer(career));
    window.open(`/career/${career.id}`, "_blank");
  };

  // Still loading?
  const isLoading =
    !scores.length || !language || !economicStatus || recommendedCareers.length === 0;

  return (
    <>
      {/* LANGUAGE SWITCH */}
      <div className="flex justify-end px-6 py-4">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-full">
          <button
            onClick={() => dispatch(setLanguage("en"))}
            className={`px-3 py-1 rounded-full ${language === "en" ? "bg-blue-600 text-white" : ""
              }`}
          >
            English
          </button>

          <button
            onClick={() => dispatch(setLanguage("mr"))}
            className={`px-3 py-1 rounded-full ${language === "mr" ? "bg-blue-600 text-white" : ""
              }`}
          >
            मराठी
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 pb-16">

        {/* Personality */}
        <section className="mb-16">
          <PersonalityStrengths scores={scores} language={language} />
        </section>

        {/* Interests */}
        <section className="mb-16">
          <CareerInterests scores={scores} language={language} />
        </section>

        {/* Aptitude */}
        <section className="mb-16">
          <AptitudeChart scores={scores} language={language} />
        </section>

        {/* Career Options */}
        <section className="mb-16">
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : (
            <CareerOptions
              economicStatus={economicStatus}
              language={language}
              onSelectCareer={handleSelectCareer}
            />
          )}
        </section>

        {/* Selected Career */}
        {/* {selectedCareer && (
          <section ref={careerPathRef} className="mt-16">
            <CareerPath selectedCareer={selectedCareer} language={language} />
          </section>
        )} */}
      </div>
    </>
  );
}
