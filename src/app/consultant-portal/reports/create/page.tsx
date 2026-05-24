"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/atoms/FormInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import FormTextArea from "@/components/atoms/FormTextArea";
import { Upload, X, FileText } from "lucide-react";
import {
    ConsultancyReportSchema,
    TConsultancyReportFormData,
} from "@/features/contracts-grants/types/contract-management/consultancy-report";
import {
    useCreateConsultancyReport,
} from "@/features/contracts-grants/controllers/consultancyReportController";
import FormButton from "@/components/FormButton";
import FormCombobox from "@/components/atoms/FormCombobox";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useGetAllConsultancyApplicants } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { ConsultantAuthUtils } from "@/features/consultant-portal/controllers/consultantAuthController";
import { ArrowLeft } from "lucide-react";

export default function CreateConsultantReportPage() {
    const form = useForm<TConsultancyReportFormData>({
        resolver: zodResolver(ConsultancyReportSchema),
        defaultValues: {
            project: "",
            supervisor: "",
            consultant: "",
            report_date: "",
            consultancy_start_date: "",
            consultancy_end_date: "",
            consultancy_duration: "",
            purpose: "",
            executive_summary: "",
            achievements: "",
            challenges_recommendations: "",
        },
    });

    const router = useRouter();
    const [document, setDocument] = useState<File | null>(null);

    // Get consultant data
    const consultantData = ConsultantAuthUtils.getConsultantData();
    const consultantEmail = consultantData.email;

    const { data: project } = useGetAllProjects({
        page: 1,
        size: 2000000,
    });

    const projectOptions = useMemo(
        () =>
            project?.data.results.map(({ title, id }) => ({
                label: title,
                value: id,
            })),
        [project]
    );

    const { data: user } = useGetAllUsers({
        page: 1,
        size: 2000000,
    });

    const userOptions = useMemo(
        () =>
            user?.data.results.map(({ first_name, last_name, id }) => ({
                label: `${first_name} ${last_name}`,
                value: id,
            })),
        [user]
    );

    // Fetch consultants to find the current logged-in consultant's management ID
    const { data: consultantDataAPI } = useGetAllConsultancyApplicants({
        page: 1,
        size: 2000000,
    });

    const currentConsultantManagementId = useMemo(() => {
        const allApplicants = consultantDataAPI?.data?.results || [];

        // Find the applicant matching the logged-in consultant's email
        const currentApplicant = allApplicants.find(
            applicant => applicant.email.toLowerCase() === consultantEmail.toLowerCase()
        );

        if (currentApplicant) {
            // Get the consultant management ID
            const managementId = Array.isArray(currentApplicant.consultants)
                ? currentApplicant.consultants[0]
                : currentApplicant.consultants || currentApplicant.consultancy;

            console.log('✅ Found consultant management ID:', {
                email: consultantEmail,
                applicantName: currentApplicant.name,
                managementId,
            });

            return managementId;
        }

        console.warn('⚠️ Could not find consultant management ID for:', consultantEmail);
        return null;
    }, [consultantDataAPI, consultantEmail]);

    // Auto-fill consultant field when management ID is found
    useEffect(() => {
        if (currentConsultantManagementId) {
            form.setValue("consultant", currentConsultantManagementId);
        }
    }, [currentConsultantManagementId, form]);

    const { createConsultancyReport, isLoading: isCreateLoading } =
        useCreateConsultancyReport();

    const onSubmit: SubmitHandler<TConsultancyReportFormData> = async (
        data
    ) => {
        try {
            if (!currentConsultantManagementId) {
                toast.error('Unable to identify your consultant record. Please contact support.');
                return;
            }

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('consultant', currentConsultantManagementId);
            formData.append('project', data.project);
            formData.append('supervisor', data.supervisor);
            formData.append('report_date', data.report_date);
            formData.append('consultancy_start_date', data.consultancy_start_date);
            formData.append('consultancy_end_date', data.consultancy_end_date);
            formData.append('consultancy_duration', data.consultancy_duration);
            formData.append('purpose', data.purpose);
            formData.append('executive_summary', data.executive_summary);
            formData.append('achievements', data.achievements);
            formData.append('challenges_recommendations', data.challenges_recommendations);

            // Add document if uploaded
            if (document) {
                formData.append('document', document);
            }

            console.log('📤 Submitting consultant report with document');

            // Use AxiosWithToken directly to send FormData
            const AxiosWithToken = (await import("@/constants/api_management/MyHttpHelperWithToken")).default;
            await AxiosWithToken.post("contract-grants/consultancy/reports/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success("Report submitted successfully");
            router.push('/consultant-portal/reports');
        } catch (error: any) {
            console.error('❌ Report submission error:', error);
            const errorMessage = error?.response?.data?.message ?? error?.message ?? "Something went wrong";
            toast.error(errorMessage);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error("File size must be less than 10MB");
                return;
            }
            setDocument(file);
        }
    };

    const removeDocument = () => {
        setDocument(null);
    };

    // Watch start and end dates to auto-calculate duration
    const startDate = form.watch("consultancy_start_date");
    const endDate = form.watch("consultancy_end_date");

    useEffect(() => {
        // Calculate duration when both dates are available
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Calculate the difference in milliseconds
            const diffTime = end.getTime() - start.getTime();

            // Convert to days (add 1 to include both start and end dates)
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            // Only set if the duration is valid (positive number)
            if (diffDays > 0) {
                form.setValue("consultancy_duration", String(diffDays));
            } else {
                form.setValue("consultancy_duration", "0");
            }
        }
    }, [startDate, endDate, form]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Submit Consultancy Report</h1>
                    <p className="text-gray-600 mt-1">Provide details about your consultancy activities</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Report Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                <FormCombobox
                                    label="Project"
                                    name="project"
                                    placeholder="Select Project"
                                    searchPlaceholder="Search projects..."
                                    emptyMessage="No project found."
                                    required
                                    options={projectOptions}
                                />

                                <FormCombobox
                                    label="Supervisor"
                                    name="supervisor"
                                    placeholder="Select Supervisor"
                                    searchPlaceholder="Search supervisors..."
                                    emptyMessage="No supervisor found."
                                    required
                                    options={userOptions}
                                />

                                <FormInput
                                    type="date"
                                    label="Report Date"
                                    name="report_date"
                                    required
                                />
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="font-bold text-lg mb-4">Consultancy Period</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <FormInput
                                        type="date"
                                        label="Start Date"
                                        name="consultancy_start_date"
                                        required
                                    />

                                    <FormInput
                                        type="date"
                                        label="End Date"
                                        name="consultancy_end_date"
                                        required
                                    />

                                    <FormInput
                                        label="Duration (Days)"
                                        name="consultancy_duration"
                                        placeholder="Auto-calculated"
                                        required
                                        disabled
                                        className="bg-gray-50"
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="font-bold text-lg mb-4">Supporting Document</h3>

                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                                        {!document ? (
                                            <div className="text-center">
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="mt-4">
                                                    <label
                                                        htmlFor="document-upload"
                                                        className="cursor-pointer text-sm font-medium text-green-600 hover:text-green-700"
                                                    >
                                                        Click to upload
                                                        <input
                                                            id="document-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            onChange={handleFileChange}
                                                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                                                        />
                                                    </label>
                                                    <span className="text-sm text-gray-500"> or drag and drop</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    PDF, DOC, DOCX, XLS, XLSX up to 10MB
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-8 w-8 text-green-600" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{document.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {(document.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={removeDocument}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-6 space-y-6">
                                <h3 className="font-bold text-lg">Report Content</h3>

                                <FormTextArea
                                    label="Purpose"
                                    name="purpose"
                                    placeholder="Describe the purpose of this consultancy"
                                    required
                                    rows={3}
                                />

                                <FormTextArea
                                    label="Executive Summary"
                                    name="executive_summary"
                                    placeholder="Provide an executive summary of the consultancy"
                                    required
                                    rows={4}
                                />

                                <FormTextArea
                                    label="Activities, Accomplishments, & Deliverables"
                                    name="achievements"
                                    placeholder="Detail your activities, accomplishments, and deliverables"
                                    required
                                    rows={6}
                                />

                                <FormTextArea
                                    label="Challenges and Recommendations"
                                    name="challenges_recommendations"
                                    placeholder="Describe any challenges faced and your recommendations"
                                    required
                                    rows={5}
                                />
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <FormButton
                                    type="submit"
                                    size="lg"
                                    loading={isCreateLoading}
                                    disabled={!currentConsultantManagementId}
                                >
                                    Submit Report
                                </FormButton>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
