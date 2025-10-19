"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelectField";
import { SelectContent, SelectItem } from "@/components/ui/select";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";

import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";
import {
    LotSchema,
    TLotData,
    TLotFormValues,
} from "@/features/procurement/types/procurement/lot";
import {
    useAddLot,
    useUpdateLot,
} from "@/features/modules/controllers/procurement/lotController";
import { useGetAllLots } from "@/features/procurement/controllers/lotsController";

const AddLots = () => {
    const { dialogProps } = useAppSelector(dailogSelector);
    const data = dialogProps?.data as unknown as TLotData;

    // Determine initial tab based on context
    const getInitialTab = (): "parent" | "sub" => {
        // If isSubLot flag is set, open sub-lot tab
        if (dialogProps?.isSubLot) return "sub";
        // If editing a lot with a parent, open sub-lot tab
        if (data?.parent) return "sub";
        // Otherwise, open parent lot tab
        return "parent";
    };

    const [activeTab, setActiveTab] = useState<"parent" | "sub">(getInitialTab());

    // Fetch all lots for parent selection dropdown
    const { data: lotsData, isLoading: isLoadingLots } = useGetAllLots({ page: 1, size: 1000 });
    const allLots = (lotsData as any)?.results || (lotsData as any)?.data?.results || [];

    // Filter out sub-lots - only show top-level lots as parent options
    const parentLotOptions = allLots.filter((lot: any) => !lot.parent);

    // Parent Lot Form
    const parentForm = useForm<TLotFormValues>({
        resolver: zodResolver(LotSchema),
        defaultValues: {
            name: data?.parent ? "" : (data?.name ?? ""),
            packet_number: data?.parent ? "" : (data?.packet_number ?? ""),
            parent: null,
        },
    });

    // Sub-Lot Form
    const subForm = useForm<TLotFormValues>({
        resolver: zodResolver(LotSchema),
        defaultValues: {
            name: data?.parent ? (data?.name ?? "") : "",
            packet_number: data?.parent ? (data?.packet_number ?? "") : "",
            parent: data?.parent ?? "",
        },
    });

    const { createLot, isLoading } = useAddLot();
    const { updateLot, isLoading: updateLotsLoading } = useUpdateLot();
    const dispatch = useAppDispatch();

    const onSubmitParent: SubmitHandler<TLotFormValues> = async (formData) => {
        try {
            const submitData = {
                ...formData,
                parent: null, // Parent lots have no parent
            };

            if (dialogProps?.type === "update") {
                await updateLot(String(dialogProps?.data?.id), submitData);
            } else {
                await createLot(submitData);
            }
            toast.success("Parent Lot Created Successfully");
            dispatch(closeDialog());
            parentForm.reset();
        } catch (error: any) {
            toast.error(error.response?.data?.message ?? error.message ?? "Something went wrong");
        }
    };

    const onSubmitSub: SubmitHandler<TLotFormValues> = async (formData) => {
        try {
            if (!formData.parent) {
                toast.error("Please select a parent lot");
                return;
            }

            const submitData = {
                ...formData,
                parent: formData.parent,
            };

            if (dialogProps?.type === "update") {
                await updateLot(String(dialogProps?.data?.id), submitData);
            } else {
                await createLot(submitData);
            }
            toast.success("Sub-Lot Created Successfully");
            dispatch(closeDialog());
            subForm.reset();
        } catch (error: any) {
            toast.error(error.response?.data?.message ?? error.message ?? "Something went wrong");
        }
    };
    return (
        <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "parent" | "sub")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="parent">Parent Lot</TabsTrigger>
                    <TabsTrigger value="sub">Sub-Lot</TabsTrigger>
                </TabsList>

                {/* Parent Lot Tab */}
                <TabsContent value="parent">
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">
                            Create a top-level lot (e.g., LOT1 - IT Equipment, LOT2 - Medical Consumables)
                        </p>
                    </div>
                    <Form {...parentForm}>
                        <form
                            onSubmit={parentForm.handleSubmit(onSubmitParent)}
                            className="flex flex-col gap-y-5"
                        >
                            <FormInput
                                label="Lot Name"
                                name="name"
                                placeholder="e.g., LOT1 - IT Equipment"
                                required
                            />

                            <FormInput
                                label="Packet Number"
                                name="packet_number"
                                placeholder="e.g., 1"
                                required
                                type="number"
                            />

                            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
                                <p><strong>Note:</strong> This will create a parent lot that can have sub-lots added to it later.</p>
                            </div>

                            <div className="flex justify-start gap-4">
                                <FormButton loading={isLoading || updateLotsLoading}>
                                    {dialogProps?.type === "update" ? "Update Parent Lot" : "Create Parent Lot"}
                                </FormButton>
                            </div>
                        </form>
                    </Form>
                </TabsContent>

                {/* Sub-Lot Tab */}
                <TabsContent value="sub">
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">
                            Create a sub-lot under an existing parent lot (e.g., LOT2-A under LOT2)
                        </p>
                    </div>

                    {parentLotOptions.length === 0 && !isLoadingLots ? (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-sm text-yellow-800">
                                <strong>No parent lots available.</strong> Please create a parent lot first before creating sub-lots.
                            </p>
                        </div>
                    ) : (
                        <Form {...subForm}>
                            <form
                                onSubmit={subForm.handleSubmit(onSubmitSub)}
                                className="flex flex-col gap-y-5"
                            >
                                <FormSelect
                                    name="parent"
                                    label="Parent Lot"
                                    placeholder="Select parent lot"
                                    required
                                >
                                    <SelectContent>
                                        {isLoadingLots && <div className="p-2 text-sm text-gray-500">Loading lots...</div>}
                                        {parentLotOptions.map((lot: any) => (
                                            <SelectItem key={lot.id} value={lot.id}>
                                                {lot.name} (Packet #{lot.packet_number})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </FormSelect>

                                <FormInput
                                    label="Sub-Lot Name"
                                    name="name"
                                    placeholder="e.g., LOT2-A - HTS Medical Consumables"
                                    required
                                />

                                <FormInput
                                    label="Packet Number"
                                    name="packet_number"
                                    placeholder="e.g., 2"
                                    required
                                    type="number"
                                />

                                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
                                    <p><strong>Tip:</strong> Sub-lots inherit the parent lot's packet number but can have descriptive names (e.g., LOT2-A, LOT2-B).</p>
                                </div>

                                <div className="flex justify-start gap-4">
                                    <FormButton loading={isLoading || updateLotsLoading}>
                                        {dialogProps?.type === "update" ? "Update Sub-Lot" : "Create Sub-Lot"}
                                    </FormButton>
                                </div>
                            </form>
                        </Form>
                    )}
                </TabsContent>
            </Tabs>
        </CardContent>
    );
};

export default AddLots;
