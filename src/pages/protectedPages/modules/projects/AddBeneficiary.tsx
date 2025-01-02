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
    BeneficiarySchema,
    TBeneficiaryData,
    TBeneficiaryFormValues,
} from "definations/modules/project/beneficiaries";
import {
    useAddBeneficiaryMutation,
    useUpdateBeneficiaryMutation,
} from "services/modules/project/beneficiaries";
import FormTextArea from "atoms/FormTextArea";

const AddBeneficiaries = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TBeneficiaryData;
    const form = useForm<TBeneficiaryFormValues>({
        resolver: zodResolver(BeneficiarySchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
        },
    });

    const [beneficiary, { isLoading }] = useAddBeneficiaryMutation();
    const [updateBeneficiary, { isLoading: updateBeneficiaryLoading }] =
        useUpdateBeneficiaryMutation();

    const dispatch = useAppDispatch();
    const onSubmit: SubmitHandler<TBeneficiaryFormValues> = async (data) => {
        try {
            dialogProps?.type === "update"
                ? await updateBeneficiary({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  }).unwrap()
                : await beneficiary(data).unwrap();
            toast.success("Beneficiary Added Succesfully");
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
                            loading={isLoading || updateBeneficiaryLoading}
                        >
                            Save
                        </FormButton>
                    </div>
                </form>
            </Form>
        </CardContent>
    );
};

export default AddBeneficiaries;
