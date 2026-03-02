import { NextResponse } from "next/server";
import crypto from "crypto";

const THIRTY_DAYS_SECONDS = 30 * 24 * 60 * 60;

export async function GET(request: Request) {
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const role = "master_admin";

  const response = NextResponse.redirect(new URL("/platform", request.url));

  response.cookies.set("edumyles_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: THIRTY_DAYS_SECONDS,
    path: "/",
  });

  response.cookies.set("edumyles_role", role, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: THIRTY_DAYS_SECONDS,
    path: "/",
  });

  return response;
}
