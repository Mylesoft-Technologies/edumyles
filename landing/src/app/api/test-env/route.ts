import { NextResponse } from "next/server";

export async function GET() {
  const env = {
    hasWorkOSApiKey: !!process.env.WORKOS_API_KEY,
    hasWorkOSClientId: !!process.env.NEXT_PUBLIC_WORKOS_CLIENT_ID,
    hasWorkOSRedirectUri: !!process.env.WORKOS_REDIRECT_URI,
    hasConvexUrl: !!process.env.NEXT_PUBLIC_CONVEX_URL,
    workOSRedirectUri: process.env.WORKOS_REDIRECT_URI,
    publicWorkOSRedirectUri: process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI,
    nodeEnv: process.env.NODE_ENV,
  };

  return NextResponse.json(env);
}
