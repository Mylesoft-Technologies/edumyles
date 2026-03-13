"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, CheckCircle, Star, Users, Globe } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="eyebrow">East Africa's Leading AI-Powered Software Company</div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Transforming Education, Healthcare, Agriculture & Business Across Africa
        </motion.h1>

        <motion.p
          className="subtext"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          20+ AI-powered solutions built for East African businesses and institutions. 
          Join 500+ schools, 100+ hospitals, and 1,000+ farmers already using Mylesoft to drive growth.
        </motion.p>

        <motion.div
          className="actions"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href="/book-demo" className="btn btn-primary">
            Book a Free Demo
            <ArrowRight size={16} />
          </Link>
          <Link href="/products" className="btn btn-secondary">
            Explore Products
          </Link>
        </motion.div>

        <motion.div
          className="trust-signals"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="trust-signal">
            <CheckCircle size={16} />
            <span>Free setup & training</span>
          </div>
          <div className="trust-signal">
            <CheckCircle size={16} />
            <span>14-day money-back guarantee</span>
          </div>
          <div className="trust-signal">
            <CheckCircle size={16} />
            <span>24/7 Kenyan support</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="hero-visual"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="dashboard-mockup">
          <div className="mockup-header">
            <div className="mockup-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="mockup-title">Mylesoft Dashboard</div>
          </div>
          <div className="mockup-body">
            <div className="mockup-sidebar">
              <div className="mockup-sidebar-item active"></div>
              <div className="mockup-sidebar-item"></div>
              <div className="mockup-sidebar-item"></div>
              <div className="mockup-sidebar-item"></div>
            </div>
            <div className="mockup-main">
              <div className="mockup-stat-row">
                <div className="mockup-stat-card c1"></div>
                <div className="mockup-stat-card c2"></div>
                <div className="mockup-stat-card c3"></div>
              </div>
              <div className="mockup-chart"></div>
              <div className="mockup-table">
                <div className="mockup-table-row"></div>
                <div className="mockup-table-row"></div>
                <div className="mockup-table-row"></div>
                <div className="mockup-table-row"></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
