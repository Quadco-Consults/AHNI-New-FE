"use client";

import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import { Button } from "components/ui/button";
import { Separator } from "components/ui/separator";
import { useAppDispatch } from "hooks/useStore";
import { FormProvider, useForm } from "react-hook-form";
import { closeDialog } from "store/ui";

export default function FundRequestBreakdown() {
    const form = useForm();

    const dispatch = useAppDispatch();

    return (
        <FormProvider {...form}>
            <form className="p-4">
                <FormInput
                    name="project_title"
                    label="Project Title"
                    required
                />

                <h3 className="text-red-500 font-bold my-4">
                    Activities under this project
                </h3>

                <div className="border rounded-xl p-4 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput name="activity" label="Activity" required />

                        <FormInput
                            name="description"
                            label="Description"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <FormInput name="quantity" label="Quantity" required />

                        <FormInput
                            name="unit_cost"
                            label="Unit Cost"
                            required
                        />

                        <FormInput name="frq" label="FRQ" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            name="request_amount"
                            label="Request Amount"
                            required
                        />

                        <FormInput name="comment" label="Comment" required />
                    </div>
                </div>

                <Separator className="my-2" />

                <Button
                    variant="ghost"
                    className="text-[#DEA004] border shadow-md"
                    type="button"
                >
                    Click to add another
                </Button>

                <div className="flex justify-end gap-5 pt-24">
                    <FormButton
                        onClick={() => dispatch(closeDialog())}
                        type="button"
                        className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                    >
                        Cancel
                    </FormButton>

                    <FormButton type="submit">Add Breakdown</FormButton>
                </div>
            </form>
        </FormProvider>
    );
}