import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import FormTextArea from "atoms/FormTextArea";
import { Card, CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

import LocationAPi from "services/configs/locationApi";
import VendorsAPI from "services/procurementApi/vendors";
import { toast } from "sonner";
import * as z from "zod";
import { APPROVAL_PROCESS } from "../FacilitiesManagment/FacilitiesMaintanance";
import { Button } from "components/ui/button";
import { useGetAllUsersQuery } from "services/auth/user";

const formSchema = z.object({
    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD"),
    odometer: z
        .string()
        .refine(
            (val) => !isNaN(parseFloat(val)),
            "Price per liter must be a valid number"
        ),
    distance_covered: z
        .string()
        .refine(
            (val) => !isNaN(parseFloat(val)),
            "Price per liter must be a valid number"
        ),
    price_per_liter: z
        .string()
        .refine(
            (val) => !isNaN(parseFloat(val)),
            "Price per liter must be a valid number"
        ),
    quantity: z
        .string()
        .refine(
            (val) => !isNaN(parseFloat(val)),
            "Price per liter must be a valid number"
        ),
    amount: z
        .string()
        .refine(
            (val) => !isNaN(parseFloat(val)),
            "Amount must be a valid number"
        ),

    assigned_driver_id: z.string().min(1, "Assigned driver is required"),
    vehicle: z.string().optional(),
});

export type FuelRecordForm = z.infer<typeof formSchema>;

const CreateFuelRecord = () => {
    const form = useForm<FuelRecordForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            odometer: "",
            distance_covered: "",
            price_per_liter: "",
            quantity: "",
            amount: "",
            assigned_driver_id: "",
        },
    });

    const [searchParams] = useSearchParams();

    const id = String(searchParams.get("to"));

    const { data: user } = useGetAllUsersQuery({ page: 1, size: 2000000 });

    const { data: locations } = LocationAPi.useGetLocationListQuery({
        params: { no_paginate: true },
    });
    const { data: vendors } = VendorsAPI.useGetVendorListQuery({
        params: { no_paginate: true },
    });

    const onSubmit = async (values: FuelRecordForm) => {
        // try {
        //     await createFuelRecord({
        //         ...values,
        //         vehicle: String(id),
        //     }).unwrap();
        //     toast.success("Fuel record created successfully");
        //     form.reset();
        // } catch (error) {
        //     toast.error("Failed to create fuel record");
        // }
    };
    return (
        <div>
            <BackNavigation extraText="New Fuel Consumption Record" />
            <Card>
                <CardContent className="p-5">
                    <Form {...form}>
                        <form
                            className="flex flex-col gap-y-6"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <FormSelect
                                    required
                                    label="Assigned Driver"
                                    name="assigned_driver_id"
                                    options={[]}
                                />
                                <FormSelect
                                    required
                                    label="Location"
                                    name="location"
                                    options={[]}
                                />
                                <FormSelect
                                    required
                                    label="Vendor"
                                    name="vendor"
                                    options={[]}
                                />
                                <FormInput
                                    name="odometer"
                                    label="Odometer Reading"
                                    type="number"
                                    required
                                />
                                <FormInput
                                    required
                                    name="date"
                                    label="Date"
                                    type="date"
                                />
                                <FormInput
                                    name="distance_covered"
                                    label="Distance Covered"
                                    type="number"
                                    required
                                />

                                <FormInput
                                    name="price_per_liter"
                                    label="Price Per Liter"
                                    type="number"
                                    required
                                />
                                <FormInput
                                    name="quantity"
                                    label="Quantity"
                                    type="number"
                                    required
                                />

                                <FormInput
                                    name="amount"
                                    label="Amount (₦)"
                                    type="number"
                                    required
                                />
                                <FormInput
                                    name="fco"
                                    label="FCO"
                                    type="number"
                                    required
                                />
                            </div>

                            <Form {...form}>
                                <form className="space-y-4">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <FormTextArea
                                                name=""
                                                label="Justification for Disposal"
                                                placeholder="This can be repaired and we donate it to CBOs"
                                            />
                                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                                <FormSelect
                                                    name=""
                                                    placeholder="Select approval"
                                                    options={APPROVAL_PROCESS}
                                                />
                                                <FormSelect
                                                    name=""
                                                    placeholder="Select name"
                                                    options={APPROVAL_PROCESS}
                                                />
                                            </div>
                                            <Button
                                                variant="custom"
                                                type="button"
                                            >
                                                Approve
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            <FormTextArea
                                                name=""
                                                label="GT CT Approval"
                                                placeholder="This can be repaired and we donate it to CBOs"
                                            />
                                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                                <FormSelect
                                                    name=""
                                                    placeholder="Select approval"
                                                    options={APPROVAL_PROCESS}
                                                />
                                                <FormSelect
                                                    name=""
                                                    placeholder="Select name"
                                                    options={APPROVAL_PROCESS}
                                                />
                                            </div>
                                            <Button
                                                variant="custom"
                                                type="button"
                                            >
                                                Approve
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            <FormTextArea
                                                name=""
                                                label="CCM Approval"
                                                placeholder="This can be repaired and we donate it to CBOs"
                                            />
                                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                                <FormSelect
                                                    name=""
                                                    placeholder="Select approval"
                                                    options={APPROVAL_PROCESS}
                                                />
                                                <FormSelect
                                                    name=""
                                                    placeholder="Select name"
                                                    options={APPROVAL_PROCESS}
                                                />
                                            </div>
                                            <Button
                                                variant="custom"
                                                type="button"
                                            >
                                                Approve
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            <FormTextArea
                                                name=""
                                                label="Remarks"
                                            />
                                            <FormSelect
                                                name=""
                                                placeholder="Select approval"
                                                options={APPROVAL_PROCESS}
                                            />
                                            <Button
                                                variant="custom"
                                                type="button"
                                            >
                                                Approve
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                            <div className="flex justify-end">
                                <FormButton loading={false}>Submit</FormButton>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateFuelRecord;
