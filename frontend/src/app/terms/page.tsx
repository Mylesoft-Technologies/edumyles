import MarketingPage from "@/components/landing/MarketingPage";

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Legal"
      title="Terms, Privacy, and Platform Policies"
      subtitle="Key legal and platform policy summaries for institutions using EduMyles."
      sections={[
        { title: "Terms of Service", text: "Service usage terms and responsibilities for institutional accounts." },
        { title: "Privacy", text: "How account and operational data is handled and protected." },
        { title: "Security and Compliance", text: "Security posture and operational governance commitments." },
      ]}
    />
  );
}
