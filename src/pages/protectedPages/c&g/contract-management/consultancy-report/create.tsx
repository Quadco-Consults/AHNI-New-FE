import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import FormInput from "atoms/FormInput";
import BackNavigation from "atoms/BackNavigation";
import { Card, CardContent } from "components/ui/card";
import { toast } from "sonner";
import { Button } from "components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CG_ROUTES } from "constants/RouterConstants";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useMemo } from "react";
import FormTextArea from "atoms/FormTextArea";
import {
    ConsultancyReportSchema,
    TConsultancyReportFormData,
} from "definations/c&g/contract-management/consultancy-report";
import {
    useCreateConsultancyReportMutation,
    useGetSingleConsultancyReportQuery,
    useModifyConsultancyReportMutation,
} from "services/c&g/contract-management/consultancy-report";
import FormButton from "atoms/FormButton";
import FormSelect from "atoms/FormSelectField";
import { useGetAllUsersQuery } from "services/auth/user";
import { useGetAllConsultantManagementsQuery } from "services/c&g/contract-management/consultancy-management/consultant-management";
import { useGetAllProjectsQuery } from "services/project";

export default function CreateConsultancyReport() {
    const form = useForm<TConsultancyReportFormData>({
        resolver: zodResolver(ConsultancyReportSchema),
        defaultValues: {
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

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const navigate = useNavigate();

    const { data: project } = useGetAllProjectsQuery({
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

    const { data: user } = useGetAllUsersQuery({
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

    const { data: consultant } = useGetAllConsultantManagementsQuery({
        page: 1,
        size: 2000000,
        type: "",
    });

    const consultantOptions = useMemo(
        () =>
            consultant?.data.results.map(({ title, id }) => ({
                label: title,
                value: id,
            })),
        [consultant]
    );

    const [createConsultancyReport, { isLoading: isCreateLoading }] =
        useCreateConsultancyReportMutation();

    const [modifyConsultancyReport, { isLoading: isModifyLoading }] =
        useModifyConsultancyReportMutation();

    const onSubmit: SubmitHandler<TConsultancyReportFormData> = async (
        data
    ) => {
        try {
            if (id) {
                await modifyConsultancyReport({ id, body: data }).unwrap();
                toast.success("Consultancy Report Updated");
            } else {
                await createConsultancyReport(data).unwrap();
                toast.success("Consultancy Report Created");
            }

            navigate(CG_ROUTES.CONSULTANCY_REPORT);
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    const { data } = useGetSingleConsultancyReportQuery(id ?? skipToken);

    useEffect(() => {
        if (data) {
            form.reset({
                ...data.data,
                supervisor: data.data.supervisor.id,
                consultant: data.data.consultant.id,
                consultancy_duration: String(data.data.consultancy_duration),
            });
        }
    }, [data]);

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
                                <FormSelect
                                    label="Project"
                                    name="project"
                                    placeholder="Select Project"
                                    required
                                    options={projectOptions}
                                />

                                <FormSelect
                                    label="Supervisor"
                                    name="supervisor"
                                    placeholder="Select Supervisor"
                                    required
                                    options={userOptions}
                                />

                                <FormSelect
                                    label="Consultant"
                                    name="consultant"
                                    placeholder="Select Consultant"
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
                                    label="Report Duration"
                                    name="consultancy_duration"
                                    placeholder="Enter Report Duration"
                                    required
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
