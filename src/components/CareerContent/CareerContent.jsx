
import React from "react";
import SegmentedContent from "./SegmentedContent";

const dummyHTML = `
  <h3>1. Entry-Level Roles (Starting Point)</h3>\n<p>As a fresher, you\u2019ll work on <b>coding, debugging, and testing software/hardware</b> under supervision. Common roles include:\n<ul>\n <li><b>Software Developer</b> (building applications or systems)</li>\n <li><b>Hardware Engineer</b> (designing circuits or embedded systems)</li>\n <li><b>QA/Testing Engineer</b> (ensuring software reliability)</li>\n</ul>\n</p>\n<p><i>Salary range:</i> \u20b93\u20136 LPA (varies by company and location). <b>Tip:</b> Focus on mastering 1\u20132 programming languages (e.g., Python, Java) and internships to stand out.</p>\n\n<h3>2. Mid-Level Roles (After 3\u20135 Years)</h3>\n<p>You\u2019ll <b>lead small teams, design system architectures, or specialize</b> in areas like AI or cybersecurity. Example roles:\n<ul>\n <li><b>Systems Architect</b> (planning tech infrastructure)</li>\n <li><b>DevOps Engineer</b> (bridging development and operations)</li>\n <li><b>Cybersecurity Analyst</b> (protecting data systems)</li>\n</ul>\n</p>\n<p><i>Salary range:</i> \u20b96\u201312 LPA. <b>Key skill:</b> Problem-solving and mentoring juniors boosts growth here.</p>\n\n<h3>3. Senior or Expert Roles (After 7\u201310+ Years)</h3>\n<p>At this stage, you <b>drive innovation, manage large projects, or become a domain expert</b>. Top roles:\n<ul>\n <li><b>CTO/Tech Director</b> (strategic tech leadership)</li>\n <li><b>Principal Engineer</b> (high-impact system design)</li>\n <li><b>AI/ML Scientist</b> (cutting-edge research)</li>\n</ul>\n</p>\n<p><i>Salary range:</i> \u20b912\u201325 LPA+ (can exceed \u20b950 LPA in top firms). <b>Pro tip:</b> Build a niche (e.g., cloud computing, blockchain) for higher demand.</p>\n\n<h3>4. Employment Areas & Industries</h3>\n<p>Computer engineers thrive in diverse sectors:\n<ul>\n <li><b>IT/Software:</b> Develop apps, OS, or enterprise solutions (e.g., TCS, Infosys).</li>\n <li><b>Finance:</b> Build fintech platforms or algorithmic trading systems (e.g., HDFC, Razorpay).</li>\n <li><b>Healthcare:</b> Design medical devices or AI diagnostics (e.g., Philips, Practo).</li>\n <li><b>Manufacturing:</b> Automate processes with IoT/robotics (e.g., Tata Motors, Siemens).</li>\n <li><b>Startups:</b> Wear multiple hats in fast-paced environments (e.g., Unacademy, Postman).</li>\n <li><b>Government:</b> Work on digital infrastructure (e.g., UIDAI, ISRO).</li>\n</ul>\n</p>\n\n<h3>5. Growth Factors</h3>\n<p>To accelerate your career:\n<ul>\n <li><b>Upskill:</b> Learn cloud (AWS/Azure), AI, or cybersecurity via <b>certifications</b> (Coursera, Udemy).</li>\n <li><b>Build projects:</b> GitHub portfolios or freelance work showcase practical skills.</li>\n <li><b>Network:</b> Attend hackathons (e.g., SIH) or join tech communities (GDG, IEEE).</li>\n <li><b>Adapt:</b> Follow trends like quantum computing or edge AI to stay relevant.</li>\n <li><b>Mentorship:</b> Seek guidance from LinkedIn professionals or alumni.</li>\n</ul>\n</p>\n<p><b>Remember:</b> Consistency and curiosity are your biggest assets\u2014tech rewards those who <i>keep learning</i>!</p> `;

function CareerContent() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Software Developer – Structured Career Info
      </h1>
      <SegmentedContent html={dummyHTML} />
    </div>
  );
}

export default CareerContent;
