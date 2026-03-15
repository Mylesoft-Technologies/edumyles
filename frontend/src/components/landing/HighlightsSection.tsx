"use client";

const highlights = [
  {
    title: "Admissions to Alumni",
    description:
      "Handle enrollment, class allocation, academics, report cards, and parent communication — one connected flow from day one to graduation.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Built for Multi-Campus",
    description:
      "Run multiple schools from a single platform with strict tenant isolation, granular role-based access, and central oversight dashboards.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    title: "East Africa Ready",
    description:
      "M-Pesa, Airtel Money, and local payment workflows built in. Supports KES, UGX, TZS, RWF, BIF, and SSP currencies plus local curricula.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

export default function HighlightsSection() {
  return (
    <section className="highlights-zone">
      <div
        className="section-header centered"
        data-reveal
      >
        <h2>Why schools choose EduMyles</h2>
        <p className="section-subtitle">
          Built specifically for East African schools with local payment methods, curricula support,
          and multi-campus capabilities.
        </p>
      </div>

      <div className="highlights" style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
        {highlights.map((h, i) => (
          <div
            key={h.title}
            className="panel"
            data-reveal
            data-reveal-delay={String(i * 150)}
          >
            <div className="panel-icon">{h.icon}</div>
            <h3>{h.title}</h3>
            <p>{h.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
