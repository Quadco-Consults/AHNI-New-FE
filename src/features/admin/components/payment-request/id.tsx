"use client";

import BackNavigation from "components/atoms/BackNavigation";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "components/ui/tabs";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { useParams } from "next/navigation";
import { useGetSinglePaymentRequestQuery } from "@/features/admin/controllers/paymentRequestController";
import { LoadingSpinner } from "components/Loading";
import DescriptionCard from "components/DescriptionCard";
import DocumentCard from "@/features/projects/components/projects/create/DocumentCard";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormTextArea from "components/atoms/FormTextArea";
import { Button } from "components/ui/button";
import FormButton from "components/atoms/FormButton";

export default function PaymentRequestDetails() {
    const { id } = useParams();

    const [page, setPage] = useState(1);
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    const { data, isLoading } = useGetSinglePaymentRequestQuery(
        id || "", !!id
    );

    const form = useForm();

    return (
        <div>
            <Tabs defaultValue="details">
                <TabsList>
                    <BackNavigation />
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="uploads">File Uploads</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                    <Card>
                        <CardHeader className="font-bold">
                            Payment Request Details
                            <Separator className="mt-4" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <LoadingSpinner />
                            ) : (
                                data && (
                                    <>
                                        <div className="grid grid-cols-3 gap-5">
                                            <DescriptionCard
                                                label="Payment Date"
                                                description={
                                                    data.data.payment_date
                                                }
                                            />

                                            <DescriptionCard
                                                label="Purchase Order Number"
                                                description={
                                                    data.data.purchase_order
                                                        .purchase_order_number
                                                }
                                            />

                                            <DescriptionCard
                                                label="Payment To"
                                                description={
                                                    data.data.payment_to
                                                }
                                            />

                                            <DescriptionCard
                                                label="Tax Identification Number"
                                                description={
                                                    data.data
                                                        .tax_identification_number
                                                }
                                            />

                                            <DescriptionCard
                                                label="Amount in Figures"
                                                description={
                                                    data.data.amount_in_figures
                                                }
                                            />

                                            <DescriptionCard
                                                label="Amount in Words"
                                                description={
                                                    data.data.amount_in_words
                                                }
                                            />

                                            <DescriptionCard
                                                label="Bank"
                                                description={
                                                    data.data.bank_name
                                                }
                                            />

                                            <DescriptionCard
                                                label="Account Number"
                                                description={
                                                    data.data.account_number
                                                }
                                            />

                                            <DescriptionCard
                                                label="Requested By"
                                                description={`${data.data.requested_by.first_name} ${data.data.requested_by.last_name}`}
                                            />

                                            <DescriptionCard
                                                label="Payment Date"
                                                description={
                                                    data.data.payment_date
                                                }
                                            />

                                            <DescriptionCard
                                                label="Payment Reason"
                                                description={
                                                    data.data.payment_reason
                                                }
                                            />
                                        </div>

                                        <FormProvider {...form}>
                                            <form className="space-y-3 mt-5">
                                                <FormTextArea
                                                    label="Comment"
                                                    name="comment"
                                                    placeholder="Enter Comment"
                                                    required
                                                />

                                                <FormButton
                                                    size="lg"
                                                    className="bg-green-500"
                                                >
                                                    Approve
                                                </FormButton>
                                            </form>
                                        </FormProvider>
                                    </>
                                )
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="uploads">
                    <Card>
                        <CardHeader className="font-bold">
                            File Uploads
                            <Separator className="mt-4" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <LoadingSpinner />
                            ) : (
                                data && (
                                    <div className="grid grid-cols-3">
                                        <DocumentCard
                                            id={data?.data.id}
                                            title="Payment Request Upload"
                                            file={data?.data.document}
                                            onLoadSuccess={
                                                onDocumentLoadSuccess
                                            }
                                            pageNumber={pageNumber}
                                            uploadedDateTime={
                                                data?.data.created_datetime
                                            }
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
