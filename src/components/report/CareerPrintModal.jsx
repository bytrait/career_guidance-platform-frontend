// src/components/print/CareerPrintModal.jsx
import React from "react";
import Spinner from "../common/Spinner";

export default function CareerPrintModal({
  careers = [],
  selectedCareerIds = [],
  onToggle,
  onClose,
  onPrint,
  language = "en",
  downloading = false,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
        
        <h2 className="text-xl font-bold mb-2 text-gray-800 flex items-center gap-2">
          <span>📄</span>
          {language === "mr" ? "पीडीएफ अहवाल डाउनलोड करा" : "Download PDF Report"}
        </h2>

        <p className="text-gray-600 text-sm mb-4">
          {language === "mr"
            ? "सर्व मुख्य मूल्यांकन अहवाल समाविष्ट केला जाईल. आपण खालीलपैकी कोणती करिअर जोडायची ते निवडा."
            : "The comprehensive assessment report will be downloaded. Select which career pathways you wish to include."}
        </p>

        {/* List */}
        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2.5 bg-gray-50/50">
          {careers.map((career) => (
            <label
              key={career.id}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-white transition cursor-pointer border border-transparent hover:border-gray-200"
            >
              <input
                type="checkbox"
                checked={selectedCareerIds.includes(career.id)}
                onChange={() => onToggle(career.id)}
                disabled={downloading}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-800">
                {career.title?.value || career.title || career.career_name || "Career Option"}
              </span>
            </label>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3 items-center">
          <button
            onClick={onClose}
            disabled={downloading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition disabled:opacity-50"
          >
            {language === "mr" ? "रद्द करा" : "Cancel"}
          </button>

          <button
            onClick={onPrint}
            disabled={downloading}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg text-sm font-semibold text-white transition flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-75"
          >
            {downloading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>{language === "mr" ? "पीडीएफ तयार होत आहे..." : "Generating PDF..."}</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                <span>{language === "mr" ? "पीडीएफ डाउनलोड करा" : "Download PDF"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

