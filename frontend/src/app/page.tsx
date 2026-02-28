import { redirect } from "next/navigation";

export default function HomePage() {
  // Authenticated users are redirected by middleware to their role dashboard
  // Unauthenticated users landing here get sent to login
  redirect("/auth/login");
}
