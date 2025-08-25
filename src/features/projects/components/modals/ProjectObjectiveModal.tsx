"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormTextArea from "components/atoms/FormTextArea";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { X } from "lucide-react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { addObjective } from "store/formData/project-objective";
import { closeDialog } from "store/ui";
import { z } from "zod";

const ProjectObjectiveSchema = z.object({
    objective: z.string().min(1, "Please enter an objective"),
    sub_objectives: z.array(z.string().min(1, "Sub-objective cannot be empty")),
});

export type TProjectObjective = z.infer<typeof ProjectObjectiveSchema>;

const ProjectObjectiveModal = () => {
    const dispatch = useAppDispatch();

    const form = useForm<TProjectObjective>({
        resolver: zodResolver(ProjectObjectiveSchema),
        defaultValues: {
            objective: "",
            sub_objectives: [],
        },
    });

    const { control, handleSubmit } = form;

    const { fields, append, remove } = useFieldArray({
        // @ts-ignore
        name: "sub_objectives",
        control: control,
    });

    const onSubmit: SubmitHandler<z.infer<typeof ProjectObjectiveSchema>> = (
        data
    ) => {
        dispatch(addObjective(data));
        dispatch(closeDialog());
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                <h4 className="text-xl font-semibold">Add Objective</h4>

                <FormTextArea name="objective" label="Objective" required />

                <div className="space-y-3">
                    <h4 className="text-xl font-semibold">
                        Add Sub-Objectives
                    </h4>

                    {fields.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-2">
                            <div className="w-[90%]">
                                <FormTextArea
                                    name={`sub_objectives.${index}`}
                                    label="Sub-Objective"
                                    required
                                />
                            </div>
                            <div>
                                <Button
                                    onClick={() => remove(index)}
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500"
                                >
                                    <X />
                                </Button>
                            </div>
                        </div>
                    ))}

                    <Button
                        onClick={() => append("")}
                        type="button"
                        className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                    >
                        Add
                    </Button>
                </div>

                <div className="flex justify-end gap-5 mt-16">
                    <Button
                        type="button"
                        className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                        onClick={() => dispatch(closeDialog())}
                    >
                        Cancel
                    </Button>
                    <FormButton>Done</FormButton>
                </div>
            </form>
        </Form>
    );
};

export default ProjectObjectiveModal;