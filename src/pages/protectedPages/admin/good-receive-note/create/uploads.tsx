import FormButton from "atoms/FormButton";
import { Button } from "components/ui/button";
import PaymentRequestLayout from "./Layout";
import { toast } from "sonner";
import {
    useCreatePaymentRequestMutation,
    useGetSinglePaymentRequestQuery,
    useModifyPaymentRequestMutation,
} from "services/admin/payment-request";
import AddSquareIcon from "components/icons/AddSquareIcon";
import React, { useEffect, useState } from "react";
import Upload from "components/shared/Upload";
import { AdminRoutes } from "constants/RouterConstants";
import {
    Link,
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import DocumentCard from "pages/protectedPages/projects/create/DocumentCard";

export default function GRNFileUploads() {
    const [files, setFiles] = useState<File[]>();
    const [error, setError] = useState("");

    console.log({ files });

    const { pathname } = useLocation();

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileList = e.target.files;
            const fileArray = Array.from(fileList);
            setFiles(fileArray);
        }
    };

    const [createPaymentRequest, { isLoading: isCreateLoading }] =
        useCreatePaymentRequestMutation();

    const [modifyPaymentRequest, { isLoading: isModifyLoading }] =
        useModifyPaymentRequestMutation();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            navigate(AdminRoutes.GRN);
            // sessionStorage.removeItem("paymentRequestFormData");
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    const { data: paymentRequest } = useGetSinglePaymentRequestQuery(
        id ?? skipToken
    );

    return (
        <PaymentRequestLayout>
            <form onSubmit={onSubmit} className="space-y-3">
                <h1 className="text-xl font-bold">File Uploads</h1>

                <Upload onChange={handleChange} multiple>
                    <Button
                        className="flex gap-2 py-6 bg-[#FFF2F2] text-red-500 dark:bg-primary dark:text-white"
                        type="button"
                    >
                        <AddSquareIcon />
                        Upload Document
                    </Button>
                </Upload>

                {files &&
                    files?.map(({ name }) => (
                        <span className="block">{name}&nbsp;</span>
                    ))}

                {error && (
                    <div className="text-red-500 text-sm font-semibold">
                        {error}
                    </div>
                )}

                <div className="flex items-center justify-end gap-x-4">
                    <Link to={AdminRoutes.GRN_CREATE_SUMMARY}>
                        <Button variant="outline" type="button" size="lg">
                            Back
                        </Button>
                    </Link>

                    <FormButton
                        size="lg"
                        loading={isCreateLoading || isModifyLoading}
                    >
                        Finish
                    </FormButton>
                </div>
            </form>
        </PaymentRequestLayout>
    );
}
