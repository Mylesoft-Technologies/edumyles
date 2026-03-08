"use client";

import React from "react";
import { LinearDashboard } from "@/components/linear/LinearDashboard";
import { initializeLinearFromEnv } from "@/lib/linear";

// Initialize Linear on component mount
if (typeof window !== 'undefined') {
  initializeLinearFromEnv();
}

export default function LinearPage() {
  const handleCreateIssue = () => {
    // Open Linear create issue form
    window.open("https://linear.app/new", "_blank");
  };

  const handleViewIssue = (issue: any) => {
    window.open(`https://linear.app/issue/${issue.id}`, "_blank");
  };

  return (
    <LinearDashboard 
      onCreateIssue={handleCreateIssue}
      onViewIssue={handleViewIssue}
    />
  );
}
