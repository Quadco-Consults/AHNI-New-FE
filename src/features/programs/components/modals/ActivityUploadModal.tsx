"use client";

import { Button } from "components/ui/button";
import { ChangeEvent, useState } from "react";
import { Input } from "components/ui/input";
import { Upload as UploadFile } from "lucide-react";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import { useAppDispatch } from "hooks/useStore";
import { closeDialog } from "store/ui";
import FormSelect from "components/atoms/FormSelect";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadActivityPlanMutation } from "@/features/programs/controllers/activityPlanController";
import { useGetAllProjectsQuery } from "@/features/projects/controllers/projectController";
import { useGetAllFinancialYearsQuery } from "@/features/modules/controllers/config/financialYearController";

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
}

const ActivityUploadModal = ({
    workPlanId,
    activityType = "PLANNED",
    header = "Upload Activities",
}: ActivityUploadModalProps) => {
    const [file, setFile] = useState<File>();

    const { data: project } = useGetAllProjectsQuery({
        page: 1,
        size: 2000000,
    });

    const { data: financialYear } = useGetAllFinancialYearsQuery({
        page: 1,
        size: 2000000,
    });

    const projectOptions = project?.data.results.map((project) => ({
        label: project.title,
        value: project.id,
    }));

    const financialYearOptions = financialYear?.data.results.map((fy) => ({
        label: fy.year,
        value: fy.id,
    }));

    // Create dynamic schema based on whether workPlanId is provided
    const dynamicFormSchema = z.object({
        project: workPlanId ? z.string().optional() : z.string().min(1, "This field is required"),
        financialYear: z.string().min(1, "This field is required"),
    });

    const form = useForm<TFormValues>({
        resolver: zodResolver(dynamicFormSchema),
        defaultValues: {
            project: "",
            financialYear: "",
        },
    });

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const { handleSubmit } = form;

    const dispatch = useAppDispatch();

    const { uploadActivityPlan, isLoading } = useUploadActivityPlanMutation();

    const onSubmit: SubmitHandler<TFormValues> = async ({ project, financialYear }) => {
        if (!file) {
            toast.error("Please choose a file to upload");
            return;
        }

        try {
            console.log("🚀 Modal submitting upload with:", {
                project,
                financialYear,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                workPlanId,
                activityType
            });

            // Use the unified upload endpoint that auto-detects activity type based on justification field
            await uploadActivityPlan({
                project,
                financialYear,
                file,
                workPlanId: workPlanId,
                activityType: activityType === "UNPLANNED" ? "UNPLANNED" : undefined
            });
            const successMessage = activityType === "UNPLANNED"
                ? "Activities uploaded successfully! Unplanned activities (with justification) will be marked for approval."
                : "Activities uploaded successfully! The system will auto-detect planned vs unplanned based on justification field.";
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

                    {/* Only show project selector if not uploading for a specific work plan */}
                    {!workPlanId && (
                        <div className="space-y-2">
                            <FormSelect
                                name="project"
                                label="Project"
                                placeholder="Select Project"
                                options={projectOptions}
                            />
                        </div>
                    )}

                    {/* Financial Year selector */}
                    <div className="space-y-2">
                        <FormSelect
                            name="financialYear"
                            label="Financial Year"
                            placeholder="Select Financial Year"
                            options={financialYearOptions}
                        />
                    </div>

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
                            className="bg-[#FFF2F2] text-primary dark:text-gray-500"
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
        </div>
    );
};

export default ActivityUploadModal;