import MarketingPage from "@/components/landing/MarketingPage";

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Contact"
      title="Get in Touch with EduMyles"
      subtitle="Our team can help with sales, onboarding, support, and partnerships."
      sections={[
        { title: "Sales", text: "Discuss plans, school fit, and deployment options." },
        { title: "Support", text: "Get help with current setup and workflow questions." },
        { title: "Partnerships", text: "Explore collaboration opportunities and integrations." },
      ]}
    />
  );
}
