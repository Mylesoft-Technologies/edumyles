"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { School, Users, Building, Truck, TrendingUp, MapPin } from "lucide-react";

interface StatItem {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const stats: StatItem[] = [
  { value: "500+", label: "Schools", icon: <School size={24} /> },
  { value: "250,000+", label: "Students", icon: <Users size={24} /> },
  { value: "100+", label: "Hospitals", icon: <Building size={24} /> },
  { value: "1,000+", label: "Farmers", icon: <Truck size={24} /> },
  { value: "18", label: "Sectors", icon: <TrendingUp size={24} /> },
  { value: "47", label: "Counties", icon: <MapPin size={24} /> },
];

function AnimatedCounter({ value }: { value: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true);
      const targetValue = parseInt(value.replace(/[^0-9]/g, ""));
      const duration = 2000;
      const steps = 60;
      const stepValue = targetValue / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= targetValue) {
          current = targetValue;
          clearInterval(timer);
        }
        setCount(Math.floor(current));
      }, duration / steps);

      return () => clearInterval(timer);
    }
    return undefined;
  }, [inView, hasAnimated, value]);

  return (
    <span ref={ref}>
      {value.includes('+') ? `${count}+` : count}
    </span>
  );
}

export default function ImpactStats() {
  return (
    <section className="impact-stats-section">
      <div className="stats-container">
        <motion.div
          className="stats-grid"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="stat-card"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 25px rgba(199, 150, 57, 0.2)"
              }}
            >
              <div className="stat-icon">
                {stat.icon}
              </div>
              <div className="stat-value">
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
