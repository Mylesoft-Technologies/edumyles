import MarketingPage from "@/components/landing/MarketingPage";

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Concierge"
      title="Talk to an Education Technology Specialist"
      subtitle="Book a guided session to map EduMyles to your school workflows."
      sections={[
        { title: "Discovery Session", text: "We review your structure, current tools, and operational goals." },
        { title: "Live Walkthrough", text: "You get a guided demo tailored to your school model." },
        { title: "Rollout Plan", text: "Receive a recommended implementation sequence and adoption checklist." },
      ]}
    />
  );
}
