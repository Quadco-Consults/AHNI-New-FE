import Card from "components/shared/Card";
import { CardContent } from "components/ui/card";
import PaymentRequestLayout from "./Layout";
import { FormProvider, useForm } from "react-hook-form";
import {
    PaymentRequestSchema,
    TPaymentRequestFormData,
} from "definations/admin/payment-request";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import FormButton from "atoms/FormButton";

export default function CreatePaymentRequest() {
    const form = useForm<TPaymentRequestFormData>({
        resolver: zodResolver(PaymentRequestSchema),
        defaultValues: {
            payment_date: "",
            purchase_order: "",
            payment_to: "",
            tax_identification_number: "",
            amount_in_figures: "",
            amount_in_words: "",
            account_number: "",
            bank_name: "",
            payment_reason: "",
        },
    });

    const onSubmit = async () => {};

    return (
        <PaymentRequestLayout>
            <Card>
                <CardContent>
                    <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-3 mt-5 gap-5">
                                <FormInput
                                    label="Date"
                                    name="payment_date"
                                    type="date"
                                    required
                                />

                                <FormSelect
                                    label="SO/PO Number"
                                    name="purchase_order"
                                    placeholder="Select Purchase Order"
                                    required
                                    options={[]}
                                />

                                <FormInput
                                    label="Payment To"
                                    name="payment_to"
                                    placeholder="Enter Payment To"
                                    required
                                />

                                <FormInput
                                    label="Tax Identification Number"
                                    name="tax_identification_number"
                                    placeholder="Enter Tax Identification Number"
                                    required
                                />

                                <FormInput
                                    label="Amount In Figures"
                                    name="amount_in_figures"
                                    placeholder="Enter Amount in Figures"
                                    required
                                    type="number"
                                />

                                <FormInput
                                    label="Amount In Words"
                                    name="amount_in_words"
                                    placeholder="Enter Amount in Words"
                                    required
                                />

                                <FormInput
                                    label="Account Number"
                                    name="account_number"
                                    placeholder="Enter Account Number"
                                    required
                                    type="number"
                                />

                                <FormInput
                                    label="Bank"
                                    name="bank_name"
                                    placeholder="Enter Bank Name"
                                    required
                                />
                            </div>

                            <FormTextArea
                                label="Reason for Payment"
                                name="payment_reason"
                                placeholder="Enter Payment Reason"
                                required
                                className="mt-5"
                            />

                            <div className="flex justify-end">
                                <FormButton loading={false} className="mt-10">
                                    Submit
                                </FormButton>
                            </div>
                        </form>
                    </FormProvider>
                </CardContent>
            </Card>
        </PaymentRequestLayout>
    );
}

/*  <FormSelect
                                    options={[]}
                                    label="Requested By"
                                    name="requested_by_id"
                                    required
                                /> */
