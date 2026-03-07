import MarketingPage from "@/components/landing/MarketingPage";

export default function Page() {
  return (
    <MarketingPage
      eyebrow="About"
      title="Built for Schools Across East Africa"
      subtitle="EduMyles exists to make school management efficient, connected, and accountable."
      sections={[
        { title: "Mission", text: "Empower schools with practical digital infrastructure that improves outcomes." },
        { title: "Vision", text: "A future where every school can operate with modern tools and clarity." },
        { title: "Values", text: "Service, reliability, ownership, and long-term partnership with institutions." },
      ]}
    />
  );
}
