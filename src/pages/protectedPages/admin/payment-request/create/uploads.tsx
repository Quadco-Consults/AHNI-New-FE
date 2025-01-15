import FormButton from "atoms/FormButton";
import { Button } from "components/ui/button";
import PaymentRequestLayout from "./Layout";
import { toast } from "sonner";
import { TPaymentRequestFormData } from "definations/admin/payment-request";
import { useCreatePaymentRequestMutation } from "services/admin/payment-request";
import AddSquareIcon from "components/icons/AddSquareIcon";
import React, { useState } from "react";
import Upload from "components/shared/Upload";
import { AdminRoutes } from "constants/RouterConstants";
import { useLocation, useNavigate } from "react-router-dom";

export default function FileUploads() {
    const [file, setFile] = useState<File>();
    const [error, setError] = useState("");

    const { pathname } = useLocation();

    const navigate = useNavigate();

    const goBack = () => {
        let path = pathname;

        path = path.substring(0, path.lastIndexOf("/"));

        path += `/summary`;

        navigate(path);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const [createPaymentRequest, { isLoading: isCreateLoading }] =
        useCreatePaymentRequestMutation();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!file) {
                setError("Please select a file");
                return;
            }

            const {
                account_number,
                amount_in_figures,
                amount_in_words,
                bank_name,
                payment_date,
                payment_reason,
                payment_to,
                purchase_order,
                tax_identification_number,
                requested_by,
                reviewer,
                authorizer,
                approver,
            } = JSON.parse(
                sessionStorage.getItem("paymentRequestFormData") || "{}"
            ) as TPaymentRequestFormData;

            const formData = new FormData();

            formData.append("account_number", account_number);
            formData.append("amount_in_figures", amount_in_figures);
            formData.append("amount_in_words", amount_in_words);
            formData.append("bank_name", bank_name);
            formData.append("payment_date", payment_date);
            formData.append("payment_reason", payment_reason);
            formData.append("payment_to", payment_to);
            formData.append("purchase_order", purchase_order);
            formData.append(
                "tax_identification_number",
                tax_identification_number
            );
            formData.append("requested_by", requested_by);
            formData.append("reviewer", reviewer);
            formData.append("authorizer", authorizer);
            formData.append("approver", approver);
            formData.append("document", file);

            await createPaymentRequest(formData as any).unwrap();

            toast.success("Payment Request Raised");
            navigate(AdminRoutes.INDEX_PAYMENT_REQUEST);
            sessionStorage.removeItem("paymentRequestFormData");
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    return (
        <PaymentRequestLayout>
            <form onSubmit={onSubmit} className="space-y-3">
                <h1 className="text-xl font-bold">File Uploads</h1>

                <Upload onChange={handleChange}>
                    <Button
                        className="flex gap-2 py-6 bg-[#FFF2F2] text-red-500 dark:bg-primary dark:text-white"
                        type="button"
                    >
                        <AddSquareIcon />
                        Upload Document
                    </Button>
                </Upload>
                {file && <span>{file.name}</span>}

                {error && (
                    <div className="text-red-500 text-sm font-semibold">
                        {error}
                    </div>
                )}

                <div className="relative w-full h-48"></div>
                <div className="flex items-center justify-end gap-x-4 ">
                    <Button
                        variant="outline"
                        type="button"
                        size="lg"
                        onClick={goBack}
                    >
                        Back
                    </Button>

                    <FormButton size="lg" loading={isCreateLoading}>
                        Submit
                    </FormButton>
                </div>
            </form>
        </PaymentRequestLayout>
    );
}
