"use client";

import { useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useGetSingleConsultantReport } from "@/features/consultant-portal/controllers/consultantReportsController";
import { Download, Printer, ArrowLeft, FileText } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FileUploadManager from "@/components/FileUploadManager";
import { CardDescription } from "@/components/ui/card";

export default function ConsultantReportDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const printRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, error } = useGetSingleConsultantReport(
        id as string,
        !!id
    );

    const report = data?.data;

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Consultancy_Report_${new Date().toISOString().split('T')[0]}`,
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
    });

    const getStatusBadge = (status: string) => {
        switch (status.toUpperCase()) {
            case 'APPROVED':
                return <Badge className="bg-green-500 text-white">Approved</Badge>;
            case 'PENDING':
                return <Badge className="bg-yellow-500 text-white">Pending Review</Badge>;
            case 'REJECTED':
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <LoadingSpinner />
                <span className="ml-2">Loading report...</span>
            </div>
        );
    }

    if (error || !report) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    Failed to load report. Please try refreshing the page.
                </AlertDescription>
            </Alert>
        );
    }

    // Extract consultant name
    const consultantName = typeof report.consultant === 'object' && report.consultant !== null
        ? (report.consultant as any).name || (report.consultant as any).title || 'N/A'
        : 'N/A';

    // Extract supervisor name
    const supervisorName = typeof report.supervisor === 'object' && report.supervisor !== null
        ? `${(report.supervisor as any).first_name || ''} ${(report.supervisor as any).last_name || ''}`.trim() || 'N/A'
        : 'N/A';

    // Extract project title
    const projectTitle = typeof report.project === 'object' && report.project !== null
        ? (report.project as any).title || 'N/A'
        : 'N/A';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Report Details</h1>
                        <p className="text-gray-600 mt-1">View your consultancy report</p>
                    </div>
                </div>

                <div className="flex gap-2 no-print">
                    <Button
                        variant="outline"
                        onClick={() => handlePrint()}
                    >
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handlePrint()}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                    </Button>
                </div>
            </div>

            {/* Report Content - Printable */}
            <div ref={printRef}>
                {/* Status Card */}
                <Card className="mb-6 no-print">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Report Status</p>
                                {getStatusBadge(report.status)}
                            </div>
                            {report.approved_datetime && (
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Approved On</p>
                                    <p className="text-sm font-medium">{formatDate(report.approved_datetime)}</p>
                                </div>
                            )}
                            {report.rejected_datetime && (
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Rejected On</p>
                                    <p className="text-sm font-medium">{formatDate(report.rejected_datetime)}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Basic Information */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Consultant</p>
                                <p className="font-medium">{consultantName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Supervisor</p>
                                <p className="font-medium">{supervisorName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Project</p>
                                <p className="font-medium">{projectTitle}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Report Date</p>
                                <p className="font-medium">{formatDate(report.report_date)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Consultancy Period */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Consultancy Period</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Start Date</p>
                                <p className="font-medium">{formatDate(report.consultancy_start_date)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">End Date</p>
                                <p className="font-medium">{formatDate(report.consultancy_end_date)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Duration</p>
                                <p className="font-medium">{report.consultancy_duration} days</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Purpose */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Purpose</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap">{report.purpose}</p>
                    </CardContent>
                </Card>

                {/* Executive Summary */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Executive Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap">{report.executive_summary}</p>
                    </CardContent>
                </Card>

                {/* Activities & Achievements */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Activities, Accomplishments, & Deliverables</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap">{report.achievements}</p>
                    </CardContent>
                </Card>

                {/* Challenges & Recommendations */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Challenges and Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap">{report.challenges_recommendations}</p>
                    </CardContent>
                </Card>

                {/* Supporting Documents */}
                <Card className="mb-6 no-print">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Supporting Documents
                        </CardTitle>
                        <CardDescription>
                            Upload report documents, appendices, and supporting materials
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Original Document from submission */}
                        {report.document && (
                            <div className="mb-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-8 w-8 text-blue-500" />
                                        <div>
                                            <div className="font-semibold">Original Report Document</div>
                                            <div className="text-sm text-gray-600">Submitted with report</div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => window.open(report.document!, '_blank')}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Multiple File Upload Manager */}
                        <FileUploadManager
                            contentType="contract_grants.consultancyreport"
                            objectId={id as string}
                            maxFiles={15}
                            maxFileSize={50}
                            allowedFileTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png', '.ppt', '.pptx']}
                            showCategorySelect={true}
                            defaultCategory="REPORT"
                        />
                    </CardContent>
                </Card>

                {/* Submission Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Submission Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Submitted On</p>
                                <p className="font-medium">{formatDate(report.created_datetime)}</p>
                            </div>
                            {report.updated_datetime && report.updated_datetime !== report.created_datetime && (
                                <div>
                                    <p className="text-sm text-gray-600">Last Updated</p>
                                    <p className="font-medium">{formatDate(report.updated_datetime)}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 no-print">
                <Button
                    variant="outline"
                    onClick={() => router.push('/consultant-portal/reports')}
                >
                    Back to Reports
                </Button>
            </div>
        </div>
    );
}
