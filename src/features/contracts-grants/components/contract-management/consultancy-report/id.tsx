"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import { useRef, useState, useMemo } from "react";
import BackNavigation from "@/components/atoms/BackNavigation";
import Card from "@/components/Card";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useGetSingleConsultancyReport, useApproveConsultancyReport } from "@/features/contracts-grants/controllers/consultancyReportController";
import { Download, Printer, CheckCircle, FileText } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";
import logoImg from "@/assets/imgs/logo.png";
import { toast } from "sonner";
import { useGetAllConsultancyApplicants } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { useGetAllConsultantManagements } from "@/features/contracts-grants/controllers/consultantManagementController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useQueryClient } from "@tanstack/react-query";

export default function ConsultancyReportDetails() {
    const { id } = useParams();
    const printRef = useRef<HTMLDivElement>(null);
    const [isApproving, setIsApproving] = useState(false);
    const queryClient = useQueryClient();

    const { data, isLoading } = useGetSingleConsultancyReport(
        id ?? skipToken
    );

    const { approveConsultancyReport } = useApproveConsultancyReport(
        (id as string) || ""
    );

    // Fetch consultancy applicants to map consultant names
    const { data: applicantsData } = useGetAllConsultancyApplicants({
        page: 1,
        size: 2000000,
    });

    // Fetch consultant management records to match titles to IDs
    const { data: consultantManagementsData } = useGetAllConsultantManagements({
        page: 1,
        size: 2000000,
        type: "",
    });

    // Fetch users to map supervisor IDs to names
    const { data: usersData } = useGetAllUsers({
        page: 1,
        size: 2000000,
    });

    // Fetch projects to map project IDs to titles
    const { data: projectsData } = useGetAllProjects({
        page: 1,
        size: 2000000,
    });

    // Create mappings for consultant names
    const { consultantIdToName, titleToId } = useMemo(() => {
        const idToName: Record<string, string> = {};
        const titleMap: Record<string, string> = {};

        // Map consultant management ID → applicant name
        const applicants = applicantsData?.data?.results || [];
        applicants.forEach((applicant) => {
            const consultantIds = Array.isArray(applicant.consultants)
                ? applicant.consultants
                : applicant.consultants
                ? [applicant.consultants]
                : applicant.consultancy
                ? [applicant.consultancy]
                : [];

            consultantIds.forEach((consultantId) => {
                if (consultantId && !idToName[consultantId]) {
                    idToName[consultantId] = applicant.name;
                }
            });
        });

        // Map consultant management title → consultant management ID
        const consultantManagements = consultantManagementsData?.data?.results || [];
        consultantManagements.forEach((cm) => {
            if (cm.title && cm.id) {
                titleMap[cm.title] = cm.id;
            }
        });

        return {
            consultantIdToName: idToName,
            titleToId: titleMap,
        };
    }, [applicantsData, consultantManagementsData]);

    // Create mappings for supervisor and project
    const { supervisorIdToName, projectIdToTitle } = useMemo(() => {
        const supervisorMap: Record<string, string> = {};
        const projectMap: Record<string, string> = {};

        // Map user ID → full name
        const users = usersData?.data?.results || [];
        users.forEach((user) => {
            if (user.id) {
                const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
                supervisorMap[user.id] = fullName || 'N/A';
            }
        });

        // Map project ID → project title
        const projects = projectsData?.data?.results || [];
        projects.forEach((project) => {
            if (project.id && project.title) {
                projectMap[project.id] = project.title;
            }
        });

        console.log('📋 Created supervisor/project mappings:', {
            supervisors: Object.keys(supervisorMap).length,
            projects: Object.keys(projectMap).length,
        });

        return {
            supervisorIdToName: supervisorMap,
            projectIdToTitle: projectMap,
        };
    }, [usersData, projectsData]);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Consultancy_Report_${data?.data?.consultant?.title || 'Report'}_${new Date().toISOString().split('T')[0]}`,
        pageStyle: `
            @page {
                size: A4;
                margin: 20mm;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .no-print {
                    display: none !important;
                }
            }
        `,
        onPrintError: (errorLocation, error) => {
            console.error('Print error at:', errorLocation, error);
            toast.error('Failed to print report. Please try again.');
        },
    });

    const handleApproveReport = async () => {
        try {
            setIsApproving(true);
            console.log('Approving report:', id);

            if (!report) {
                toast.error('Report data not loaded. Please refresh and try again.');
                return;
            }

            // Call the approve endpoint
            await approveConsultancyReport();

            // Invalidate queries to refetch the updated report data
            await queryClient.invalidateQueries({
                queryKey: ["consultancyReport", id]
            });
            await queryClient.invalidateQueries({
                queryKey: ["consultancyReports"]
            });

            toast.success("Report approved successfully!");
            console.log('✅ Report approved');
        } catch (error: any) {
            console.error('❌ Failed to approve report:', error);
            console.error('Error details:', error?.response?.data || error?.data);
            const errorMessage = error?.data?.message ?? error?.message ?? "Failed to approve report";
            toast.error(errorMessage);
        } finally {
            setIsApproving(false);
        }
    };

    const handleDownloadPDF = () => {
        console.log('📥 Downloading PDF...');
        console.log('Print ref:', printRef.current);

        if (!printRef.current) {
            toast.error('Report content not ready. Please try again.');
            return;
        }

        toast.info('Opening print dialog. Select "Save as PDF" to download.', {
            duration: 4000,
        });

        handlePrint();
    };

    const handlePrintReport = () => {
        console.log('🖨️ Printing report...');
        console.log('Print ref:', printRef.current);
        console.log('HandlePrint function:', handlePrint);

        if (!printRef.current) {
            toast.error('Report content not ready. Please try again.');
            return;
        }

        // Check if handlePrint is a function
        if (typeof handlePrint === 'function') {
            console.log('Calling handlePrint function...');
            handlePrint();
        } else {
            // Fallback to native print
            console.log('Falling back to native print...');
            toast.info('Opening print dialog...');
            window.print();
        }
    };

    const report = data?.data;

    // Debug: Log full report data and mappings
    console.log('🔍 Full report data:', report);
    console.log('🗺️ All mappings:', {
        projectIdToTitle,
        supervisorIdToName,
        consultantIdToName,
        titleToId,
    });

    // Extract and enrich consultant information
    const consultantName = useMemo(() => {
        if (!report?.consultant) return 'N/A';

        // Get consultant ID or title
        let consultantIdOrTitle = typeof report.consultant === 'object'
            ? (report.consultant as any)?.id || (report.consultant as any)?.title
            : report.consultant;

        // If it's a title, convert to ID
        const isTitle = consultantIdOrTitle && !consultantIdOrTitle.match(/^[0-9a-f-]{36}$/i);
        let consultantId = consultantIdOrTitle;

        if (isTitle && titleToId[consultantIdOrTitle]) {
            consultantId = titleToId[consultantIdOrTitle];
            console.log(`🔄 Details: Converted title "${consultantIdOrTitle}" → ID "${consultantId}"`);
        }

        // Look up the actual person's name
        const personName = consultantId ? consultantIdToName[consultantId] : null;

        console.log('📋 Details page consultant:', {
            original: consultantIdOrTitle,
            consultantId,
            personName,
            found: !!personName,
        });

        return personName || consultantIdOrTitle || 'N/A';
    }, [report?.consultant, consultantIdToName, titleToId]);

    // Extract supervisor name
    const supervisorName = useMemo(() => {
        if (!report?.supervisor) return 'N/A';

        // Check if supervisor is already populated with full_name
        if (typeof report.supervisor === 'object' && (report.supervisor as any)?.full_name) {
            const fullName = (report.supervisor as any).full_name;
            console.log('📋 Details page supervisor (from full_name):', fullName);
            return fullName;
        }

        // Fallback: Extract supervisor ID and map
        let supervisorId = typeof report.supervisor === 'object'
            ? (report.supervisor as any)?.id
            : report.supervisor;

        // Look up supervisor name from mapping
        const name = supervisorId ? supervisorIdToName[supervisorId] : null;

        console.log('📋 Details page supervisor (from mapping):', {
            original: report.supervisor,
            supervisorId,
            mappedName: name,
            found: !!name,
        });

        return name || supervisorId || 'N/A';
    }, [report?.supervisor, supervisorIdToName]);

    // Extract project title
    const projectTitle = useMemo(() => {
        console.log('🔍 Project field check:', {
            hasReport: !!report,
            hasProjectField: report && 'project' in report,
            projectValue: report?.project,
            projectType: typeof report?.project,
        });

        if (!report?.project) {
            console.warn('⚠️ Project field is missing or null in report data');
            return 'N/A';
        }

        // Check if project is already populated with title
        if (typeof report.project === 'object' && (report.project as any)?.title) {
            const title = (report.project as any).title;
            console.log('📋 Details page project (from title):', title);
            return title;
        }

        // Fallback: Extract project ID and map
        let projectId = typeof report.project === 'object'
            ? (report.project as any)?.id
            : report.project;

        // Look up project title from mapping
        const title = projectId ? projectIdToTitle[projectId] : null;

        console.log('📋 Details page project (from mapping):', {
            original: report.project,
            projectId,
            mappedTitle: title,
            found: !!title,
        });

        return title || projectId || 'N/A';
    }, [report?.project, projectIdToTitle]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #printable-report, #printable-report * {
                        visibility: visible;
                    }
                    #printable-report {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>
            <section className="space-y-6">
                {/* Action Buttons - Don't Print */}
                <div className="flex items-center justify-between no-print">
                <BackNavigation />

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handlePrintReport}
                        className="flex items-center gap-2"
                        type="button"
                    >
                        <Printer className="h-4 w-4" />
                        Print Report
                    </Button>
                    <Button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                        type="button"
                    >
                        <Download className="h-4 w-4" />
                        Download PDF
                    </Button>
                    {report?.status !== "APPROVED" && (
                        <Button
                            onClick={handleApproveReport}
                            disabled={isApproving}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="button"
                        >
                            <CheckCircle className="h-4 w-4" />
                            {isApproving ? "Approving..." : "Approve Report"}
                        </Button>
                    )}
                </div>
            </div>

            {/* Printable Report Content */}
            <Card className="bg-white">
                <div ref={printRef} id="printable-report" className="p-8 bg-white">
                    {/* Header with Logo */}
                    <div className="border-b-4 border-red-600 pb-6 mb-8">
                        <div className="text-center mb-4">
                            <div className="flex justify-center mb-4">
                                <Image
                                    src={logoImg}
                                    alt="AHNi Logo"
                                    width={150}
                                    height={60}
                                />
                            </div>
                            <h2 className="text-sm font-semibold text-gray-700">
                                Achieving Health Nigeria Initiative (AHNi)
                            </h2>
                            <p className="text-xs text-gray-600 mt-1">
                                30 Anthony Enahoro Street, Utako District, Abuja, Nigeria
                            </p>
                            <p className="text-xs text-gray-600">
                                Tel: +234.94615555 | Email: AHNiOperations@ahnigeria.org
                            </p>
                            <div className="flex justify-center mt-4">
                                <div className="bg-red-600 text-white px-4 py-2 rounded-lg">
                                    <p className="text-xs font-semibold">Report Date</p>
                                    <p className="text-sm font-bold">{report?.report_date || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-6">
                            <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">
                                Consultancy Report
                            </h1>
                            <div className="h-1 w-32 bg-red-600 mx-auto mt-3"></div>
                            {report?.status === "APPROVED" && (
                                <div className="mt-4 inline-block bg-green-100 border-2 border-green-500 text-green-700 px-6 py-2 rounded-full">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5" />
                                        <span className="font-bold uppercase text-sm">Approved Report</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Report Information Grid */}
                    <div className="grid grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                Project
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                                {projectTitle}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                Consultant
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                                {consultantName}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                Supervisor
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                                {supervisorName}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                Consultancy Period
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                                {report?.consultancy_start_date} to {report?.consultancy_end_date}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                Duration
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                                {report?.consultancy_duration || 'N/A'} {report?.consultancy_duration && parseInt(report.consultancy_duration) > 1 ? 'days' : 'day'}
                            </p>
                        </div>
                    </div>

                    {/* Purpose Section */}
                    <div className="mb-6">
                        <div className="bg-red-600 text-white px-4 py-2 rounded-t-lg">
                            <h2 className="text-lg font-bold uppercase">1. Purpose</h2>
                        </div>
                        <div className="border border-gray-200 border-t-0 rounded-b-lg p-4">
                            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                                {report?.purpose || 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Executive Summary Section */}
                    <div className="mb-6">
                        <div className="bg-red-600 text-white px-4 py-2 rounded-t-lg">
                            <h2 className="text-lg font-bold uppercase">2. Executive Summary</h2>
                        </div>
                        <div className="border border-gray-200 border-t-0 rounded-b-lg p-4">
                            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                                {report?.executive_summary || 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Activities Section */}
                    <div className="mb-6">
                        <div className="bg-red-600 text-white px-4 py-2 rounded-t-lg">
                            <h2 className="text-lg font-bold uppercase">
                                3. Activities, Accomplishments, & Deliverables
                            </h2>
                        </div>
                        <div className="border border-gray-200 border-t-0 rounded-b-lg p-4">
                            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                                {report?.achievements || 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Challenges Section */}
                    <div className="mb-8">
                        <div className="bg-red-600 text-white px-4 py-2 rounded-t-lg">
                            <h2 className="text-lg font-bold uppercase">
                                4. Challenges and Recommendations
                            </h2>
                        </div>
                        <div className="border border-gray-200 border-t-0 rounded-b-lg p-4">
                            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                                {report?.challenges_recommendations || 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Supporting Document Section */}
                    {report?.document && (
                        <div className="mb-8">
                            <div className="bg-red-600 text-white px-4 py-2 rounded-t-lg">
                                <h2 className="text-lg font-bold uppercase">
                                    5. Supporting Document
                                </h2>
                            </div>
                            <div className="border border-gray-200 border-t-0 rounded-b-lg p-4">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-6 w-6 text-green-600" />
                                    <a
                                        href={report.document}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:text-green-700 font-medium hover:underline text-sm"
                                    >
                                        View/Download Document
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="border-t-2 border-gray-300 pt-6 mt-8">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                                    Prepared By
                                </p>
                                <div className="border-t border-gray-400 pt-2 mt-8">
                                    <p className="text-sm font-medium text-gray-900">{consultantName}</p>
                                    <p className="text-xs text-gray-600">Consultant</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                                    Reviewed By
                                </p>
                                <div className="border-t border-gray-400 pt-2 mt-8">
                                    <p className="text-sm font-medium text-gray-900">{supervisorName}</p>
                                    <p className="text-xs text-gray-600">Supervisor</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-8 pt-6 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                                This is a confidential document prepared by Achieving Health Nigeria Initiative (AHNi)
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Generated on {new Date().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </section>
        </>
    );
}
