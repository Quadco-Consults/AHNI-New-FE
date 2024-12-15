import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";
import {
    CostCategorySchema,
    TCostCategoryData,
    TCostCategoryFormValues,
} from "definations/modules/finance/cost-category";
import {
    useAddCostCategoryMutation,
    useUpdateCostCategoryMutation,
} from "services/modules/finance/cost-category";

const AddCostCategory = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TCostCategoryData;

    const form = useForm<TCostCategoryFormValues>({
        resolver: zodResolver(CostCategorySchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
            code: data?.code ?? "",
        },
    });

    const [addCostCategory, { isLoading }] = useAddCostCategoryMutation();
    const [updateCostCategory, { isLoading: updateLoading }] =
        useUpdateCostCategoryMutation();

    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<TCostCategoryFormValues> = async (data) => {
        try {
            dialogProps?.type === "update"
                ? await updateCostCategory({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  }).unwrap()
                : await addCostCategory(data).unwrap();
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
                    className="flex flex-col gap-y-5"
                >
                    <FormInput
                        label="Name"
                        name="name"
                        placeholder="Enter Name"
                        required
                    />
                    <FormInput
                        label="Description"
                        name="description"
                        placeholder="Enter Description"
                    />

                    <FormInput
                        label="Code"
                        name="code"
                        required
                        placeholder="Enter Code"
                    />
                    <div className="flex justify-start gap-4">
                        <FormButton loading={isLoading || updateLoading}>
                            Save
                        </FormButton>
                    </div>
                </form>
            </Form>
        </CardContent>
    );
};

export default AddCostCategory;
