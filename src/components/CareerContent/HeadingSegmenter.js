// src/components/career/HeadingSegmenter.js
import { parseDocument } from "htmlparser2";
import { DomUtils } from "htmlparser2";
import { render as renderHtml } from "dom-serializer";

/**
 * Splits HTML into sections based on headings (h1–h4).
 * Each section = { heading: "Title", content: "<p>..</p><ul>..</ul>" }
 */
export function segmentByHeadings(htmlString) {
  if (!htmlString || typeof htmlString !== "string") return [];

  const document = parseDocument(htmlString);
  const children = DomUtils.getChildren(document);
  const sections = [];

  let currentSection = null;

  for (const node of children) {
    if (node.type === "tag" && /^h[1-4]$/i.test(node.name)) {
      // Push previous section if exists
      if (currentSection) sections.push(currentSection);

      currentSection = {
        heading: DomUtils.textContent(node).trim(),
        content: "",
      };
    } else if (currentSection) {
      currentSection.content += renderHtml(node);
    }
  }

  // Add last section
  if (currentSection) sections.push(currentSection);

  return sections;
}
