"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateServiceOrder } from "@/hooks/useServiceOrders";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export default function ServiceOrderFormPage() {
  const router = useRouter();
  const createMutation = useCreateServiceOrder();
  const [prData, setPrData] = useState<any>(null);
  const [formData, setFormData] = useState({
    vendor: "",
    department: "",
    service_type: "OTHER",
    service_description: "",
    service_start_date: "",
    service_end_date: "",
    payment_frequency: "ONE_TIME",
    payment_terms: "",
    is_recurring: false,
    vendor_contact_person: "",
    vendor_contact_phone: "",
    notes: "",
  });

  useEffect(() => {
    // Load PR data from sessionStorage
    const storedData = sessionStorage.getItem("selectedPRForSO");
    if (storedData) {
      const data = JSON.parse(storedData);
      setPrData(data);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.vendor) {
      toast.error("Please select a vendor");
      return;
    }

    if (!formData.service_description) {
      toast.error("Please enter service description");
      return;
    }

    try {
      const payload = {
        ...formData,
        purchase_request: prData?.prId,
        items: prData?.items || [],
      };

      const result = await createMutation.mutateAsync(payload);

      toast.success("Service Order created successfully!");
      sessionStorage.removeItem("selectedPRForSO");
      router.push(`/dashboard/procurement/service-orders/${result.data.id}`);
    } catch (error: any) {
      console.error("Error creating service order:", error);
      toast.error(error.response?.data?.message || "Failed to create service order");
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Service Order</h1>
          <p className="text-muted-foreground">
            {prData ? `From PR: ${prData.prRefNumber}` : "Fill in service order details"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Information */}
        <Card>
          <CardHeader>
            <CardTitle>Service Information</CardTitle>
            <CardDescription>Basic details about the service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service_type">Service Type *</Label>
                <Select
                  value={formData.service_type}
                  onValueChange={(value) => setFormData({ ...formData, service_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TRAVEL">Travel & Transportation</SelectItem>
                    <SelectItem value="COMMUNICATION">Communication (Data, Airtime)</SelectItem>
                    <SelectItem value="CATERING">Catering & Feeding</SelectItem>
                    <SelectItem value="PRINTING">Printing & Documentation</SelectItem>
                    <SelectItem value="COURIER">Courier & Delivery</SelectItem>
                    <SelectItem value="UTILITIES">Utilities & Facilities</SelectItem>
                    <SelectItem value="OTHER">Other Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_frequency">Payment Frequency *</Label>
                <Select
                  value={formData.payment_frequency}
                  onValueChange={(value) => setFormData({ ...formData, payment_frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ONE_TIME">One Time</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                    <SelectItem value="ON_DEMAND">On Demand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service_description">Service Description *</Label>
              <Textarea
                id="service_description"
                placeholder="Describe the service being ordered..."
                value={formData.service_description}
                onChange={(e) => setFormData({ ...formData, service_description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service_start_date">Service Start Date</Label>
                <Input
                  id="service_start_date"
                  type="date"
                  value={formData.service_start_date}
                  onChange={(e) => setFormData({ ...formData, service_start_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service_end_date">Service End Date</Label>
                <Input
                  id="service_end_date"
                  type="date"
                  value={formData.service_end_date}
                  onChange={(e) => setFormData({ ...formData, service_end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_recurring"
                checked={formData.is_recurring}
                onCheckedChange={(checked) => setFormData({ ...formData, is_recurring: checked as boolean })}
              />
              <Label htmlFor="is_recurring" className="font-normal">
                This is a recurring service
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Information */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Information</CardTitle>
            <CardDescription>Details about the service provider</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor *</Label>
              <Input
                id="vendor"
                placeholder="Select or enter vendor ID"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                required
              />
              <p className="text-sm text-muted-foreground">
                Enter the vendor UUID from the vendor database
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendor_contact_person">Contact Person</Label>
                <Input
                  id="vendor_contact_person"
                  placeholder="Contact person name"
                  value={formData.vendor_contact_person}
                  onChange={(e) => setFormData({ ...formData, vendor_contact_person: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendor_contact_phone">Contact Phone</Label>
                <Input
                  id="vendor_contact_phone"
                  placeholder="+234..."
                  value={formData.vendor_contact_phone}
                  onChange={(e) => setFormData({ ...formData, vendor_contact_phone: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>Payment terms and conditions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment_terms">Payment Terms</Label>
              <Input
                id="payment_terms"
                placeholder="e.g., Net 30, Payment on delivery, etc."
                value={formData.payment_terms}
                onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="Enter department UUID"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Internal Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes or special instructions..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Service Items Summary */}
        {prData && prData.items && prData.items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Service Items ({prData.items.length})</CardTitle>
              <CardDescription>Items from Purchase Request</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {prData.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} {item.unit_of_measure}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ₦{parseFloat(item.unit_price).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Buttons */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={createMutation.isPending} className="flex-1">
            {createMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Service Order
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
