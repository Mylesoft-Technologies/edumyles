import { redirect } from "next/navigation";
import { cookies } from "next/headers";
export default async function HomePage() {
  const cookieStore = await cookies();
  // Set bypass session if not present
  if (!cookieStore.get("edumyles_session")) {
    const { NextResponse } = await import("next/server");
  }
  redirect("/admin");
}
