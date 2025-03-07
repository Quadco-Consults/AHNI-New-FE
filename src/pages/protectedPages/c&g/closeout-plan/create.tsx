import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query";
import BackNavigation from "atoms/BackNavigation";
import FadedButton from "atoms/FadedButton";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { CG_ROUTES } from "constants/RouterConstants";
import {
    CloseOutPlanSchema,
    TCloseOutPlanFormData,
} from "definations/c&g/closeout-plan";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    useCreateCloseOutPlanMutation,
    useGetSingleCloseOutPlanQuery,
    useModifyCloseOutPlanMutation,
} from "services/c&g/closeout-plan";
import { useGetAllDepartmentsQuery } from "services/modules/config/department";
import { useGetAllLocationsQuery } from "services/modules/config/location";
import { useGetAllProjectsQuery } from "services/project";
import { toast } from "sonner";

export default function CreateCloseOutPlan() {
    const [searchParams] = useSearchParams();

    const id = searchParams.get("id");

    const navigate = useNavigate();

    const form = useForm<TCloseOutPlanFormData>({
        resolver: zodResolver(CloseOutPlanSchema),
        defaultValues: {
            project: "",
            department: "",
            location: "",
            key_task: "",
            tasks: [
                { designation: "", remarks: "", start_date: "", end_date: "" },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        name: "tasks",
        control: form.control,
    });

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

    const { data: department } = useGetAllDepartmentsQuery({
        page: 1,
        size: 2000000,
    });

    const departmentOptions = useMemo(
        () =>
            department?.data.results.map(({ name, id }) => ({
                label: name,
                value: id,
            })),
        [project]
    );

    const { data: location } = useGetAllLocationsQuery({
        page: 1,
        size: 2000000,
    });

    const locationOptions = useMemo(
        () =>
            location?.data.results.map(({ name, id }) => ({
                label: name,
                value: id,
            })),
        [project]
    );

    const [createCloseOutPlan, { isLoading: isCreateLoading }] =
        useCreateCloseOutPlanMutation();

    const [modifyCloseOutPlan, { isLoading: isModifyLoading }] =
        useModifyCloseOutPlanMutation();

    const onSubmit: SubmitHandler<TCloseOutPlanFormData> = async (data) => {
        try {
            if (id) {
                await modifyCloseOutPlan({ id, body: data }).unwrap();
                toast.success("Close Out Plan Updated");
            } else {
                await createCloseOutPlan(data).unwrap();
                toast.success("Close Out Plan Created");
            }

            navigate(CG_ROUTES.CLOSE_OUT);
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    const { data } = useGetSingleCloseOutPlanQuery(id ?? skipToken);

    useEffect(() => {
        if (data) {
            const {
                data: { project, department, location },
            } = data;

            form.reset({
                ...data.data,
                project: project.id,
                department: department.id,
                location: location.id,
            });
        }
    }, [data, project, department, location]);

    console.log({ id });

    return (
        <Card>
            <BackNavigation extraText="New Close Out Plan" />

            <CardContent>
                <Form {...form}>
                    <form
                        className="space-y-5"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormSelect
                            label="Project"
                            name="project"
                            placeholder="Select Project"
                            required
                            options={projectOptions}
                        />

                        <FormSelect
                            label="Department"
                            name="department"
                            placeholder="Select Department"
                            required
                            options={departmentOptions}
                        />

                        <FormSelect
                            label="Location"
                            name="location"
                            placeholder="Select Location"
                            required
                            options={locationOptions}
                        />

                        <div className="space-y-5">
                            <FormTextArea
                                label="Key Task"
                                name="key_task"
                                placeholder="Enter Key Task"
                                required
                            />

                            {fields.map((field, index) => (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">
                                            Task {index + 1}
                                        </h3>

                                        <Button
                                            variant="ghost"
                                            onClick={() => remove(index)}
                                        >
                                            <DeleteIcon />
                                        </Button>
                                    </div>
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-2 gap-5"
                                    >
                                        <FormInput
                                            label="Designation"
                                            name={`tasks.${index}.designation`}
                                            placeholder="Enter Designation"
                                            required
                                        />

                                        <FormInput
                                            label="Remarks"
                                            name={`tasks.${index}.remarks`}
                                            placeholder="Enter Remarks"
                                            required
                                        />

                                        <FormInput
                                            type="date"
                                            label="Start Date"
                                            name={`tasks.${index}.start_date`}
                                            required
                                        />

                                        <FormInput
                                            type="date"
                                            label="End Date"
                                            name={`tasks.${index}.end_date`}
                                            required
                                        />
                                    </div>
                                </div>
                            ))}

                            <FadedButton
                                type="button"
                                size="lg"
                                className="text-primary"
                                onClick={() =>
                                    append({
                                        designation: "",
                                        remarks: "",
                                        start_date: "",
                                        end_date: "",
                                    })
                                }
                            >
                                <AddSquareIcon /> Add Task
                            </FadedButton>
                        </div>

                        <div className="flex justify-end items-center gap-x-5">
                            <FadedButton
                                type="button"
                                size="lg"
                                className="text-primary"
                            >
                                Cancel
                            </FadedButton>
                            <FormButton
                                loading={isCreateLoading || isModifyLoading}
                                size="lg"
                            >
                                Submit
                            </FormButton>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
