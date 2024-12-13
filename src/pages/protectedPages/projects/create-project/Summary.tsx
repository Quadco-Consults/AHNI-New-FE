import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import ProjectLayout from "./ProjectLayout";
import { Button } from "components/ui/button";
import FormButton from "atoms/FormButton";
import { Label } from "components/ui/label";
import { openDialog } from "store/ui";
import { DialogType, mediumDailogScreen } from "constants/dailogs";
import { CalendarIcon, ChevronRight } from "lucide-react";
import { FormField, FormItem, Form, FormControl } from "components/ui/form";
import Card from "components/shared/Card";
import FormInput from "atoms/FormInput";
import MultiSelectFormField from "components/ui/multiselect";
import LocationSvg from "assets/svgs/LocationSvg";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectsSummarySchema } from "definations/project-validator";
import { z } from "zod";
import FormTextArea from "atoms/FormTextArea";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "lib/utils";
import { Calendar } from "components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { useGetUserQuery } from "services/users";
import {
    useBeneficiariesQuery,
    useFundingSourcesQuery,
    usePartnersQuery,
} from "services/modules/project/moduleProjects";
import {
    addObjective,
    clearObjectives,
    removeObjective,
} from "store/formData/project-objective";
import { addPartners, clearPartners } from "store/formData/project-values";
import useQuery from "hooks/useQuery";
import {
    useCreateProjectMutation,
    useGetSingleProjectQuery,
    useUpdateProjectMutation,
} from "services/projectsApi/projectsApi";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { FaTimes } from "react-icons/fa";
import FormSelect from "atoms/FormSelect";

const Summary = () => {
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    const { data: beneficiaries } = useBeneficiariesQuery({
        no_paginate: false,
    });

    const { data: fundingSourceData } = useFundingSourcesQuery({
        no_paginate: false,
    });

    const { data: users } = useGetUserQuery({ no_paginate: false });

    const userOptions = users?.data?.results?.map((user) => ({
        name: user.first_name + " " + user.last_name,
        id: user.id,
    }));

    const query = useQuery();

    const projectId = query.get("id");

    const { data: project } = useGetSingleProjectQuery(projectId ?? skipToken);

    const [addProject, { isLoading }] = useCreateProjectMutation();

    const [updateProject, { isLoading: isUpdateLoading }] =
        useUpdateProjectMutation();

    const navigate = useNavigate();

    const { data: partnersResult } = usePartnersQuery({
        no_paginate: false,
    });

    const objectives = useAppSelector((state) => state.objectives);
    const { partners } = useAppSelector((state) => state.partnerLocation);

    const partnerItems = partnersResult?.data?.results
        ?.filter((partner) => partners.includes(partner.id))
        .map(({ id, name, state }) => ({
            id,
            name,
            state,
        }));

    const dispatch = useAppDispatch();

    const form = useForm<z.infer<typeof ProjectsSummarySchema>>({
        resolver: zodResolver(ProjectsSummarySchema),
        defaultValues: {
            project_id: "",
            goal: "",
            budget: 0,
            funding_sources: [],
            project_managers: [],
            expected_results: "",
            budget_performance: "0",
            achievement_against_target: "",
            beneficiaries: [],
            currency: "",
        },
    });

    const { handleSubmit, reset } = form;

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
                budget,
                project_managers: projectManagers,
                funding_sources: fundingSources,
                expected_results,
                achievement_against_target,
                beneficiaries: beneficiariesArr,
                currency,
            });

            objectives?.map((obj) => {
                dispatch(addObjective(obj));
            });

            setStartDate(new Date(start_date));
            setEndDate(new Date(end_date));

            const partnerIds = partners.map((partner) => partner.id);

            dispatch(addPartners(partnerIds));
        }
    }, [project, partnersResult]);

    const { pathname } = useLocation();

    const onSubmit = async (data: z.infer<typeof ProjectsSummarySchema>) => {
        const formData = {
            title: data.title,
            project_id: data.project_id,
            goal: data.goal,
            narrative: data.narrative,
            budget_performance: data.budget_performance,
            start_date: format(startDate as Date, "yyyy-MM-dd"),
            end_date: format(endDate as Date, "yyyy-MM-dd"),
            project_managers: data.project_managers,
            partners: partners,
            funding_sources: data.funding_sources,
            objectives: objectives.objectives,
            expected_results: data.expected_results,
            achievement_against_target: data.achievement_against_target,
            beneficiaries: data.beneficiaries,
            budget: Number(data.budget),
            currency: data.currency,
        };

        try {
            let id;

            if (projectId) {
                await updateProject({ id: projectId, body: formData }).unwrap();
            } else {
                const res = await addProject(formData).unwrap();
                id = res.data.id;
            }

            toast.success("Project successfully added.");

            let path = pathname;

            path = path.substring(0, path.lastIndexOf("/"));

            path += `/uploads?id=${projectId || id}`;
            navigate(path);
        } catch (error: any) {
            toast.error(error.data.message);
        }

        dispatch(clearObjectives());
        dispatch(clearPartners());
    };

    return (
        <ProjectLayout>
            <div className="space-y-6">
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Card className="space-y-6 py-5">
                            <h4 className="text-lg font-semibold">
                                Project Summary
                            </h4>
                            <FormInput name="title" label="Project Title" />
                            <FormInput name="project_id" label="Project ID" />
                            <FormTextArea
                                name="goal"
                                label="Goal of the project"
                            />
                            <FormTextArea
                                name="narrative"
                                label="Narrative"
                                required
                            />

                            {projectId && (
                                <FormInput
                                    name="budget_performance"
                                    label="Budget Performance"
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
                                <div>
                                    <Label>Start Date</Label>
                                    <br />
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !startDate &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {startDate ? (
                                                    format(
                                                        startDate,
                                                        "yyy-MM-dd"
                                                    )
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={startDate}
                                                onSelect={setStartDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div>
                                    <Label>End Date</Label>
                                    <br />
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !endDate &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {endDate ? (
                                                    format(endDate, "yyy-MM-dd")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={endDate}
                                                onSelect={setEndDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                                <FormInput
                                    name="budget"
                                    label="Budget  (Total Estimated Amount)"
                                    type="number"
                                />

                                <div>
                                    <Label className="font-semibold">
                                        Project Manager
                                    </Label>

                                    <FormField
                                        control={form.control}
                                        name="project_managers"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <MultiSelectFormField
                                                        options={
                                                            userOptions || []
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
                                                        fundingSourceData?.data
                                                            .results || []
                                                    }
                                                    defaultValue={field.value}
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
                            </div>

                            <FormInput
                                label="Expected results"
                                name="expected_results"
                                required
                            />

                            <FormInput
                                label="Achievement against target"
                                name="achievement_against_target"
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
                                                        beneficiaries?.data
                                                            ?.results || []
                                                    }
                                                    defaultValue={field.value}
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
                            </div>

                            <div className="flex flex-col w-full mt-10 space-y-3">
                                <Label className="font-semibold">
                                    Consortium partners
                                </Label>
                                <div className="flex flex-wrap gap-3">
                                    {partnerItems?.map((partner) => (
                                        <div
                                            key={partner.id}
                                            className="border p-5 space-y-3 rounded-lg"
                                        >
                                            <div className="flex gap-3 items-center">
                                                <h4 className="font-semibold">
                                                    {partner.name}
                                                </h4>
                                            </div>

                                            <div className="flex items-cemter gap-2">
                                                <LocationSvg />
                                                {partner.state}
                                            </div>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="text-[#DEA004]"
                                        onClick={() => {
                                            dispatch(
                                                openDialog({
                                                    type: DialogType.ConsortiumModal,
                                                    dialogProps: {
                                                        width: "max-w-6xl",
                                                        prevPartners: project
                                                            ?.data
                                                            .partners as unknown as string,
                                                    },
                                                })
                                            );
                                        }}
                                    >
                                        Click to select consortium partners
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        <div className="flex justify-between gap-5 mt-16">
                            <Button
                                onClick={() => navigate(-1)}
                                type="button"
                                className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                            >
                                Cancel
                            </Button>
                            <FormButton
                                loading={isLoading || isUpdateLoading}
                                disabled={isLoading}
                                type="submit"
                                suffix={<ChevronRight size={14} />}
                            >
                                Next
                            </FormButton>
                        </div>
                    </form>
                </Form>
            </div>
        </ProjectLayout>
    );
};

export default Summary;
