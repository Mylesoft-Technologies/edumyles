"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, GraduationCap, Car, Hospital, Users, Tractor, Brain } from "lucide-react";

interface Product {
  icon: React.ReactNode;
  name: string;
  description: string;
  href: string;
  status: "Live" | "In Development" | "Coming Soon";
  color: string;
}

const products: Product[] = [
  {
    icon: <GraduationCap size={32} />,
    name: "EduMyles",
    description: "Complete school management system for educational institutions",
    href: "/products/edumyles",
    status: "Live",
    color: "var(--navy-blue)"
  },
  {
    icon: <Car size={32} />,
    name: "EduRyde",
    description: "School transport management with real-time tracking",
    href: "/products/eduryde",
    status: "Live",
    color: "var(--success-green)"
  },
  {
    icon: <Hospital size={32} />,
    name: "MylesCare",
    description: "Hospital management system for healthcare facilities",
    href: "/products/mylescare",
    status: "Live",
    color: "var(--warning-amber)"
  },
  {
    icon: <Users size={32} />,
    name: "MylesCRM",
    description: "Customer relationship management for businesses",
    href: "/products/mylescrm",
    status: "Live",
    color: "var(--gold)"
  },
  {
    icon: <Tractor size={32} />,
    name: "AgriMyles",
    description: "Agricultural management for farmers and cooperatives",
    href: "/products/agrimyles",
    status: "In Development",
    color: "var(--light-blue)"
  },
  {
    icon: <Brain size={32} />,
    name: "Myles AI",
    description: "AI-powered intelligence across all sectors",
    href: "/products/myles-ai",
    status: "Coming Soon",
    color: "var(--navy-blue)"
  },
];

const getStatusColor = (status: Product["status"]) => {
  switch (status) {
    case "Live":
      return "bg-success-bg text-success";
    case "In Development":
      return "bg-warning-bg text-warning-amber";
    case "Coming Soon":
      return "bg-neutral-100 text-neutral-600";
    default:
      return "bg-neutral-100 text-neutral-600";
  }
};

export default function FeaturedProducts() {
  return (
    <section className="featured-products-section">
      <div className="container">
        <motion.div
          className="section-header centered"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Featured Products</h2>
          <p className="section-subtitle">
            6 powerful solutions designed to transform critical industries across East Africa
          </p>
        </motion.div>

        <motion.div
          className="products-grid"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              className="product-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -8,
                boxShadow: "0 20px 40px rgba(26,57,91,0.15)",
                borderColor: "var(--gold)"
              }}
            >
              <div className="product-icon" style={{ color: product.color }}>
                {product.icon}
              </div>
              
              <div className="product-content">
                <div className="product-header">
                  <h3>{product.name}</h3>
                  <span className={`product-status ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </div>
                
                <p className="product-description">
                  {product.description}
                </p>
                
                <Link href={product.href} className="product-link">
                  Learn More
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="products-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <Link href="/products" className="btn btn-secondary">
            View All 20+ Products
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
