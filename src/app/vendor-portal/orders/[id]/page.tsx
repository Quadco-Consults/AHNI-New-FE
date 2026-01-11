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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {

ArrowLeft,
  Calendar,
  DollarSign,
  Package,
  CheckCircle,
  Clock,
  FileText,
  Download,
  Upload,
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  Save,
  Send,
  AlertCircle
} from "lucide-react";
import {
  usePurchaseOrderDetails,
  useAcknowledgePurchaseOrder,
  useUpdateDeliveryStatus,
  useUploadDeliveryProof,
  POGRNUtils
} from "@/features/vendor-portal/controllers/purchaseOrderController";
import { POAcknowledgment, DeliveryUpdate, DeliveryStatus } from "@/features/vendor-portal/types/purchase-orders";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";

const AcknowledgmentSchema = z.object({
  estimated_delivery_date: z.string().min(1, "Estimated delivery date is required"),
  vendor_notes: z.string().optional(),
  delivery_method: z.string().min(1, "Delivery method is required"),
  tracking_will_be_provided: z.boolean(),
  line_item_confirmations: z.array(z.object({
    po_line_item_id: z.string(),
    can_fulfill: z.boolean(),
    confirmed_quantity: z.number().min(0),
    confirmed_delivery_date: z.string().min(1),
    alternative_specifications: z.string().optional(),
    notes: z.string().optional(),
  }))
});

const DeliveryUpdateSchema = z.object({
  delivery_status: z.enum(['SCHEDULED', 'IN_TRANSIT', 'DELIVERED', 'CONFIRMED', 'DELAYED', 'FAILED']),
  estimated_delivery_date: z.string().optional(),
  actual_delivery_date: z.string().optional(),
  tracking_information: z.object({
    carrier: z.string(),
    tracking_number: z.string(),
    tracking_url: z.string().optional(),
  }).optional(),
  delivery_notes: z.string().optional(),
});

type AcknowledgmentFormData = z.infer<typeof AcknowledgmentSchema>;
type DeliveryUpdateFormData = z.infer<typeof DeliveryUpdateSchema>;

export default function PurchaseOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const poId = Array.isArray(params.id) ? params.id[0] : params.id;
  const action = searchParams.get('action');

  const [activeTab, setActiveTab] = useState("overview");
  const [showAcknowledgment, setShowAcknowledgment] = useState(false);
  const [showDeliveryUpdate, setShowDeliveryUpdate] = useState(false);
  const [deliveryProofFiles, setDeliveryProofFiles] = useState<FileList | null>(null);

  const { data: purchaseOrder, isLoading, error } = usePurchaseOrderDetails(poId as string);
  const { mutate: acknowledgePO, isPending: isAcknowledging } = useAcknowledgePurchaseOrder();
  const { mutate: updateDelivery, isPending: isUpdatingDelivery } = useUpdateDeliveryStatus();
  const { mutate: uploadProof, isPending: isUploadingProof } = useUploadDeliveryProof();

  const acknowledgmentForm = useForm<AcknowledgmentFormData>({
    resolver: zodResolver(AcknowledgmentSchema),
    defaultValues: {
      estimated_delivery_date: "",
      vendor_notes: "",
      delivery_method: "",
      tracking_will_be_provided: false,
      line_item_confirmations: []
    }
  });

  const deliveryUpdateForm = useForm<DeliveryUpdateFormData>({
    resolver: zodResolver(DeliveryUpdateSchema),
    defaultValues: {
      delivery_status: 'SCHEDULED',
      estimated_delivery_date: "",
      actual_delivery_date: "",
      delivery_notes: "",
    }
  });

  useEffect(() => {
    if (action === 'acknowledge') {
      setShowAcknowledgment(true);
      setActiveTab("acknowledge");
    } else if (action === 'update') {
      setShowDeliveryUpdate(true);
      setActiveTab("delivery");
    }
  }, [action]);

  useEffect(() => {
    if (purchaseOrder && !acknowledgmentForm.getValues().line_item_confirmations.length) {
      const confirmations = purchaseOrder.line_items.map(item => ({
        po_line_item_id: item.id,
        can_fulfill: true,
        confirmed_quantity: item.quantity_ordered,
        confirmed_delivery_date: purchaseOrder.delivery_date,
        alternative_specifications: "",
        notes: ""
      }));
      acknowledgmentForm.setValue('line_item_confirmations', confirmations);
    }
  }, [purchaseOrder, acknowledgmentForm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading purchase order details...</span>
      </div>
    );
  }

  if (error || !purchaseOrder) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load purchase order details. Please try refreshing the page.
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
    const acknowledgment: POAcknowledgment = {
      po_id: poId as string,
      acknowledged_date: new Date().toISOString(),
      estimated_delivery_date: data.estimated_delivery_date,
      line_item_confirmations: data.line_item_confirmations,
      vendor_notes: data.vendor_notes,
      delivery_method: data.delivery_method,
      tracking_will_be_provided: data.tracking_will_be_provided
    };

    acknowledgePO(acknowledgment, {
      onSuccess: () => {
        toast.success("Purchase order acknowledged successfully!");
        setShowAcknowledgment(false);
        setActiveTab("overview");
      },
      onError: () => {
        toast.error("Failed to acknowledge purchase order");
      }
    });
  };

  const handleDeliveryUpdate = (data: DeliveryUpdateFormData) => {
    const update: DeliveryUpdate = {
      po_id: poId as string,
      delivery_status: data.delivery_status,
      estimated_delivery_date: data.estimated_delivery_date,
      actual_delivery_date: data.actual_delivery_date,
      tracking_information: data.tracking_information,
      delivery_notes: data.delivery_notes
    };

    updateDelivery(update, {
      onSuccess: () => {
        toast.success("Delivery status updated successfully!");
        setShowDeliveryUpdate(false);
      },
      onError: () => {
        toast.error("Failed to update delivery status");
      }
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setDeliveryProofFiles(event.target.files);
    }
  };

  const handleUploadDeliveryProof = () => {
    if (!deliveryProofFiles || deliveryProofFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    uploadProof({
      po_id: poId as string,
      files: Array.from(deliveryProofFiles),
      delivery_date: new Date().toISOString(),
      delivery_notes: "Delivery proof uploaded by vendor"
    }, {
      onSuccess: () => {
        toast.success("Delivery proof uploaded successfully!");
        setDeliveryProofFiles(null);
      },
      onError: () => {
        toast.error("Failed to upload delivery proof");
      }
    });
  };

  const completionPercentage = POGRNUtils.calculateCompletionPercentage(purchaseOrder);
  const isOverdue = POGRNUtils.isPOOverdue(purchaseOrder);
  const daysUntilDelivery = POGRNUtils.getDaysUntilDelivery(purchaseOrder.delivery_date);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/vendor-portal/orders')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">PO #{purchaseOrder.po_number}</h1>
            <Badge variant={POGRNUtils.getPOStatusBadgeVariant(purchaseOrder.status)}>
              {POGRNUtils.getPOStatusDisplayName(purchaseOrder.status)}
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">
            Issued on {formatDate(purchaseOrder.issue_date)} •
            Delivery by {formatDate(purchaseOrder.delivery_date)}
          </p>
        </div>
      </div>

      {/* Status Alerts */}
      {isOverdue && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This order is overdue by {Math.abs(daysUntilDelivery)} days. Please provide an update on delivery status.
          </AlertDescription>
        </Alert>
      )}

      {purchaseOrder.status === 'ISSUED' && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            This purchase order requires your acknowledgment. Please review and confirm your ability to fulfill this order.
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-xl font-bold text-green-600">
                  {POGRNUtils.formatCurrency(purchaseOrder.total_amount, purchaseOrder.currency)}
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
                <p className="text-sm font-medium text-gray-600">Line Items</p>
                <p className="text-xl font-bold text-blue-600">{purchaseOrder.line_items.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion</p>
                <p className="text-xl font-bold text-purple-600">{completionPercentage}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Days to Delivery</p>
                <p className={`text-xl font-bold ${isOverdue ? 'text-red-600' : 'text-orange-600'}`}>
                  {isOverdue ? `${Math.abs(daysUntilDelivery)} overdue` : daysUntilDelivery}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="items">Line Items</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="acknowledge" disabled={purchaseOrder.status !== 'ISSUED'}>
            Acknowledge
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Information */}
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">PO Number</label>
                    <p className="text-gray-900">{purchaseOrder.po_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Badge variant={POGRNUtils.getPOStatusBadgeVariant(purchaseOrder.status)}>
                      {POGRNUtils.getPOStatusDisplayName(purchaseOrder.status)}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Issue Date</label>
                    <p className="text-gray-900">{formatDate(purchaseOrder.issue_date)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Delivery Date</label>
                    <p className="text-gray-900">{formatDate(purchaseOrder.delivery_date)}</p>
                  </div>
                </div>

                {purchaseOrder.rfq_reference && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">RFQ Reference</label>
                    <p className="text-gray-900">{purchaseOrder.rfq_reference}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-700">Payment Terms</label>
                  <p className="text-gray-900">{purchaseOrder.payment_terms}</p>
                </div>

                {purchaseOrder.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Notes</label>
                    <p className="text-gray-900">{purchaseOrder.notes}</p>
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
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    {POGRNUtils.formatCurrency(purchaseOrder.subtotal, purchaseOrder.currency)}
                  </span>
                </div>
                {purchaseOrder.discount_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-green-600">
                      -{POGRNUtils.formatCurrency(purchaseOrder.discount_amount, purchaseOrder.currency)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">
                    {POGRNUtils.formatCurrency(purchaseOrder.tax_amount, purchaseOrder.currency)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg">
                    {POGRNUtils.formatCurrency(purchaseOrder.total_amount, purchaseOrder.currency)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Overall Completion</span>
                  <span className="text-sm font-medium">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Line Items ({purchaseOrder.line_items.length})</CardTitle>
              <CardDescription>
                Detailed breakdown of all items in this purchase order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchaseOrder.line_items.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="md:col-span-2">
                        <h4 className="font-medium text-gray-900">{item.item_name}</h4>
                        <p className="text-sm text-gray-600">Code: {item.item_code}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Ordered</label>
                        <p className="font-medium">{item.quantity_ordered} {item.unit_of_measure}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Delivered</label>
                        <p className="font-medium">{item.quantity_delivered} {item.unit_of_measure}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Unit Price</label>
                        <p className="font-medium">
                          {POGRNUtils.formatCurrency(item.unit_price, purchaseOrder.currency)}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Total</label>
                        <p className="font-medium">
                          {POGRNUtils.formatCurrency(item.total_price, purchaseOrder.currency)}
                        </p>
                      </div>
                    </div>

                    {/* Progress bar for this item */}
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Delivery Progress</span>
                        <span className="text-xs font-medium">
                          {Math.round((item.quantity_delivered / item.quantity_ordered) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-green-600 h-1.5 rounded-full"
                          style={{
                            width: `${Math.round((item.quantity_delivered / item.quantity_ordered) * 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    {item.specifications && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <h5 className="text-sm font-medium text-gray-900 mb-1">Specifications</h5>
                        <p className="text-sm text-gray-700">{item.specifications}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Delivery Location</label>
                  <p className="text-gray-900">{purchaseOrder.delivery_location.name}</p>
                  <p className="text-sm text-gray-600">{purchaseOrder.delivery_location.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Contact Person</label>
                  <p className="text-gray-900">{purchaseOrder.delivery_location.contact_person}</p>
                  {purchaseOrder.delivery_location.phone && (
                    <p className="text-sm text-gray-600">{purchaseOrder.delivery_location.phone}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Requested Delivery Date</label>
                  <p className="text-gray-900">{formatDate(purchaseOrder.delivery_date)}</p>
                </div>
                {purchaseOrder.delivery_instructions && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Special Instructions</label>
                    <p className="text-gray-900">{purchaseOrder.delivery_instructions}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tracking Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Tracking Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {purchaseOrder.tracking_information ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Carrier</label>
                      <p className="text-gray-900">{purchaseOrder.tracking_information.carrier}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Tracking Number</label>
                      <p className="text-gray-900 font-mono">{purchaseOrder.tracking_information.tracking_number}</p>
                    </div>
                    {purchaseOrder.tracking_information.estimated_delivery && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Estimated Delivery</label>
                        <p className="text-gray-900">
                          {formatDate(purchaseOrder.tracking_information.estimated_delivery)}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Truck className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">No tracking information available yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Delivery Update Form */}
          {['ACKNOWLEDGED', 'IN_PROGRESS', 'PARTIALLY_DELIVERED'].includes(purchaseOrder.status) && (
            <Card>
              <CardHeader>
                <CardTitle>Update Delivery Status</CardTitle>
                <CardDescription>
                  Provide updates on your delivery progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...deliveryUpdateForm}>
                  <form onSubmit={deliveryUpdateForm.handleSubmit(handleDeliveryUpdate)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={deliveryUpdateForm.control}
                        name="delivery_status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Status</FormLabel>
                            <FormControl>
                              <select {...field} className="w-full px-3 py-2 border rounded-md">
                                <option value="SCHEDULED">Scheduled</option>
                                <option value="IN_TRANSIT">In Transit</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="DELAYED">Delayed</option>
                                <option value="FAILED">Failed</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={deliveryUpdateForm.control}
                        name="estimated_delivery_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estimated Delivery Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={deliveryUpdateForm.control}
                      name="delivery_notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Provide any updates or additional information about the delivery"
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isUpdatingDelivery}>
                      {isUpdatingDelivery ? (
                        <>
                          <LoadingSpinner />
                          <span className="ml-2">Updating...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Update Status
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Upload Delivery Proof */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Delivery Proof</CardTitle>
              <CardDescription>
                Upload delivery receipts, photos, or other proof of delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <div className="text-center">
                      <label htmlFor="delivery-proof" className="cursor-pointer text-blue-600 hover:text-blue-500">
                        Click to upload delivery proof documents
                      </label>
                      <Input
                        id="delivery-proof"
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 10MB each</p>
                  </div>
                  {deliveryProofFiles && (
                    <div className="mt-4">
                      <p className="text-sm font-medium">Selected files:</p>
                      <ul className="text-sm text-gray-600">
                        {Array.from(deliveryProofFiles).map((file, index) => (
                          <li key={index}>• {file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleUploadDeliveryProof}
                  disabled={!deliveryProofFiles || isUploadingProof}
                >
                  {isUploadingProof ? (
                    <>
                      <LoadingSpinner />
                      <span className="ml-2">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Proof
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Order Documents</CardTitle>
              <CardDescription>
                All documents related to this purchase order
              </CardDescription>
            </CardHeader>
            <CardContent>
              {purchaseOrder.documents.length > 0 ? (
                <div className="space-y-3">
                  {purchaseOrder.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500">{doc.type} • {formatDate(doc.uploaded_date)}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(doc.url, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No documents available for this purchase order</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>AHNI Contact Information</CardTitle>
              <CardDescription>
                Get in touch if you have questions about this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{purchaseOrder.procurement_officer.name}</p>
                    <p className="text-sm text-gray-600">Procurement Officer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-900">{purchaseOrder.procurement_officer.email}</p>
                </div>
                {purchaseOrder.procurement_officer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <p className="text-gray-900">{purchaseOrder.procurement_officer.phone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acknowledge" className="space-y-6">
          {purchaseOrder.status === 'ISSUED' ? (
            <Card>
              <CardHeader>
                <CardTitle>Acknowledge Purchase Order</CardTitle>
                <CardDescription>
                  Confirm your ability to fulfill this purchase order and provide delivery details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...acknowledgmentForm}>
                  <form onSubmit={acknowledgmentForm.handleSubmit(handleAcknowledgment)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={acknowledgmentForm.control}
                        name="estimated_delivery_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estimated Delivery Date *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={acknowledgmentForm.control}
                        name="delivery_method"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Method *</FormLabel>
                            <FormControl>
                              <select {...field} className="w-full px-3 py-2 border rounded-md">
                                <option value="">Select delivery method</option>
                                <option value="COMPANY_VEHICLE">Company Vehicle</option>
                                <option value="COURIER">Courier Service</option>
                                <option value="FREIGHT">Freight</option>
                                <option value="PICKUP">Customer Pickup</option>
                                <option value="POSTAL">Postal Service</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={acknowledgmentForm.control}
                      name="tracking_will_be_provided"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>I will provide tracking information</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={acknowledgmentForm.control}
                      name="vendor_notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Any additional notes or comments about this order"
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setActiveTab("overview")}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isAcknowledging}>
                        {isAcknowledging ? (
                          <>
                            <LoadingSpinner />
                            <span className="ml-2">Acknowledging...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Acknowledge Order
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
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Order Already Acknowledged</h3>
                <p className="text-gray-500">
                  This purchase order has been acknowledged on {formatDate(purchaseOrder.acknowledgment_date || purchaseOrder.issue_date)}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}