"use client";

export const dynamic = "force-dynamic";
import LeaveDetails from "@/features/hr/components/leave-management/id/index";

export default function LeaveDetailsPage({ params }: { params: { id: string } }) {
    return <LeaveDetails id={params?.id} />;
}