// src/pages/CareerPage.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useLocation } from "react-router-dom";

import {
  setSelectedCareer
} from "../store/reportSlice";

import CareerHero from "../components/career/CareerHero";
import StageNavigationTabs from "../components/career/StageNavigationTabs";
import StageContentView from "../components/career/StageContentView";

export default function CareerPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { careerId } = useParams(); // URL param: /career/:careerId
  const isCounsellorView = location.pathname.startsWith("/counsellor");
  const backHref = isCounsellorView ? "/counsellor/students" : "/report-ready";

  const { selectedCareer, recommendedCareers, language } = useSelector(
    (s) => s.report
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);
useEffect(() => {
  if (selectedCareer) {
    window.scrollTo({ top: 0, behavior: "instant" }); 
  }
}, [selectedCareer]);


  // ----------------------------------------
  // Restore career after refresh
  // ----------------------------------------
  useEffect(() => {
    if (!careerId) return;

    // CASE 1: Already selected (normal navigation)
    if (selectedCareer && String(selectedCareer.id) === String(careerId)) {
      setLoading(false);
      return;
    }

    // CASE 2: Try to find in Redux list
    const found = recommendedCareers.find((c) => String(c.id) === String(careerId));
    if (found) {
      dispatch(setSelectedCareer(found));
      setLoading(false);
      return;
    }

    // CASE 3: Nothing found
    setLoading(false);
  }, [careerId, selectedCareer, recommendedCareers]);

  // ----------------------------------------
  // If still loading
  // ----------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading career…
      </div>
    );
  }

  // ----------------------------------------
  // If no career available
  // ----------------------------------------
  if (!selectedCareer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <div className="text-lg">No career selected or career not found.</div>
        <a
          href={backHref}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go back
        </a>
      </div>
    );
  }

  // ----------------------------------------
  // Process 8 stages
  // ----------------------------------------
  const steps = (selectedCareer.steps || [])
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((s) => ({
      order: s.order,
      title: s.title?.[language] || s.title?.value,
      content: s.note?.[language] || s.note?.value,
    }));

  const selectedStep = steps[selectedIndex];

  // ----------------------------------------
  // PAGE UI
  // ----------------------------------------
  return (
    <>
      {/* HERO SECTION */}
      <CareerHero
        careerTitle={selectedCareer.title?.[language] || selectedCareer.title?.value}
        subtitle={selectedCareer.description?.[language] || selectedCareer.description?.value}
        matchScore={selectedCareer.similarity || 0}
        strengths={selectedCareer.strengths || []}
        salary={selectedCareer.salary_snapshot}
        minCost={selectedCareer.min_cost}
        maxCost={selectedCareer.max_cost}
        avgSalary={selectedCareer.avg_salary}
        language={language}
      />

      {/* 8 STAGES */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <StageNavigationTabs
          steps={steps}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          language={language}
        />  

        <StageContentView step={selectedStep} language={language} />
      </div>
    </>
  );
}
