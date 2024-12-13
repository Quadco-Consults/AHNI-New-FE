import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";

import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import {
    FundingSourceSchema,
    TFundingSourceFormValues,
    TFundingSourceResponse,
} from "definations/modules/project/funding-source";
import {
    useAddFundingSourceMutation,
    useUpdateFundingSourceMutation,
} from "services/modules/project/funding-source";

const AddFundingSource = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TFundingSourceResponse;

    const form = useForm<TFundingSourceFormValues>({
        resolver: zodResolver(FundingSourceSchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
        },
    });

    const dispatch = useAppDispatch();
    const [fundingSource, { isLoading }] = useAddFundingSourceMutation();

    const [updateFunding, { isLoading: updateFundingLoading }] =
        useUpdateFundingSourceMutation();

    const onSubmit: SubmitHandler<TFundingSourceFormValues> = async (data) => {
        try {
            dialogProps?.type === "update"
                ? await updateFunding({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  }).unwrap()
                : await fundingSource(data).unwrap();
            toast.success("Funding Source Added Succesfully");
            dispatch(closeDialog());
            form.reset();
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
        }
    };

    return (
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
                        placeholder="Enter Name"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 gap-y-7">
                    <FormInput
                        label="Description"
                        name="description"
                        placeholder="Enter Description"
                        required
                    />
                </div>
                <div className="flex justify-start gap-4">
                    <FormButton loading={isLoading || updateFundingLoading}>
                        Save
                    </FormButton>
                </div>
            </form>
        </Form>
    );
};

export default AddFundingSource;
