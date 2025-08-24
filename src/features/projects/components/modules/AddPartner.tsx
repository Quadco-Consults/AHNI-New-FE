"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import FormTextArea from "components/atoms/FormTextArea";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { nigerianStates } from "lib/index";
import {
    PartnerSchema,
    TPartnerData,
    TPartnerFormValues,
} from "@/features/projects/types/project/partners";
import {
    useAddPartner,
    useUpdatePartner,
} from "@/features/modules/controllers/project/partnerController";

const AddPartners = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const result = dialogProps?.data as unknown as TPartnerData;

    const stateOptions = nigerianStates?.map((state: string) => ({
        label: state,
        value: state,
    }));

    const form = useForm<TPartnerFormValues>({
        resolver: zodResolver(PartnerSchema),
        defaultValues: {
            name: result?.name ?? "",
            partner_type: result?.partner_type ?? "",
            address: result?.address ?? "",
            city: result?.city ?? "",
            state: result?.state ?? "",
            phone: result?.phone ?? "",
            email: result?.email ?? "",
            website: result?.website ?? "",
        },
    });

    const dispatch = useAppDispatch();
    const { addPartner: partners, isLoading } = useAddPartner();
    const { updatePartner: updatePartners, isLoading: updatePartnersLoading } =
        useUpdatePartner();

    const onSubmit: SubmitHandler<TPartnerFormValues> = async (data) => {
        try {
            dialogProps?.type === "update"
                ? await updatePartners({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  })
                : await partners(data);
            toast.success("Partner Added Succesfully");
            dispatch(closeDialog());
            form.reset();
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
        }
    };

    return (
        <CardContent className="w-100% flex flex-col gap-y-10 p-0">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="bg-white rounded-[2rem] flex flex-col gap-y-7 pb-[2rem]"
                >
                    <FormInput
                        label="Name"
                        name="name"
                        placeholder="Enter Name"
                        required
                    />

                    <FormSelect
                        label="Type of Partner"
                        name="partner_type"
                        placeholder="Select Partner Type"
                        required
                        options={[
                            { label: "Consortium", value: "CONSORTIUM" },
                            { label: "Sub-Grantee", value: "SUBGRANTEE" },
                            { label: "Others", value: "OTHER" },
                        ]}
                    />

                    <FormTextArea
                        name="address"
                        label="Address"
                        placeholder="Enter Address"
                        required
                    />

                    <FormInput
                        label="City"
                        name="city"
                        placeholder="Enter City"
                        required
                    />

                    <FormSelect
                        label="State"
                        name="state"
                        placeholder="Select State"
                        required
                        options={stateOptions}
                    />

                    <FormInput
                        label="Phone"
                        name="phone"
                        placeholder="Enter Phone"
                        required
                        type="number"
                    />

                    <FormInput
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        required
                    />

                    <FormInput
                        label="Website"
                        name="website"
                        placeholder="Enter Website"
                        required
                    />

                    <FormButton loading={isLoading || updatePartnersLoading}>
                        Save
                    </FormButton>
                </form>
            </Form>
        </CardContent>
    );
};

export default AddPartners;
