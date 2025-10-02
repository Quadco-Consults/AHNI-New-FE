"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import BackNavigation from "components/atoms/BackNavigation";
import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";
import { LoadingSpinner } from "components/Loading";
import { useParams } from "next/navigation";
import { useGetSingleCloseOutPlan } from "@/features/contracts-grants/controllers/closeoutPlanController";
import { useMemo } from "react";

export default function CloseOutPlan() {
    const { id } = useParams();

    const { data, isLoading } = useGetSingleCloseOutPlan(id ?? skipToken);

    // Flatten tasks and activities with sequential numbering
    const flattenedActivities = useMemo(() => {
        if (!data?.data.tasks) return [];

        let activityNumber = 1;
        const flattened: any[] = [];

        data.data.tasks.forEach((task) => {
            task.activities.forEach((activity) => {
                flattened.push({
                    taskNo: activityNumber++,
                    keyTask: task.key_task,
                    description: activity.description,
                    designation: activity.designation,
                    startDate: activity.start_date,
                    endDate: activity.end_date,
                    status: activity.status,
                    remarks: activity.remarks,
                });
            });
        });

        return flattened;
    }, [data?.data.tasks]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (data) {
        return (
            <main className="space-y-5">
                <BackNavigation />

                <Card className="space-y-10">
                    <div className="grid grid-cols-3 gap-5">
                        <DescriptionCard
                            label="Project"
                            description={data.data.project.title}
                        />

                        <DescriptionCard
                            label="Department"
                            description={data.data.department.name}
                        />

                        <DescriptionCard
                            label="Location"
                            description={data.data.location.name}
                        />
                    </div>

                    <div className="space-y-5">
                        <h3 className="text-xl font-bold">Close-Out Activities</h3>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">TASK NO</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">KEY TASKS</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">RESPONSIBLE (R)</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">TIMELINE</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">STATUS</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">REMARKS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {flattenedActivities.map((activity, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-2">{activity.taskNo}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <div className="font-semibold text-sm mb-1">{activity.keyTask}</div>
                                                <div className="text-sm text-gray-700">{activity.description}</div>
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">{activity.designation}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <div className="text-sm">
                                                    <div>Start: {new Date(activity.startDate).toLocaleDateString()}</div>
                                                    <div>End: {new Date(activity.endDate).toLocaleDateString()}</div>
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                                    activity.status === "Completed" ? "bg-green-100 text-green-800" :
                                                    activity.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                                                    activity.status === "On Hold" ? "bg-yellow-100 text-yellow-800" :
                                                    "bg-gray-100 text-gray-800"
                                                }`}>
                                                    {activity.status}
                                                </span>
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-sm">{activity.remarks || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>
            </main>
        );
    }
}
