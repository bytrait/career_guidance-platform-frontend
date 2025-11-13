// src/components/career/SegmentedContent.jsx
import React from "react";
import parse from "html-react-parser";
import { segmentByHeadings } from "./HeadingSegmenter";
import SectionCard from "./SectionCard";

const colors = ["blue", "green", "purple", "orange", "teal", "rose"];

export default function SegmentedContent({ html }) {
  const sections = segmentByHeadings(html);

  if (!sections.length) {
    return <p className="text-gray-500 text-center">No structured content available.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto bg-gray-50 p-8 rounded-2xl">
      {sections.map((sec, idx) => (
        <SectionCard
          key={idx}
          title={sec.heading}
          color={colors[idx % colors.length]}
        >
          {parse(sec.content)}
        </SectionCard>
      ))}
    </div>
  );
}
