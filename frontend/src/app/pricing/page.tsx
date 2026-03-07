import MarketingPage from "@/components/landing/MarketingPage";

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Pricing"
      title="Simple Pricing that Scales with You"
      subtitle="Transparent plans designed for schools of different sizes."
      sections={[
        { title: "Starter", text: "For smaller schools starting their digital journey with essential workflows." },
        { title: "Standard", text: "For growing schools needing deeper academics, finance, and communication controls." },
        { title: "Enterprise", text: "For multi-campus organizations requiring advanced controls and central oversight." },
      ]}
    />
  );
}
