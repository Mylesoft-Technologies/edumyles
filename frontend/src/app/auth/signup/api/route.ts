import { NextRequest, NextResponse } from "next/server";
import { getSignUpUrl } from "@workos-inc/authkit-nextjs";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Dev bypass — only when ENABLE_DEV_AUTH_BYPASS=true is explicitly set
    if (process.env.ENABLE_DEV_AUTH_BYPASS === "true") {
      console.log("[auth/signup] Dev bypass: redirecting to /admin");
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    const email = req.nextUrl.searchParams.get("email") ?? undefined;
    const plan = req.nextUrl.searchParams.get("plan") ?? undefined;

    // Encode plan in state so the callback can read it
    const statePayload = plan ? Buffer.from(JSON.stringify({ plan })).toString("base64url") : undefined;
    const state = statePayload ? `${crypto.randomBytes(8).toString("hex")}.${statePayload}` : undefined;

    const authUrl = await getSignUpUrl({ loginHint: email, state, returnTo: "/admin" });

    const response = NextResponse.redirect(authUrl);
    if (state) {
      response.cookies.set("workos_state", state.split(".")[0]!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 600,
        path: "/",
      });
    }
    return response;
  } catch (error) {
    console.error("[auth/signup] Failed to build sign-up URL:", error);
    return NextResponse.redirect(
      new URL("/auth/signup?error=not_configured", req.url)
    );
  }
}
