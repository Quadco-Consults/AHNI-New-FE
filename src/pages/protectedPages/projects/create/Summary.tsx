import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProjectLayout from "./ProjectLayout";
import { Button } from "components/ui/button";
import FormButton from "atoms/FormButton";
import { Label } from "components/ui/label";
import { openDialog } from "store/ui";
import { DialogType, mediumDailogScreen } from "constants/dailogs";
import { FormField, FormItem, Form, FormControl } from "components/ui/form";
import Card from "components/shared/Card";
import FormInput from "atoms/FormInput";
import MultiSelectFormField from "components/ui/multiselect";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextArea from "atoms/FormTextArea";
import { toast } from "sonner";
import { useGetAllUsersQuery } from "services/auth/user";
import {
    addObjective,
    clearObjectives,
    removeObjective,
} from "store/formData/project-objective";
import { addPartner, clearPartners } from "store/formData/project-values";
import useQuery from "hooks/useQuery";
import {
    useAddProjectMutation,
    useGetSingleProjectQuery,
    useUpdateProjectMutation,
} from "services/project";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { FaTimes } from "react-icons/fa";
import FormSelect from "atoms/FormSelect";
import { useGetAllBeneficiaryQuery } from "services/modules/project/beneficiaries";
import { useUseGetAllFundingSourceQuery } from "services/modules/project/funding-source";
import { useGetAllPartnersQuery } from "services/modules/project/partners";
import { ProjectSchema, TProjectFormValues } from "definations/project";
import ConsortiumPartners from "./ConsortiumPartners";
import BreadcrumbCard, { TBreadcrumbList } from "components/shared/Breadcrumb";
import LongArrowLeft from "components/icons/LongArrowLeft";
import { RouteEnum } from "constants/RouterConstants";
import DateInput from "components/shared/DateInput";
import { formatDate } from "utils/date";

const breadcrumbs: TBreadcrumbList[] = [
    { name: "Projects", icon: true },
    { name: "Create", icon: true },
    { name: "Summary", icon: false },
];

export default function ProjectSummaryPage() {
    const { data: beneficiary } = useGetAllBeneficiaryQuery({
        page: 1,
        size: 2000000,
    });

    const { data: fundingSource } = useUseGetAllFundingSourceQuery({
        page: 1,
        size: 2000000,
    });

    const { data: user } = useGetAllUsersQuery({ page: 1, size: 2000000 });

    const { data: partner } = useGetAllPartnersQuery({
        page: 1,
        size: 2000000,
    });

    const userOptions = user?.data?.results?.map((user) => ({
        name: user.first_name + " " + user.last_name,
        id: user.id,
    }));

    const query = useQuery();

    const projectId = query.get("id");

    const { data: project } = useGetSingleProjectQuery(projectId ?? skipToken);

    const [addProject, { isLoading }] = useAddProjectMutation();

    const [updateProject, { isLoading: isUpdateLoading }] =
        useUpdateProjectMutation();

    const navigate = useNavigate();

    const objectives = useAppSelector((state) => state.objectives);

    const dispatch = useAppDispatch();

    const form = useForm<TProjectFormValues>({
        resolver: zodResolver(ProjectSchema),
        defaultValues: {
            title: "",
            project_id: "",
            goal: "",
            narrative: "",
            budget: "0",
            funding_sources: [],
            project_managers: [],
            expected_results: "",
            budget_performance: "0",
            achievement_against_target: "",
            beneficiaries: [],
            currency: "",
            start_date: "",
            end_date: "",
        },
    });

    const {
        handleSubmit,
        reset,
        formState: { errors },
    } = form;

    useEffect(() => {
        if (project) {
            const {
                title,
                project_id,
                goal,
                narrative,
                budget_performance,
                start_date,
                end_date,
                budget,
                project_managers,
                funding_sources,
                expected_results,
                achievement_against_target,
                beneficiaries,
                objectives,
                partners,
                currency,
            } = project?.data;

            const projectManagers = project_managers.map(
                (manager) => manager.id
            );

            const fundingSources = funding_sources.map((source) => source.id);

            const beneficiariesArr = beneficiaries.map((ben) => ben.id);

            reset({
                title,
                project_id,
                goal,
                narrative: narrative || "",
                budget_performance,
                budget: String(budget),
                project_managers: projectManagers,
                funding_sources: fundingSources,
                expected_results,
                achievement_against_target,
                beneficiaries: beneficiariesArr,
                currency,
                start_date,
                end_date,
            });

            objectives?.map((obj) => {
                dispatch(addObjective(obj));
            });

            dispatch(addPartner(partners));
        }
    }, [project, partner]);

    const { pathname } = useLocation();

    const { consortiumPartners } = useAppSelector(
        (state) => state.consortiumPartner
    );

    const onSubmit: SubmitHandler<TProjectFormValues> = async ({
        title,
        project_id,
        goal,
        narrative,
        budget_performance,
        project_managers,
        funding_sources,
        expected_results,
        achievement_against_target,
        beneficiaries,
        budget,
        currency,
        start_date,
        end_date,
    }) => {
        const partnersId = consortiumPartners.map((partner) => partner.id);

        const formData = {
            title: title,
            project_id: project_id,
            goal: goal,
            narrative: narrative,
            budget_performance: budget_performance,
            start_date: formatDate(start_date),
            end_date: formatDate(end_date),
            project_managers: project_managers,
            partners: partnersId,
            funding_sources: funding_sources,
            objectives: objectives.objectives,
            expected_results: expected_results,
            achievement_against_target: achievement_against_target,
            beneficiaries: beneficiaries,
            budget: budget,
            currency: currency,
        };

        try {
            let id;

            if (projectId) {
                await updateProject({ id: projectId, body: formData }).unwrap();
                toast.success("Project Updated Successfully.");
            } else {
                const res = await addProject(formData as any).unwrap();
                id = res.data.id;
                toast.success("Project Added Successfully.");
            }

            let path = pathname;

            path = path.substring(0, path.lastIndexOf("/"));

            path += `/uploads?id=${projectId || id}`;
            navigate(path);

            dispatch(clearObjectives());
            dispatch(clearPartners());
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-5">
                <Link
                    to={RouteEnum.PROJECTS}
                    className="w-[3rem] h-[3rem] rounded-full drop-shadow-md bg-white flex items-center justify-center"
                >
                    <LongArrowLeft />
                </Link>
                <BreadcrumbCard list={breadcrumbs} />
            </div>

            <ProjectLayout>
                <div className="space-y-6">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Card className="space-y-6 py-5">
                                <h4 className="text-lg font-semibold">
                                    Project Summary
                                </h4>

                                <FormInput
                                    label="Project Title"
                                    name="title"
                                    placeholder="Enter Title"
                                    required
                                />

                                <FormInput
                                    label="Project ID"
                                    name="project_id"
                                    placeholder="Enter ID"
                                    required
                                />

                                <FormTextArea
                                    name="goal"
                                    label="Goal of the project"
                                    placeholder="Enter Goal"
                                    required
                                />

                                <FormTextArea
                                    name="narrative"
                                    label="Narrative"
                                    placeholder="Enter Narrative"
                                    required
                                />

                                {projectId && (
                                    <FormInput
                                        name="budget_performance"
                                        label="Budget Performance"
                                        placeholder="Enter Budget Performance"
                                        required
                                    />
                                )}

                                <FormSelect
                                    label="Currency"
                                    name="currency"
                                    required
                                    placeholder="Select Currency"
                                    options={[
                                        { label: "NGN", value: "NGN" },
                                        { label: "USD", value: "USD" },
                                    ]}
                                />

                                <div className="grid grid-cols-2 gap-5">
                                    <DateInput
                                        label="Start Date"
                                        name="start_date"
                                    />

                                    <DateInput
                                        label="End Date"
                                        name="end_date"
                                    />
                                </div>

                                <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                                    <FormInput
                                        type="number"
                                        label="Budget (Total Estimated Amount)"
                                        name="budget"
                                        placeholder="Enter Budget"
                                        required
                                    />

                                    <div>
                                        <Label className="font-semibold">
                                            Project Managers
                                        </Label>

                                        <FormField
                                            control={form.control}
                                            name="project_managers"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <MultiSelectFormField
                                                            options={
                                                                userOptions ||
                                                                []
                                                            }
                                                            defaultValue={
                                                                field.value
                                                            }
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            placeholder="Select options"
                                                            variant="inverted"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        {errors.project_managers && (
                                            <span className="text-sm text-red-500 font-medium">
                                                {
                                                    errors.project_managers
                                                        .message
                                                }
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label className="font-semibold">
                                        Funding Sources
                                    </Label>
                                    <FormField
                                        control={form.control}
                                        name="funding_sources"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <MultiSelectFormField
                                                        options={
                                                            fundingSource?.data
                                                                .results || []
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        placeholder="Select Funding Sources"
                                                        variant="inverted"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    {errors.funding_sources && (
                                        <span className="text-sm text-red-500 font-medium">
                                            {errors.funding_sources.message}
                                        </span>
                                    )}
                                </div>

                                <hr />

                                <div className=" mt-10 space-y-3">
                                    <Label className="font-semibold text-red-600">
                                        Objectives
                                    </Label>
                                    <div className="flex flex-wrap gap-3">
                                        {objectives.objectives.map(
                                            (objective, index) => (
                                                <div
                                                    key={index}
                                                    className="border px-7 py-4 space-y-3 rounded-lg relative "
                                                >
                                                    <p className="text-sm font-semibold">
                                                        {objective?.objective}
                                                    </p>

                                                    {objective?.sub_objectives && (
                                                        <ul className="space-y-2">
                                                            {objective?.sub_objectives.map(
                                                                (
                                                                    obj: any,
                                                                    i: number
                                                                ) => (
                                                                    <li
                                                                        key={i}
                                                                        className="text-sm text-gray-500 list-disc pl-5"
                                                                    >
                                                                        {obj}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    )}

                                                    <Button
                                                        variant="ghost"
                                                        type="button"
                                                        className="absolute p-0 -right-2 -top-4 w-fit h-fit"
                                                        title="Delete Objective"
                                                        onClick={() =>
                                                            dispatch(
                                                                removeObjective(
                                                                    objective.objective
                                                                )
                                                            )
                                                        }
                                                    >
                                                        <FaTimes
                                                            color="red"
                                                            size={16}
                                                        />
                                                    </Button>
                                                </div>
                                            )
                                        )}

                                        <div>
                                            <Button
                                                variant="ghost"
                                                type="button"
                                                className="text-[#DEA004] font-medium border shadow-sm py-2 px-5 rounded-lg text-sm"
                                                onClick={() =>
                                                    dispatch(
                                                        openDialog({
                                                            type: DialogType.ProjectObjectiveModal,
                                                            dialogProps: {
                                                                ...mediumDailogScreen,
                                                            },
                                                        })
                                                    )
                                                }
                                            >
                                                Click to add objectives
                                            </Button>
                                        </div>
                                    </div>

                                    {objectives.objectives.length === 0 && (
                                        <span className="text-sm text-red-500 font-medium">
                                            Please select objectives
                                        </span>
                                    )}
                                </div>

                                <FormInput
                                    label="Expected results"
                                    name="expected_results"
                                    placeholder="Enter Expected Results"
                                    required
                                />

                                <FormInput
                                    label="Achievement against target"
                                    name="achievement_against_target"
                                    placeholder="Enter Achievement Against Target"
                                    required
                                />

                                <div className="space-y-1">
                                    <Label className="font-semibold">
                                        Target population
                                    </Label>
                                    <FormField
                                        control={form.control}
                                        name="beneficiaries"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <MultiSelectFormField
                                                        options={
                                                            beneficiary?.data
                                                                ?.results || []
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        placeholder="Select Target Population"
                                                        variant="inverted"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    {errors.beneficiaries && (
                                        <span className="text-sm text-red-500 font-medium">
                                            {errors.beneficiaries.message}
                                        </span>
                                    )}
                                </div>

                                <ConsortiumPartners />
                            </Card>

                            <div className="flex justify-end gap-5 mt-16">
                                <Button
                                    onClick={() => navigate(-1)}
                                    type="button"
                                    className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                                    size="lg"
                                >
                                    Cancel
                                </Button>
                                <FormButton
                                    loading={isLoading || isUpdateLoading}
                                    disabled={isLoading}
                                    type="submit"
                                    size="lg"
                                >
                                    Next
                                </FormButton>
                            </div>
                        </form>
                    </Form>
                </div>
            </ProjectLayout>
        </div>
    );
}
