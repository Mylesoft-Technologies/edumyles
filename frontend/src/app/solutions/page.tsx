import MarketingPage from "@/components/landing/MarketingPage";

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Solutions"
      title="Solutions Built for Real School Operations"
      subtitle="Choose the deployment model and workflows that fit your institution."
      sections={[
        { title: "Primary and Secondary", text: "Academic and administrative workflows tailored to day-to-day school operations." },
        { title: "Multi-Campus", text: "Unified oversight with role-based control across branches and teams." },
        { title: "Partners and Integrators", text: "APIs and workflows for implementation partners and ecosystem providers." },
      ]}
    />
  );
}
