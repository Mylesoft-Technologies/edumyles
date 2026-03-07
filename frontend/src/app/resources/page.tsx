import MarketingPage from "@/components/landing/MarketingPage";

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Resources"
      title="Guides, Demos, and Practical Playbooks"
      subtitle="Learn quickly and roll out confidently with curated learning materials."
      sections={[
        { title: "Implementation Guides", text: "Step-by-step onboarding references for admins, teachers, and finance teams." },
        { title: "Webinars and Demos", text: "Live and recorded walkthroughs for core workflows and best practices." },
        { title: "Knowledge Base", text: "Answers to common operational, billing, and user-management questions." },
      ]}
    />
  );
}
