"use client";

import FormButton from "@/components/FormButton";
import { Form } from "components/ui/form";
import { cn } from "lib/utils";
import { Angry, Smile } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const SspApproveModal = () => {
    const [status, setStatus] = useState("");

    const form = useForm({
        defaultValues: {
            title: [
                {
                    descriptionOfItems: "",
                    numberOfPersons: "",
                    numberOfDays: "",
                    fco: "",
                    unitCost: "",
                    total: "",
                },
            ],
        },
    });

    const { handleSubmit } = form;

    const onSubmit = (data: any) => {};

    return (
        <div className="w-full">
            <Form {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                >
                    <div className="grid grid-cols-2 gap-5">
                        <button
                            onClick={() => setStatus("Approve")}
                            className={cn(
                                "p-5 rounded-lg text-center border border-green-500 text-green-500",
                                status === "Approve" && "border-2 bg-green-50"
                            )}
                        >
                            <Smile className="mx-auto" />
                            <h4>Approve</h4>
                        </button>
                        <button
                            onClick={() => setStatus("Reject")}
                            className={cn(
                                "p-5 rounded-lg text-center border border-red-500 text-red-500",
                                status === "Reject" && "border-2 bg-red-50"
                            )}
                        >
                            <Angry className="mx-auto" />
                            <h4>Reject</h4>
                        </button>
                    </div>

                    <FormButton className="mx-auto" size="lg">
                        Submit
                    </FormButton>
                </form>
            </Form>
        </div>
    );
};

export default SspApproveModal;