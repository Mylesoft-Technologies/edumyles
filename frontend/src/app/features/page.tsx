import MarketingPage from "@/components/landing/MarketingPage";

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Features"
      title="Powerful Modules for Every School"
      subtitle="Everything from admissions to alumni in one connected system."
      sections={[
        { title: "Student Lifecycle", text: "Admissions, enrollment, classes, attendance, grading, and report cards in one workflow." },
        { title: "Finance and Billing", text: "Flexible invoicing, fee plans, mobile money collections, and real-time payment visibility." },
        { title: "Operations and HR", text: "Staff management, payroll support, timetables, and process automation across departments." },
      ]}
    />
  );
}
