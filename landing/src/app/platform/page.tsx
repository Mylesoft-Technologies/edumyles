"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PlatformRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // For now, redirect to frontend app on localhost
    // In production, this should be the deployed frontend URL
    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
    window.location.href = `${frontendUrl}/platform`;
  }, [router]);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      flexDirection: "column",
      gap: "1rem"
    }}>
      <div>Redirecting to platform dashboard...</div>
      <div style={{ fontSize: "0.875rem", opacity: 0.7 }}>
        If you're not redirected automatically, 
        <a href="http://localhost:3000/platform" style={{ color: "#007bff" }}>
          click here
        </a>
      </div>
    </div>
  );
}
