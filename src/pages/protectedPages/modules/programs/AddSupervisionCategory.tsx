import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import {
    SupervisionCategorySchema,
    TSupervisionCategoryData,
    TSupervisionCategoryFormValues,
} from "definations/modules/program/supervision-category";
import {
    useAddSupervisionCategoryMutation,
    useUpdateSupervisionCategoryMutation,
} from "services/modules/program/supervision-category";
import FormTextArea from "atoms/FormTextArea";

const AddSupervisionCategory = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TSupervisionCategoryData;

    const form = useForm<TSupervisionCategoryFormValues>({
        resolver: zodResolver(SupervisionCategorySchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
        },
    });

    const dispatch = useAppDispatch();

    const [supervisionCategory, { isLoading }] =
        useAddSupervisionCategoryMutation();
    const [updateSupervisionCategory, { isLoading: updateSupervisionLoading }] =
        useUpdateSupervisionCategoryMutation();

    const onSubmit: SubmitHandler<TSupervisionCategoryFormValues> = async (
        data
    ) => {
        try {
            dialogProps?.type === "update"
                ? await updateSupervisionCategory({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  }).unwrap()
                : await supervisionCategory(data).unwrap();
            toast.success("Supervision Category Added Succesfully");
            dispatch(closeDialog());
            form.reset();
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
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

export default AddSupervisionCategory;
