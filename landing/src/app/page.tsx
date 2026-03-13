"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ImpactStats from "@/components/ImpactStats";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";

// Frontend app URL for authentication
const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL || "https://edumyles.vercel.app";

function LandingPageContent() {
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const searchParams = useSearchParams();

  // Handle auth errors and success from URL parameters
  useEffect(() => {
    const error = searchParams.get("auth_error");
    const success = searchParams.get("auth_success");
    
    if (error) {
      const decoded = decodeURIComponent(error);
      const safeError = decoded.replace(/[<>]/g, "");
      setAuthError(safeError);
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("auth_error");
      window.history.replaceState({}, "", newUrl.toString());
    }
    
    if (success === "true") {
      setAuthSuccess("Authentication successful! You are now logged in.");
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("auth_success");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [searchParams]);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Impact Stats Section */}
      <ImpactStats />

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header centered">
            <h2>How It Works</h2>
            <p className="section-subtitle">
              Get started with Mylesoft in three simple steps
            </p>
          </div>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Book a Demo</h3>
              <p>Schedule a free personalized demonstration tailored to your organization's needs</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Customize</h3>
              <p>We'll configure the system to match your workflows and requirements</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Go Live</h3>
              <p>Launch with training, support, and ongoing assistance from our team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header centered">
            <h2>Trusted by Leading Organizations</h2>
            <p className="section-subtitle">
              See what our customers across East Africa are saying about Mylesoft
            </p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                "Mylesoft transformed our entire school operations. We've seen a 40% improvement in efficiency."
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>John Kamau</h4>
                  <p>Principal, Nairobi Academy</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                "The AI-powered insights have helped us make better decisions for our hospital management."
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Dr. Sarah Ochieng</h4>
                  <p>Director, MylesCare Hospital</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                "Finally, a solution built for African businesses. The payment integrations are seamless."
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Michael Mutiso</h4>
                  <p>CEO, AgriTech Kenya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Myles AI Spotlight */}
      <section className="ai-spotlight-section">
        <div className="container">
          <div className="section-header centered">
            <h2>Powered by Myles AI</h2>
            <p className="section-subtitle light">
              Africa's intelligence engine supporting local languages and contexts
            </p>
          </div>
          
          <div className="ai-features">
            <div className="ai-feature">
              <h3>African Language Support</h3>
              <p>Support for Swahili, Kinyarwanda, Luganda, and other local languages</p>
            </div>
            <div className="ai-feature">
              <h3>Industry-Specific Models</h3>
              <p>AI trained on African educational, healthcare, and agricultural data</p>
            </div>
            <div className="ai-feature">
              <h3>Local Context Awareness</h3>
              <p>Understands local regulations, curricula, and business practices</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="trusted-by-section">
        <div className="container">
          <div className="trusted-label">Trusted by leading organizations across East Africa</div>
          <div className="trusted-logos">
            {[
              "Nairobi Academy", "Kampala International", "Dar es Salaam School",
              "Addis Ababa Academy", "Kigali Heights", "Mombasa Scholars",
              "Entebbe Prep", "Arusha International", "Bujumbura School"
            ].map((logo, index) => (
              <div key={index} className="school-logo">{logo}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="blog-preview-section">
        <div className="container">
          <div className="section-header centered">
            <h2>Latest Insights</h2>
            <p className="section-subtitle">
              Thought leadership and best practices from the Mylesoft team
            </p>
          </div>
          
          <div className="blog-grid">
            <div className="blog-card">
              <div className="blog-category">Education</div>
              <h3>The Future of School Management in Africa</h3>
              <p>How AI is transforming educational administration across the continent...</p>
              <a href="/blog/future-school-management" className="blog-link">Read More →</a>
            </div>
            
            <div className="blog-card">
              <div className="blog-category">Healthcare</div>
              <h3>Digital Transformation in Healthcare</h3>
              <p>Lessons from implementing hospital management systems in East Africa...</p>
              <a href="/blog/healthcare-transformation" className="blog-link">Read More →</a>
            </div>
            
            <div className="blog-card">
              <div className="blog-category">Agriculture</div>
              <h3>Tech-Enabled Farming for Smallholders</h3>
              <p>How digital tools are helping small-scale farmers increase productivity...</p>
              <a href="/blog/agriculture-tech" className="blog-link">Read More →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Organisation?</h2>
            <p>Join 500+ schools, 100+ hospitals, and 1,000+ businesses already using Mylesoft</p>
            <div className="cta-actions">
              <a href="/book-demo" className="btn btn-primary">Book a Free Demo</a>
              <a href="/contact" className="btn btn-secondary">Contact Us</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LandingPageContent />
    </Suspense>
  );
}
