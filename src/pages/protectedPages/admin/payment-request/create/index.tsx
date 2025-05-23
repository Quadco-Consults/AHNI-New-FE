import Card from "components/shared/Card";
import { CardContent } from "components/ui/card";
import PaymentRequestLayout from "./Layout";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
    PaymentRequestSchema,
    TPaymentRequestFormData,
} from "definations/admin/payment-request";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import FormButton from "atoms/FormButton";
import { useGetAllPurchaseOrdersQuery } from "services/procurementApi/purchase-order";
import { useEffect, useMemo } from "react";

import {
    Link,
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import { useGetAllUsersQuery } from "services/auth/user";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { useGetSinglePaymentRequestQuery } from "services/admin/payment-request";
import { skipToken } from "@reduxjs/toolkit/query";

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
            reviewer: "",
            authorizer: "",
            approver: "",

            // to be added
            request_type: "",
            number: "",
        },
    });

    const { pathname } = useLocation();

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const { data: purchaseOrder } = useGetAllPurchaseOrdersQuery({
        page: 1,
        size: 2000000,
    });

    const purchaseOrderOptions = useMemo(
        () =>
            purchaseOrder?.data.results.map(
                ({ purchase_order_number, id }) => ({
                    label: purchase_order_number,
                    value: id,
                })
            ),
        [purchaseOrder]
    );

    const { data: user } = useGetAllUsersQuery({ page: 1, size: 2000000 });

    const userOptions = useMemo(
        () =>
            user?.data.results.map(({ first_name, last_name, id }) => ({
                label: `${first_name} ${last_name}`,
                value: id,
            })),
        [user]
    );

    const onSubmit: SubmitHandler<TPaymentRequestFormData> = (data) => {
        sessionStorage.setItem("paymentRequestFormData", JSON.stringify(data));

        let path = pathname;

        path = path.substring(0, path.lastIndexOf("/"));

        path += `/uploads?id=${id ?? ""}`;

        navigate(path);
    };

    const { data: paymentRequest } = useGetSinglePaymentRequestQuery(
        id ? id : skipToken
    );

    useEffect(() => {
        const data = JSON.parse(
            sessionStorage.getItem("paymentRequestFormData") || "{}"
        ) as TPaymentRequestFormData;

        if (paymentRequest) {
            const { data } = paymentRequest;

            form.reset({
                payment_date: data.payment_date,
                purchase_order: data.purchase_order.id,
                payment_to: data.payment_to,
                tax_identification_number: data.tax_identification_number,
                amount_in_figures: data.amount_in_figures,
                amount_in_words: data.amount_in_words,
                account_number: data.account_number,
                bank_name: data.bank_name,
                payment_reason: data.payment_reason,
                reviewer: "",
                authorizer: "",
                approver: "",
            });
        }
    }, [paymentRequest, user, purchaseOrder]);

    const requestType = form.watch("request_type") || "";
    const number = form.watch("number") || "";

    console.log({ requestType });

    return (
        <PaymentRequestLayout>
            <Card>
                <CardContent>
                    <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-3 mt-5 gap-10">
                                <FormInput
                                    label="Date"
                                    name="payment_date"
                                    type="date"
                                    required
                                />

                                <FormSelect
                                    label="Request Type"
                                    name="request_type"
                                    placeholder="Select Request Type"
                                    options={[
                                        {
                                            label: "SERVICE ORDER",
                                            value: "SERVICE_ORDER",
                                        },
                                        {
                                            label: "CONSULTANT",
                                            value: "CONSULTANT",
                                        },
                                        {
                                            label: "ADHOC STAFF",
                                            value: "ADHOC_STAFF",
                                        },
                                        { label: "OTHERS", value: "OTHERS" },
                                    ]}
                                />

                                {requestType === "SERVICE_ORDER" && (
                                    <FormSelect
                                        label="SO/PO Number"
                                        name="purchase_order"
                                        placeholder="Select Purchase Order"
                                        required
                                        options={purchaseOrderOptions}
                                    />
                                )}

                                {(requestType === "CONSULTANT" ||
                                    requestType === "ADHOC_STAFF") && (
                                    <FormSelect
                                        label="Number"
                                        name="number"
                                        placeholder="Select Number"
                                        options={[
                                            {
                                                label: "SINGLE",
                                                value: "SINGLE",
                                            },

                                            {
                                                label: "MULTIPLE",
                                                value: "MULTIPLE",
                                            },
                                        ]}
                                    />
                                )}

                                {requestType === "CONSULTANT" &&
                                    number === "SINGLE" && (
                                        <FormSelect
                                            label="Consultant"
                                            name="consultant"
                                            placeholder="Select Consultant"
                                            required
                                            options={[]}
                                        />
                                    )}

                                {requestType === "ADHOC_STAFF" &&
                                    number === "SINGLE" && (
                                        <FormSelect
                                            label="Adhoc Staff"
                                            name="adhoc_staff"
                                            placeholder="Select Adhoc Staff"
                                            required
                                            options={[]}
                                        />
                                    )}

                                <FormInput
                                    label="Payment To"
                                    name="payment_to"
                                    placeholder="Enter Payment To"
                                    required
                                />

                                {number === "SINGLE" && (
                                    <FormInput
                                        label="Tax Identification Number"
                                        name="tax_identification_number"
                                        placeholder="Enter Tax Identification Number"
                                        required
                                    />
                                )}

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

                                {number === "SINGLE" && (
                                    <FormInput
                                        label="Account Number"
                                        name="account_number"
                                        placeholder="Enter Account Number"
                                        required
                                        type="number"
                                    />
                                )}

                                {number === "SINGLE" && (
                                    <FormInput
                                        label="Bank"
                                        name="bank_name"
                                        placeholder="Enter Bank Name"
                                        required
                                    />
                                )}
                            </div>

                            <FormTextArea
                                label="Reason for Payment"
                                name="payment_reason"
                                placeholder="Enter Payment Reason"
                                required
                                className="mt-5"
                            />

                            <div className="grid grid-cols-3 gap-5 mt-5">
                                <FormSelect
                                    label="Reviewer"
                                    name="reviewer"
                                    placeholder="Select Reviewer"
                                    required
                                    options={userOptions}
                                />

                                <FormSelect
                                    label="Authorizer"
                                    name="authorizer"
                                    placeholder="Select Authorizer"
                                    required
                                    options={userOptions}
                                />

                                <FormSelect
                                    label="Approver"
                                    name="approver"
                                    placeholder="Select Approver"
                                    required
                                    options={userOptions}
                                />
                            </div>

                            <div className="flex items-center justify-end mt-10 gap-2">
                                <Link to={AdminRoutes.INDEX_PAYMENT_REQUEST}>
                                    <Button
                                        variant="outline"
                                        type="button"
                                        size="lg"
                                    >
                                        Cancel
                                    </Button>
                                </Link>
                                <FormButton loading={false} size="lg">
                                    Next
                                </FormButton>
                            </div>
                        </form>
                    </FormProvider>
                </CardContent>
            </Card>
        </PaymentRequestLayout>
    );
}
