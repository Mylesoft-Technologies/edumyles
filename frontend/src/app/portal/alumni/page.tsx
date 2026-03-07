"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@/hooks/useSSRSafeConvex";
import { api } from "@/convex/_generated/api";
import { GraduationCap, FileText, Users, Calendar, Send, Briefcase, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { formatDate, formatRelativeTime } from "@/lib/formatters";

export default function AlumniDashboardPage() {
  const { isLoading, sessionToken } = useAuth();
  const { toast } = useToast();
  const [requestType, setRequestType] = useState<"official" | "unofficial">("official");
  const [requestNotes, setRequestNotes] = useState("");
  const [requesting, setRequesting] = useState(false);

  const profile = useQuery(
    api.modules.portal.alumni.queries.getAlumniProfile,
    sessionToken ? {} : "skip"
  );
  const transcripts = useQuery(
    api.modules.portal.alumni.queries.getTranscripts,
    sessionToken ? {} : "skip"
  );
  const directory = useQuery(
    api.modules.portal.alumni.queries.getAlumniDirectory,
    sessionToken ? {} : "skip"
  );
  const events = useQuery(
    api.modules.portal.alumni.queries.getAlumniEvents,
    sessionToken ? {} : "skip"
  );
  const announcements = useQuery(
    api.modules.portal.alumni.queries.getAlumniAnnouncements,
    sessionToken ? {} : "skip"
  );

  const requestTranscript = useMutation(api.modules.portal.alumni.mutations.requestTranscript);
  const rsvpEvent = useMutation(api.modules.portal.alumni.mutations.rsvpEvent);

  const stats = useMemo(
    () => ({
      graduationYear: profile?.graduationYear ?? "--",
      transcriptRequests: transcripts?.requests?.length ?? 0,
      networkSize: directory?.length ?? 0,
      upcomingEvents: (events ?? []).filter((e) => e.date >= Date.now()).length,
    }),
    [profile, transcripts, directory, events]
  );

  const handleRequestTranscript = async () => {
    setRequesting(true);
    try {
      await requestTranscript({
        type: requestType,
        notes: requestNotes.trim() || undefined,
      });
      setRequestNotes("");
      toast({
        title: "Request submitted",
        description: "Your transcript request is now pending review.",
      });
    } catch (error) {
      toast({
        title: "Request failed",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setRequesting(false);
    }
  };

  const handleRsvp = async (eventId: any) => {
    try {
      const result = await rsvpEvent({ eventId });
      toast({
        title: result?.rsvpd ? "RSVP confirmed" : "RSVP cancelled",
        description: "Your event response has been updated.",
      });
    } catch (error) {
      toast({
        title: "RSVP failed",
        description: String(error),
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <LoadingSkeleton variant="page" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alumni Dashboard"
        description="Access your records and connect with fellow alumni"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Graduation Year" value={stats.graduationYear} icon={GraduationCap} />
        <StatCard label="Transcript Requests" value={stats.transcriptRequests} icon={FileText} />
        <StatCard label="Alumni Network" value={stats.networkSize} icon={Users} />
        <StatCard label="Upcoming Events" value={stats.upcomingEvents} icon={Calendar} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profile ? (
              <>
                <p className="font-medium">{`${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "Alumni User"}</p>
                <p className="text-sm text-muted-foreground">Program: {profile.program || "N/A"}</p>
                <p className="text-sm text-muted-foreground">Graduation Year: {profile.graduationYear}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{profile.jobTitle || "Role not set"} {profile.currentEmployer ? `at ${profile.currentEmployer}` : ""}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.contactEmail || "No contact email"}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No alumni profile found for this account.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Transcript</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={requestType}
                onValueChange={(v: "official" | "unofficial") => setRequestType(v)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="official">Official</SelectItem>
                  <SelectItem value="unofficial">Unofficial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                rows={3}
                value={requestNotes}
                onChange={(e) => setRequestNotes(e.target.value)}
                placeholder="Any special processing notes"
              />
            </div>
            <Button onClick={handleRequestTranscript} disabled={requesting} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              {requesting ? "Submitting..." : "Submit Request"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transcript Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(transcripts?.requests ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No transcript requests yet.</p>
            ) : (
              (transcripts?.requests ?? []).slice(0, 6).map((request: any) => (
                <div key={request._id} className="rounded-lg border p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-medium capitalize">{request.type}</span>
                    <Badge variant={request.status === "ready" ? "default" : "secondary"} className="capitalize">
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(request.createdAt)}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(events ?? []).filter((e) => e.date >= Date.now()).slice(0, 6).map((event: any) => (
              <div key={event._id} className="rounded-lg border p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium">{event.title}</span>
                  <Badge variant="outline">{event.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{event.location}</p>
                <Button size="sm" className="mt-2" variant="outline" onClick={() => handleRsvp(event._id)}>
                  RSVP ({event.rsvps?.length ?? 0})
                </Button>
              </div>
            ))}
            {(events ?? []).filter((e) => e.date >= Date.now()).length === 0 && (
              <p className="text-sm text-muted-foreground">No upcoming events right now.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(announcements ?? []).slice(0, 8).map((notice: any) => (
            <div key={notice._id} className="rounded-lg border p-3">
              <p className="font-medium">{notice.title}</p>
              <p className="text-sm text-muted-foreground">{notice.message}</p>
              <p className="text-xs text-muted-foreground">{formatRelativeTime(notice.createdAt)}</p>
            </div>
          ))}
          {(announcements ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">No announcements available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
