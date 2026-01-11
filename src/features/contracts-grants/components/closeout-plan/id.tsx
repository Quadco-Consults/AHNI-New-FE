"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import BackNavigation from "@/components/atoms/BackNavigation";
import Card from "@/components/Card";
import DescriptionCard from "@/components/DescriptionCard";
import { LoadingSpinner } from "@/components/Loading";
import { useParams } from "next/navigation";
import { useGetSingleCloseOutPlan, useUpdateTaskStatus } from "@/features/contracts-grants/controllers/closeoutPlanController";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Image from "next/image";
import logoPng from "@/assets/svgs/logo-bg.svg";
import { useState } from "react";

export default function CloseOutPlan() {
    const { id } = useParams();

    const { data, isLoading, refetch } = useGetSingleCloseOutPlan(id ?? skipToken);
    const { updateTaskStatus } = useUpdateTaskStatus();
    const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

    // Handle status change
    const handleStatusChange = async (taskId: string, newStatus: string) => {
        try {
            setUpdatingTaskId(taskId);
            console.log('📝 Updating task status:', { taskId, newStatus });

            const response = await updateTaskStatus(id as string, taskId, newStatus);
            console.log('✅ Backend response:', response);

            // Check if the status was actually updated
            if (response?.data?.status === newStatus) {
                toast.success("Status updated successfully");
            } else {
                console.warn('⚠️ Backend returned different status:', {
                    sent: newStatus,
                    received: response?.data?.status
                });
                toast.warning("Status update request sent, but backend returned old value");
            }

            // Refetch the data to show updated status
            await refetch();
        } catch (error: any) {
            console.error('❌ Status update error:', error);
            toast.error(error?.message || "Failed to update status");
        } finally {
            setUpdatingTaskId(null);
        }
    };

    // Download PDF function
    const handleDownloadPDF = async () => {
        try {
            toast.info('Generating PDF...');

            const element = document.getElementById('closeout-plan-content');
            if (!element) {
                toast.error('Content not found');
                return;
            }

            // Hide action buttons before capturing
            const actionButtons = document.querySelector('.action-buttons') as HTMLElement;
            const originalDisplay = actionButtons?.style.display;
            if (actionButtons) {
                actionButtons.style.display = 'none';
            }

            // Wait for DOM updates
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
            });

            // Restore action buttons
            if (actionButtons) {
                actionButtons.style.display = originalDisplay || '';
            }

            if (!canvas || canvas.width === 0 || canvas.height === 0) {
                toast.error('Failed to capture content for PDF');
                return;
            }

            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pageHeight = 297; // A4 height in mm

            if (imgHeight <= pageHeight) {
                // Single page
                pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
            } else {
                // Multiple pages
                let sourceHeight = canvas.height;
                let position = 0;
                let pageNumber = 1;

                while (sourceHeight > 0) {
                    const pageCanvas = document.createElement('canvas');
                    const pageContext = pageCanvas.getContext('2d');

                    pageCanvas.width = canvas.width;
                    pageCanvas.height = Math.min(canvas.height * pageHeight / imgHeight, sourceHeight);

                    if (pageContext) {
                        pageContext.drawImage(
                            canvas,
                            0, position,
                            canvas.width, pageCanvas.height,
                            0, 0,
                            pageCanvas.width, pageCanvas.height
                        );

                        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);

                        if (pageNumber > 1) {
                            pdf.addPage();
                        }

                        const pageImgHeight = (pageCanvas.height * imgWidth) / pageCanvas.width;
                        pdf.addImage(pageImgData, 'JPEG', 0, 0, imgWidth, pageImgHeight);

                        position += pageCanvas.height;
                        sourceHeight -= pageCanvas.height;
                        pageNumber++;
                    }
                }
            }

            const fileName = `closeout-plan-${data?.data?.project?.title || 'report'}.pdf`;
            pdf.save(fileName);
            toast.success('PDF downloaded successfully!');
        } catch (error) {
            console.error('PDF generation error:', error);
            toast.error('Failed to generate PDF');
        }
    };

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

    // Debug: Log the closeout plan data structure
    console.log('Closeout Plan Full Data:', closeoutPlan);
    console.log('Tasks:', closeoutPlan.tasks);
    if (closeoutPlan.tasks && closeoutPlan.tasks.length > 0) {
        console.log('First Task Fields:', Object.keys(closeoutPlan.tasks[0]));
        console.log('First Task Data:', closeoutPlan.tasks[0]);
    }

    return (
        <main className="space-y-5">
            <div className="flex justify-between items-center action-buttons">
                <BackNavigation />
                <Button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2"
                >
                    <Download size={16} />
                    Download PDF
                </Button>
            </div>

            <div id="closeout-plan-content">
                <Card className="space-y-10">
                    {/* Header with Logo */}
                    <div className="flex flex-col items-center space-y-4 border-b pb-6">
                        <Image
                            src={logoPng}
                            alt="Company Logo"
                            width={120}
                            height={120}
                            className="object-contain"
                        />
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-red-600">Close-Out Plan</h1>
                            <p className="text-gray-600 mt-2">Pre Closeout and Close Out Activities</p>
                        </div>
                    </div>
                {/* Project Details */}
                <div className="grid grid-cols-2 gap-5">
                    <DescriptionCard
                        label="Project"
                        description={projectTitle || 'N/A'}
                    />

                    <DescriptionCard
                        label="Location"
                        description={locationName || 'N/A'}
                    />

                    <DescriptionCard
                        label="Department"
                        description={departmentName || 'N/A'}
                    />

                    <DescriptionCard
                        label="Created Date"
                        description={closeoutPlan.created_datetime
                            ? new Date(closeoutPlan.created_datetime).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })
                            : 'N/A'
                        }
                    />
                </div>

                {/* Close-Out Plan Table */}
                <div className="space-y-5">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-red-600">Pre Closeout and Close Out Activities</h3>
                        {closeoutPlan.key_task && (
                            <span className="text-sm text-gray-600 font-semibold">
                                Section: {closeoutPlan.key_task}
                            </span>
                        )}
                    </div>

                    <div className="overflow-x-auto border border-gray-300 rounded-lg">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-red-50 border-b-2 border-red-600">
                                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm w-20 text-red-700">
                                        TASK NO
                                    </th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm text-red-700">
                                        KEY TASKS
                                    </th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm w-40 text-red-700">
                                        Responsible (R)
                                    </th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm w-48 text-red-700">
                                        Timeline
                                    </th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm w-32 text-red-700">
                                        STATUS
                                    </th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm w-48 text-red-700">
                                        REMARKS
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Main Header Row */}
                                {closeoutPlan.key_task && (
                                    <tr className="bg-red-100">
                                        <td className="border border-gray-300 px-4 py-2" colSpan={6}>
                                            <div className="font-bold text-base text-red-800">{closeoutPlan.key_task}</div>
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
                                                    {/* Interactive dropdown for screen */}
                                                    <select
                                                        value={task.status || "Pending"}
                                                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                        disabled={updatingTaskId === task.id}
                                                        className={`print:hidden w-full px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                                                            task.status === "Completed" || task.status === "COMPLETED"
                                                                ? "bg-green-100 text-green-800" :
                                                            task.status === "In Progress" || task.status === "IN_PROGRESS"
                                                                ? "bg-blue-100 text-blue-800" :
                                                            task.status === "On Hold" || task.status === "ON_HOLD"
                                                                ? "bg-yellow-100 text-yellow-800" :
                                                            task.status === "Pending" || task.status === "PENDING"
                                                                ? "bg-yellow-100 text-yellow-800" :
                                                            "bg-gray-100 text-gray-800"
                                                        }`}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Completed">Completed</option>
                                                        <option value="On Hold">On Hold</option>
                                                    </select>
                                                    {/* Static badge for PDF */}
                                                    <span className={`hidden print:inline-block px-2 py-1 rounded text-xs font-medium ${
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
                                                        {task.status || "Pending"}
                                                    </span>
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
            </div>
        </main>
    );
}