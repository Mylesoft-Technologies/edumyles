"use client";

import { useEffect } from "react";

/**
 * Mounts a single IntersectionObserver (+ MutationObserver fallback) on the
 * document body.  Any element that carries a [data-reveal] attribute will gain
 * the "revealed" class once it enters the viewport, triggering the CSS
 * fade-up transition defined in landing-premium.css.
 *
 * The MutationObserver ensures dynamically-loaded components (ssr:false) are
 * picked up after hydration.
 */
export default function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -56px 0px" }
    );

    const observe = () => {
      document
        .querySelectorAll<Element>("[data-reveal]:not(.revealed)")
        .forEach((el) => io.observe(el));
    };

    observe();

    // Catch elements added by lazy-loaded components
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
