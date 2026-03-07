import MarketingPage from "@/components/landing/MarketingPage";

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Team"
      title="A Product Team Focused on Education Operations"
      subtitle="Engineers, operators, and educators building software that schools can trust."
      sections={[
        { title: "Product and Engineering", text: "Building stable, secure systems for daily institutional use." },
        { title: "Implementation", text: "Supporting rollout, adoption, and training for school teams." },
        { title: "Customer Success", text: "Helping schools continuously improve with data and feedback loops." },
      ]}
    />
  );
}
