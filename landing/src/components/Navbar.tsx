"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Globe, Phone, Mail } from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
    dropdown: [
      { label: "EduMyles", href: "/products/edumyles", desc: "Complete school management" },
      { label: "EduRyde", href: "/products/eduryde", desc: "School transport management" },
      { label: "MylesCare", href: "/products/mylescare", desc: "Hospital management system" },
      { label: "MylesCRM", href: "/products/mylescrm", desc: "Customer relationship management" },
      { label: "AgriMyles", href: "/products/agrimyles", desc: "Agricultural management" },
      { label: "Myles AI", href: "/products/myles-ai", desc: "AI-powered intelligence" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    dropdown: [
      { label: "Implementation", href: "/services/implementation", desc: "Setup & data migration" },
      { label: "Custom Development", href: "/services/custom", desc: "Bespoke software solutions" },
      { label: "System Integration", href: "/services/integration", desc: "Connect with existing systems" },
      { label: "AI Consulting", href: "/services/ai-consulting", desc: "Custom analytics models" },
      { label: "Support & Maintenance", href: "/services/support", desc: "SLA-based technical support" },
    ],
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Careers",
    href: "/careers",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <>
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <Link href="/" className="navbar-logo">
          Mylesoft
        </Link>

        <ul className="navbar-links">
          {navItems.map((item) => (
            <li
              key={item.label}
              className={`nav-item ${item.dropdown ? "has-dropdown" : ""}`}
              onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link href={item.href}>
                {item.label}
                {item.dropdown && <ChevronDown size={16} />}
              </Link>
              {item.dropdown && (
                <div className={`nav-dropdown ${openDropdown === item.label ? "open" : ""}`}>
                  {item.dropdown.map((sub) => (
                    <Link key={sub.label} href={sub.href} className="dropdown-item">
                      <span className="dropdown-item-label">{sub.label}</span>
                      <span className="dropdown-item-desc">{sub.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <Link className="navbar-login" href="/contact">
            <Phone size={16} />
            +254 743 993 715
          </Link>
          <Link className="navbar-cta" href="/book-demo">
            Book a Demo
          </Link>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <div key={item.label} className="mobile-nav-group">
              <Link href={item.href} onClick={() => setMobileMenuOpen(false)}>
                {item.label}
              </Link>
              {item.dropdown && (
                <div className="mobile-dropdown">
                  {item.dropdown.map((sub) => (
                    <Link key={sub.label} href={sub.href} onClick={() => setMobileMenuOpen(false)}>
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="mobile-auth-actions">
            <Link href="/contact" className="btn btn-secondary" onClick={() => setMobileMenuOpen(false)}>
              <Phone size={16} />
              Contact Us
            </Link>
            <Link href="/book-demo" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
              Book a Demo
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
