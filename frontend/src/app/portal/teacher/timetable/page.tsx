"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TimetablePage() {
    const { user, isLoading: authLoading } = useAuth();

    if (authLoading) return <LoadingSkeleton variant="page" />;

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00"];

    // Mock timetable data for visualization
    const schedule: any = {
        "Monday-08:00": { subject: "Mathematics", class: "Form 3A", room: "Lab 1" },
        "Tuesday-10:00": { subject: "Physics", class: "Form 4B", room: "Room 204" },
        "Wednesday-14:00": { subject: "Advanced Math", class: "Form 4A", room: "Lab 2" },
        "Friday-09:00": { subject: "Mathematics", class: "Form 3A", room: "Room 105" },
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="My Timetable"
                description="Your weekly teaching schedule and room assignments."
            />

            <div className="overflow-x-auto">
                <div className="min-w-[800px] grid grid-cols-6 border rounded-lg bg-card text-card-foreground">
                    {/* Header Row */}
                    <div className="p-4 font-bold border-b border-r bg-muted/50">Time</div>
                    {days.map(day => (
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
                            {days.map(day => {
                                const entry = schedule[`${day}-${time}`];
                                return (
                                    <div key={`${day}-${time}`} className="p-2 border-b border-r last:border-r-0 min-h-[100px]">
                                        {entry && (
                                            <div className="h-full bg-primary/10 border-l-4 border-primary p-2 rounded text-xs space-y-1">
                                                <div className="font-bold">{entry.subject}</div>
                                                <div className="text-muted-foreground">{entry.class}</div>
                                                <Badge variant="outline" className="text-[10px] py-0">{entry.room}</Badge>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
