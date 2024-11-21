import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    useAddCategoriesMutation,
    useUpdateCategoriesMutation,
} from "services/moduleConfig";
import { TCategories } from "definations/module-config";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";
import { BudgetLineSchema, TBudgetLine } from "definations/module-finance";
import {
    useAddBudgetLineMutation,
    useUpdateBudgetLineMutation,
} from "services/moduleFinance";

const AddBudgetLine = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TBudgetLine;
    const form = useForm<TBudgetLine>({
        resolver: zodResolver(BudgetLineSchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
            code: data?.code ?? "",
        },
    });

    const [addBudgetLine, { isLoading }] = useAddBudgetLineMutation();
    const [updateBudgetLine, { isLoading: isUpdateLoading }] =
        useUpdateBudgetLineMutation();

    const dispatch = useAppDispatch();
    const onSubmit: SubmitHandler<TBudgetLine> = async (data) => {
        try {
            dialogProps?.type === "update"
                ? await updateBudgetLine({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  }).unwrap()
                : await addBudgetLine(data).unwrap();
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
                    className="flex flex-col gap-y-10"
                >
                    <div className="grid grid-cols-1 gap-y-7">
                        <FormInput
                            label="Title"
                            name="name"
                            placeholder="Enter name"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-x-1">
                        <FormInput
                            label="Description"
                            placeholder="Enter description"
                            name="description"
                            required
                        />
                        <FormInput
                            label="Code"
                            name="code"
                            placeholder="Enter code"
                            required
                        />
                    </div>
                    <div className="flex justify-start gap-4">
                        <FormButton loading={isLoading || isUpdateLoading}>
                            Save
                        </FormButton>
                    </div>
                </form>
            </Form>
        </CardContent>
    );
};

export default AddBudgetLine;
