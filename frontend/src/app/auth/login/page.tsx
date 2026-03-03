import { redirect } from "next/navigation";
export const metadata = { title: "Sign In — EduMyles" };
export default async function LoginPage() {
  redirect("/admin");
}
