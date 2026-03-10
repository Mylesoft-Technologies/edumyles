"use client";

import Link from "next/link";

const highlights = [
  {
    title: "Admissions to Alumni",
    description:
      "Handle enrollment, class allocation, academics, report cards, and parent communication - one connected flow from day one to graduation.",
  },
  {
    title: "Built for Multi-Campus",
    description:
      "Run multiple schools from a single platform with strict tenant isolation, granular role-based access, and central oversight dashboards.",
  },
  {
    title: "East Africa Ready",
    description:
      "M-Pesa, Airtel Money, and local payment workflows built in. Supports KES, UGX, TZS, RWF, BIF, and SSP currencies plus local curricula.",
  },
];

export default function HighlightsSection() {
  return (
    <section className="highlights-zone">
      <div className="section-header centered">
        <h2>Why schools choose EduMyles</h2>
        <p className="section-subtitle">
          Built specifically for East African schools with local payment methods, curricula support,
          and multi-language capabilities.
        </p>
      </div>
      <div className="highlights">
        {highlights.map((highlight) => (
          <div key={highlight.title} className="panel">
            <h3>{highlight.title}</h3>
            <p>{highlight.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
