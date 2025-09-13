"use client";

import BackNavigation from "components/atoms/BackNavigation";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "components/ui/tabs";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { useParams } from "next/navigation";
import {
  useGetSinglePaymentRequestQuery,
  useReviewPaymentRequest,
  useAuthorizePaymentRequest,
  useApprovePaymentRequest,
} from "@/features/admin/controllers/paymentRequestController";
import { LoadingSpinner } from "components/Loading";
import DescriptionCard from "components/DescriptionCard";
import DocumentCard from "@/features/projects/components/projects/create/DocumentCard";
import { useState } from "react";
import { toast } from "sonner";
import { FormProvider, useForm } from "react-hook-form";
import FormTextArea from "components/atoms/FormTextArea";
import FormButton from "@/components/FormButton";

export default function PaymentRequestDetails() {
  const { id } = useParams() as { id: string };

  const [pageNumber] = useState<number>(1);

  function onDocumentLoadSuccess(): void {
    // Document loaded successfully
  }

  const { data, isLoading } = useGetSinglePaymentRequestQuery(id || "", !!id);

  // Approval hooks
  const { reviewPaymentRequest, isLoading: isReviewing } =
    useReviewPaymentRequest(id);
  const { authorizePaymentRequest, isLoading: isAuthorizing } =
    useAuthorizePaymentRequest(id);
  const { approvePaymentRequest, isLoading: isApproving } =
    useApprovePaymentRequest(id);

  const form = useForm();

  // Determine what action button to show based on current status
  const getApprovalAction = () => {
    if (!data?.data) return null;

    const status = data.data.status;
    switch (status) {
      case "PENDING":
        return {
          action: "review",
          label: "Review",
          handler: reviewPaymentRequest,
          loading: isReviewing,
        };
      case "REVIEWED":
        return {
          action: "authorize",
          label: "Authorize",
          handler: authorizePaymentRequest,
          loading: isAuthorizing,
        };
      case "AUTHORIZED":
        return {
          action: "approve",
          label: "Approve",
          handler: approvePaymentRequest,
          loading: isApproving,
        };
      default:
        return null;
    }
  };

  const handleApproval = async (formData: any) => {
    const approvalAction = getApprovalAction();
    if (!approvalAction || !formData.comment) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      await approvalAction.handler(formData.comment);
      form.reset({
        comment: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div>
      <Tabs defaultValue='details'>
        <TabsList>
          <BackNavigation />
          <TabsTrigger value='details'>Details</TabsTrigger>
          <TabsTrigger value='uploads'>File Uploads</TabsTrigger>
        </TabsList>
        <TabsContent value='details'>
          <Card>
            <CardHeader className='font-bold'>
              Payment Request Details
              <Separator className='mt-4' />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                data && (
                  <>
                    <div className='grid grid-cols-3 gap-5'>
                      <DescriptionCard
                        label='Payment Date'
                        description={data.data.payment_date}
                      />

                      <DescriptionCard
                        label='Purchase Order Number'
                        description={
                          data.data.purchase_order?.purchase_order_number ||
                          "N/A"
                        }
                      />

                      <DescriptionCard
                        label='Payment Type'
                        description={data.data.payment_type_display}
                      />

                      <DescriptionCard
                        label='Total Amount'
                        description={data.data.total_amount}
                      />

                      <DescriptionCard
                        label='Status'
                        description={data.data.status}
                      />

                      <DescriptionCard
                        label='Is Bulk Payment'
                        description={data.data.is_bulk_payment ? "Yes" : "No"}
                      />

                      <DescriptionCard
                        label='Payment Items Count'
                        description={data.data.payment_items_count?.toString()}
                      />

                      <DescriptionCard
                        label='Requested By'
                        description={data.data.requested_by?.full_name || "N/A"}
                      />

                      <DescriptionCard
                        label='Payment Reason'
                        description={data.data.payment_reason}
                      />
                    </div>

                    {/* Payment Items Section */}
                    <div className='mt-8'>
                      <h3 className='text-lg font-semibold mb-4'>
                        Payment Items
                      </h3>
                      {data.data.payment_items?.map(
                        (item: any, index: number) => (
                          <Card key={item.id} className='mb-4'>
                            <CardHeader className='font-medium'>
                              Payment Item {index + 1}
                            </CardHeader>
                            <CardContent>
                              <div className='grid grid-cols-3 gap-5'>
                                <DescriptionCard
                                  label='Payment To'
                                  description={item.payment_to}
                                />
                                <DescriptionCard
                                  label='Amount In Figures'
                                  description={item.amount_in_figures}
                                />
                                <DescriptionCard
                                  label='Amount In Words'
                                  description={item.amount_in_words}
                                />
                                <DescriptionCard
                                  label='Account Number'
                                  description={item.account_number}
                                />
                                <DescriptionCard
                                  label='Bank Name'
                                  description={item.bank_name}
                                />
                                <DescriptionCard
                                  label='Tax ID Number'
                                  description={
                                    item.tax_identification_number || "N/A"
                                  }
                                />
                                <DescriptionCard
                                  label='Phone Number'
                                  description={item.phone_number || "N/A"}
                                />
                                <DescriptionCard
                                  label='Email'
                                  description={item.email || "N/A"}
                                />
                                <DescriptionCard
                                  label='Address'
                                  description={item.address || "N/A"}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        )
                      )}
                    </div>

                    {/* Approval Section - Only show if action is available */}
                    {getApprovalAction() && (
                      <div className='mt-8 p-4 border rounded-lg bg-gray-50'>
                        <h3 className='text-lg font-semibold mb-4'>
                          Approval Action
                        </h3>
                        <FormProvider {...form}>
                          <form
                            onSubmit={form.handleSubmit(handleApproval)}
                            className='space-y-3'
                          >
                            <FormTextArea
                              label='Comment'
                              name='comment'
                              placeholder={`Enter comment for ${getApprovalAction()?.label?.toLowerCase()}`}
                              required
                            />

                            <FormButton
                              size='lg'
                              className='bg-green-500'
                              loading={getApprovalAction()?.loading || false}
                              type='submit'
                            >
                              {getApprovalAction()?.label}
                            </FormButton>
                          </form>
                        </FormProvider>
                      </div>
                    )}

                    {/* Show current approval history */}
                    {data.data.approvals?.length > 0 && (
                      <div className='mt-8'>
                        <h3 className='text-lg font-semibold mb-4'>
                          Approval History
                        </h3>
                        {data.data.approvals.map((approval: any) => (
                          <Card key={approval.id} className='mb-3'>
                            <CardContent className='pt-4'>
                              <div className='grid grid-cols-3 gap-4'>
                                <DescriptionCard
                                  label='Level'
                                  description={approval.approval_level}
                                />
                                <DescriptionCard
                                  label='Approved By'
                                  description={
                                    approval.user?.full_name || "N/A"
                                  }
                                />
                                <DescriptionCard
                                  label='Date'
                                  description={new Date(
                                    approval.created_datetime
                                  ).toLocaleDateString()}
                                />
                              </div>
                              {approval.comments && (
                                <div className='mt-3'>
                                  <DescriptionCard
                                    label='Comments'
                                    description={approval.comments}
                                  />
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='uploads'>
          <Card>
            <CardHeader className='font-bold'>
              File Uploads
              <Separator className='mt-4' />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                data && (
                  <div className='grid grid-cols-3'>
                    <DocumentCard
                      id={data?.data.id}
                      title='Payment Request Upload'
                      file={data?.data.document}
                      onLoadSuccess={onDocumentLoadSuccess}
                      pageNumber={pageNumber}
                      uploadedDateTime={data?.data.created_datetime}
                      showDeleteIcon={false}
                    />
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
