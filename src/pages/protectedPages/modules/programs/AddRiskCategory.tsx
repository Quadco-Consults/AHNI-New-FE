import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    useAddRiskCategoryMutation,
    useUpdateRiskCategoryMutation,
} from "services/module-programs";
import { TRiskCategory, riskCategorySchema } from "definations/module-programs";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";

const AddRiskCategory = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TRiskCategory;

    const form = useForm<TRiskCategory>({
        resolver: zodResolver(riskCategorySchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
        },
    });

    const dispatch = useAppDispatch();
    const [riskCategory, { isLoading }] = useAddRiskCategoryMutation();
    const [updateRiskCategory, { isLoading: updateRiskLoading }] =
        useUpdateRiskCategoryMutation();

    const onSubmit: SubmitHandler<TRiskCategory> = async (data) => {
        try {
            dialogProps?.type === "update"
                ? await updateRiskCategory({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  }).unwrap()
                : await riskCategory(data).unwrap();
            toast.success("Risk Category Added Succesfully");
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
                    className="flex flex-col gap-y-10"
                >
                    <div className="grid grid-cols-1 gap-y-7">
                        <FormInput
                            label="Name"
                            name="name"
                            placeholder="Enter name"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-y-7">
                        <FormInput
                            label="Description"
                            placeholder="Enter description"
                            name="description"
                            required
                        />
                    </div>
                    <div className="flex justify-start gap-4">
                        <FormButton loading={isLoading || updateRiskLoading}>
                            Save
                        </FormButton>
                    </div>
                </form>
            </Form>
        </CardContent>
    );
};

export default AddRiskCategory;
