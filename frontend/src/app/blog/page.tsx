import MarketingPage from "@/components/landing/MarketingPage";

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Blog"
      title="Insights from School Operations"
      subtitle="Practical thinking on finance, academics, administration, and digital transformation."
      sections={[
        { title: "Operations", text: "Improving efficiency, compliance, and administrative reliability." },
        { title: "Academics", text: "Using workflows and data to support better learning outcomes." },
        { title: "Finance", text: "Collections, reconciliation, and communication strategies for fee operations." },
      ]}
    />
  );
}
