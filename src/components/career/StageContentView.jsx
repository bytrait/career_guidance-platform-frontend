// src/components/career/StageContentView.jsx
import React, { useEffect, useState } from "react";
import StageContentCard from "./StageContentCard";

export default function StageContentView({ step, language = "en" }) {
  const [visible, setVisible] = useState(true);
  const [animKey, setAnimKey] = useState(0);

  // Trigger fade/slide animation when stage changes
  useEffect(() => {
    setVisible(false);

    const t = setTimeout(() => {
      setAnimKey((k) => k + 1);
      setVisible(true);
    }, 200);

    return () => clearTimeout(t);
  }, [step?.order]);

  if (!step) {
    return (
      <div className="text-gray-500 py-8 text-center">
        {language === "mr" ? "सामग्री उपलब्ध नाही." : "No content available."}
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div
        key={animKey}
        className={`transition-all duration-300 
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}
        `}
      >
        <StageContentCard step={step} language={language} />
      </div>
    </div>
  );
}
