"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";

import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import {
    FundingSourceSchema,
    TFundingSourceData,
    TFundingSourceFormValues,
} from "@/features/projects/types/project/funding-source";
import {
    useAddFundingSource,
    useUpdateFundingSource,
} from "@/features/modules/controllers/project/fundingSourceController";
import FormTextArea from "components/atoms/FormTextArea";

const AddFundingSource = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TFundingSourceData;

    const form = useForm<TFundingSourceFormValues>({
        resolver: zodResolver(FundingSourceSchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
        },
    });

    const dispatch = useAppDispatch();
    const { addFundingSource: fundingSource, isLoading } = useAddFundingSource();

    const [updateFunding, { isLoading: updateFundingLoading }] =
        useUpdateFundingSource();

    const onSubmit: SubmitHandler<TFundingSourceFormValues> = async (data) => {
        try {
            dialogProps?.type === "update"
                ? await updateFunding({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  })
                : await fundingSource(data);
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
                className="flex flex-col gap-y-7"
            >
                <FormInput
                    label="Donor Name"
                    name="name"
                    placeholder="Enter Name"
                    required
                />

                <FormInput
                    label="Donor Email"
                    name="email"
                    placeholder="Enter email"
                />

                <FormTextArea
                    label="Donor Address"
                    name="address"
                    placeholder="Enter address"
                />

                <FormInput
                    label="Donor Contact Person"
                    name="description"
                    placeholder="Enter name"
                />

                <FormInput
                    label="Donor Contact Person Email"
                    name="email"
                    placeholder="Enter email"
                />

                <FormInput
                    label="Donor Contact Person Phone Number"
                    name="phone_number"
                    placeholder="Enter phone number"
                />
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
