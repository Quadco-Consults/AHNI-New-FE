"use client";
import FormButton from "@/components/FormButton";
import { Button } from "components/ui/button";
import PaymentRequestLayout from "./Layout";
import { toast } from "sonner";
import { TPaymentRequestFormData } from "features/admin/types/payment-request";
import {
  useCreatePaymentRequest,
  useGetSinglePaymentRequest,
  useModifyPaymentRequest,
} from "@/features/admin/controllers/paymentRequestController";
import AddSquareIcon from "components/icons/AddSquareIcon";
import React, { useEffect, useState } from "react";
import Upload from "components/Upload";
import { AdminRoutes } from "constants/RouterConstants";
// import { useLocation, useNavigate, useSearchParams } from ''
// import DocumentCard from "pages/protectedPages/projects/create/DocumentCard";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import DocumentCard from "@/features/projects/components/projects/create/DocumentCard";

export default function FileUploads() {
  const [file, setFile] = useState<File>();
  const [error, setError] = useState("");

  const [document, setDocument] = useState("");
  const [pageNumber] = useState<number>(1);

  function onDocumentLoadSuccess(_: { numPages: number }): void {
    // Document loaded successfully
  }

  //   const { pathname } = useLocation();

  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  const goBack = () => {
    let path = pathname;

    if (path) {
      path = path.substring(0, path.lastIndexOf("/"));
      path += `/summary`;
      router.push(path);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const { createPaymentRequest, isLoading: isCreateLoading } =
    useCreatePaymentRequest();

  const { modifyPaymentRequest, isLoading: isModifyLoading } =
    useModifyPaymentRequest(id || "");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!file && !document) {
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
        reviewer,
        authorizer,
        approver,
      } = JSON.parse(
        sessionStorage.getItem("paymentRequestFormData") || "{}"
      ) as TPaymentRequestFormData;

      const formData = new FormData();

      formData.append("account_number", account_number || "");
      formData.append("amount_in_figures", amount_in_figures || "");
      formData.append("amount_in_words", amount_in_words || "");
      formData.append("bank_name", bank_name || "");
      formData.append("payment_date", payment_date || "");
      formData.append("payment_reason", payment_reason || "");
      formData.append("payment_to", payment_to || "");
      formData.append("purchase_order", purchase_order || "");
      formData.append("tax_identification_number", tax_identification_number || "");
      formData.append("requested_by", "2986fab0-02fd-40b0-b9ce-20e624a4a1cd");
      formData.append("reviewer", reviewer || "");
      formData.append("authorizer", authorizer || "");
      formData.append("approver", approver || "");
      formData.append("document", file as File);

      if (id) {
        await modifyPaymentRequest(formData as any);
        toast.success("Payment Request Updated");
      } else {
        await createPaymentRequest(formData as any);
        toast.success("Payment Request Raised");
      }

      router.push(AdminRoutes.INDEX_PAYMENT_REQUEST);
      sessionStorage.removeItem("paymentRequestFormData");
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
    }
  };

  const { data: paymentRequest } = useGetSinglePaymentRequest(id || "", !!id);

  useEffect(() => {
    if (paymentRequest) {
      setDocument(paymentRequest.data.document);
    }
  }, [paymentRequest]);

  return (
    <PaymentRequestLayout>
      <form onSubmit={onSubmit} className='space-y-3'>
        <h1 className='text-xl font-bold'>File Uploads</h1>

        {document ? (
          <DocumentCard
            id={document}
            title='Payment Request Document'
            file={document}
            onLoadSuccess={onDocumentLoadSuccess}
            pageNumber={pageNumber}
            uploadedDateTime={paymentRequest?.data.created_datetime ?? ""}
            onDeleteDocument={() => setDocument("")}
          />
        ) : (
          <Upload onChange={handleChange}>
            <Button
              className='flex gap-2 py-6 bg-[#FFF2F2] text-red-500 dark:bg-primary dark:text-white'
              type='button'
            >
              <AddSquareIcon />
              Upload Document
            </Button>
          </Upload>
        )}

        {file && <span>{file.name}</span>}

        {error && (
          <div className='text-red-500 text-sm font-semibold'>{error}</div>
        )}

        <div className='relative w-full h-48'></div>
        <div className='flex items-center justify-end gap-x-4'>
          <Button variant='outline' type='button' size='lg' onClick={goBack}>
            Back
          </Button>

          <FormButton size='lg' loading={isCreateLoading || isModifyLoading}>
            Finish
          </FormButton>
        </div>
      </form>
    </PaymentRequestLayout>
  );
}
