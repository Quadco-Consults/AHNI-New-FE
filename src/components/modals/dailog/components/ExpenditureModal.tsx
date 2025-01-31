import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormTextArea from "atoms/FormTextArea";
import { Form } from "components/ui/form";
import {
    ExpenditureSchema,
    TExpenditureFormData,
} from "definations/c&g/grants";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCreateExpenditureMutation } from "services/c&g/expenditure";
import { toast } from "sonner";
import { closeDialog } from "store/ui";

export default function ExpenditureModal() {
    const form = useForm<TExpenditureFormData>({
        resolver: zodResolver(ExpenditureSchema),
        defaultValues: {
            amount: "",
            description: "",
        },
    });

    const dispatch = useAppDispatch();

    const { dialogProps } = useAppSelector((state) => state.ui.dailog);

    const grantId = dialogProps?.grantId as string;

    const [createExpenditure, { isLoading: isCreateLoading }] =
        useCreateExpenditureMutation();

    const onSubmit: SubmitHandler<TExpenditureFormData> = async (data) => {
        try {
            await createExpenditure({
                grantId,
                body: data,
            }).unwrap();
            toast.success("Expenditure Created");
            dispatch(closeDialog());
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };
    return (
        <div className="w-full">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <FormInput
                        type="number"
                        label="Amount"
                        name="amount"
                        placeholder="Enter Amount"
                        required
                    />

                    <FormTextArea
                        label="Description"
                        name="description"
                        placeholder="Enter Description"
                        required
                    />

                    <div className="flex justify-end">
                        <FormButton size="lg" loading={isCreateLoading}>
                            Submit
                        </FormButton>
                    </div>
                </form>
            </Form>
        </div>
    );
}
