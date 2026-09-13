import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import ReactDOM from "react-dom/client";

import PersonalityStrengths from "../../components/report/PersonalityStrengths";
import CareerInterests from "../../components/report/CareerInterests";
import AptitudeChart from "../../components/report/AptitudeChart";
import CareerOptions from "../../components/report/CareerOptions";
import CareerPrintModal from "../../components/report/CareerPrintModal";
import Spinner from "../../components/common/Spinner";

import PrintDocument from "../../components/report/PrintDocument";
import PrintCoverPage from "../../components/report/PrintCoverPage";
import ReportOverviewPage from "../../components/report/ReportOverviewPage";

import { getStudentById, isAuthenticated } from "../../services/auth";
import {
  getStudentScoresForCounsellor,
  getStudentPreferenceForCounsellor,
  getStudentDetailsForCounsellor,
} from "../../services/counsellorService";
import { getRecommendedCareers } from "../../services/careerService";
import { downloadReportPDF } from "../../services/reportService";
import { setSelectedCareer } from "../../store/reportSlice";

/* ------------------ COLLECT EXACT STYLES ------------------ */
function collectReportStyles() {
  const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  const styles = Array.from(document.querySelectorAll("style"));

  const origin = window.location.origin;

  const linkTags = links
    .map(l => (l.href ? `<link rel="stylesheet" href="${l.href}" />` : ""))
    .join("\n");

  const styleTags = styles
    .map(s => `<style>${s.innerHTML}</style>`)
    .join("\n");

  return `
    <base href="${origin}/" />
    ${linkTags}
    ${styleTags}
    <link rel="stylesheet" href="${origin}/src/styles/printCareer.css" />

    <style>
      @page {
        size: A4 portrait;
        margin: 0;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      @media print, all {
        .print-page {
          page-break-after: always;
        }
        .print-page:last-child {
          page-break-after: auto;
        }
      }

      html, body {
        background: white !important;
        color: #111827 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .no-print { display: none !important; }
    </style>
  `;
}

export default function CounsellorStudentReport() {
  const { studentId } = useParams();
  const dispatch = useDispatch();
  const offscreenRootRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [careersLoading, setCareersLoading] = useState(false);
  const [student, setStudent] = useState(null);

  const [scores, setScores] = useState([]);
  const [language, setLanguage] = useState("en");
  const [economicStatus, setEconomicStatus] = useState("stable");
  const [recommendedCareers, setRecommendedCareers] = useState([]);

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedCareerIds, setSelectedCareerIds] = useState([]);
  const [downloading, setDownloading] = useState(false);

  const [studentProfile, setStudentProfile] = useState(null);
  const [counsellor, setCounsellor] = useState(null);

  /* ------------------ LOAD STUDENT DATA ------------------ */
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const [studentRes, scoreRes, studentAuthRes, counsellorRes] =
          await Promise.all([
            getStudentDetailsForCounsellor(studentId),
            getStudentScoresForCounsellor(studentId),
            getStudentById(studentId),
            isAuthenticated(),
          ]);

        // Preference may be missing (students no longer save it on congratulations)
        let prefRes = null;
        try {
          prefRes = await getStudentPreferenceForCounsellor(studentId);
        } catch (err) {
          console.warn("Student preference not found, using defaults", err);
        }

        setStudent(studentRes);
        setLanguage(prefRes?.preferredLanguage || "en");
        setEconomicStatus(prefRes?.economicStatus || "stable");
        setScores(scoreRes || []);
        setStudentProfile(studentAuthRes || null);
        setCounsellor(counsellorRes || null);
      } catch (err) {
        console.error("Failed to load student report data", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [studentId]);

  /* ------------------ LOAD CAREERS ------------------ */
  useEffect(() => {
    async function loadCareers() {
      if (!scores.length || !economicStatus || !language) return;

      setCareersLoading(true);
      try {
        const res = await getRecommendedCareers(
          scores,
          economicStatus,
          language
        );

        let recs = [];
        if (res?.data?.recommendations) {
          recs =
            economicStatus === "weak"
              ? [
                  ...(res.data.recommendations.vocational || []),
                  ...(res.data.recommendations.professional || []),
                ]
              : res.data.recommendations.professional || [];
        }

        setRecommendedCareers(recs);
      } catch (err) {
        console.error("Failed to load recommended careers", err);
        setRecommendedCareers([]);
      } finally {
        setCareersLoading(false);
      }
    }

    loadCareers();
  }, [scores, economicStatus, language]);

  // Don't require careers.length — empty list should still show the report
  const isLoading = loading || careersLoading || !scores.length;

  function toggleCareer(id) {
    setSelectedCareerIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  }

  function openPrintModal() {
    if (!selectedCareerIds.length && recommendedCareers.length) {
      setSelectedCareerIds(recommendedCareers.slice(0, 3).map(c => c.id));
    }
    setShowPrintModal(true);
  }

  function ensureOffscreenRoot() {
    if (offscreenRootRef.current) return offscreenRootRef.current;

    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.left = "-9999px";
    div.style.top = "0";
    div.style.width = "210mm";
    document.body.appendChild(div);
    offscreenRootRef.current = div;
    return div;
  }

  /* ------------------ BACKEND PDF DOWNLOAD WITH EXACT REACT DESIGN ------------------ */
  async function handleDownloadPdf() {
    setDownloading(true);
    let container = null;
    let root = null;
    try {
      container = ensureOffscreenRoot();
      container.innerHTML = "";

      root = ReactDOM.createRoot(container);
      root.render(
        <>
          <PrintCoverPage
            userDetails={studentProfile}
            counsellorDetails={counsellor}
            language={language}
          />
          <ReportOverviewPage />
          <PrintDocument
            scores={scores}
            language={language}
            recommendedCareers={recommendedCareers}
            selectedCareerIds={selectedCareerIds}
          />
        </>
      );

      // Wait for React to mount all child charts, icons, and SVG elements
      await new Promise(r => setTimeout(r, 400));

      const innerHtml = container.innerHTML;
      const styles = collectReportStyles();

      const finalHTML = `
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>${studentProfile?.fullName || "Student Report"}</title>
            ${styles}
          </head>
          <body>${innerHtml}</body>
        </html>
      `;

      const response = await downloadReportPDF({
        html: finalHTML,
        studentName: studentProfile?.fullName || student?.fullName || "Student",
      });

      // Trigger direct file download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const brandSlug = "ByTrait";
      const fileName = `${studentProfile?.fullName || "Student"}_${brandSlug}_Report_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setShowPrintModal(false);
    } catch (err) {
      console.error("Failed to download student PDF report:", err);
      alert("Failed to generate PDF report. Please try again.");
    } finally {
      if (root) {
        root.unmount();
      }
      if (container) {
        container.remove();
        offscreenRootRef.current = null;
      }
      setDownloading(false);
    }
  }

  /* ------------------ RENDER ------------------ */
  if (loading) {
    return (
      <div className="flex justify-center mt-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-16">
      <div className="flex justify-between items-center my-6 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {studentProfile?.fullName || "Student Report"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Counsellor Evaluation &amp; Psychometric Analysis View
          </p>
        </div>

        <button
          onClick={openPrintModal}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          <span>Download PDF Report</span>
        </button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="space-y-16">
          <PersonalityStrengths scores={scores} language={language} />
          <CareerInterests scores={scores} language={language} />
          <AptitudeChart scores={scores} language={language} />

          <section className="mb-16">
            <CareerOptions
              scores={scores}
              careers={recommendedCareers}
              economicStatus={economicStatus}
              language={language}
              careerPathPrefix="/counsellor/career"
              onSelectCareer={(career) => dispatch(setSelectedCareer(career))}
            />
          </section>
        </div>
      )}

      {/* DOWNLOAD PDF MODAL */}
      {showPrintModal && (
        <CareerPrintModal
          careers={recommendedCareers}
          selectedCareerIds={selectedCareerIds}
          onToggle={toggleCareer}
          onClose={() => setShowPrintModal(false)}
          onPrint={handleDownloadPdf}
          language={language}
          downloading={downloading}
        />
      )}
    </div>
  );
}
