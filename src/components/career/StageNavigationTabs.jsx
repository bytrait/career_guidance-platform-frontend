// src/components/career/StageNavigationTabs.jsx
import React from "react";

const STAGE_ICONS = {
  "Career Overview": "bi bi-info-circle-fill",
  "Educational Path & Eligibility": "bi bi-mortarboard-fill",
  "Entrance Exams": "bi bi-journal-check",
  "Top Colleges & Scholarships": "bi bi-building",
  "Skills & Tools Required": "bi bi-tools",
  "Career Growth & Opportunities": "bi bi-graph-up-arrow",
  "Future Trends & Real-world Exposure": "bi bi-lightbulb-fill",
  "Motivation & Summary": "bi bi-stars",
};

export default function StageNavigationTabs({
  steps = [],
  selectedIndex = 0,
  onSelect = () => {},
  language = "en",
}) {
  return (
    <div className="w-full bg-white sticky top-0 z-30 border-b border-gray-200 shadow-sm">
      <div className="overflow-x-auto scrollbar-hide">
        
        <div className="flex items-center gap-10 px-6 py-5 min-w-max relative">

          {steps.map((s, idx) => {
            const isActive = idx === selectedIndex;
            const isCompleted = idx < selectedIndex;

            const iconClass = STAGE_ICONS[s.title] || "bi bi-dot";

            return (
              <React.Fragment key={idx}>

                {/* --- PATHWAY NODE --- */}
                <button
                  onClick={() => onSelect(idx)}
                  className={`
                    flex flex-col items-center gap-1 relative group
                    transition-all duration-300
                  `}
                >
                  
                  {/* OUTER CIRCLE */}
                  <div
                    className={`
                      w-12 h-12 flex items-center justify-center rounded-full border-2 
                      transition-all duration-300
                      ${
                        isActive
                          ? "border-blue-600 bg-blue-50 shadow-md scale-105"
                          : isCompleted
                          ? "border-blue-300 bg-blue-100"
                          : "border-gray-300 bg-gray-100"
                      }
                    `}
                  >
                    <i
                      className={`${iconClass} text-lg 
                        ${
                          isActive
                            ? "text-blue-700"
                            : isCompleted
                            ? "text-blue-600"
                            : "text-gray-500"
                        }
                      `}
                    ></i>
                  </div>

                  {/* TITLE */}
                  <span
                    className={`text-xs text-center w-28 leading-tight
                      ${
                        isActive
                          ? "text-blue-700 font-semibold"
                          : "text-gray-600"
                      }
                    `}
                  >
                    {language === "mr" && s.title_mr ? s.title_mr : s.title}
                  </span>

                </button>

                {/* --- CONNECTING LINE --- */}
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-300 relative -ml-5 -mr-5">
                    <div
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{
                        width:
                          idx < selectedIndex
                            ? "100%"
                            : idx === selectedIndex
                            ? "50%"
                            : "0%",
                      }}
                    ></div>
                  </div>
                )}

              </React.Fragment>
            );
          })}

        </div>
      </div>
    </div>
  );
}
