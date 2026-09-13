import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactDOM from "react-dom/client";

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
import { fetchUserDetailsById } from "../services/userAssessmentProgressService";

import { downloadReportPDF } from "../services/reportService";

import PersonalityStrengths from "../components/report/PersonalityStrengths";
import CareerInterests from "../components/report/CareerInterests";
import AptitudeChart from "../components/report/AptitudeChart";
import CareerOptions from "../components/report/CareerOptions";
import CareerPrintModal from "../components/report/CareerPrintModal";
import Spinner from "../components/common/Spinner";

import PrintDocument from "../components/report/PrintDocument";
import PrintCoverPage from "../components/report/PrintCoverPage";
import ReportOverviewPage from "../components/report/ReportOverviewPage";

/* ------------------ PRINT STYLES ------------------ */
function collectStylesForIframe() {
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

export default function ReportPage() {
  const dispatch = useDispatch();
  const offscreenRootRef = useRef(null);

  const [userDetails, setUserDetails] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedCareerIds, setSelectedCareerIds] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const { scores, language, economicStatus, recommendedCareers } = useSelector(
    s => s.report
  );

  /* ------------------ LOAD INITIAL DATA ------------------ */
  useEffect(() => {
    async function load() {
      const pref = await getPreference();
      dispatch(setLanguage(pref.preferredLanguage || "en"));
      dispatch(setEconomicStatus(pref.economicStatus || null));

      const scoreRes = await getScores();
      if (scoreRes.data?.success) {
        dispatch(setScores(scoreRes.data.data));
      }

      const user = await fetchUserDetailsById();
      setUserDetails(user);
    }
    load();
  }, []);

  /* ------------------ LOAD CAREERS ------------------ */
  useEffect(() => {
    async function loadCareers() {
      if (!scores?.length || !language || !economicStatus) return;

      const res = await getRecommendedCareers(scores, economicStatus, language);
      let recs = [];

      if (res.data?.recommendations) {
        recs =
          economicStatus === "weak"
            ? [
                ...(res.data.recommendations.vocational || []),
                ...(res.data.recommendations.professional || []),
              ]
            : res.data.recommendations.professional || [];
      }

      dispatch(setRecommendedCareers(recs));
    }
    loadCareers();
  }, [scores, language, economicStatus]);

  const isLoading =
    !scores?.length || !language || !economicStatus || !recommendedCareers.length;

  /* ------------------ SELECTION ------------------ */
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

  /* ------------------ PRINT / DOWNLOAD PDF ------------------ */
  async function handleDownloadPDF() {
    setIsDownloading(true);

    const container = ensureOffscreenRoot();
    container.innerHTML = "";

    const root = ReactDOM.createRoot(container);

    root.render(
      <>
        <PrintCoverPage userDetails={userDetails} language={language} />
        <ReportOverviewPage />
        <PrintDocument
          scores={scores}
          language={language}
          recommendedCareers={recommendedCareers}
          selectedCareerIds={selectedCareerIds}
        />
      </>
    );

    await new Promise(r => setTimeout(r, 500));

    const styles = collectStylesForIframe();

    const finalHTML = `
    <!doctype html>
    <html>
      <head>
        <base href="${window.location.origin}" />
        <meta charset="utf-8" />
        <title>${userDetails?.fullName || "Report"}</title>
        ${styles}
      </head>
      <body>
        ${container.innerHTML}
      </body>
    </html>
    `;

    try {
      const response = await downloadReportPDF({
        html: finalHTML,
        studentName: userDetails?.fullName,
      });

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      const brandSlug = "ByTrait";
      const fileName = `${userDetails?.fullName || "Student"}_${brandSlug}_Report_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;

      link.href = url;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download failed:", error);
      alert("PDF download failed. Please try again.");
    } finally {
      setIsDownloading(false);
      root.unmount();
      container.remove();
      offscreenRootRef.current = null;
      setShowPrintModal(false);
    }
  }

  /* ------------------ RENDER ------------------ */
  return (
    <>
      {/* Language Switch */}
      <div className="flex justify-end px-6 py-4 no-print">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-full">
          <button
            onClick={() => dispatch(setLanguage("en"))}
            className={`px-3 py-1 rounded-full font-medium text-sm transition ${
              language === "en" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            English
          </button>
          <button
            onClick={() => dispatch(setLanguage("mr"))}
            className={`px-3 py-1 rounded-full font-medium text-sm transition ${
              language === "mr" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            मराठी
          </button>
        </div>
      </div>

      {/* Download PDF Button */}
      <div className="max-w-7xl mx-auto px-4 mb-6 no-print">
        <div className="flex justify-end">
          <button
            onClick={openPrintModal}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>{language === "mr" ? "अहवाल डाउनलोड करा (PDF)" : "Download PDF Report"}</span>
          </button>
        </div>
      </div>

      {/* Screen Content */}
      <div className="max-w-7xl mx-auto px-4 space-y-16 pb-16">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-4xl font-bold text-gray-900">
            {userDetails?.fullName || "Student Career Report"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Personalized Psychometric &amp; Career Guidance Analysis
          </p>
        </div>

        <PersonalityStrengths scores={scores} language={language} />
        <CareerInterests scores={scores} language={language} />
        <AptitudeChart scores={scores} language={language} />

        <section className="mb-16">
          {isLoading ? (
            <Spinner />
          ) : (
            <CareerOptions
              scores={scores}
              careers={recommendedCareers}
              economicStatus={economicStatus}
              language={language}
              onSelectCareer={c => dispatch(setSelectedCareer(c))}
            />
          )}
        </section>
      </div>

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
    </>
  );
}
