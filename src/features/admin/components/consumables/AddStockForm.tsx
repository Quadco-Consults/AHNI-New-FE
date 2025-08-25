"use client";

import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import { Form } from "components/ui/form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation"; 
import { dailogSelector } from "store/ui";

// const options = [
//     {
//         label: "Receipt",
//         value: "Receipt",
//     },
//     {
//         label: "Issued",
//         value: "Issued",
//     },
// ];

const AddStockForm = () => {
    const form = useForm({});

    const { dialogProps } = useAppSelector(dailogSelector);

    useEffect(() => {
        if (dialogProps?.data) {
            const { status, particular, date, stock } =
                dialogProps?.data as any;
            form.reset({
                particular,
                date,
                stock: String(stock),
                status,
            });
        }
    }, [dialogProps, form]);

    const [params] = useSearchParams();

    const dispatch = useAppDispatch();

    const id = params.get("id");

    const onSubmit = async () => {};

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 "
                >
                    <div className="grid grid-cols-2 gap-4">
                        <FormSelect name="particular" label="User" />
                        <FormInput name="stock" label="Stock" type="number" />
                    </div>
                    <div className="grid items-center grid-cols-2 gap-x-4">
                        <FormInput name="date" label="Date" type="date" />
                        <FormSelect name="status" label="Status" options={[]} />
                    </div>
                    <div className="w-full mt-6">
                        <FormButton loading={false}>Submit</FormButton>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default AddStockForm;
