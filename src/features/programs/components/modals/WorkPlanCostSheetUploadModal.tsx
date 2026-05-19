"use client";

import { Button } from "@/components/ui/button";
import { ChangeEvent, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Upload as UploadFile, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import { useAppDispatch } from "@/hooks/useStore";
import { closeDialog } from "@/store/ui";
import { useUploadWorkPlanCostSheets } from "@/features/programs/controllers/activityCostSheetController";
import { useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

interface WorkPlanCostSheetUploadModalProps {
    workPlanId?: string;
    workPlanTitle?: string;
    activitiesCount?: number;
}

const WorkPlanCostSheetUploadModal = ({
    workPlanId,
    workPlanTitle,
    activitiesCount,
}: WorkPlanCostSheetUploadModalProps) => {
    const [file, setFile] = useState<File>();
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [showPreview, setShowPreview] = useState(false);
    const [stats, setStats] = useState({ activities: 0, subActivities: 0 });

    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    const { uploadWorkPlanCostSheets, isLoading, isSuccess } = useUploadWorkPlanCostSheets();

    // Handle success
    useEffect(() => {
        if (isSuccess) {
            toast.success("Cost sheets uploaded successfully for all activities!");
            // Invalidate queries to refetch data
            queryClient.invalidateQueries({ queryKey: ["activity-cost-sheets"] });
            queryClient.invalidateQueries({ queryKey: ["work-plans"] });
            dispatch(closeDialog());
        }
    }, [isSuccess, dispatch, queryClient]);

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

                // Parse and preview data (excluding header)
                const parsedData = rows.slice(1).map((row, index) => ({
                    rowNumber: index + 2,
                    activityNumber: row[0]?.toString() || "",
                    description: row[1]?.toString() || "",
                    units: row[2] || 0,
                    days: row[3] || 0,
                    frequency: row[4] || 0,
                    rate_ngn: row[5] || 0,
                    comments: row[6]?.toString() || "",
                })).filter(row => row.activityNumber && row.description); // Filter out empty rows

                // Calculate statistics
                const uniqueActivities = new Set(parsedData.map(row => row.activityNumber));
                setStats({
                    activities: uniqueActivities.size,
                    subActivities: parsedData.length,
                });

                // Show first 10 rows
                setPreviewData(parsedData.slice(0, 10));
                setShowPreview(true);

                console.log("📊 File preview:", {
                    totalRows: rows.length - 1,
                    activities: uniqueActivities.size,
                    subActivities: parsedData.length,
                    preview: parsedData.slice(0, 3),
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

        if (!workPlanId) {
            toast.error("Work Plan ID is missing");
            return;
        }

        try {
            await uploadWorkPlanCostSheets({
                work_plan: workPlanId,
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

    const downloadTemplate = async () => {
        if (!workPlanId) {
            toast.error("Work Plan ID is missing");
            return;
        }

        try {
            toast.loading("Generating template...", { id: "template-download" });

            // Call backend API to generate dynamic template using AxiosWithToken
            const response = await AxiosWithToken.get(
                `/programs/plans/activity-cost-sheets/download-template/`,
                {
                    params: { work_plan: workPlanId },
                    responseType: 'blob', // Important for file downloads
                }
            );

            // Get the file blob
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            // Extract filename from content-disposition header or use default
            const contentDisposition = response.headers['content-disposition'];
            let filename = `cost_sheet_template_${workPlanTitle?.replace(/\s+/g, '_') || 'workplan'}.xlsx`;

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Template downloaded successfully!", { id: "template-download" });
        } catch (error: any) {
            console.error("Template download error:", error);
            const errorMessage = error?.response?.data?.message
                || error?.response?.data?.error
                || error?.message
                || "Failed to download template";
            toast.error(errorMessage, { id: "template-download" });
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Instructions */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-md border-l-4 border-blue-500">
                    <h3 className="font-medium text-blue-800 flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5" />
                        Work Plan Bulk Upload Instructions
                    </h3>
                    <div className="text-sm text-blue-700 mt-2 space-y-2">
                        <p>Upload cost sheets for <strong>all activities</strong> in this work plan using a single Excel file:</p>
                        <ul className="list-disc ml-5 space-y-1">
                            <li><strong>Download the template</strong> - All your activities are already included with budget amounts</li>
                            <li><strong>Item/Description</strong> - Describe each expense item for the activity (required)</li>
                            <li><strong>Units</strong> - Number of units (required, must be &gt; 0)</li>
                            <li><strong>Days</strong> - Duration in days (required, must be &gt; 0)</li>
                            <li><strong>Frequency</strong> - How many times (required, must be &gt; 0)</li>
                            <li><strong>Rate (NGN)</strong> - Rate in Naira (required, must be &gt; 0)</li>
                            <li><strong>Comments</strong> - Additional notes (optional)</li>
                        </ul>
                        <div className="mt-3 p-3 bg-white rounded-md border border-blue-200">
                            <p className="text-xs font-medium text-blue-900">
                                💡 Tip: The template is organized by activity - just fill in the expense items under each activity section
                            </p>
                            <p className="text-xs text-blue-800 mt-1">
                                Total Cost = Units × Days × Frequency × Rate (NGN)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Work Plan Context */}
                {workPlanTitle && (
                    <div className="bg-green-50 p-4 rounded-md border-l-4 border-green-500">
                        <h3 className="font-medium text-green-800">Target Work Plan</h3>
                        <div className="text-sm text-green-700 mt-2 space-y-1">
                            <p><strong>Work Plan:</strong> {workPlanTitle}</p>
                            {activitiesCount && (
                                <p><strong>Total Activities:</strong> {activitiesCount}</p>
                            )}
                            <p className="text-xs mt-2 text-green-600">
                                All cost sheets will be created for activities in this work plan.
                            </p>
                        </div>
                    </div>
                )}

                {/* Download Template Button */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-md border-2 border-purple-200">
                    <div className="flex items-center gap-3">
                        <FileSpreadsheet className="w-6 h-6 text-purple-600" />
                        <div>
                            <p className="text-sm font-medium text-purple-900">Download Excel Template</p>
                            <p className="text-xs text-purple-700">Pre-filled sample template with instructions</p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={downloadTemplate}
                        className="flex gap-2 border-purple-300 hover:bg-purple-100"
                    >
                        <UploadFile className="w-4 h-4" />
                        Download Template
                    </Button>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Select Excel File <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full relative gap-x-3 h-[52px] rounded-[16.2px] border-2 border-dashed flex justify-center items-center hover:bg-gray-50 transition-colors hover:border-blue-400">
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
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-md border border-green-200">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <p className="text-sm text-green-700 flex-1">
                                <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
                            </p>
                        </div>
                    )}
                </div>

                {/* Statistics */}
                {showPreview && stats.activities > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-xs text-blue-600 mb-1">Activities Found</p>
                            <p className="text-3xl font-bold text-blue-700">{stats.activities}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <p className="text-xs text-green-600 mb-1">Total Sub-Activities</p>
                            <p className="text-3xl font-bold text-green-700">{stats.subActivities}</p>
                        </div>
                    </div>
                )}

                {/* Preview */}
                {showPreview && previewData.length > 0 && (
                    <div className="bg-purple-50 p-4 rounded-md border border-purple-200">
                        <h4 className="font-medium text-purple-800 mb-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Preview (First 10 rows)
                        </h4>
                        <div className="overflow-x-auto max-h-80 overflow-y-auto">
                            <table className="w-full text-xs border-collapse">
                                <thead className="sticky top-0 bg-purple-100">
                                    <tr className="border-b-2 border-purple-200">
                                        <th className="text-left p-2 text-purple-900">Row</th>
                                        <th className="text-left p-2 text-purple-900">Activity #</th>
                                        <th className="text-left p-2 text-purple-900">Sub-Activity</th>
                                        <th className="text-right p-2 text-purple-900">Units</th>
                                        <th className="text-right p-2 text-purple-900">Days</th>
                                        <th className="text-right p-2 text-purple-900">Freq</th>
                                        <th className="text-right p-2 text-purple-900">Rate (₦)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.map((row, idx) => (
                                        <tr
                                            key={row.rowNumber}
                                            className={`border-b border-purple-100 ${
                                                idx > 0 && row.activityNumber !== previewData[idx - 1].activityNumber
                                                    ? 'border-t-2 border-purple-300'
                                                    : ''
                                            }`}
                                        >
                                            <td className="p-2 text-purple-600">{row.rowNumber}</td>
                                            <td className="p-2 text-purple-900 font-medium">{row.activityNumber}</td>
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
                        {previewData.length >= 10 && (
                            <p className="text-xs text-purple-700 mt-2 text-center">
                                Showing first 10 rows. Total: {stats.subActivities} sub-activities across {stats.activities} activities.
                            </p>
                        )}
                        <p className="text-xs text-purple-700 mt-3">
                            <strong>Note:</strong> Please verify activity numbers match your work plan before uploading.
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
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
                        className="min-w-[200px]"
                    >
                        Upload All Cost Sheets
                    </FormButton>
                </div>
            </form>
        </div>
    );
};

export default WorkPlanCostSheetUploadModal;
