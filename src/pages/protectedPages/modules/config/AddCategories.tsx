import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";
import {
    CategorySchema,
    TCategoryData,
    TCategoryFormValues,
} from "definations/modules/config/category";
import {
    useAddCategoryMutation,
    useUpdateCategoryMutation,
} from "services/modules/config/category";
import FormTextArea from "atoms/FormTextArea";

const jobCategoryOptions = [
    { label: "Goods", value: "GOODS" },
    { label: "Service", value: "SERVICE" },
    { label: "Work", value: "WORK" },
    { label: "Others", value: "OTHERS" },
];

const AddCategories = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TCategoryData;
    const form = useForm<TCategoryFormValues>({
        resolver: zodResolver(CategorySchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
            // @ts-ignore
            job_category: data?.job_category ?? undefined,
            serial_number: data?.serial_number ?? "",
            code: data?.code ?? "",
        },
    });

    const [category, { isLoading }] = useAddCategoryMutation();

    const [updateCategory, { isLoading: updateCategoryLoading }] =
        useUpdateCategoryMutation();

    const dispatch = useAppDispatch();
    const onSubmit: SubmitHandler<TCategoryFormValues> = async (data) => {
        try {
            if (dialogProps?.type === "update") {
                await updateCategory({
                    //@ts-ignore
                    id: String(dialogProps?.data?.id),
                    body: data,
                }).unwrap();
            } else {
                await category(data).unwrap();
            }

            toast.success("Category Added Succesfully");
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

                    <FormInput
                        label="Code"
                        name="code"
                        placeholder="Enter Code"
                        required
                    />

                    <FormInput
                        label="Serial Number"
                        name="serial_number"
                        type="number"
                        placeholder="Enter Serial Number"
                        required
                    />

                    <FormSelect
                        label="Job Category"
                        name="job_category"
                        required
                        placeholder="Select Job Category"
                        options={jobCategoryOptions}
                    />

                    <div className="flex justify-start gap-4">
                        <FormButton
                            loading={isLoading || updateCategoryLoading}
                        >
                            Save
                        </FormButton>
                    </div>
                </form>
            </Form>
        </CardContent>
    );
};

export default AddCategories;
