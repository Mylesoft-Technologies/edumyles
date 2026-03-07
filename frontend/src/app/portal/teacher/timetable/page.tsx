"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@/hooks/useSSRSafeConvex";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
const DAY_TO_INDEX: Record<(typeof DAYS)[number], number> = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
};
const DEFAULT_TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00"];

export default function TimetablePage() {
    const { user, isLoading: authLoading } = useAuth();
    const slots = useQuery(
        api.modules.timetable.queries.listSlots,
        user?._id ? { teacherId: user._id } : "skip"
    );

    if (authLoading || slots === undefined) return <LoadingSkeleton variant="page" />;

    const slotTimes = Array.from(new Set((slots as any[]).map((slot) => slot.startTime))).sort();
    const timeSlots = slotTimes.length > 0 ? slotTimes : DEFAULT_TIME_SLOTS;

    const getEntry = (day: (typeof DAYS)[number], time: string) =>
        (slots as any[]).find(
            (slot) => slot.dayOfWeek === DAY_TO_INDEX[day] && slot.startTime === time
        );

    return (
        <div className="space-y-6">
            <PageHeader
                title="My Timetable"
                description="Your weekly teaching schedule and room assignments."
            />
            <div className="flex gap-3">
                <Button size="sm" variant="outline" asChild>
                    <Link href="/portal/teacher/attendance">Take Attendance</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                    <Link href="/portal/teacher/assignments/create">Create Assignment</Link>
                </Button>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[800px] grid grid-cols-6 border rounded-lg bg-card text-card-foreground">
                    {/* Header Row */}
                    <div className="p-4 font-bold border-b border-r bg-muted/50">Time</div>
                    {DAYS.map(day => (
                        <div key={day} className="p-4 font-bold border-b border-r last:border-r-0 bg-muted/50 text-center">
                            {day}
                        </div>
                    ))}

                    {/* Time Slots */}
                    {timeSlots.map(time => (
                        <div key={time} className="contents">
                            <div className="p-4 border-b border-r bg-muted/20 font-medium text-sm">
                                {time}
                            </div>
                            {DAYS.map(day => {
                                const entry = getEntry(day, time);
                                return (
                                    <div key={`${day}-${time}`} className="p-2 border-b border-r last:border-r-0 min-h-[100px]">
                                        {entry && (
                                            <div className="h-full bg-primary/10 border-l-4 border-primary p-2 rounded text-xs space-y-1">
                                                <div className="font-bold">{entry.subjectName || entry.subjectId || "Subject"}</div>
                                                <div className="text-muted-foreground">{entry.className || entry.classId || "Class"}</div>
                                                <Badge variant="outline" className="text-[10px] py-0">{entry.room || "Room TBA"}</Badge>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
            {(slots as any[]).length === 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>No Timetable Slots Yet</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Your schedule is empty. Contact administration to publish your timetable.
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
