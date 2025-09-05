"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import {
    SupervisionCriteriaSchema,
    TSupervisionCriteriaData,
    TSupervisionCriteriaFormValues,
} from "features/programs/types/program/supervision-criteria";
import {
    useAddSupervisionCriteriaController,
    useUpdateSupervisionCriteriaController,
} from "@/features/modules/controllers/program/supervisionCriteriaController";
import { useGetAllSupervisionCategoryController } from "@/features/modules/controllers/program/supervisionCategoryController";
import FormTextArea from "components/atoms/FormTextArea";

const AddSupervisionCriteria = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TSupervisionCriteriaData;

    const form = useForm<TSupervisionCriteriaFormValues>({
        resolver: zodResolver(SupervisionCriteriaSchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
            evaluation_category: data?.evaluation_category ?? "",
        },
    });

    const dispatch = useAppDispatch();

    const { data: category } = useGetAllSupervisionCategoryController({
        page: 1,
        size: 2000000,
    });

    const categoryOptions = category?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
    }));

    const [addSupervisionCriteria, { isLoading }] =
        useAddSupervisionCriteriaController();

    const [updateSupervisionCriteria, { isLoading: updateSupervisionLoading }] =
        useUpdateSupervisionCriteriaController();

    const onSubmit: SubmitHandler<TSupervisionCriteriaFormValues> = async (
        data
    ) => {
        try {
            dialogProps?.type === "update"
                ? await updateSupervisionCriteria({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  })
                : await addSupervisionCriteria(data);
            toast.success("Supervision Category Added Succesfully");
            dispatch(closeDialog());
            form.reset();
        } catch (error: any) {
            toast.error(error.response?.data?.message ?? error.message ?? "Something went wrong");
        }
    };

    return (
        <CardContent>
            <Form {...form}>
                <form
                    action=""
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-y-7"
                >
                    <FormInput
                        label="Name"
                        name="name"
                        placeholder="Enter Name"
                        required
                    />

                    <FormTextArea
                        label="Description"
                        placeholder="Enter Description"
                        name="description"
                    />

                    <FormSelect
                        label="Supervision Evaluation Category"
                        placeholder="Select Evaluation Category"
                        name="evaluation_category"
                        required
                        options={categoryOptions}
                    />

                    <div className="flex justify-start gap-4">
                        <FormButton
                            loading={isLoading || updateSupervisionLoading}
                        >
                            Save
                        </FormButton>
                    </div>
                </form>
            </Form>
        </CardContent>
    );
};

export default AddSupervisionCriteria;