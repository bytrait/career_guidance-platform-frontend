// src/components/PrintDocument.jsx
import React from "react";
import PrintablePersonalityStrengths from "./PrintablePersonalityStrengths";
import PrintableCareerInterests from "./PrintableCareerInterests";
import PrintableAptitudeStrengths from "./PrintableAptitudeStrengths";
import PrintableCareerOptions from "./PrintableCareerOptions";
import PrintableCareerDetail from "./PrintableCareerDetail";


/** 
 * PrintDocument
 * - A simple React component that renders the printable report only.
 * - This component will be mounted into an offscreen container and its innerHTML
 *   copied into a print iframe.
 *
 * Props:
 * - scores, language, userDetails
 * - recommendedCareers: full array (we'll optionally render selected ones after)
 * - selectedCareerIds: array of ids (use PrintableCareerOptions to render all; optional separate rendering handled by ReportPage)
 * - selectedCareersHtml: OPTIONAL prebuilt HTML fragments for career sections (string) — if passed, Render them after main report.
 */

export default function PrintDocument({
  scores = [],
  language = "en",
  userDetails = {},
  recommendedCareers = [],
  selectedCareerIds = [],
  selectedCareersHtml = "",
}) {
  return (
    <div id="print-root">
      {/* SINGLE-PAGE SECTIONS */}
      <PrintablePersonalityStrengths
        scores={scores}
        language={language}
      />

      <PrintableCareerInterests
        scores={scores}
        language={language}
      />

      <PrintableAptitudeStrengths
        scores={scores}
        language={language}
      />

      {/* MULTI-PAGE SECTION (handles its own pages) */}
      <PrintableCareerOptions
        scores={scores}
        careers={recommendedCareers}
        language={language}
      />

      {/* CAREER DETAIL PAGES (each renders its own print-page) */}
      {recommendedCareers
        .filter(c => selectedCareerIds.includes(c.id))
        .map(career => (
          <div className="mb-[60px]" key={career.id}>
          <PrintableCareerDetail
            key={career.id}
            career={career}
            language={language}
          />
          </div>
        ))}
    </div>
  );
}


