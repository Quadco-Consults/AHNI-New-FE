import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "components/atoms/FormButton";
import FormInput from "components/atoms/FormInput";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";
import {
    PrequalificationCategorySchema,
    TPrequalificationCategoryData,
    TPrequalificationCategoryFormValues,
} from "components/modules-types/procurement/prequalification-category";
import {
    useAddPrequalificationCategory,
    useUpdatePrequalificationCategory,
} from "@/features/modules/controllers/procurement/prequalification-categoryController";
import FormTextArea from "components/atoms/FormTextArea";

const AddPrequalificationCategory = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TPrequalificationCategoryData;
    const form = useForm<TPrequalificationCategoryFormValues>({
        resolver: zodResolver(PrequalificationCategorySchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
        },
    });

    const [prequalificationCategory, { isLoading }] =
        useAddPrequalificationCategory();
    const [
        updatePrequalificationCategory,
        { isLoading: updatePrequalificationCategoryLoading },
    ] = useUpdatePrequalificationCategory();

    const dispatch = useAppDispatch();
    const onSubmit: SubmitHandler<TPrequalificationCategoryFormValues> = async (
        data
    ) => {
        try {
            dialogProps?.type === "update"
                ? await updatePrequalificationCategory({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  }).unwrap()
                : await prequalificationCategory(data).unwrap();
            toast.success("Pre-qualification Category Added Succesfully");
            dispatch(closeDialog());
            form.reset();
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
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
                        name="description"
                        placeholder="Enter Description"
                    />

                    <div className="flex justify-start gap-4">
                        <FormButton
                            loading={
                                isLoading ||
                                updatePrequalificationCategoryLoading
                            }
                        >
                            Save
                        </FormButton>
                    </div>
                </form>
            </Form>
        </CardContent>
    );
};

export default AddPrequalificationCategory;
