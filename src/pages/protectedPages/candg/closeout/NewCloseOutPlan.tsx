import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "atoms/BackNavigation";
import FadedButton from "atoms/FadedButton";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import AddSquareIconFaded from "components/icons/AddSquareIconFaded";
import { Form } from "components/ui/form";
import { ClosuOutPlanSchema } from "definations/candg-validator";
import React, { useMemo } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { closeoutPlanAPis } from "services/cAndGApi/closeOutPlan";
import DepartmentsAPI from "services/configs/departments";
import { useGetPartnersQuery } from "services/projectsApi/partnersApi";
import { useGetProjectsQuery } from "services/project";
import { toast } from "sonner";
import { z } from "zod";

const NewCloseOutPlan: React.FC = () => {
    const form = useForm<z.infer<typeof ClosuOutPlanSchema>>({
        resolver: zodResolver(ClosuOutPlanSchema),
        defaultValues: {
            tasks: [
                {
                    designation: "",
                    start_date: "",
                    end_date: "",
                    status: "Pending",
                    remarks: "",
                },
            ],
        },
    });

    const options = [
        { value: "Pending", label: "Pending" },
        { value: "Approved", label: "Approved" },
        { value: "Rejected", label: "Rejected" },
    ];

    const { control } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "tasks",
    });

    const [addCloseOutPlan, addCloseOutPlanResults] =
        closeoutPlanAPis.useAddCloseOutPlanMutation();

    const onSubmit: SubmitHandler<z.infer<typeof ClosuOutPlanSchema>> = async (
        data
    ) => {
        try {
            const result = await addCloseOutPlan({
                ...data,
                reference_number: "AGIF-0023",
            }).unwrap();
            if (result) {
                toast.success("Grant added");
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } catch (error: any) {
            toast.error(error?.data?.errors?.[0]?.attr + " is required");
            // console.log(error);
        }
    };

    return (
        <main className="w-full flex flex-col items-center justify-center gap-y-[1.875rem]">
            <section className="w-full">
                <div className="w-full flex ">
                    <BackNavigation />
                </div>
            </section>
            <section className="w-full">
                <div className="w-full bg-white p-5 space-y-[1.25rem]">
                    <p className="text-[#1A0000] text-[1.25rem] font-semibold py-5">
                        Create Close Out Plan
                    </p>
                    <Form {...form}>
                        <form
                            className="flex flex-col gap-y-[1.25rem]"
                            action=""
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FormSelect
                                label="Project Title"
                                name="project"
                                // options={projects}
                                placeholder="Enter project title"
                                required
                            />
                            <FormSelect
                                label="Select Department"
                                name="department"
                                // options={departments}
                                placeholder="Program/Technical"
                                required
                            />
                            <FormSelect
                                label="Location"
                                name="location"
                                // options={partners}
                                placeholder="Abuja"
                                required
                            />
                            <FormInput
                                label="Key Task"
                                name="key_task"
                                placeholder="Key task"
                                required
                            />
                            <div className="flex flex-col gap-y-[1.25rem]">
                                <div className="">
                                    {fields.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className="flex relative flex-wrap gap-y-[2rem] py-[2rem] justify-between"
                                        >
                                            <div className="w-[49%]">
                                                <FormInput
                                                    name={`tasks.${index}.designation`}
                                                    label="Designation"
                                                    required={true}
                                                    placeholder="Enter designation"
                                                />
                                            </div>
                                            <div className="w-[49%]">
                                                <FormInput
                                                    name={`tasks.${index}.remarks`}
                                                    label="Remarks"
                                                    required={true}
                                                    placeholder="Enter remarks"
                                                />
                                            </div>
                                            <div className="w-full">
                                                <FormSelect
                                                    name={`tasks.${index}.status`}
                                                    label="Status"
                                                    options={options}
                                                    required={true}
                                                    placeholder="Select status"
                                                />{" "}
                                            </div>
                                            <div className="w-[49%]">
                                                <FormInput
                                                    name={`tasks.${index}.start_date`}
                                                    min={`${new Date()}`}
                                                    label="Start Date"
                                                    required={true}
                                                    placeholder="Enter start date"
                                                    type="date"
                                                />
                                            </div>
                                            <div className="w-[49%]">
                                                <FormInput
                                                    name={`tasks.${index}.end_date`}
                                                    min={`${new Date()}`}
                                                    label="End Date"
                                                    required={true}
                                                    placeholder="Enter end date"
                                                    type="date"
                                                />
                                            </div>
                                            {/* <Controller control={control} name={`tasks.${index}.status`} render={({ field }) => } /> */}
                                            {index !== 0 && (
                                                <button
                                                    className="absolute top-0 right-0 z-[9999]"
                                                    type="button"
                                                    onClick={() =>
                                                        remove(index)
                                                    }
                                                >
                                                    Remove Task
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="w-fit">
                                    <FadedButton
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            append({
                                                designation: "",
                                                start_date: "",
                                                end_date: "",
                                                status: "Pending",
                                                remarks: "",
                                            });
                                        }}
                                    >
                                        <div className="flex p-2 gap-x-[.625rem] text-primary font-semibold text-sm w-fit">
                                            <AddSquareIconFaded />
                                            <p>Click to Add More Task</p>
                                        </div>
                                    </FadedButton>
                                </div>
                            </div>
                            <div className="flex justify-end items-center gap-x-[1rem]">
                                <div>
                                    <FadedButton type="button">
                                        <p className="text-primary">Cancel</p>
                                    </FadedButton>
                                </div>
                                <div>
                                    <FormButton
                                        loading={
                                            addCloseOutPlanResults.isLoading
                                        }
                                    >
                                        <p>Finish</p>
                                    </FormButton>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </section>
        </main>
    );
};

export default NewCloseOutPlan;
