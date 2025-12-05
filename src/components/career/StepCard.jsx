import React from "react";
import SegmentedContent from "../CareerContent/SegmentedContent";

const StepCard = ({ step }) => {

  const en = step.translations.find(t => t.language === "en");
  const mr = step.translations.find(t => t.language === "mr");

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "15px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        {/* ---------------- English Column ---------------- */}
        <div>
          <h4 style={{ marginBottom: "5px" }}>{en?.title}</h4>

          {en?.note && (
                          <SegmentedContent html={en.note} />
            
          )}


          {step.duration_years && (
            <p><strong>Duration:</strong> {step.duration_years} years</p>
          )}
        </div>

        {/* ---------------- Marathi Column ---------------- */}
        <div>
          <h4 style={{ marginBottom: "5px" }}>{mr?.title}</h4>
          {mr?.note && (
                          <SegmentedContent html={mr.note} />
            
          )}

          {step.duration_years && (
            <p><strong>कालावधी:</strong> {step.duration_years} वर्षे</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepCard;
