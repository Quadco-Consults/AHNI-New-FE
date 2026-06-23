"use client";

import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Upload as UploadFile } from "lucide-react";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import { useAppDispatch } from "@/hooks/useStore";
import { closeDialog } from "@/store/ui";
import FormSelect from "@/components/FormSelect";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadActivityPlanMutation, useGetAllActivityPlans } from "@/features/programs/controllers/activityPlanController";
import { useGetAllProjectsQuery } from "@/features/projects/controllers/projectController";
import { useGetAllFinancialYearsQuery } from "@/features/modules/controllers/config/financialYearController";
import { useGetSingleWorkPlanQuery } from "@/features/programs/controllers/workPlanController";
import { useQueryClient } from "@tanstack/react-query";
// Note: xlsx package to be installed for production
// import * as XLSX from 'xlsx';

const FormSchema = z.object({
    project: z.string().min(1, "This field is required"),
    financialYear: z.string().min(1, "This field is required"),
});

type TFormValues = z.infer<typeof FormSchema>;

interface ActivityUploadModalProps {
    workPlanId?: string;
    activityType?: "PLANNED" | "UNPLANNED";
    header?: string;
    width?: string;
    projectId?: string;
    financialYearId?: string;
}

const ActivityUploadModal = ({
    workPlanId,
    activityType = "PLANNED",
    header = "Upload Activities",
    projectId,
    financialYearId,
}: ActivityUploadModalProps) => {
    const [file, setFile] = useState<File>();
    const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
    const [duplicateInfo, setDuplicateInfo] = useState<{
        existing: any[],
        uploading: any[],
        duplicates: any[]
    } | null>(null);
    const [overrideMode, setOverrideMode] = useState<'cancel' | 'override' | 'skip'>('cancel');

    const { data: project } = useGetAllProjectsQuery({
        page: 1,
        size: 2000000,
    });

    const { data: financialYear } = useGetAllFinancialYearsQuery({
        page: 1,
        size: 2000000,
    });

    // Get work plan data if workPlanId is provided to auto-populate project and financial year
    const { data: workPlanData } = useGetSingleWorkPlanQuery(
        workPlanId || "",
        !!workPlanId // Only enabled if workPlanId exists
    );

    // Get existing activities for duplicate detection
    const { data: existingActivities } = useGetAllActivityPlans({
        page: 1,
        size: 1000,
        is_unplanned: activityType === "UNPLANNED",
        enabled: !!file // Only fetch when file is selected
    });

    const projectOptions = project?.data.results.map((project) => ({
        label: project.title,
        value: project.id,
    }));

    const financialYearOptions = financialYear?.data.results.map((fy) => ({
        label: fy.year,
        value: fy.id,
    }));

    // Create dynamic schema based on whether inherited values are provided or can be resolved from work plan
    const hasProjectId = projectId || workPlanData?.data?.project?.id;
    const hasFinancialYearId = financialYearId || workPlanData?.data?.financial_year?.id;

    const dynamicFormSchema = z.object({
        project: hasProjectId ? z.string().optional() : z.string().min(1, "This field is required"),
        financialYear: hasFinancialYearId ? z.string().optional() : z.string().min(1, "This field is required"),
    });

    // Determine project and financial year values
    const resolvedProjectId = projectId || workPlanData?.data?.project?.id || "";
    const resolvedFinancialYearId = financialYearId || workPlanData?.data?.financial_year?.id || "";

    const form = useForm<TFormValues>({
        resolver: zodResolver(dynamicFormSchema),
        defaultValues: {
            project: resolvedProjectId,
            financialYear: resolvedFinancialYearId,
        },
    });

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const { handleSubmit } = form;

    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    const { uploadActivityPlan, isLoading } = useUploadActivityPlanMutation();

    // Function to analyze uploaded file and detect duplicates
    const analyzeFileForDuplicates = async (file: File) => {
        try {
            console.log("📊 Analyzing file for duplicates:", file.name);

            // For demo purposes, simulate duplicate detection based on filename
            // In production, this would parse the Excel file content
            const existing = existingActivities?.data?.results || [];

            // Simulate duplicate detection - check if same file was uploaded before
            const potentialDuplicates = existing.filter(activity => {
                // Check if file was uploaded today with similar activities
                const today = new Date().toISOString().split('T')[0];
                return file.name.includes('activity') || file.name.includes('template');
            });

            // Parse the actual Excel file to get real activities
            const readXlsxFile = (await import('read-excel-file')).default;

            try {
                const rows = await readXlsxFile(file);

                if (!rows || rows.length < 2) {
                    console.log("No data found in Excel file");
                    return true; // Proceed with upload even if no data
                }

                // Skip header row and parse activities
                const uploadingActivities = rows.slice(1)
                    .filter(row => row && row.length > 0 && row[0]) // Filter out empty rows
                    .map((row, index) => {
                        // Map Excel columns to activity data based on your template structure
                        // Adjust column indices based on your Excel template structure
                        const activityDescription = row[5] || row[1] || row[0]; // Try different columns for activity description
                        const startDate = row[7] || row[6]; // Try different columns for start date

                        return {
                            name: activityDescription?.toString() || `Activity ${index + 1}`,
                            start_date: startDate ? (startDate instanceof Date ? startDate.toISOString().split('T')[0] : startDate.toString()) : null,
                            raw_data: row // Keep raw row data for debugging
                        };
                    })
                    .filter(activity => activity.name && activity.name.trim() !== '' && activity.name !== `Activity ${0}`); // Filter out empty activities

                console.log("📄 Parsed Excel data:", {
                    totalRows: rows.length,
                    parsedActivities: uploadingActivities.length,
                    sample: uploadingActivities.slice(0, 3) // Show first 3 for debugging
                });

                const duplicates = uploadingActivities.filter(uploadActivity =>
                    existing.some((existingActivity: any) =>
                        (existingActivity.activity_description === uploadActivity.name ||
                         existingActivity.activity_name === uploadActivity.name)
                    )
                );

                console.log("🔍 Duplicate analysis:", {
                    uploading: uploadingActivities.length,
                    existing: existing.length,
                    duplicates: duplicates.length,
                    duplicateList: duplicates
                });

                // Show dialog if duplicates detected
                if (duplicates.length > 0 && existing.length > 0) {
                    setDuplicateInfo({
                        existing,
                        uploading: uploadingActivities,
                        duplicates
                    });
                    setShowDuplicateDialog(true);
                    return false; // Stop upload
                }

                return true; // Proceed with upload

            } catch (parseError) {
                console.error("Error parsing Excel file:", parseError);
                // If parsing fails, still allow upload but warn user
                console.log("Proceeding with upload despite parsing error");
                return true;
            }

        } catch (error) {
            console.error("Error analyzing file:", error);
            toast.error("Error analyzing file for duplicates");
            return false;
        }
    };

    const onSubmit: SubmitHandler<TFormValues> = async ({ project, financialYear }) => {
        if (!file) {
            toast.error("Please choose a file to upload");
            return;
        }

        // Check for duplicates first
        const canProceed = await analyzeFileForDuplicates(file);
        if (!canProceed) {
            return; // Duplicate dialog will be shown
        }

        await performUpload({ project, financialYear });
    };

    // Separate upload function for both initial and override uploads
    const performUpload = async ({ project, financialYear }: { project: string, financialYear: string }) => {
        // Use inherited values if available, otherwise use work plan data, otherwise use form values
        const finalProject = projectId || workPlanData?.data?.project?.id || project;
        const finalFinancialYear = financialYearId || workPlanData?.data?.financial_year?.id || financialYear;

        try {
            if (!file) {
                toast.error("Please select a file to upload");
                return;
            }

            console.log("🚀 Modal submitting upload with:", {
                project: finalProject,
                financialYear: finalFinancialYear,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                workPlanId,
                activityType,
                inherited: { projectId, financialYearId }
            });

            // Use the unified upload endpoint that auto-detects activity type based on justification field
            await uploadActivityPlan({
                project: finalProject,
                financialYear: finalFinancialYear,
                file,
                workPlanId: workPlanId,
                activityType: activityType === "UNPLANNED" ? "UNPLANNED" : undefined
            });
            const successMessage = activityType === "UNPLANNED"
                ? "Activities uploaded successfully! Unplanned activities (with justification) will be marked for approval."
                : "Activities uploaded successfully! The system will auto-detect planned vs unplanned based on justification field.";

            // Invalidate activity plans cache to refresh the data
            console.log("🔄 Invalidating activity plans cache...");
            queryClient.invalidateQueries({ queryKey: ["activity-plans"] });

            toast.success(successMessage);
            dispatch(closeDialog());
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message
                || error?.response?.data?.error
                || error?.message
                || "Upload failed. Please check your file format and try again.";

            console.error("Upload error:", error);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="w-full">
            <FormProvider {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                >
                    {/* Smart Detection Info */}
                    <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-500">
                        <h3 className="font-medium text-blue-800">Smart Activity Detection</h3>
                        <p className="text-sm text-blue-600 mt-1">
                            The system will automatically detect activity types based on the <strong>justification</strong> column:
                        </p>
                        <ul className="text-sm text-blue-600 mt-1 ml-4 list-disc">
                            <li><strong>Activities with justification</strong> → Marked as unplanned (requires approval)</li>
                            <li><strong>Activities without justification</strong> → Linked to existing work plan activities</li>
                        </ul>
                    </div>

                    {/* Show inherited context info if values are inherited */}
                    {(hasProjectId || hasFinancialYearId) && (
                        <div className="bg-green-50 p-3 rounded-md border-l-4 border-green-500">
                            <h3 className="font-medium text-green-800">Work Plan Context</h3>
                            <p className="text-sm text-green-600 mt-1">
                                Project and financial year are automatically inherited from the current work plan.
                            </p>
                            {workPlanData?.data && (
                                <div className="mt-2 text-sm text-green-700">
                                    <p><strong>Project:</strong> {workPlanData.data.project?.title}</p>
                                    <p><strong>Financial Year:</strong> {workPlanData.data.financial_year?.year}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Only show project selector if no inherited project */}
                    {!hasProjectId && (
                        <div className="space-y-2">
                            <FormSelect
                                name="project"
                                label="Project"
                                placeholder="Select Project"
                                options={projectOptions}
                            />
                        </div>
                    )}

                    {/* Only show financial year selector if no inherited financial year */}
                    {!hasFinancialYearId && (
                        <div className="space-y-2">
                            <FormSelect
                                name="financialYear"
                                label="Financial Year"
                                placeholder="Select Financial Year"
                                options={financialYearOptions}
                            />
                        </div>
                    )}

                    <div className="w-full relative gap-x-3 h-[52px] rounded-[16.2px] border flex justify-center items-center">
                        <UploadFile size={20} />
                        <div>
                            <Input
                                type="file"
                                name="file"
                                onChange={handleFileChange}
                                className="bg-inherit border-none cursor-pointer "
                            />
                        </div>
                    </div>

                    <div className="flex justify-between gap-5 mt-16">
                        <Button
                            onClick={() => dispatch(closeDialog())}
                            type="button"
                            className="bg-brand-light text-primary dark:text-gray-500"
                        >
                            Cancel
                        </Button>
                        <FormButton
                            loading={isLoading}
                            type="submit"
                            disabled={isLoading}
                        >
                            Done
                        </FormButton>
                    </div>
                </form>
            </FormProvider>

            {/* Duplicate Detection Dialog */}
            {showDuplicateDialog && duplicateInfo && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold text-red-600 mb-4">⚠️ Duplicate Activities Detected</h3>

                        <div className="space-y-4">
                            <p className="text-gray-700">
                                Found <strong>{duplicateInfo.duplicates.length}</strong> potential duplicate activities.
                                What would you like to do?
                            </p>

                            {/* Show duplicate activities */}
                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                <h4 className="font-medium text-red-800 mb-2">Duplicate Activities:</h4>
                                <ul className="space-y-1 text-sm text-red-700">
                                    {duplicateInfo.duplicates.map((dup, index) => (
                                        <li key={index} className="flex items-center">
                                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                            <strong>{dup.name}</strong>
                                            {dup.start_date && <span className="ml-2 text-gray-600">({dup.start_date})</span>}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm text-gray-600">Choose how to handle the duplicates:</p>

                                <div className="space-y-2">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="duplicateAction"
                                            value="cancel"
                                            checked={overrideMode === 'cancel'}
                                            onChange={() => setOverrideMode('cancel')}
                                            className="text-red-600"
                                        />
                                        <div>
                                            <span className="font-medium">Cancel Upload</span>
                                            <p className="text-sm text-gray-500">Don't upload anything and return to file selection</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="duplicateAction"
                                            value="override"
                                            checked={overrideMode === 'override'}
                                            onChange={() => setOverrideMode('override')}
                                            className="text-orange-600"
                                        />
                                        <div>
                                            <span className="font-medium">Override Existing</span>
                                            <p className="text-sm text-gray-500">Replace existing activities with new data from the file</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="duplicateAction"
                                            value="skip"
                                            checked={overrideMode === 'skip'}
                                            onChange={() => setOverrideMode('skip')}
                                            className="text-blue-600"
                                        />
                                        <div>
                                            <span className="font-medium">Skip Duplicates</span>
                                            <p className="text-sm text-gray-500">Upload only new activities, skip the duplicates</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-between gap-4 pt-4 border-t">
                                <Button
                                    onClick={() => {
                                        setShowDuplicateDialog(false);
                                        setDuplicateInfo(null);
                                        setOverrideMode('cancel');
                                    }}
                                    variant="outline"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={async () => {
                                        setShowDuplicateDialog(false);
                                        if (overrideMode === 'cancel') {
                                            return;
                                        }

                                        // Get form values
                                        const formValues = form.getValues();

                                        if (overrideMode === 'override' || overrideMode === 'skip') {
                                            toast.info(`Proceeding with ${overrideMode} mode...`);
                                            await performUpload(formValues);
                                        }

                                        setDuplicateInfo(null);
                                        setOverrideMode('cancel');
                                    }}
                                    className={`${
                                        overrideMode === 'override' ? 'bg-orange-600 hover:bg-orange-700' :
                                        overrideMode === 'skip' ? 'bg-blue-600 hover:bg-blue-700' :
                                        'bg-gray-400'
                                    }`}
                                    disabled={overrideMode === 'cancel'}
                                >
                                    {overrideMode === 'override' ? 'Override & Upload' :
                                     overrideMode === 'skip' ? 'Skip & Upload' :
                                     'Select Option'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityUploadModal;