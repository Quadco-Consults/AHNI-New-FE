"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/atoms/FormInput";
import BackNavigation from "@/components/atoms/BackNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation"; 
import { CG_ROUTES } from "@/constants/RouterConstants";
import { useEffect, useMemo } from "react";
import FormTextArea from "@/components/atoms/FormTextArea";
import {
    ConsultancyReportSchema,
    TConsultancyReportFormData,
} from "@/features/contracts-grants/types/contract-management/consultancy-report";
import {
    useCreateConsultancyReport,
    useGetSingleConsultancyReport,
    useUpdateConsultancyReport,
} from "@/features/contracts-grants/controllers/consultancyReportController";
import FormButton from "@/components/FormButton";
import FormCombobox from "@/components/atoms/FormCombobox";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useGetAllConsultancyApplicants } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";

export default function CreateConsultancyReport() {
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

    const searchParams = useSearchParams();
    const id = searchParams?.get("id") || null;

    const router = useRouter();

    const { data: project, isLoading: isProjectsLoading } = useGetAllProjects({
        page: 1,
        size: 1000,
    });

    const projectOptions = useMemo(() => {
        const options = project?.data.results.map(({ title, id }) => ({
            label: title,
            value: id,
        })) || [];
        console.log('📋 Projects loaded:', {
            count: options.length,
            isLoading: isProjectsLoading,
            sample: options.slice(0, 3)
        });
        return options;
    }, [project, isProjectsLoading]);

    const { data: user, isLoading: isUsersLoading } = useGetAllUsers({
        page: 1,
        size: 1000,
    });

    const userOptions = useMemo(() => {
        const options = user?.data.results.map(({ first_name, last_name, id }) => ({
            label: `${first_name} ${last_name}`,
            value: id,
        })) || [];
        console.log('📋 Users (Supervisors) loaded:', {
            count: options.length,
            isLoading: isUsersLoading,
            sample: options.slice(0, 3)
        });
        return options;
    }, [user, isUsersLoading]);

    // Fetch consultants from the consultancy database (accepted consultants only)
    const { data: consultantData } = useGetAllConsultancyApplicants({
        page: 1,
        size: 1000,
    });

    const consultantOptions = useMemo(() => {
        const allApplicants = consultantData?.data?.results || [];

        // Filter for consultants who have accepted their contracts
        const acceptedConsultants = allApplicants.filter(applicant => {
            // Must have accepted the offer
            if (!applicant.offer_accepted) return false;

            // Must be CONSULTANT type only
            return applicant.type === "CONSULTANT";

            // Must have a linked consultant management ID
            // return applicant.consultants || applicant.consultancy;
        });

        console.log('📋 Consultancy Report - Consultant Options:', {
            totalApplicants: allApplicants.length,
            acceptedConsultants: acceptedConsultants.length,
            sampleConsultants: acceptedConsultants.slice(0, 3).map(c => ({
                id: c.id,
                name: c.name,
                email: c.email,
                type: c.type,
                consultants: c.consultants,
                consultancy: c.consultancy,
            }))
        });

        // Map to dropdown options
        // Show the consultant name but use the applicant ID as value
        // We'll map this to consultant management ID on form submission
        return acceptedConsultants.map((applicant) => ({
            label: `${applicant.name} - ${applicant.email || 'No email'}`,
            value: applicant.id, // Applicant ID - will be mapped on submit
            // Store the consultant management ID in a data attribute
            consultantManagementId: Array.isArray(applicant.consultants)
                ? applicant.consultants[0]
                : applicant.consultants || applicant.consultancy,
        }));
    }, [consultantData]);

    const { createConsultancyReport, isLoading: isCreateLoading } =
        useCreateConsultancyReport();

    const { updateConsultancyReport, isLoading: isModifyLoading } =
        useUpdateConsultancyReport(id || "");

    const onSubmit: SubmitHandler<TConsultancyReportFormData> = async (
        data
    ) => {
        try {
            // Map the consultant applicant ID to consultant management ID
            // The backend expects a consultant management ID, not an applicant ID
            const consultantApplicantId = data.consultant;
            const selectedConsultantOption = consultantOptions?.find(
                (opt) => opt.value === consultantApplicantId
            );

            console.log('📤 Submitting Consultancy Report:', {
                originalData: data,
                consultantApplicantId,
                selectedConsultantOption,
                consultantManagementId: (selectedConsultantOption as any)?.consultantManagementId,
            });

            // Replace the applicant ID with the consultant management ID
            const consultantManagementId = (selectedConsultantOption as any)?.consultantManagementId;

            if (!consultantManagementId) {
                console.error('❌ No consultant management ID found for applicant:', {
                    consultantApplicantId,
                    selectedConsultantOption,
                });
                toast.error('Unable to find consultant management record. Please select a different consultant.');
                return;
            }

            const submitData = {
                ...data,
                consultant: consultantManagementId,
            };

            console.log('📤 Final submit data:', {
                ...submitData,
                mappedFrom: {
                    applicantId: consultantApplicantId,
                    applicantName: selectedConsultantOption?.label,
                    consultantManagementId,
                }
            });

            if (id) {
                await updateConsultancyReport(submitData);
                toast.success("Consultancy Report Updated");
            } else {
                await createConsultancyReport(submitData);
                toast.success("Consultancy Report Created");
            }

            router.push(CG_ROUTES.CONSULTANCY_REPORT);
        } catch (error: any) {
            console.error('❌ Consultancy Report submission error:', error);
            const errorMessage = error?.data?.message ?? error?.message ?? "Something went wrong";
            toast.error(errorMessage);
        }
    };

    const { data } = useGetSingleConsultancyReport(id || "", !!id);

    useEffect(() => {
        if (data && consultantOptions) {
            // Extract IDs from nested objects or use direct ID if already a string
            const projectId = typeof data.data.project === 'object'
                ? (data.data.project as any)?.id
                : data.data.project;

            const supervisorId = typeof data.data.supervisor === 'object'
                ? data.data.supervisor.id
                : data.data.supervisor;

            const consultantManagementId = typeof data.data.consultant === 'object'
                ? data.data.consultant.id
                : data.data.consultant;

            // Find the applicant ID that corresponds to this consultant management ID
            const matchingConsultantOption = consultantOptions.find(
                (opt: any) => opt.consultantManagementId === consultantManagementId
            );

            const consultantApplicantId = matchingConsultantOption?.value || consultantManagementId;

            console.log('📝 Loaded consultancy report for editing:', {
                reportId: id,
                projectId,
                supervisorId,
                consultantManagementId,
                consultantApplicantId,
                matchingConsultantOption,
            });

            form.reset({
                ...data.data,
                project: projectId,
                supervisor: supervisorId,
                consultant: consultantApplicantId, // Use applicant ID for the form
                consultancy_duration: String(data.data.consultancy_duration),
            });
        }
    }, [data, id, form, consultantOptions]);

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

            console.log('📅 Duration Calculation:', {
                startDate,
                endDate,
                diffDays,
                calculation: `${endDate} - ${startDate} = ${diffDays} days`
            });

            // Only set if the duration is valid (positive number)
            if (diffDays > 0) {
                form.setValue("consultancy_duration", String(diffDays));
            } else {
                // If end date is before start date, show warning
                console.warn('⚠️ End date is before start date');
                form.setValue("consultancy_duration", "0");
            }
        }
    }, [startDate, endDate, form]);

    return (
        <div className="space-y-6">
            <BackNavigation extraText="Create Consultancy Report" />
            <Card>
                <CardContent className="p-5">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-3 gap-5">
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

                                <FormCombobox
                                    label="Consultant"
                                    name="consultant"
                                    placeholder="Select Consultant"
                                    searchPlaceholder="Search consultants..."
                                    emptyMessage="No consultant found."
                                    required
                                    options={consultantOptions}
                                />

                                <FormInput
                                    type="date"
                                    label="Date"
                                    name="report_date"
                                    required
                                />
                            </div>

                            <h3 className="font-bold">Consultancy Period</h3>

                            <div className="grid grid-cols-3 gap-5">
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
                                    label="Report Duration (Days)"
                                    name="consultancy_duration"
                                    placeholder="Auto-calculated from dates"
                                    required
                                    disabled
                                    className="bg-gray-50"
                                />
                            </div>

                            <FormTextArea
                                label="Purpose"
                                name="purpose"
                                placeholder="Enter Purpose"
                                required
                            />

                            <FormTextArea
                                label="Executive Summary"
                                name="executive_summary"
                                placeholder="Enter Executive Summary"
                                required
                            />

                            <FormTextArea
                                label="Activities, Accomplishments, & Deliverables"
                                name="achievements"
                                placeholder="Enter Activities, Accomplishments, & Deliverables"
                                required
                            />

                            <FormTextArea
                                label="Challenges and Recommendations"
                                name="challenges_recommendations"
                                placeholder="Enter Challenges & Recommendations"
                                required
                            />

                            <div className="flex items-center justify-end gap-5">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                >
                                    Cancel
                                </Button>
                                <FormButton
                                    type="submit"
                                    size="lg"
                                    loading={isCreateLoading || isModifyLoading}
                                >
                                    Submit
                                </FormButton>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
