"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";

import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
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
            email_donor: data?.email_donor ?? "",
            address_donor: data?.address_donor ?? "",
            contact_person_name: data?.contact_person_name ?? "",
            email_contact_person: data?.email_contact_person ?? "",
            contact_person_phone: data?.contact_person_phone ?? "",
        },
    });

    const dispatch = useAppDispatch();
    const [addFundingSource, { isLoading }] = useAddFundingSource();

    const [updateFunding, { isLoading: updateFundingLoading }] =
        useUpdateFundingSource();

    // Update form values when data changes (for update mode)
    useEffect(() => {
        if (data && dialogProps?.type === "update") {
            form.reset({
                name: data.name ?? "",
                description: data.description ?? "",
                email_donor: data.email_donor ?? "",
                address_donor: data.address_donor ?? "",
                contact_person_name: data.contact_person_name ?? "",
                email_contact_person: data.email_contact_person ?? "",
                contact_person_phone: data.contact_person_phone ?? "",
            });
        } else if (dialogProps?.type !== "update") {
            // Reset form for new entries
            form.reset({
                name: "",
                description: "",
                email_donor: "",
                address_donor: "",
                contact_person_name: "",
                email_contact_person: "",
                contact_person_phone: "",
            });
        }
    }, [data, dialogProps?.type, form]);

    const onSubmit: SubmitHandler<TFundingSourceFormValues> = async (data) => {
        try {
            dialogProps?.type === "update"
                ? await updateFunding({
                      id: String(dialogProps?.data?.id),
                      body: data,
                  })
                : await addFundingSource(data);
            toast.success(dialogProps?.type === "update" ? "Funding Source Updated Successfully" : "Funding Source Added Successfully");
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

                <FormTextArea
                    label="Description"
                    name="description"
                    placeholder="Enter description"
                />

                <FormInput
                    label="Donor Email"
                    name="email_donor"
                    placeholder="Enter donor email"
                />

                <FormTextArea
                    label="Donor Address"
                    name="address_donor"
                    placeholder="Enter donor address"
                />

                <FormInput
                    label="Donor Contact Person"
                    name="contact_person_name"
                    placeholder="Enter contact person name"
                />

                <FormInput
                    label="Donor Contact Person Email"
                    name="email_contact_person"
                    placeholder="Enter contact person email"
                />

                <FormInput
                    label="Donor Contact Person Phone Number"
                    name="contact_person_phone"
                    placeholder="Enter contact person phone number"
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
