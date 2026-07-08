"use client";

import BackNavigation from "@/components/BackNavigation";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useGetSinglePaymentRequestQuery } from "@/features/admin/controllers/paymentRequestController";
import { LoadingSpinner } from "@/components/Loading";
import DocumentCard from "@/features/projects/components/projects/create/DocumentCard";
import { useState } from "react";
import {
  CalendarIcon,
  UserIcon,
  CreditCardIcon,
  FileTextIcon,
  CheckCircleIcon,
  BanknoteIcon,
  BuildingIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ApprovedPaymentRequestDetail() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [pageNumber] = useState<number>(1);

  function onDocumentLoadSuccess(): void {
    // Document loaded successfully
  }

  const { data, isLoading } = useGetSinglePaymentRequestQuery(id || "", !!id);

  // Get status badge color
  const getStatusBadge = (status: string) => {
    return (
      <Badge variant="outline" className={cn("font-medium bg-green-100 text-green-800 border-green-200")}>
        <CheckCircleIcon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  // Format currency
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(num);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue='details'>
        <TabsList>
          <BackNavigation />
          <TabsTrigger value='details'>Details</TabsTrigger>
          <TabsTrigger value='uploads'>File Uploads</TabsTrigger>
        </TabsList>

        <TabsContent value='details' className="space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="py-20">
                <LoadingSpinner />
              </CardContent>
            </Card>
          ) : (
            data && (
              <>
                {/* Header Card with Summary */}
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h1 className="text-2xl font-bold text-gray-900">
                            Approved Payment Request
                          </h1>
                          {getStatusBadge(data.data.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          Request ID: <span className="font-mono font-medium">{data.data.id}</span>
                        </p>
                      </div>
                      <div className="text-right space-y-3">
                        <div>
                          <p className="text-3xl font-bold text-green-600">
                            {formatCurrency(data.data.total_amount || data.data.gross_amount || 0)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">Total Amount</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <CalendarIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Payment Date</p>
                          <p className="font-medium text-gray-900">
                            {format(new Date(data.data.payment_date), "dd MMM yyyy")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <FileTextIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Payment Type</p>
                          <p className="font-medium text-gray-900">
                            {data.data.payment_type_display || data.data.payment_type}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <UserIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Requested By</p>
                          <p className="font-medium text-gray-900">
                            {typeof data.data.requested_by === 'string'
                              ? data.data.requested_by
                              : data.data.requested_by?.full_name || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <CreditCardIcon className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Payment Items</p>
                          <p className="font-medium text-gray-900">
                            {data.data.payment_items?.length || 0} Item(s)
                          </p>
                        </div>
                      </div>
                    </div>

                    {data.data.payment_type === "PURCHASE_ORDER" && data.data.purchase_order && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-1">Purchase Order</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {data.data.purchase_order.purchase_order_number}
                        </p>
                      </div>
                    )}

                    {data.data.payment_reason && (
                      <div className="mt-6">
                        <p className="text-sm font-medium text-gray-700 mb-2">Payment Reason</p>
                        <p className="text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-200">
                          {data.data.payment_reason}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Project & Budget Information */}
                {(data.data.project || data.data.budget_line) && (
                  <Card>
                    <CardHeader>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Project & Budget Allocation
                      </h3>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.data.project && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Project</p>
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="font-semibold text-gray-900">{data.data.project.project_id}</p>
                              <p className="text-sm text-gray-600 mt-1">{data.data.project.title}</p>
                            </div>
                          </div>
                        )}

                        {data.data.budget_line && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Budget Line</p>
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                              <p className="font-semibold text-gray-900">{data.data.budget_line.code}</p>
                              <p className="text-sm text-gray-600 mt-1">{data.data.budget_line.name}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Payment Items Section */}
                {data.data.payment_items && data.data.payment_items.length > 0 && (
                  <Card>
                    <CardHeader>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Payment Items Details
                      </h3>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-6 space-y-6">
                      {data.data.payment_items.map((item: any, index: number) => (
                        <Card key={item.id} className="border-l-4 border-l-gray-300">
                          <CardHeader className="bg-gray-50">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-gray-900">
                                Payment Item {index + 1}
                              </h4>
                              <Badge variant="outline" className="bg-white">
                                {formatCurrency(item.amount_in_figures || item.amount || 0)}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-6">
                            {/* Recipient Info */}
                            <div className="mb-6">
                              <h5 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                                Recipient Information
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                  <UserIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                  <div>
                                    <p className="text-xs text-gray-600">Payment To</p>
                                    <p className="font-medium text-gray-900">{item.payment_to}</p>
                                  </div>
                                </div>
                                {item.email && (
                                  <div className="flex items-start gap-3">
                                    <MailIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                      <p className="text-xs text-gray-600">Email</p>
                                      <p className="font-medium text-gray-900">{item.email}</p>
                                    </div>
                                  </div>
                                )}
                                {item.phone_number && (
                                  <div className="flex items-start gap-3">
                                    <PhoneIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                      <p className="text-xs text-gray-600">Phone</p>
                                      <p className="font-medium text-gray-900">{item.phone_number}</p>
                                    </div>
                                  </div>
                                )}
                                {item.address && (
                                  <div className="flex items-start gap-3">
                                    <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                      <p className="text-xs text-gray-600">Address</p>
                                      <p className="font-medium text-gray-900">{item.address}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Banking Info */}
                            {(item.bank_name || item.account_number) && (
                              <div className="mb-6">
                                <h5 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                                  Banking Information
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {item.bank_name && (
                                    <div className="flex items-start gap-3">
                                      <BuildingIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                      <div>
                                        <p className="text-xs text-gray-600">Bank Name</p>
                                        <p className="font-medium text-gray-900">{item.bank_name}</p>
                                      </div>
                                    </div>
                                  )}
                                  {item.account_number && (
                                    <div className="flex items-start gap-3">
                                      <CreditCardIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                      <div>
                                        <p className="text-xs text-gray-600">Account Number</p>
                                        <p className="font-medium text-gray-900 font-mono">{item.account_number}</p>
                                      </div>
                                    </div>
                                  )}
                                  {item.tax_identification_number && (
                                    <div className="flex items-start gap-3">
                                      <FileTextIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                      <div>
                                        <p className="text-xs text-gray-600">Tax ID</p>
                                        <p className="font-medium text-gray-900">{item.tax_identification_number}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Amount Info */}
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-start gap-3 mb-3">
                                <BanknoteIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-xs text-gray-600">Amount in Figures</p>
                                  <p className="text-xl font-bold text-gray-900">
                                    {formatCurrency(item.amount_in_figures || item.amount || 0)}
                                  </p>
                                </div>
                              </div>
                              {item.amount_in_words && (
                                <div className="pt-3 border-t border-gray-200">
                                  <p className="text-xs text-gray-600 mb-1">Amount in Words</p>
                                  <p className="font-medium text-gray-900 italic">{item.amount_in_words}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Approval History */}
                {data.data.approvals && data.data.approvals.length > 0 && (
                  <Card>
                    <CardHeader>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Approval History
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Approval workflow for this payment request
                      </p>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-6 space-y-4">
                      {data.data.approvals.map((approval: any, index: number) => (
                        <div key={approval.id} className="flex gap-4">
                          {/* Timeline indicator */}
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircleIcon className="w-5 h-5 text-green-600" />
                            </div>
                            {index < data.data.approvals.length - 1 && (
                              <div className="w-0.5 h-full bg-gray-200 my-2" />
                            )}
                          </div>

                          {/* Content */}
                          <Card className="flex-1 border-l-4 border-l-green-500">
                            <CardContent className="pt-4">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <Badge variant="outline" className="mb-2">
                                    {approval.approval_level}
                                  </Badge>
                                  <p className="font-semibold text-gray-900">
                                    {approval.user?.full_name || "N/A"}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {approval.user?.email || ""}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">
                                    {format(new Date(approval.created_datetime), "dd MMM yyyy")}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {format(new Date(approval.created_datetime), "HH:mm")}
                                  </p>
                                </div>
                              </div>
                              {approval.comments && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                  <p className="text-sm text-gray-700 italic">
                                    &quot;{approval.comments}&quot;
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </>
            )
          )}
        </TabsContent>

        <TabsContent value='uploads'>
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-900">
                Attached Documents
              </h3>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                data && (
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {data?.data.document ? (
                      <DocumentCard
                        id={data?.data.id}
                        title='Payment Request Document'
                        file={data?.data.document}
                        onLoadSuccess={onDocumentLoadSuccess}
                        pageNumber={pageNumber}
                        uploadedDateTime={data?.data.created_datetime}
                        showDeleteIcon={false}
                      />
                    ) : (
                      <div className="col-span-3 text-center py-12 text-gray-500">
                        <FileTextIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>No documents attached to this payment request</p>
                      </div>
                    )}
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
