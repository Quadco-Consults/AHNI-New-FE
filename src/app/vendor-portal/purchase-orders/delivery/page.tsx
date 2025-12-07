"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { Alert, AlertDescription } from "components/ui/alert";
import {
  Truck,
  Calendar,
  MapPin,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  Upload,
  FileText,
  Search
} from "lucide-react";
import { useVendorPurchaseOrders, POGRNUtils } from "@/features/vendor-portal/controllers/purchaseOrderController";
import { LoadingSpinner } from "components/Loading";

export default function DeliveryManagementPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [deliveryData, setDeliveryData] = useState({
    delivery_date: "",
    tracking_number: "",
    carrier: "",
    notes: "",
    proof_of_delivery: null as File | null
  });

  const { data: orders, isLoading, error } = useVendorPurchaseOrders();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading delivery management...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load purchase orders. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  // Filter orders that need delivery updates
  const deliveryOrders = orders?.filter((order: any) =>
    ['CONFIRMED', 'IN_PROGRESS', 'PARTIALLY_DELIVERED'].includes(order.status)
  ) || [];

  const filteredOrders = deliveryOrders.filter((order: any) =>
    searchTerm === "" ||
    order.po_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeliveryUpdate = () => {
    if (!selectedOrder) return;

    // TODO: Implement delivery update API call
    console.log('Updating delivery for order:', selectedOrder.po_number, deliveryData);

    // Reset form
    setSelectedOrder(null);
    setDeliveryData({
      delivery_date: "",
      tracking_number: "",
      carrier: "",
      notes: "",
      proof_of_delivery: null
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDeliveryStatus = (order: any) => {
    const today = new Date();
    const deliveryDate = new Date(order.delivery_date);
    const daysUntilDelivery = Math.ceil((deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDelivery < 0) return { status: 'overdue', color: 'destructive', text: 'Overdue' };
    if (daysUntilDelivery <= 3) return { status: 'urgent', color: 'secondary', text: 'Due Soon' };
    if (daysUntilDelivery <= 7) return { status: 'upcoming', color: 'outline', text: 'Upcoming' };
    return { status: 'scheduled', color: 'default', text: 'Scheduled' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Delivery Management</h1>
          <p className="text-gray-600 mt-1">
            Update delivery status and manage shipments for your purchase orders
          </p>
        </div>
        <Button onClick={() => router.push('/vendor-portal/orders')}>
          Back to Orders
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Orders Requiring Delivery Updates
            </CardTitle>
            <CardDescription>
              Select an order to update delivery information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Orders */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order: any) => {
                  const deliveryStatus = getDeliveryStatus(order);
                  const isSelected = selectedOrder?.id === order.id;

                  return (
                    <div
                      key={order.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{order.po_number}</h4>
                        <Badge variant={deliveryStatus.color as any}>
                          {deliveryStatus.text}
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Due: {formatDate(order.delivery_date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          <span>Value: {POGRNUtils.formatCurrency(order.total_amount)}</span>
                        </div>
                        <div className="text-xs">
                          Status: {POGRNUtils.getPOStatusDisplayName(order.status)}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No orders found</p>
                  <p className="text-xs">Try adjusting your search</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Update Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Update Delivery Information
            </CardTitle>
            <CardDescription>
              {selectedOrder
                ? `Update delivery for ${selectedOrder.po_number}`
                : "Select an order to update delivery information"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedOrder ? (
              <div className="space-y-4">
                {/* Order Summary */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{selectedOrder.po_number}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Expected Delivery: {formatDate(selectedOrder.delivery_date)}</div>
                    <div>Order Value: {POGRNUtils.formatCurrency(selectedOrder.total_amount)}</div>
                    <div>Items: {selectedOrder.items?.length || 0}</div>
                  </div>
                </div>

                {/* Delivery Form */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="delivery_date">Actual/Planned Delivery Date</Label>
                    <Input
                      id="delivery_date"
                      type="date"
                      value={deliveryData.delivery_date}
                      onChange={(e) => setDeliveryData({ ...deliveryData, delivery_date: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="carrier">Carrier/Shipping Company</Label>
                    <Select value={deliveryData.carrier} onValueChange={(value) => setDeliveryData({ ...deliveryData, carrier: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select carrier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dhl">DHL</SelectItem>
                        <SelectItem value="fedex">FedEx</SelectItem>
                        <SelectItem value="ups">UPS</SelectItem>
                        <SelectItem value="gig">GIG Logistics</SelectItem>
                        <SelectItem value="kwik">Kwik Delivery</SelectItem>
                        <SelectItem value="custom">Custom/Self Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tracking_number">Tracking Number</Label>
                    <Input
                      id="tracking_number"
                      value={deliveryData.tracking_number}
                      onChange={(e) => setDeliveryData({ ...deliveryData, tracking_number: e.target.value })}
                      placeholder="Enter tracking number"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Delivery Notes</Label>
                    <Textarea
                      id="notes"
                      value={deliveryData.notes}
                      onChange={(e) => setDeliveryData({ ...deliveryData, notes: e.target.value })}
                      placeholder="Additional delivery information, special instructions, etc."
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="proof_of_delivery">Proof of Delivery (Optional)</Label>
                    <Input
                      id="proof_of_delivery"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setDeliveryData({ ...deliveryData, proof_of_delivery: e.target.files?.[0] || null })}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload delivery receipt, photo, or other proof (Max 5MB)
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleDeliveryUpdate} className="flex-1">
                      Update Delivery Status
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select an order from the list to update delivery information</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delivery Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Guidelines</CardTitle>
          <CardDescription>
            Important information about delivery management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Best Practices
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Update delivery information as soon as items are shipped</li>
                <li>• Provide accurate tracking numbers when available</li>
                <li>• Include delivery photos for high-value items</li>
                <li>• Communicate delays promptly to procurement team</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                Important Notes
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Late deliveries may affect future vendor ratings</li>
                <li>• Ensure items match PO specifications exactly</li>
                <li>• Contact support for delivery address changes</li>
                <li>• Keep delivery receipts for at least 12 months</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}