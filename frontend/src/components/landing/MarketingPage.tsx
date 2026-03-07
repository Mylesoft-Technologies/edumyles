import Link from "next/link";

interface SectionItem {
  title: string;
  text: string;
}

interface MarketingPageProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
  sections: SectionItem[];
}

export default function MarketingPage({
  eyebrow,
  title,
  subtitle,
  ctaLabel = "Get Started",
  ctaHref = "/auth/login",
  sections,
}: MarketingPageProps) {
  return (
    <div>
      <section className="page-hero">
        <div className="section-header centered">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="section-subtitle">{subtitle}</p>
          <div className="centered-actions" style={{ marginTop: "1rem" }}>
            <Link className="btn btn-primary" href={ctaHref}>
              {ctaLabel}
            </Link>
            <Link className="btn btn-secondary" href="/#concierge">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      <section className="modules-section">
        <div className="highlights">
          {sections.map((item) => (
            <article key={item.title} className="panel">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
