"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_state: "Login session expired. Please try again.",
  session_failed: "Could not create your session. Please try again.",
  callback_failed: "Authentication failed. Please try again.",
  config_error: "Authentication is not configured yet. Contact your administrator.",
  not_configured: "Authentication service is not configured. Contact your administrator.",
  no_code: "No authorization code received. Please try again.",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorKey = searchParams.get("error");
  const errorMsg = errorKey ? (ERROR_MESSAGES[errorKey] ?? "An unexpected error occurred. Please try again.") : null;
  const returnTo = searchParams.get("returnTo") || searchParams.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      const res = await fetch("/auth/login/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, returnTo }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Login failed. Please try again.");
        return;
      }

      if (data.redirectUrl) {
        router.push(data.redirectUrl);
      } else if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        setFormError("Unexpected server response. Please try again.");
      }
    } catch {
      setFormError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your EduMyles account</p>
        </div>

        {(errorMsg || formError) && (
          <div className="auth-error-banner" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{formError || errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="email" className="auth-label">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.ac.ke"
              className="auth-input"
              required
              autoComplete="email"
              autoFocus
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading
              ? <span className="auth-btn-spinner" aria-label="Signing in…" />
              : "Continue with email"
            }
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <a href="/auth/login/api" className="auth-sso-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Continue with SSO
        </a>

        <p className="auth-footer-text">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="auth-link">Get started free →</Link>
        </p>
      </div>

      <p className="auth-legal">
        By signing in you agree to our{" "}
        <Link href="/terms" className="auth-link">Terms</Link>{" "}and{" "}
        <Link href="/privacy" className="auth-link">Privacy Policy</Link>.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="auth-page"><div className="auth-card auth-loading" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
