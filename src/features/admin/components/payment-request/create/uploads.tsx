"use client";
import FormButton from "@/components/FormButton";
import { Button } from "components/ui/button";
import PaymentRequestLayout from "./Layout";
import { toast } from "sonner";
import { TPaymentRequestFormData } from "features/admin/types/payment-request";
import {
  useCreatePaymentRequest,
  useGetSinglePaymentRequest,
  useGetSinglePaymentRequestQuery,
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
      router.push(path);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed:", e.target.files);
    if (e.target.files && e.target.files.length > 0) {
      console.log("Setting file:", e.target.files[0]);
      setFile(e.target.files[0]);
    } else {
      console.log("No files selected or files array is empty");
    }
  };

  const { createPaymentRequest, isLoading: isCreateLoading } =
    useCreatePaymentRequest();

  const { modifyPaymentRequest, isLoading: isModifyLoading } =
    useModifyPaymentRequest(id || "");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("File state at submit:", file);
      console.log("Document state at submit:", document);

      if (!file && !document) {
        setError("Please select a file");
        return;
      }

      const {
        payment_type,
        payment_date,
        payment_reason,
        purchase_order,
        reviewer,
        authorizer,
        approver,
        payment_items,
      } = JSON.parse(
        sessionStorage.getItem("paymentRequestFormData") || "{}"
      ) as TPaymentRequestFormData;

      const formData = new FormData();
      console.log("File being appended to FormData:", file);

      // Main payment request fields
      formData.append("payment_type", payment_type || "OTHER");
      formData.append("payment_date", payment_date || "");
      formData.append("payment_reason", payment_reason || "");
      formData.append("reviewer", reviewer || "");
      formData.append("authorizer", authorizer || "");
      formData.append("approver", approver || "");

      // Only append document if a new file was uploaded
      if (file && file instanceof File) {
        formData.append("document", file);
      }

      // Optional purchase order for PURCHASE_ORDER type
      if (payment_type === "PURCHASE_ORDER" && purchase_order) {
        formData.append("purchase_order", purchase_order);
      }

      // Add payment items - try sending as JSON array first
      if (payment_items && payment_items.length > 0) {
        // Convert to the exact format expected by API
        const cleanedPaymentItems = payment_items.map((item) => ({
          payment_to: item.payment_to,
          account_number: item.account_number,
          bank_name: item.bank_name,
          amount_in_figures: item.amount_in_figures,
          amount_in_words: item.amount_in_words,
          ...(item.tax_identification_number && {
            tax_identification_number: item.tax_identification_number,
          }),
          ...(item.phone_number && { phone_number: item.phone_number }),
          ...(item.email && { email: item.email }),
          ...(item.address && { address: item.address }),
          ...(item.consultant && { consultant: item.consultant }),
          ...(item.facilitator && { facilitator: item.facilitator }),
          ...(item.adhoc_staff && { adhoc_staff: item.adhoc_staff }),
        }));

        // Try as FormData array format
        cleanedPaymentItems.forEach((item, index) => {
          Object.entries(item).forEach(([key, value]) => {
            if (value) {
              formData.append(`payment_items[${index}][${key}]`, value);
            }
          });
        });
      }

      if (id) {
        await modifyPaymentRequest(formData as any);
      } else {
        await createPaymentRequest(formData as any);
      }

      router.push(AdminRoutes.INDEX_PAYMENT_REQUEST);
      sessionStorage.removeItem("paymentRequestFormData");
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
    }
  };

  const { data: paymentRequest } = useGetSinglePaymentRequest(id || "", !!id);
  console.log({ paymentRequest: paymentRequest?.data?.document });

  useEffect(() => {
    if (paymentRequest) {
      setDocument(paymentRequest?.data?.document);
      // Don't set file to document URL - file should only be set when user uploads a new file
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
