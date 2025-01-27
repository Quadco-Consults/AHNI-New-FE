import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "atoms/BackNavigation";
import FadedButton from "atoms/FadedButton";
import FormButton from "atoms/FormButton";
import FormSelect from "atoms/FormSelect";
import { Form } from "components/ui/form";
import { ClosuOutPlanSchema } from "definations/candg-validator";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
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

    const onSubmit: SubmitHandler<z.infer<typeof ClosuOutPlanSchema>> = async (
        data
    ) => {};

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
                                label="Project "
                                name="project"
                                placeholder="Select Project"
                                required
                            />

                            <div className="flex justify-end items-center gap-x-[1rem]">
                                <div>
                                    <FadedButton type="button">
                                        <p className="text-primary">Cancel</p>
                                    </FadedButton>
                                </div>
                                <div>
                                    <FormButton loading={false}>
                                        Finish
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
