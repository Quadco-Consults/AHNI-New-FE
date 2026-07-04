"use client";

export const dynamic = "force-dynamic";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  FileText,
  User,
  Phone,
  Mail,
  AlertCircle,
  Briefcase,
  Settings,
  Building
} from "lucide-react";
import {
  useServiceOrderDetails,
  useAcknowledgeServiceOrder,
  SOUtils,
  SOAcknowledgment
} from "@/features/vendor-portal/controllers/serviceOrderController";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";

const AcknowledgmentSchema = z.object({
  vendor_notes: z.string().optional(),
  service_start_confirmation: z.string().min(1, "Service start confirmation is required"),
});

type AcknowledgmentFormData = z.infer<typeof AcknowledgmentSchema>;

export default function ServiceOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const soId = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const action = searchParams?.get('action');

  const [activeTab, setActiveTab] = useState("overview");

  const { data: serviceOrder, isLoading, error } = useServiceOrderDetails(soId as string);
  const { mutate: acknowledgeSO, isPending: isAcknowledging } = useAcknowledgeServiceOrder();

  const acknowledgmentForm = useForm<AcknowledgmentFormData>({
    resolver: zodResolver(AcknowledgmentSchema),
    defaultValues: {
      vendor_notes: "",
      service_start_confirmation: "",
    }
  });

  useEffect(() => {
    if (action === 'acknowledge') {
      setActiveTab("acknowledge");
    }
  }, [action]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading service order details...</span>
      </div>
    );
  }

  if (error || !serviceOrder) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load service order details. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAcknowledgment = (data: AcknowledgmentFormData) => {
    const acknowledgment: SOAcknowledgment = {
      so_id: soId as string,
      vendor_notes: data.vendor_notes,
      service_start_confirmation: data.service_start_confirmation,
    };

    acknowledgeSO(acknowledgment, {
      onSuccess: () => {
        toast.success("Service order acknowledged successfully!");
        setActiveTab("overview");
        router.push('/vendor-portal/service-orders');
      },
      onError: () => {
        toast.error("Failed to acknowledge service order");
      }
    });
  };

  const isOverdue = SOUtils.isSOOverdue(serviceOrder);
  const daysUntilEnd = serviceOrder.service_end_date
    ? SOUtils.getDaysUntilEnd(serviceOrder.service_end_date)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/vendor-portal/service-orders')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Service Orders
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">SO #{serviceOrder.service_order_number}</h1>
            <Badge
              variant={SOUtils.getStatusBadgeVariant(serviceOrder.status)}
              style={{
                backgroundColor: serviceOrder.status_info.color === 'green' ? '#10b981' :
                               serviceOrder.status_info.color === 'teal' ? '#14b8a6' :
                               serviceOrder.status_info.color === 'amber' ? '#f59e0b' :
                               serviceOrder.status_info.color === 'red' ? '#ef4444' :
                               undefined
              }}
            >
              {serviceOrder.status_info.text}
            </Badge>
            {serviceOrder.is_recurring && (
              <Badge variant="outline">Recurring</Badge>
            )}
          </div>
          <p className="text-gray-600 mt-1">
            Ordered on {formatDate(serviceOrder.order_date)}
            {serviceOrder.service_end_date && ` • Service ends ${formatDate(serviceOrder.service_end_date)}`}
          </p>
        </div>
      </div>

      {/* Status Alerts */}
      {isOverdue && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This service order is overdue by {Math.abs(daysUntilEnd || 0)} days. Please provide an update on service status.
          </AlertDescription>
        </Alert>
      )}

      {serviceOrder.status === 'APPROVED' && (
        <Alert className="border-amber-200 bg-amber-50">
          <Clock className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            This service order requires your acknowledgment. Please review and confirm your agreement to the terms.
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Payable</p>
                <p className="text-xl font-bold text-green-600">
                  {SOUtils.formatCurrency(serviceOrder.net_payable, serviceOrder.currency)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Service Items</p>
                <p className="text-xl font-bold text-blue-600">{serviceOrder.service_items.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Service Type</p>
                <p className="text-lg font-bold text-purple-600">{serviceOrder.service_type_display}</p>
              </div>
              <Settings className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Payment Frequency</p>
                <p className="text-lg font-bold text-orange-600">{serviceOrder.payment_frequency_display}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="items">Service Items</TabsTrigger>
          <TabsTrigger value="approval">Approval Workflow</TabsTrigger>
          <TabsTrigger value="acknowledge" disabled={serviceOrder.status !== 'APPROVED'}>
            Acknowledge
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Service Order Information */}
            <Card>
              <CardHeader>
                <CardTitle>Service Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">SO Number</label>
                    <p className="text-gray-900">{serviceOrder.service_order_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Badge variant={SOUtils.getStatusBadgeVariant(serviceOrder.status)}>
                      {serviceOrder.status_info.text}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Order Date</label>
                    <p className="text-gray-900">{formatDate(serviceOrder.order_date)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Service Type</label>
                    <p className="text-gray-900">{serviceOrder.service_type_display}</p>
                  </div>
                  {serviceOrder.service_start_date && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Service Start</label>
                      <p className="text-gray-900">{formatDate(serviceOrder.service_start_date)}</p>
                    </div>
                  )}
                  {serviceOrder.service_end_date && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Service End</label>
                      <p className="text-gray-900">{formatDate(serviceOrder.service_end_date)}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Service Description</label>
                  <p className="text-gray-900">{serviceOrder.service_description}</p>
                </div>

                {serviceOrder.payment_terms && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Payment Terms</label>
                    <p className="text-gray-900">{serviceOrder.payment_terms}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-700">Payment Frequency</label>
                  <p className="text-gray-900">{serviceOrder.payment_frequency_display}</p>
                </div>

                {serviceOrder.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Notes</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{serviceOrder.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross Total:</span>
                  <span className="font-medium">
                    {SOUtils.formatCurrency(serviceOrder.gross_total, serviceOrder.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">VAT:</span>
                  <span className="font-medium">
                    {SOUtils.formatCurrency(serviceOrder.total_vat, serviceOrder.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">WHT:</span>
                  <span className="font-medium text-orange-600">
                    -{SOUtils.formatCurrency(serviceOrder.total_wht, serviceOrder.currency)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-semibold">Net Payable:</span>
                  <span className="font-bold text-lg text-green-600">
                    {SOUtils.formatCurrency(serviceOrder.net_payable, serviceOrder.currency)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vendor Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Vendor Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Company Name</label>
                  <p className="text-gray-900">{serviceOrder.vendor.company_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{serviceOrder.vendor.email}</p>
                </div>
                {serviceOrder.vendor.phone_numbers && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{serviceOrder.vendor.phone_numbers}</p>
                  </div>
                )}
                {serviceOrder.vendor.company_address && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <p className="text-gray-900">{serviceOrder.vendor.company_address}</p>
                  </div>
                )}
                {serviceOrder.vendor.tin && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">TIN</label>
                    <p className="text-gray-900">{serviceOrder.vendor.tin}</p>
                  </div>
                )}
                {serviceOrder.vendor.bank_name && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Bank Details</label>
                    <p className="text-gray-900">
                      {serviceOrder.vendor.bank_name}<br/>
                      {serviceOrder.vendor.account_name} - {serviceOrder.vendor.account_number}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Department & Funding */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {serviceOrder.department && (
              <Card>
                <CardHeader>
                  <CardTitle>Requesting Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-gray-900">{serviceOrder.department.name}</p>
                  {serviceOrder.department.description && (
                    <p className="text-sm text-gray-600 mt-1">{serviceOrder.department.description}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {serviceOrder.funding_source && (
              <Card>
                <CardHeader>
                  <CardTitle>Funding Source</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-gray-900">{serviceOrder.funding_source.name}</p>
                  {serviceOrder.funding_source.description && (
                    <p className="text-sm text-gray-600 mt-1">{serviceOrder.funding_source.description}</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {serviceOrder.fco_number && (
            <Card>
              <CardHeader>
                <CardTitle>FCO Number</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900">{serviceOrder.fco_number.number}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Items ({serviceOrder.service_items.length})</CardTitle>
              <CardDescription>
                Detailed breakdown of all service items in this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceOrder.service_items.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        {item.item && (
                          <>
                            <h4 className="font-medium text-gray-900">{item.item.name}</h4>
                            {item.item.category && (
                              <p className="text-sm text-gray-600">Category: {item.item.category}</p>
                            )}
                          </>
                        )}
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Quantity</label>
                        <p className="font-medium">{item.quantity} {item.unit_of_measure || 'units'}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Unit Price</label>
                        <p className="font-medium">
                          {SOUtils.formatCurrency(item.unit_price, serviceOrder.currency)}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Total</label>
                        <p className="font-medium text-green-600">
                          {SOUtils.formatCurrency(item.total_price, serviceOrder.currency)}
                        </p>
                      </div>
                    </div>

                    {item.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <h5 className="text-sm font-medium text-gray-900 mb-1">Notes</h5>
                        <p className="text-sm text-gray-700">{item.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approval" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Approval Workflow</CardTitle>
              <CardDescription>
                Track the approval progress of this service order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Reviewed */}
                {serviceOrder.approval_workflow.reviewed_by && (
                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-900">Reviewed</p>
                      <p className="text-sm text-blue-700">
                        by {serviceOrder.approval_workflow.reviewed_by.name}
                      </p>
                      <p className="text-xs text-blue-600">
                        {formatDate(serviceOrder.approval_workflow.reviewed_by.datetime)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Authorized */}
                {serviceOrder.approval_workflow.authorized_by && (
                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-purple-900">Authorized</p>
                      <p className="text-sm text-purple-700">
                        by {serviceOrder.approval_workflow.authorized_by.name}
                      </p>
                      <p className="text-xs text-purple-600">
                        {formatDate(serviceOrder.approval_workflow.authorized_by.datetime)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Approved */}
                {serviceOrder.approval_workflow.approved_by && (
                  <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-amber-900">Approved</p>
                      <p className="text-sm text-amber-700">
                        by {serviceOrder.approval_workflow.approved_by.name}
                      </p>
                      <p className="text-xs text-amber-600">
                        {formatDate(serviceOrder.approval_workflow.approved_by.date)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Acknowledged/Agreed */}
                {serviceOrder.approval_workflow.agreed_by ? (
                  <div className="flex items-start gap-4 p-4 bg-teal-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-teal-900">Acknowledged by Vendor</p>
                      <p className="text-sm text-teal-700">
                        by {serviceOrder.approval_workflow.agreed_by.name}
                      </p>
                      <p className="text-xs text-teal-600">
                        {formatDate(serviceOrder.approval_workflow.agreed_by.date)}
                      </p>
                    </div>
                  </div>
                ) : serviceOrder.status === 'APPROVED' && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-amber-300">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Awaiting Vendor Acknowledgment</p>
                      <p className="text-sm text-gray-600">
                        Please review and acknowledge this service order to proceed
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Related Information */}
          {serviceOrder.purchase_request && (
            <Card>
              <CardHeader>
                <CardTitle>Related Purchase Request</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900">PR #{serviceOrder.purchase_request.ref_number}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="acknowledge" className="space-y-6">
          {serviceOrder.status === 'APPROVED' ? (
            <Card>
              <CardHeader>
                <CardTitle>Acknowledge Service Order</CardTitle>
                <CardDescription>
                  Confirm your agreement to the service terms and provide service start details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...acknowledgmentForm}>
                  <form onSubmit={acknowledgmentForm.handleSubmit(handleAcknowledgment)} className="space-y-6">
                    <FormField
                      control={acknowledgmentForm.control}
                      name="service_start_confirmation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Start Confirmation *</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              placeholder="When will you start the service?"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={acknowledgmentForm.control}
                      name="vendor_notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vendor Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Any comments or notes about this service order"
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Service Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <h4 className="font-medium text-gray-900 mb-3">Service Order Summary</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Service Type:</span>
                          <p className="font-medium">{serviceOrder.service_type_display}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Net Payable:</span>
                          <p className="font-medium text-green-600">
                            {SOUtils.formatCurrency(serviceOrder.net_payable, serviceOrder.currency)}
                          </p>
                        </div>
                        {serviceOrder.service_start_date && (
                          <div>
                            <span className="text-gray-600">Expected Start:</span>
                            <p className="font-medium">{formatDate(serviceOrder.service_start_date)}</p>
                          </div>
                        )}
                        {serviceOrder.service_end_date && (
                          <div>
                            <span className="text-gray-600">Expected End:</span>
                            <p className="font-medium">{formatDate(serviceOrder.service_end_date)}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        By acknowledging this service order, you confirm your agreement to deliver the services
                        as specified, within the agreed timeframe and at the specified price.
                      </AlertDescription>
                    </Alert>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setActiveTab("overview")}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isAcknowledging} className="bg-teal-600 hover:bg-teal-700">
                        {isAcknowledging ? (
                          <>
                            <LoadingSpinner />
                            <span className="ml-2">Acknowledging...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Acknowledge Service Order
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-16">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-teal-500" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Service Order Already Acknowledged</h3>
                <p className="text-gray-500">
                  {serviceOrder.approval_workflow.agreed_by && (
                    <>
                      This service order was acknowledged on {formatDate(serviceOrder.approval_workflow.agreed_by.date)} by {serviceOrder.approval_workflow.agreed_by.name}
                    </>
                  )}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
