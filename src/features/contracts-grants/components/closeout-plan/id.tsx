"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import BackNavigation from "components/atoms/BackNavigation";
import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";
import { LoadingSpinner } from "components/Loading";
import { useParams } from "next/navigation";
import { useGetSingleCloseOutPlan } from "@/features/contracts-grants/controllers/closeoutPlanController";

export default function CloseOutPlan() {
    const { id } = useParams();

    const { data, isLoading } = useGetSingleCloseOutPlan(id ?? skipToken);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!data?.data) {
        return (
            <main className="space-y-5 p-6">
                <BackNavigation />
                <Card className="p-6">
                    <p className="text-center text-gray-500">No data found</p>
                </Card>
            </main>
        );
    }

    const closeoutPlan = data.data;
    const projectTitle = typeof closeoutPlan.project === 'object' ? closeoutPlan.project.title : closeoutPlan.project;
    const departmentName = typeof closeoutPlan.department === 'object' ? closeoutPlan.department.name : closeoutPlan.department;
    const locationName = typeof closeoutPlan.location === 'object' ? closeoutPlan.location.name : closeoutPlan.location;

    return (
        <main className="space-y-5">
            <BackNavigation />

            <Card className="space-y-10">
                {/* Project Details */}
                <div className="grid grid-cols-3 gap-5">
                    <DescriptionCard
                        label="Project"
                        description={projectTitle || 'N/A'}
                    />

                    <DescriptionCard
                        label="Department"
                        description={departmentName || 'N/A'}
                    />

                    <DescriptionCard
                        label="Location"
                        description={locationName || 'N/A'}
                    />
                </div>

                {/* Close-Out Plan Table */}
                <div className="space-y-5">
                    <h3 className="text-xl font-bold">Close-Out Activities</h3>

                    <div className="overflow-x-auto border border-gray-300 rounded-lg">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm w-20">
                                        TASK NO
                                    </th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm">
                                        KEY TASKS
                                    </th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm w-40">
                                        Responsible (R)
                                    </th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm w-48">
                                        Timeline
                                    </th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm w-32">
                                        STATUS
                                    </th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm w-48">
                                        REMARKS
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Main Header Row */}
                                {closeoutPlan.key_task && (
                                    <tr className="bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-2" colSpan={6}>
                                            <div className="font-bold text-base">{closeoutPlan.key_task}</div>
                                        </td>
                                    </tr>
                                )}

                                {/* Column Headers Row */}
                                <tr className="bg-white">
                                    <td className="border border-gray-300 px-4 py-2"></td>
                                    <td className="border border-gray-300 px-4 py-2"></td>
                                    <td className="border border-gray-300 px-4 py-2 font-semibold text-sm">
                                        DESIGNATION
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-sm">START DATE</span>
                                            <span className="font-semibold text-sm">END DATE</span>
                                        </div>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2"></td>
                                    <td className="border border-gray-300 px-4 py-2"></td>
                                </tr>

                                {/* Activity Rows */}
                                {closeoutPlan.tasks && closeoutPlan.tasks.length > 0 ? (
                                    closeoutPlan.tasks.map((task: any, index: number) => {
                                        // Check if this is a section header (has description but no dates/designation)
                                        const isSectionHeader = task.description && !task.start_date && !task.end_date && !task.designation;

                                        if (isSectionHeader) {
                                            return (
                                                <tr key={task.id || index} className="bg-gray-50">
                                                    <td className="border border-gray-300 px-4 py-2"></td>
                                                    <td className="border border-gray-300 px-4 py-3 font-bold" colSpan={5}>
                                                        {task.description}
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        // Regular activity row
                                        return (
                                            <tr key={task.id || index} className="hover:bg-gray-50">
                                                <td className="border border-gray-300 px-4 py-2 text-center">
                                                    {index + 1}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2 text-sm">
                                                    {task.description || '-'}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2 text-sm">
                                                    {task.designation || '-'}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {task.start_date || task.end_date ? (
                                                        <div className="flex justify-between text-sm">
                                                            <span>{task.start_date ? new Date(task.start_date).toLocaleDateString() : '-'}</span>
                                                            <span>{task.end_date ? new Date(task.end_date).toLocaleDateString() : '-'}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm">-</span>
                                                    )}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {task.status ? (
                                                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                                            task.status === "Completed" || task.status === "COMPLETED"
                                                                ? "bg-green-100 text-green-800" :
                                                            task.status === "In Progress" || task.status === "IN_PROGRESS"
                                                                ? "bg-blue-100 text-blue-800" :
                                                            task.status === "On Hold" || task.status === "ON_HOLD"
                                                                ? "bg-yellow-100 text-yellow-800" :
                                                            task.status === "Pending" || task.status === "PENDING"
                                                                ? "bg-yellow-100 text-yellow-800" :
                                                            "bg-gray-100 text-gray-800"
                                                        }`}>
                                                            {task.status}
                                                        </span>
                                                    ) : (
                                                        <span>-</span>
                                                    )}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2 text-sm">
                                                    {task.remarks || "-"}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                                            No activities found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
        </main>
    );
}
