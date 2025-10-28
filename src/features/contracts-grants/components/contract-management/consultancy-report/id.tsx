"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import BackNavigation from "components/atoms/BackNavigation";
import Card from "components/Card";
import { LoadingSpinner } from "components/Loading";
import { Button } from "components/ui/button";
import { useParams } from "next/navigation";
import { useGetSingleConsultancyReport } from "@/features/contracts-grants/controllers/consultancyReportController";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Image from "next/image";
import logoPng from "@/assets/svgs/logo-bg.svg";
import { useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

export default function ConsultancyReportDetails() {
    const { id } = useParams();
    const printRef = useRef<HTMLDivElement>(null);

    const { data, isLoading } = useGetSingleConsultancyReport(
        id ?? skipToken
    );

    const [isApproving, setIsApproving] = useState(false);

    // Print function
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `consultancy-report-${data?.data?.consultant?.name || 'report'}`,
        onBeforeGetContent: () => {
            // Hide action buttons before printing
            const actionButtons = document.querySelector('.action-buttons') as HTMLElement;
            if (actionButtons) {
                actionButtons.style.display = 'none';
            }
        },
        onAfterPrint: () => {
            // Restore action buttons after printing
            const actionButtons = document.querySelector('.action-buttons') as HTMLElement;
            if (actionButtons) {
                actionButtons.style.display = '';
            }
        },
    });

    // Download PDF function
    const handleDownloadPDF = async () => {
        try {
            toast.info('Generating PDF...');

            const element = document.getElementById('consultancy-report-content');
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

            const fileName = `consultancy-report-${data?.data?.consultant?.name || 'report'}.pdf`;
            pdf.save(fileName);
            toast.success('PDF downloaded successfully!');
        } catch (error) {
            console.error('PDF generation error:', error);
            toast.error('Failed to generate PDF');
        }
    };

    // Handle approval
    const handleApprove = async () => {
        try {
            setIsApproving(true);
            // TODO: Implement approval API call
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            toast.success('Report approved successfully!');
        } catch (error) {
            toast.error('Failed to approve report');
        } finally {
            setIsApproving(false);
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
                    <p className="text-center text-gray-500">No report data found</p>
                </Card>
            </main>
        );
    }

    const report = data.data;

    // Extract names with fallbacks
    const consultantName = typeof report.consultant === 'object'
        ? `${report.consultant?.first_name || ''} ${report.consultant?.last_name || ''}`.trim() || report.consultant?.name || report.consultant?.title
        : report.consultant || 'N/A';

    const supervisorName = typeof report.supervisor === 'object'
        ? `${report.supervisor?.first_name || ''} ${report.supervisor?.last_name || ''}`.trim() || report.supervisor?.name
        : report.supervisor || 'N/A';

    const projectName = typeof report.project === 'object'
        ? report.project?.title || report.project?.name
        : report.project || 'N/A';

    return (
        <main className="space-y-5">
            <div className="flex justify-between items-center action-buttons">
                <BackNavigation />
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handlePrint}
                        className="flex items-center gap-2"
                    >
                        <Icon icon="ph:printer" />
                        Print Report
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2"
                    >
                        <Icon icon="ph:download" />
                        Download PDF
                    </Button>
                    <Button
                        onClick={handleApprove}
                        disabled={isApproving}
                        className="flex items-center gap-2"
                    >
                        {isApproving ? (
                            <Icon icon="eos-icons:loading" className="animate-spin" />
                        ) : (
                            <Icon icon="ph:check-circle" />
                        )}
                        {isApproving ? 'Approving...' : 'Approve Report'}
                    </Button>
                </div>
            </div>

            <div ref={printRef} id="consultancy-report-content">
                <Card className="space-y-8 print:shadow-none print:border-none">
                    {/* Header with Logo */}
                    <div className="flex flex-col items-center space-y-6 border-b pb-8">
                        <Image
                            src={logoPng}
                            alt="AHNi Logo"
                            width={120}
                            height={120}
                            className="object-contain"
                        />
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold text-red-600">Consultancy Report</h1>
                            <p className="text-lg text-gray-600">Professional Services Completion Report</p>
                            <div className="text-sm text-gray-500">
                                Report Generated: {new Date().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Executive Information Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-red-600 border-b-2 border-red-200 pb-2">
                            Executive Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 mb-2">Consultant Details</h3>
                                    <p className="text-lg font-medium">{consultantName}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 mb-2">Project</h3>
                                    <p className="text-lg">{projectName}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 mb-2">Supervisor</h3>
                                    <p className="text-lg">{supervisorName}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 mb-2">Consultancy Period</h3>
                                    <p className="text-lg">
                                        {report.consultancy_start_date && report.consultancy_end_date
                                            ? `${new Date(report.consultancy_start_date).toLocaleDateString()} - ${new Date(report.consultancy_end_date).toLocaleDateString()}`
                                            : 'N/A'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Purpose Section */}
                    {report.purpose && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-red-600 border-b-2 border-red-200 pb-2">
                                Purpose of Consultancy
                            </h2>
                            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                    {report.purpose}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Executive Summary Section */}
                    {report.executive_summary && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-red-600 border-b-2 border-red-200 pb-2">
                                Executive Summary
                            </h2>
                            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                    {report.executive_summary}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Activities and Achievements Section */}
                    {report.achievements && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-red-600 border-b-2 border-red-200 pb-2">
                                Activities, Accomplishments & Deliverables
                            </h2>
                            <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                    {report.achievements}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Challenges and Recommendations Section */}
                    {report.challenges_recommendations && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-red-600 border-b-2 border-red-200 pb-2">
                                Challenges & Recommendations
                            </h2>
                            <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                    {report.challenges_recommendations}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Signature Section */}
                    <div className="space-y-6 pt-8 border-t">
                        <h2 className="text-xl font-bold text-red-600 border-b-2 border-red-200 pb-2">
                            Approvals & Signatures
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="border-t-2 border-gray-400 pt-2">
                                    <p className="font-semibold">Consultant Signature</p>
                                    <p className="text-sm text-gray-600">{consultantName}</p>
                                    <p className="text-sm text-gray-500">Date: _______________</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="border-t-2 border-gray-400 pt-2">
                                    <p className="font-semibold">Supervisor Approval</p>
                                    <p className="text-sm text-gray-600">{supervisorName}</p>
                                    <p className="text-sm text-gray-500">Date: _______________</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center py-6 border-t text-sm text-gray-500">
                        <p>© 2024 AHNi - Aid for Health Network International</p>
                        <p>This document is confidential and proprietary</p>
                    </div>
                </Card>
            </div>
        </main>
    );
}
