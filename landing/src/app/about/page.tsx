import type { Metadata } from "next";
import Link from "next/link";
import FounderImage from "./FounderImage";

export const metadata: Metadata = {
  title: "About Us — EduMyles",
  description:
    "EduMyles is transforming schools, one mile at a time — learn about our mission, vision, M.Y.L.E.S. values, and the team behind the platform.",
};

const milestones = [
  { year: "2023", title: "The Idea", desc: "Jonathan Myles saw firsthand how schools in East Africa relied on spreadsheets, WhatsApp groups, and manual ledgers. He knew there had to be a better way." },
  { year: "2023", title: "Research & Design", desc: "Months of visiting schools across Kenya, Uganda, and Tanzania — understanding real workflows, real pain points, and what solutions already existed." },
  { year: "2024", title: "First Build", desc: "The first version of EduMyles launched with student management, admissions, and fee collection modules — tested with 5 pilot schools in Nairobi." },
  { year: "2024", title: "Growing Fast", desc: "Expanded to 50+ schools across 6 East African countries. Added timetable, academics, HR, and communication modules." },
  { year: "2025", title: "Platform Maturity", desc: "Full 11-module platform with M-Pesa, Airtel Money, multi-campus support, and the partner white-label programme." },
  { year: "2026", title: "Scaling Impact", desc: "Serving schools across Kenya, Uganda, Tanzania, Rwanda, Ethiopia, and Ghana — with a growing partner ecosystem." },
];

const values = [
  {
    title: "M — Mastery",
    desc: "We pursue relentless excellence in everything we do — from the code we write to the schools we serve. We never settle for “good enough.”",
  },
  {
    title: "Y — Youth Empowerment",
    desc: "Every feature we build is an investment in Africa\u2019s young people. When schools succeed, students succeed — and so does Africa.",
  },
  {
    title: "L — Leadership",
    desc: "We lead with integrity, courage, and accountability to every stakeholder: schools, students, parents, teams, and communities.",
  },
  {
    title: "E — Entrepreneurship",
    desc: "We think like founders — moving fast, owning outcomes, and finding creative solutions even when resources are limited.",
  },
  {
    title: "S — Service",
    desc: "We measure success by lives impacted, schools transformed, and communities strengthened — not just revenue.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">About Us</p>
          <h1>Transforming schools, one mile at a time.</h1>
          <p className="subtext">
            EduMyles is a school management platform purpose-built for African schools — replacing disconnected tools
            with one intuitive, unified system for admissions, academics, finance, and operations.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="content-section">
        <div className="content-inner">
          <div className="about-mission-block">
            <div className="about-mission-text">
              <h2>Our Mission &amp; Vision</h2>
              <p className="about-lead">
                To empower schools across Africa with intuitive, affordable technology that simplifies administration,
                enhances learning outcomes, and connects every stakeholder in the education journey.
              </p>
              <p>
                Too many schools still run on spreadsheets, paper ledgers, and WhatsApp groups. Data gets lost, fees go
                uncollected, parents stay uninformed, and admin staff burn out on repetitive tasks. EduMyles exists to
                change that — by giving every school, regardless of size or location, access to world-class tools that
                simply work.
              </p>
              <p>
                Our vision is a world where every school has access to the technology it needs to deliver transformative
                education. From a rural day school to a multi-campus network, EduMyles is designed to scale with the
                journey.
              </p>
            </div>
            <div className="about-mission-stats">
              <div className="about-stat">
                <span className="about-stat-value">50+</span>
                <span className="about-stat-label">Schools</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-value">6</span>
                <span className="about-stat-label">Countries</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-value">11</span>
                <span className="about-stat-label">Modules</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-value">14</span>
                <span className="about-stat-label">User Roles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="content-section alt">
        <div className="content-inner">
          <div className="founder-block">
            <div className="founder-image">
              <FounderImage />
            </div>
            <div className="founder-text">
              <p className="eyebrow">CEO &amp; Founder</p>
              <h2>Jonathan Myles</h2>
              <p className="founder-bio">
                Jonathan founded EduMyles after years of working with schools
                across East Africa and witnessing the operational chaos caused
                by fragmented tools. He saw principals juggling 5+ different
                systems, bursars chasing fees through personal M-Pesa accounts,
                and teachers manually compiling report cards in Excel.
              </p>
              <p className="founder-bio">
                His vision was simple: build one platform that does everything a
                school needs — admissions, academics, finance, HR, communication
                — and make it work with the payment methods and curricula that
                East African schools actually use.
              </p>
              <p className="founder-bio">
                Today, EduMyles serves 50+ schools across 6 countries, and
                Jonathan continues to lead product development with a relentless
                focus on simplicity, reliability, and real-world impact.
              </p>
              <div className="founder-location">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>WesternHeights, Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="content-section">
        <div className="content-inner">
          <div className="section-header centered">
            <h2>Our Values</h2>
          </div>
          <div className="features-grid four-col">
            {values.map((v) => (
              <div key={v.title} className="feature-card">
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="content-section alt">
        <div className="content-inner">
          <div className="section-header centered">
            <h2>Our Journey</h2>
            <p className="section-subtitle">From an idea to a platform serving schools across East Africa.</p>
          </div>
          <div className="timeline">
            {milestones.map((m, i) => (
              <div key={i} className="timeline-item">
                <span className="timeline-year">{m.year}</span>
                <div className="timeline-content">
                  <h3>{m.title}</h3>
                  <p>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team CTA */}
      <section className="content-section green-bg">
        <div className="content-inner">
          <div className="section-header centered">
            <h2>Meet the team behind EduMyles</h2>
            <p className="section-subtitle light">
              A passionate team of engineers, educators, and operators building the future of school management in Africa.
            </p>
            <div className="actions centered-actions" style={{ marginTop: "1.5rem" }}>
              <Link className="btn btn-amber" href="/team">
                Meet the Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="final-cta">
        <div className="final-cta-card">
          <h2>Want to join our mission?</h2>
          <p>We&apos;re always looking for passionate people who care about education in Africa.</p>
          <div className="actions centered-actions">
            <Link className="btn btn-primary" href="/contact">
              Get in Touch
            </Link>
            <Link className="btn btn-secondary" href="mailto:info@edumyles.com?subject=Careers%20Inquiry">
              Careers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
