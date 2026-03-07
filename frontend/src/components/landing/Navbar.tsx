"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Features",
    href: "/features",
    dropdown: [
      { label: "Platform Overview", href: "/features", desc: "Unified school management" },
      { label: "All Modules", href: "/features", desc: "Student, finance, operations & more" },
      { label: "Integrations", href: "/features", desc: "M-Pesa, Airtel Money, Stripe" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  {
    label: "Solutions",
    href: "/solutions",
    dropdown: [
      { label: "Primary Schools", href: "/solutions", desc: "Simplified management for junior schools" },
      { label: "Secondary Schools", href: "/solutions", desc: "Academic & admin management" },
      { label: "School Groups", href: "/solutions", desc: "Multi-campus unified control" },
    ],
  },
  { label: "Resources", href: "/resources" },
  {
    label: "About",
    href: "/about",
    dropdown: [
      { label: "Our Story", href: "/about", desc: "Mission, values & journey" },
      { label: "Team", href: "/team", desc: "Meet the people behind EduMyles" },
      { label: "Blog", href: "/blog", desc: "Insights and updates" },
    ],
  },
  { label: "Concierge", href: "/concierge" },
];

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}

function getUserFromCookie(): UserInfo | null {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie.split("; ").find((c) => c.startsWith("edumyles_user="));
    if (!match) return null;
    return JSON.parse(decodeURIComponent(match.split("=").slice(1).join("=")));
  } catch {
    return null;
  }
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setUser(getUserFromCookie());
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!navRef.current) return;
      if (event.target instanceof Node && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const initials = user
    ? (`${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || (user.email?.[0] ?? "").toUpperCase())
    : "";

  const handleLogout = () => {
    window.location.href = "/auth/logout";
  };

  const handleMobileLogout = () => {
    setMobileMenuOpen(false);
    window.location.href = "/auth/logout";
  };

  return (
    <>
      <div className="announcement-bar">
        <span>Introducing EduMyles - The Operating System for Schools in East Africa</span>
        <span className="badge">NEW</span>
      </div>

      <nav className={`navbar ${scrolled ? "scrolled" : ""}`} ref={navRef}>
        <Link href="/" className="navbar-logo">
          EduMyles
        </Link>

        <ul className="navbar-links">
          {navItems.map((item) => {
            const hasDropdown = Boolean(item.dropdown);
            const isOpen = openDropdown === item.label;

            return (
              <li
                key={item.label}
                className={`nav-item ${hasDropdown ? "has-dropdown" : ""}`}
                onMouseEnter={() => hasDropdown && setOpenDropdown(item.label)}
                onMouseLeave={() => hasDropdown && setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  aria-expanded={hasDropdown ? isOpen : undefined}
                  aria-haspopup={hasDropdown ? "menu" : undefined}
                  onClick={(e) => {
                    if (!hasDropdown) return;
                    if (!isOpen) {
                      e.preventDefault();
                      setOpenDropdown(item.label);
                    }
                  }}
                >
                  {item.label}
                </Link>

                {hasDropdown && item.dropdown && (
                  <div className={`nav-dropdown ${isOpen ? "open" : ""}`} role="menu">
                    <Link href={item.href} className="dropdown-item">
                      <span className="dropdown-item-label">{item.label} Overview</span>
                      <span className="dropdown-item-desc">Open the full {item.label.toLowerCase()} page</span>
                    </Link>
                    {item.dropdown.map((sub) => (
                      <Link key={sub.label} href={sub.href} className="dropdown-item">
                        <span className="dropdown-item-label">{sub.label}</span>
                        <span className="dropdown-item-desc">{sub.desc}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="navbar-actions">
          {user ? (
            <>
              <div className="navbar-user">
                <div className="navbar-avatar">{initials}</div>
                <span className="navbar-username">{user.firstName || user.email.split("@")[0]}</span>
              </div>
              <button type="button" className="navbar-login" onClick={handleLogout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link className="navbar-login" href="/auth/login">
                Log In
              </Link>
              <Link className="navbar-get-started" href="/auth/login">
                Get Started
              </Link>
              <Link className="navbar-signup" href="/auth/login">
                Sign Up Free
              </Link>
            </>
          )}

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${mobileMenuOpen ? "open" : ""}`} />
          </button>
        </div>
      </nav>

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
            {user ? (
              <>
                <div className="mobile-user-info">
                  <div className="navbar-avatar">{initials}</div>
                  <span>{user.firstName || user.email.split("@")[0]}</span>
                </div>
                <button type="button" className="btn btn-secondary" onClick={handleMobileLogout}>
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn-secondary" onClick={() => setMobileMenuOpen(false)}>
                  Log In
                </Link>
                <Link href="/auth/login" className="btn btn-secondary" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
                <Link href="/auth/login" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
