"use client";

import { FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/useStore";
import { closeDialog } from "@/store/ui";
import { useQueryClient } from "@tanstack/react-query";
import { StandardBulkUpload } from "@/components/uploads/StandardBulkUpload";

interface CostSheetUploadModalProps {
    activityId?: string;
    activityNumber?: string;
}

const CostSheetUploadModal = ({
    activityId,
    activityNumber,
}: CostSheetUploadModalProps) => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    if (!activityId) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-600">Activity ID is missing. Cannot upload cost sheets.</p>
            </div>
        );
    }

    // Generate CSV template (client-side generation)
    const generateTemplateUrl = () => {
        const headers = [
            "Description",
            "Units",
            "Days",
            "Frequency",
            "Rate (NGN)",
            "Comments"
        ];

        const sampleData = [
            ["Staff Salaries for Project Manager", "1", "30", "3", "150000", "Monthly salary for 3 months"],
            ["Training Materials (Notebooks)", "50", "1", "1", "500", "Training supplies"],
            ["Vehicle Rental", "1", "5", "2", "25000", "Field visits - 2 trips of 5 days each"],
        ];

        const csvContent = [
            headers.join(","),
            ...sampleData.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        return URL.createObjectURL(blob);
    };

    return (
        <div className="w-full space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
                <h3 className="font-medium text-blue-800 flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5" />
                    Bulk Upload Instructions
                </h3>
                <div className="text-sm text-blue-700 mt-2 space-y-2">
                    <p>Upload an Excel/CSV file with the following columns:</p>
                    <ul className="list-disc ml-5 space-y-1">
                        <li><strong>Description</strong> - Sub-activity description (required)</li>
                        <li><strong>Units</strong> - Number of units (required, must be &gt; 0)</li>
                        <li><strong>Days</strong> - Duration in days (required, must be &gt; 0)</li>
                        <li><strong>Frequency</strong> - How many times (required, must be &gt; 0)</li>
                        <li><strong>Rate (NGN)</strong> - Rate in Naira (required, must be &gt; 0)</li>
                        <li><strong>Comments</strong> - Additional notes (optional)</li>
                    </ul>
                    <p className="text-xs mt-2">
                        <strong>Note:</strong> Total Cost will be calculated automatically as: Units × Days × Frequency × Rate
                    </p>
                </div>
            </div>

            {/* Activity Context */}
            {activityNumber && (
                <div className="bg-green-50 p-3 rounded-md border-l-4 border-green-500">
                    <h3 className="font-medium text-green-800">Target Activity</h3>
                    <p className="text-sm text-green-700 mt-1">
                        <strong>Activity:</strong> {activityNumber}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                        All sub-activities in the file will be linked to this activity.
                    </p>
                </div>
            )}

            {/* Standardized Bulk Upload Component */}
            <StandardBulkUpload
                endpoint={`${process.env.NEXT_PUBLIC_API_URL}/programs/plans/activity-cost-sheets/bulk-upload/`}
                templateUrl={generateTemplateUrl()}
                acceptedFormats={['.xlsx', '.xls', '.csv']}
                maxFileSizeMB={10}
                title="Upload Cost Sheet Sub-Activities"
                description="Select an Excel or CSV file containing multiple sub-activities to import."
                additionalData={{
                    activity: activityId,
                }}
                onSuccess={(result) => {
                    // Invalidate queries to refetch data
                    queryClient.invalidateQueries({ queryKey: ["activity-cost-sheets"] });
                    queryClient.invalidateQueries({ queryKey: ["activity-cost-sheets", activityId] });

                    toast.success(
                        `Successfully uploaded ${result.created_count} sub-${result.created_count === 1 ? 'activity' : 'activities'}!`
                    );

                    // Let user review results before manually closing
                }}
                onError={(error) => toast.error(error)}
                showTemplateDownload={true}
                validateBeforeUpload={true}
                autoCloseDelay={0}
                onClose={() => dispatch(closeDialog())}
            />
        </div>
    );
};

export default CostSheetUploadModal;

/*
====================================================================================================
OLD IMPLEMENTATION (PRESERVED FOR 2 WEEKS AS BACKUP - Remove after 2026-06-03)
====================================================================================================

This file was migrated to use StandardBulkUpload component on 2026-05-20.

Changes made:
- Replaced custom upload form with StandardBulkUpload
- Removed client-side preview feature (can be added back to StandardBulkUpload later if needed)
- Added 4-stage progress tracking (Validating → Uploading → Processing → Complete)
- Added detailed error reporting with row/column numbers
- Removed auto-close behavior - user manually closes after reviewing results
- Kept instructions panel and activity context display
- Template is now generated as a data URL for StandardBulkUpload

Benefits:
- Consistent UX across all bulk uploads
- Better progress visibility
- Detailed error reporting
- Reduced code from 291 lines to ~120 lines (59% reduction)

Trade-offs:
- Removed preview feature (showed first 5 rows before upload)
  - This feature was nice-to-have but not critical
  - Can be re-added to StandardBulkUpload as an enhancement later

OLD CODE BELOW:
----------------------------------------------------------------------------------------------------

"use client";

import { Button } from "@/components/ui/button";
import { ChangeEvent, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Upload as UploadFile, FileSpreadsheet, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { closeDialog } from "@/store/ui";
import { useUploadActivityCostSheets } from "@/features/programs/controllers/activityCostSheetController";
import { useQueryClient } from "@tanstack/react-query";

interface CostSheetUploadModalProps {
    activityId?: string;
    activityNumber?: string;
}

const CostSheetUploadModal = ({
    activityId,
    activityNumber,
}: CostSheetUploadModalProps) => {
    const [file, setFile] = useState<File>();
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    const { uploadCostSheets, isLoading, isSuccess } = useUploadActivityCostSheets();

    // Handle success
    useEffect(() => {
        if (isSuccess) {
            toast.success("Cost sheet sub-activities uploaded successfully!");
            // Invalidate queries to refetch data
            queryClient.invalidateQueries({ queryKey: ["activity-cost-sheets"] });
            queryClient.invalidateQueries({ queryKey: ["activity-cost-sheets", activityId] });
            dispatch(closeDialog());
        }
    }, [isSuccess, dispatch, queryClient, activityId]);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            // Preview the file contents
            try {
                const readXlsxFile = (await import('read-excel-file')).default;
                const rows = await readXlsxFile(selectedFile);

                if (!rows || rows.length < 2) {
                    toast.warning("Excel file appears to be empty");
                    setPreviewData([]);
                    return;
                }

                // Parse and preview first 5 rows (excluding header)
                const preview = rows.slice(1, 6).map((row, index) => ({
                    rowNumber: index + 2, // +2 because we skip header and arrays are 0-indexed
                    description: row[0]?.toString() || "",
                    units: row[1] || 0,
                    days: row[2] || 0,
                    frequency: row[3] || 0,
                    rate_ngn: row[4] || 0,
                    comments: row[5]?.toString() || "",
                }));

                setPreviewData(preview);
                setShowPreview(true);

                console.log("📊 File preview:", {
                    totalRows: rows.length - 1, // Exclude header
                    preview: preview.slice(0, 3),
                });
            } catch (error) {
                console.error("Error previewing file:", error);
                toast.error("Error reading Excel file. Please check the format.");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            toast.error("Please select a file to upload");
            return;
        }

        if (!activityId) {
            toast.error("Activity ID is missing");
            return;
        }

        try {
            await uploadCostSheets({
                activity: activityId,
                file: file,
            });
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message
                || error?.response?.data?.error
                || error?.message
                || "Upload failed. Please check your file format and try again.";

            toast.error(errorMessage);
        }
    };

    const downloadTemplate = () => {
        // Create a sample CSV template
        const headers = [
            "Description",
            "Units",
            "Days",
            "Frequency",
            "Rate (NGN)",
            "Comments"
        ];

        const sampleData = [
            ["Staff Salaries for Project Manager", "1", "30", "3", "150000", "Monthly salary for 3 months"],
            ["Training Materials (Notebooks)", "50", "1", "1", "500", "Training supplies"],
            ["Vehicle Rental", "1", "5", "2", "25000", "Field visits - 2 trips of 5 days each"],
        ];

        const csvContent = [
            headers.join(","),
            ...sampleData.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.setAttribute("href", url);
        link.setAttribute("download", `cost_sheet_template_${activityNumber || 'activity'}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Template downloaded successfully!");
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Instructions *\/}
                <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
                    <h3 className="font-medium text-blue-800 flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5" />
                        Bulk Upload Instructions
                    </h3>
                    <div className="text-sm text-blue-700 mt-2 space-y-2">
                        <p>Upload an Excel/CSV file with the following columns:</p>
                        <ul className="list-disc ml-5 space-y-1">
                            <li><strong>Description</strong> - Sub-activity description (required)</li>
                            <li><strong>Units</strong> - Number of units (required, must be &gt; 0)</li>
                            <li><strong>Days</strong> - Duration in days (required, must be &gt; 0)</li>
                            <li><strong>Frequency</strong> - How many times (required, must be &gt; 0)</li>
                            <li><strong>Rate (NGN)</strong> - Rate in Naira (required, must be &gt; 0)</li>
                            <li><strong>Comments</strong> - Additional notes (optional)</li>
                        </ul>
                        <p className="text-xs mt-2">
                            <strong>Note:</strong> Total Cost will be calculated automatically as: Units × Days × Frequency × Rate
                        </p>
                    </div>
                </div>

                {/* Activity Context *\/}
                {activityNumber && (
                    <div className="bg-green-50 p-3 rounded-md border-l-4 border-green-500">
                        <h3 className="font-medium text-green-800">Target Activity</h3>
                        <p className="text-sm text-green-700 mt-1">
                            <strong>Activity:</strong> {activityNumber}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                            All sub-activities in the file will be linked to this activity.
                        </p>
                    </div>
                )}

                {/* Download Template Button *\/}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                    <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5 text-gray-600" />
                        <div>
                            <p className="text-sm font-medium text-gray-800">Need a template?</p>
                            <p className="text-xs text-gray-600">Download a sample CSV file with the correct format</p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={downloadTemplate}
                        className="flex gap-2"
                    >
                        <UploadFile className="w-4 h-4" />
                        Download Template
                    </Button>
                </div>

                {/* File Upload *\/}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Select File <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full relative gap-x-3 h-[52px] rounded-[16.2px] border flex justify-center items-center hover:bg-gray-50 transition-colors">
                        <UploadFile size={20} className="text-gray-500" />
                        <div>
                            <Input
                                type="file"
                                name="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleFileChange}
                                className="bg-inherit border-none cursor-pointer"
                            />
                        </div>
                    </div>
                    {file && (
                        <p className="text-sm text-green-600 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </p>
                    )}
                </div>

                {/* Preview *\/}
                {showPreview && previewData.length > 0 && (
                    <div className="bg-purple-50 p-4 rounded-md border border-purple-200">
                        <h4 className="font-medium text-purple-800 mb-3">Preview (First 5 rows)</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-purple-200">
                                        <th className="text-left p-2 text-purple-900">Row</th>
                                        <th className="text-left p-2 text-purple-900">Description</th>
                                        <th className="text-right p-2 text-purple-900">Units</th>
                                        <th className="text-right p-2 text-purple-900">Days</th>
                                        <th className="text-right p-2 text-purple-900">Frequency</th>
                                        <th className="text-right p-2 text-purple-900">Rate (₦)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.map((row) => (
                                        <tr key={row.rowNumber} className="border-b border-purple-100">
                                            <td className="p-2 text-purple-700">{row.rowNumber}</td>
                                            <td className="p-2 text-purple-900">{row.description || "(empty)"}</td>
                                            <td className="text-right p-2 text-purple-900">{row.units}</td>
                                            <td className="text-right p-2 text-purple-900">{row.days}</td>
                                            <td className="text-right p-2 text-purple-900">{row.frequency}</td>
                                            <td className="text-right p-2 text-purple-900">{Number(row.rate_ngn).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-purple-700 mt-2">
                            Please verify the data looks correct before uploading.
                        </p>
                    </div>
                )}

                {/* Action Buttons *\/}
                <div className="flex justify-between gap-5 mt-4 pt-4 border-t">
                    <Button
                        onClick={() => dispatch(closeDialog())}
                        type="button"
                        variant="outline"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <FormButton
                        loading={isLoading}
                        type="submit"
                        disabled={isLoading || !file}
                    >
                        Upload Sub-Activities
                    </FormButton>
                </div>
            </form>
        </div>
    );
};

export default CostSheetUploadModal;

----------------------------------------------------------------------------------------------------
END OF OLD IMPLEMENTATION
====================================================================================================
*/
