import { NextRequest, NextResponse } from "next/server";
import { WorkOS } from "@workos-inc/node";


export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const redirectUri = process.env.WORKOS_REDIRECT_URI ?? "https://edumyles.vercel.app/auth/callback";

    const authUrl = workos.userManagement.getAuthorizationUrl({
      clientId,
      redirectUri,
      loginHint: email,
    });

    return NextResponse.json({ authUrl });
  } catch (err) {
    console.error("Auth error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
