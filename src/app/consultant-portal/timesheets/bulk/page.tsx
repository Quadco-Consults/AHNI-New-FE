"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Upload,
  Download,
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
  Info,
  Calendar
} from "lucide-react";
import { useUploadBulkTimesheetTemplate } from "@/features/consultant-portal/controllers/timesheetController";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";
import ConsultantAxiosWithToken from "@/constants/api_management/ConsultantHttpHelper";

export default function BulkTimesheetUploadPage() {
  const router = useRouter();
  const { mutate: uploadTemplate, isPending } = useUploadBulkTimesheetTemplate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadTemplate = async () => {
    // Validate dates before downloading
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date must be before end date");
      return;
    }

    setIsDownloading(true);
    try {
      const response = await ConsultantAxiosWithToken.get(
        `contract-grants/consultant-portal/timesheets/download-template/?start_date=${startDate}&end_date=${endDate}`,
        {
          responseType: 'blob',
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Extract filename from content-disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'timesheet_template.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Template downloaded successfully!');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message ||
                         error?.message ||
                         'Failed to download template';
      toast.error(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!templateFile) {
      newErrors.templateFile = "Please upload the filled template";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append('file', templateFile!);
    formData.append('submit_immediately', 'true');

    uploadTemplate(formData, {
      onSuccess: (data) => {
        const entryCount = data.data?.entries?.length || 0;
        toast.success(data.message || `Timesheet submitted with ${entryCount} entries!`);
        router.push('/consultant-portal/timesheets');
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "Failed to upload timesheet";
        toast.error(errorMessage);
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (Excel files only)
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];

      if (!allowedTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        setErrors({ ...errors, templateFile: "Only Excel files (.xlsx, .xls) are allowed" });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ ...errors, templateFile: "File size must be less than 10MB" });
        return;
      }

      setTemplateFile(file);
      setErrors({ ...errors, templateFile: "" });
      toast.success(`File selected: ${file.name}`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Bulk Timesheet Upload</h1>
          <p className="text-gray-600 mt-1">Upload multiple timesheet entries using Excel template</p>
        </div>
      </div>

      {/* Instructions Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <div className="font-semibold mb-2">How it works</div>
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li>Select the start and end dates for your timesheet period</li>
            <li>Download the Excel template with all working days in that period</li>
            <li>Fill in the green-highlighted columns:
              <ul className="ml-6 mt-1 list-disc">
                <li><span className="font-semibold text-green-700">"Activity"</span> - What you worked on</li>
                <li><span className="font-semibold text-green-700">"Description"</span> - Additional details (optional)</li>
                <li><span className="font-semibold text-green-700">"Hours Worked"</span> - Hours spent (default 8)</li>
              </ul>
            </li>
            <li>Remove rows for days you didn't work (optional)</li>
            <li>Save the Excel file</li>
            <li>Upload the filled template below</li>
          </ol>
        </AlertDescription>
      </Alert>

      {/* Step 1: Download Template */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Step 1: Select Date Range & Download Template
          </CardTitle>
          <CardDescription>
            Choose the period for your timesheet and download the Excel template
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Range Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={errors.startDate ? "border-red-500" : ""}
              />
              {errors.startDate && (
                <p className="text-sm text-red-600 mt-1">{errors.startDate}</p>
              )}
            </div>
            <div>
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={errors.endDate ? "border-red-500" : ""}
              />
              {errors.endDate && (
                <p className="text-sm text-red-600 mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          <Button
            type="button"
            onClick={handleDownloadTemplate}
            disabled={isDownloading || !startDate || !endDate}
            className="w-full sm:w-auto"
          >
            {isDownloading ? (
              <>
                <LoadingSpinner className="mr-2" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download Excel Template
              </>
            )}
          </Button>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <p className="text-sm font-semibold text-gray-700 mb-2">Template will include:</p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>All working days in your selected date range (excluding weekends)</li>
              <li>Read-only columns: Date, Day of Week</li>
              <li>Editable columns (highlighted in green):</li>
              <ul className="ml-6 mt-1 space-y-1">
                <li><span className="font-semibold text-green-700">"Activity"</span> - description of work performed</li>
                <li><span className="font-semibold text-green-700">"Description"</span> - additional details</li>
                <li><span className="font-semibold text-green-700">"Hours Worked"</span> - hours spent</li>
              </ul>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Upload Template */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Step 2: Upload Filled Template
            </CardTitle>
            <CardDescription>
              Upload the completed Excel template with your timesheet entries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Template File Upload */}
            <div>
              <Label htmlFor="template_file" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Filled Excel Template *
              </Label>
              <Input
                id="template_file"
                type="file"
                onChange={handleFileChange}
                accept=".xlsx,.xls"
                className={errors.templateFile ? "border-red-500" : ""}
              />
              {templateFile && (
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  {templateFile.name}
                </p>
              )}
              {errors.templateFile && (
                <p className="text-sm text-red-600 mt-1">{errors.templateFile}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Upload the Excel template after filling in your timesheet entries
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending || !templateFile}
            className="flex-1"
          >
            {isPending ? (
              <>
                <LoadingSpinner className="mr-2" />
                Submitting...
              </>
            ) : (
              <>Submit Timesheet</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
