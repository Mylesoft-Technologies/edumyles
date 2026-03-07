"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@/hooks/useSSRSafeConvex";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

export default function PartnerProfilePage() {
  const { isLoading } = useAuth();
  const profile = useQuery(api.modules.portal.partner.queries.getPartnerProfile, {});
  const updateProfile = useMutation(api.modules.portal.partner.mutations.updatePartnerProfile);
  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [sponsorshipTerms, setSponsorshipTerms] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setOrganizationName(profile.organizationName ?? "");
      setOrganizationType(profile.organizationType ?? "");
      setContactEmail(profile.contactEmail ?? "");
      setContactPhone(profile.contactPhone ?? "");
      setSponsorshipTerms(profile.sponsorshipTerms ?? "");
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateProfile({
        organizationName: organizationName || undefined,
        organizationType: organizationType || undefined,
        contactEmail: contactEmail || undefined,
        contactPhone: contactPhone || undefined,
        sponsorshipTerms: sponsorshipTerms || undefined,
      });
      setSaved(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || profile === undefined) {
    return <LoadingSkeleton variant="page" />;
  }

  if (!profile) {
    return (
      <div>
        <PageHeader title="Partner profile" description="Organization profile" />
        <p className="text-muted-foreground">No partner profile found for your account.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Partner profile"
        description="Update your organization details and sponsorship terms"
      />

      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="orgName">Organization name</Label>
            <Input
              id="orgName"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="e.g. Acme Foundation"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="orgType">Type</Label>
            <Input
              id="orgType"
              value={organizationType}
              onChange={(e) => setOrganizationType(e.target.value)}
              placeholder="e.g. NGO, corporate, individual"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Contact email</Label>
            <Input
              id="email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone">Contact phone</Label>
            <Input
              id="phone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+254..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="terms">Sponsorship terms (notes)</Label>
            <Textarea
              id="terms"
              value={sponsorshipTerms}
              onChange={(e) => setSponsorshipTerms(e.target.value)}
              placeholder="Optional notes about sponsorship terms"
              rows={3}
              className="mt-1"
            />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
          {saved && (
            <p className="text-sm text-green-600">Profile updated.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
