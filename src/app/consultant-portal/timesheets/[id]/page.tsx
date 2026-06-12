"use client";

import { useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  FileText,
  Printer,
  Download,
} from "lucide-react";
import { useTimesheetDetail } from "@/features/consultant-portal/controllers/timesheetController";
import { LoadingSpinner } from "@/components/Loading";
import { useReactToPrint } from "react-to-print";

export default function TimesheetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const timesheetId = params.id as string;
  const printRef = useRef<HTMLDivElement>(null);

  const { data: timesheetData, isLoading, error } = useTimesheetDetail(timesheetId);
  const timesheet = timesheetData?.data;

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Timesheet_${new Date().toISOString().split('T')[0]}`,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-500 text-white">Approved</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-500 text-white">Pending Review</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-blue-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading timesheet...</span>
      </div>
    );
  }

  if (error || !timesheet) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load timesheet. It may not exist or you don't have permission to view it.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Timesheet Report</h1>
            <p className="text-gray-600 mt-1">View your submitted timesheet</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handlePrint()}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={() => handlePrint()}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Printable Content */}
      <div ref={printRef}>
        {/* Organization Header - Visible in Print */}
        <div className="mb-6 text-center border-b-2 pb-4 print:block hidden">
          <h1 className="text-2xl font-bold text-gray-900">Achieving Health Nigeria Initiative (AHNI)</h1>
          <p className="text-xs text-gray-600 mt-1">No. 30 Anthony Enahoro Street, Utako District, Abuja, Nigeria</p>
          <p className="text-xs text-gray-600">Tel: +234-09-4615555 / +234-09-461500 | Fax: +234-09-4615511 | Email: info@ahnigeria.org.ng</p>
          <h2 className="text-xl font-semibold text-gray-800 mt-3">CONSULTANT TIMESHEET</h2>
        </div>

        {/* Status Card */}
        <Card className="mb-6 no-print">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(timesheet.status)}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  {getStatusBadge(timesheet.status)}
                </div>
              </div>
              {timesheet.approved_datetime && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Approved On</p>
                  <p className="font-medium">{formatDate(timesheet.approved_datetime)}</p>
                </div>
              )}
              {timesheet.submitted_datetime && !timesheet.approved_datetime && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Submitted On</p>
                  <p className="font-medium">{formatDate(timesheet.submitted_datetime)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rejection Alert */}
        {timesheet.status === 'rejected' && timesheet.rejection_reason && (
          <Alert variant="destructive" className="mb-6 no-print">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-semibold">Timesheet Rejected</div>
              <div className="text-sm mt-1">{timesheet.rejection_reason}</div>
            </AlertDescription>
          </Alert>
        )}

        {/* Period Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-semibold text-lg">{formatDate(timesheet.start_date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="font-semibold text-lg">{formatDate(timesheet.end_date)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Work Performed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-600">Total Hours:</span>
                <span className="font-bold text-2xl text-blue-600">{timesheet.total_hours}</span>
              </div>
            </div>

            {timesheet.entries && timesheet.entries.length > 0 ? (
              <div className="space-y-3 mt-4">
                {timesheet.entries.map((entry, index) => (
                  <div key={entry.id} className="border-l-4 border-green-500 pl-4 py-2">
                    <div className="font-semibold text-lg mb-1">{entry.activity_name}</div>
                    {entry.description && (
                      <p className="text-gray-700 whitespace-pre-wrap">{entry.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>Hours: {entry.hours_worked}</span>
                      {entry.date && <span>Date: {formatDate(entry.date)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 italic">No activity details available</p>
            )}
          </CardContent>
        </Card>

        {/* Approver Information */}
        {timesheet.approver && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Supervisor/Approver
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{timesheet.approver.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{timesheet.approver.email}</p>
                </div>
              </div>
              {timesheet.approved_by && timesheet.approved_datetime && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">Approved By</p>
                  <p className="font-semibold">{timesheet.approved_by.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    on {formatDate(timesheet.approved_datetime)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer - Visible in Print */}
        <div className="mt-8 pt-4 border-t text-center text-xs text-gray-500 print:block hidden">
          <p>This is a computer-generated document. Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p className="mt-1">Achieving Health Nigeria Initiative - Consultant Portal</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 no-print">
        <Button variant="outline" onClick={() => router.push('/consultant-portal/timesheets')}>
          Back to Timesheets
        </Button>
      </div>
    </div>
  );
}
