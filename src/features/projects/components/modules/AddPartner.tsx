"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/atoms/FormInput";
import FormSelect from "@/components/atoms/FormSelect";
import FormTextArea from "@/components/atoms/FormTextArea";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { closeDialog, dailogSelector } from "@/store/ui";
import { nigerianStates, nigerianCitiesByState } from "@/lib/index";
import { useState, useEffect } from "react";
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

    const [cityOptions, setCityOptions] = useState<{ label: string; value: string }[]>([]);

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
    const [addPartner, { isLoading }] = useAddPartner();
    const [updatePartner, { isLoading: updatePartnersLoading }] =
        useUpdatePartner();

    // Watch state field to update cities
    const selectedState = form.watch("state");

    useEffect(() => {
        if (selectedState && nigerianCitiesByState[selectedState]) {
            const cities = nigerianCitiesByState[selectedState].map((city) => ({
                label: city,
                value: city,
            }));
            setCityOptions(cities);
        } else {
            setCityOptions([]);
        }
    }, [selectedState]);

    // Set initial city options if editing
    useEffect(() => {
        if (result?.state && nigerianCitiesByState[result.state]) {
            const cities = nigerianCitiesByState[result.state].map((city) => ({
                label: city,
                value: city,
            }));
            setCityOptions(cities);
        }
    }, [result?.state]);

    const onSubmit: SubmitHandler<TPartnerFormValues> = async (data) => {
        try {
            dialogProps?.type === "update"
                ? await updatePartner({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  })
                : await addPartner(data);
            toast.success("Partner Added Succesfully");
            dispatch(closeDialog());
            form.reset();
        } catch (error: any) {
            toast.error(error?.data?.message || error?.message || "Something went wrong");
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
                            { label: "Implementing", value: "IMPLEMENTING" },
                            { label: "Funding", value: "FUNDING" },
                            { label: "Technical", value: "TECHNICAL" },
                            { label: "Government", value: "GOVERNMENT" },
                            { label: "Private Sector", value: "PRIVATE_SECTOR" },
                            { label: "NGO", value: "NGO" },
                            { label: "Academic", value: "ACADEMIC" },
                            { label: "Community", value: "COMMUNITY" },
                            { label: "Consortium", value: "CONSORTIUM" },
                            { label: "Sub-Grantee", value: "SUBGRANTEE" },
                        ]}
                    />

                    <FormTextArea
                        name="address"
                        label="Address"
                        placeholder="Enter Address"
                        required
                    />

                    <FormSelect
                        label="State"
                        name="state"
                        placeholder="Select State"
                        required
                        options={stateOptions}
                    />

                    <FormSelect
                        label="City"
                        name="city"
                        placeholder="Select City"
                        required
                        options={cityOptions}
                        disabled={!selectedState || cityOptions.length === 0}
                    />

                    <FormInput
                        label="Phone"
                        name="phone"
                        placeholder="Enter Phone"
                        required
                        type="tel"
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
