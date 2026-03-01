import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_WORKOS_CLIENT_ID;
  const redirectUri =
    process.env.WORKOS_REDIRECT_URI ||
    "https://edumyles.vercel.app/auth/callback";

  if (!clientId) {
    return NextResponse.json(
      { error: "WorkOS client ID not configured" },
      { status: 500 },
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    provider: "authkit",
    screen_hint: "sign-in",
  });

  return NextResponse.redirect(
    `https://api.workos.com/user-management/authorize?${params.toString()}`,
  );
}
