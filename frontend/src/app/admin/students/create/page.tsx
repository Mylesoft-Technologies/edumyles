"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateStudentPage() {
    const { isLoading, sessionToken } = useAuth();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const classes = useQuery(
        api.modules.sis.queries.listClasses,
        sessionToken ? {} : "skip"
    );

    const createStudent = useMutation(api.modules.sis.mutations.createStudent);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "male",
        classId: "",
        admissionNumber: "",
        guardianName: "",
        guardianEmail: "",
        guardianPhone: "",
        guardianRelationship: "guardian",
    });

    const updateField = (field: string, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            if (!form.firstName || !form.lastName || !form.dateOfBirth) {
                throw new Error("Please fill in all required fields.");
            }

            await createStudent({
                firstName: form.firstName,
                lastName: form.lastName,
                dateOfBirth: form.dateOfBirth,
                gender: form.gender,
                classId: form.classId || undefined,
                admissionNumber: form.admissionNumber || undefined,
                guardianName: form.guardianName || undefined,
                guardianEmail: form.guardianEmail || undefined,
                guardianPhone: form.guardianPhone || undefined,
                guardianRelationship: form.guardianRelationship || undefined,
            });

            router.push("/admin/students");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create student");
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) return <LoadingSkeleton variant="page" />;

    return (
        <div>
            <div className="mb-4">
                <Link href="/admin/students" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" /> Back to Students
                </Link>
            </div>

            <PageHeader
                title="Enroll New Student"
                description="Add a new student to the school"
            />

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                {error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Student Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                                id="firstName"
                                value={form.firstName}
                                onChange={(e) => updateField("firstName", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                                id="lastName"
                                value={form.lastName}
                                onChange={(e) => updateField("lastName", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                            <Input
                                id="dateOfBirth"
                                type="date"
                                value={form.dateOfBirth}
                                onChange={(e) => updateField("dateOfBirth", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender *</Label>
                            <Select value={form.gender} onValueChange={(v) => updateField("gender", v)}>
                                <SelectTrigger id="gender">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="classId">Class</Label>
                            <Select value={form.classId} onValueChange={(v) => updateField("classId", v)}>
                                <SelectTrigger id="classId">
                                    <SelectValue placeholder="Select a class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes?.map((c) => (
                                        <SelectItem key={c._id} value={c._id}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="admissionNumber">Admission Number (auto-generated if empty)</Label>
                            <Input
                                id="admissionNumber"
                                value={form.admissionNumber}
                                onChange={(e) => updateField("admissionNumber", e.target.value)}
                                placeholder="Leave blank to auto-generate"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Guardian Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="guardianName">Guardian Name</Label>
                            <Input
                                id="guardianName"
                                value={form.guardianName}
                                onChange={(e) => updateField("guardianName", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="guardianRelationship">Relationship</Label>
                            <Select
                                value={form.guardianRelationship}
                                onValueChange={(v) => updateField("guardianRelationship", v)}
                            >
                                <SelectTrigger id="guardianRelationship">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="father">Father</SelectItem>
                                    <SelectItem value="mother">Mother</SelectItem>
                                    <SelectItem value="guardian">Guardian</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="guardianEmail">Guardian Email</Label>
                            <Input
                                id="guardianEmail"
                                type="email"
                                value={form.guardianEmail}
                                onChange={(e) => updateField("guardianEmail", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="guardianPhone">Guardian Phone</Label>
                            <Input
                                id="guardianPhone"
                                type="tel"
                                value={form.guardianPhone}
                                onChange={(e) => updateField("guardianPhone", e.target.value)}
                                placeholder="+254..."
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                    <Link href="/admin/students">
                        <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? "Enrolling..." : "Enroll Student"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
