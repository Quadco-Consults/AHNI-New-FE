"use client";
import { redirect } from "next/navigation";

export default function HRPage() {
    redirect("/dashboard/hr/leave-management");
    return null;
}