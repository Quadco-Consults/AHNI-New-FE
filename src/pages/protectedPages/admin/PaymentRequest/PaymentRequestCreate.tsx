// import { zodResolver } from "@hookform/resolvers/zod";

import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { Form } from "components/ui/form";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
    TPaymentRequestPayload,
    useCreatePaymentRequestMutation,
} from "services/adminApi/paymentRequest";
import { useGetUserQuery } from "services/users";

import * as z from "zod";
import { toast } from "sonner";

import { Card, CardContent } from "components/ui/card";

import StepHeader from "components/shared/StepHeader";
import { zodResolver } from "@hookform/resolvers/zod";
import FileUploadRequest from "./FileUploadRequest";

const steps = [
    { step: 1, stepName: "Payment Request" },
    { step: 2, stepName: "File Uploads" },
];

const paymentRequestSchema = z.object({
    date: z.string().min(1, "Date is required"),
    payment_to: z.string().min(1, "Payment To is required"),
    tax_identification_number: z.string().optional(),
    amount_in_figures: z.string().min(1, "Amount in Figures is required"),
    amount_in_words: z.string().min(1, "Amount in Words is required"),
    account_number: z.string().min(1, "Account Number is required"),
    bank: z.string().min(1, "Bank is required"),
    requested_by_id: z.string().uuid("Requested By is required"),
});

export type PaymentRequestFormData = z.infer<typeof paymentRequestSchema>;

type StepsF = {
    currentStep: number;
    // eslint-disable-next-line no-unused-vars
    setCurrentStep: (step: number) => void;
    // eslint-disable-next-line no-unused-vars
    setId: (id: string) => void;
};

const FormOne = ({ currentStep, setCurrentStep, setId }: StepsF) => {
    const form = useForm<TPaymentRequestPayload>({
        defaultValues: {},
        resolver: zodResolver(paymentRequestSchema),
    });

    const [createPaymentRequest, { isLoading }] =
        useCreatePaymentRequestMutation();

    const { data } = useGetUserQuery({});

    const drivedData = useMemo(() => {
        return data?.results.map((item) => {
            return {
                label: `${item.first_name} ${item.last_name}`,
                value: item.id,
            };
        }, []);
    }, [data?.results]);

    const onSubmit = async (data: TPaymentRequestPayload) => {
        try {
            const resp = await createPaymentRequest(data).unwrap();
            toast.success("Payment request created successfully");
            setCurrentStep(currentStep + 1);
            setId(resp.id);
        } catch (error) {
            toast.error("Error creating payment request");
        }
    };
    return (
        <div>
            <Card>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-3 mt-6 gap-8">
                                <FormInput
                                    type="date"
                                    label="Date"
                                    name="date"
                                />
                                <FormSelect
                                    options={[]}
                                    label="SO/PO Number"
                                    name=""
                                    required
                                />
                                <FormInput
                                    label="Payment To"
                                    name="payment_to"
                                />
                                <FormInput
                                    label="Tax Identification Number"
                                    name="tax_identification_number"
                                />

                                <FormInput
                                    label="Amount In Figures"
                                    name="amount_in_figures"
                                    required
                                    type="number"
                                />

                                <FormInput
                                    label="Amount In Words"
                                    name="amount_in_words"
                                    required
                                />

                                <FormInput
                                    label="Account Number"
                                    name="account_number"
                                    required
                                    type="number"
                                />
                                <FormInput label="Bank" name="bank" />
                                <FormSelect
                                    options={drivedData}
                                    label="Requested By"
                                    name="requested_by_id"
                                    required
                                />
                                <FormInput label="Reason for Payment" name="" />
                                <FormSelect
                                    options={[
                                        {
                                            label: "Reviewer",
                                            value: "reviewer",
                                        },
                                        {
                                            label: "Authorization",
                                            value: "authorization",
                                        },
                                        {
                                            label: "Approver",
                                            value: "approver",
                                        },
                                    ]}
                                    label="Approval Levels"
                                    name=""
                                    required
                                />
                                <FormSelect
                                    options={[
                                        {
                                            label: "Reviewer",
                                            value: "reviewer",
                                        },
                                        {
                                            label: "Authorization",
                                            value: "authorization",
                                        },
                                        {
                                            label: "Approver",
                                            value: "approver",
                                        },
                                    ]}
                                    label="Name"
                                    name=""
                                    required
                                />
                            </div>

                            <div className="flex justify-end">
                                <FormButton
                                    loading={isLoading}
                                    className="mt-10"
                                >
                                    Next
                                </FormButton>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

const PaymentRequestCreate = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [rid, setId] = useState("");
    return (
        <div>
            <StepHeader steps={steps} currentStep={currentStep} />
            {currentStep === 1 && (
                <FormOne
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    setId={setId}
                />
            )}

            {currentStep === 2 && (
                <FileUploadRequest
                    id={rid}
                    setCurrentStep={setCurrentStep}
                    currentStep={currentStep}
                />
            )}
        </div>
    );
};

export default PaymentRequestCreate;
