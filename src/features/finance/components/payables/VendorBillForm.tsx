"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { toast } from "sonner";
import {
  FileText,
  Calendar,
  DollarSign,
  Building,
  Calculator,
  CreditCard,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useGetAllPaymentRequests } from "@/features/admin/controllers/paymentRequestController";

// Types
type BillStatus =
  | 'OPEN'
  | 'PARTIAL'
  | 'PAID'
  | 'OVERDUE'
  | 'VOID'
  | 'CANCELLED';

interface VendorBill {
  id: string;
  bill_number: string;
  vendor_id: string;
  vendor_name: string;
  bill_date: string;
  due_date: string;
  status: BillStatus;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  description?: string;
  reference_number?: string;
  created_at: string;
  updated_at: string;
}

interface BillLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  account_code?: string;
}

interface VendorBillFormData {
  payment_request_id: string;
  vendor_id: string;
  bill_number: string;
  bill_date: string;
  due_date: string;
  reference_number: string;
  description: string;
  payment_terms: string;
  currency: string;
  line_items: BillLineItem[];
  notes: string;
  tax_amount: number;
  discount_amount: number;
}

interface VendorBillFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bill?: VendorBill;
  onSuccess?: () => void;
}

// AHNI Vendors/Suppliers
const ahniVendors = [
  {
    id: "vendor-001",
    name: "Medical Equipment Suppliers Ltd",
    contact: "procurement@medequip.ng",
    terms: "NET_30",
    category: "Medical Supplies"
  },
  {
    id: "vendor-002",
    name: "Nigeria Pharmaceutical Distributors",
    contact: "orders@npharm.ng",
    terms: "NET_15",
    category: "Pharmaceuticals"
  },
  {
    id: "vendor-003",
    name: "Laboratory Services Nigeria",
    contact: "billing@labservices.ng",
    terms: "NET_30",
    category: "Laboratory"
  },
  {
    id: "vendor-004",
    name: "IT Solutions Africa",
    contact: "finance@itsolutions.ng",
    terms: "NET_15",
    category: "Technology"
  },
  {
    id: "vendor-005",
    name: "Logistics & Transport Co",
    contact: "accounts@logistics.ng",
    terms: "NET_30",
    category: "Logistics"
  },
  {
    id: "vendor-006",
    name: "Office Supplies Lagos",
    contact: "billing@officesupplies.ng",
    terms: "NET_15",
    category: "Office Supplies"
  },
  {
    id: "vendor-007",
    name: "Training & Capacity Building",
    contact: "finance@training.ng",
    terms: "NET_30",
    category: "Training"
  },
  {
    id: "vendor-008",
    name: "Security Services Nigeria",
    contact: "billing@security.ng",
    terms: "NET_30",
    category: "Security"
  }
];

// Common expense categories for AHNI
const expenseCategories = [
  { code: "MEDICAL_SUPPLIES", name: "Medical Supplies & Equipment" },
  { code: "PHARMACEUTICALS", name: "Pharmaceuticals & Drugs" },
  { code: "LAB_SERVICES", name: "Laboratory Services" },
  { code: "IT_EQUIPMENT", name: "IT Equipment & Software" },
  { code: "OFFICE_SUPPLIES", name: "Office Supplies" },
  { code: "TRAINING", name: "Training & Capacity Building" },
  { code: "TRANSPORTATION", name: "Transportation & Logistics" },
  { code: "UTILITIES", name: "Utilities & Services" },
  { code: "RENT", name: "Rent & Facilities" },
  { code: "PROFESSIONAL_SERVICES", name: "Professional Services" },
  { code: "SECURITY", name: "Security Services" },
  { code: "COMMUNICATIONS", name: "Communications & Internet" },
  { code: "OTHER", name: "Other Expenses" }
];

const paymentTermsOptions = [
  { value: "NET_15", label: "Net 15 days" },
  { value: "NET_30", label: "Net 30 days" },
  { value: "NET_45", label: "Net 45 days" },
  { value: "NET_60", label: "Net 60 days" },
  { value: "COD", label: "Cash on Delivery" },
  { value: "DUE_ON_RECEIPT", label: "Due on Receipt" }
];

export default function VendorBillForm({
  open,
  onOpenChange,
  bill,
  onSuccess
}: VendorBillFormProps) {
  // Fetch payment requests
  const { data: paymentRequestsData } = useGetAllPaymentRequests({
    page: 1,
    size: 1000,
    search: "",
    enabled: true,
  });

  // Get payment request options
  const paymentRequestOptions = useMemo(
    () =>
      paymentRequestsData?.data?.results?.map((pr: any) => ({
        id: pr.id,
        label: `${pr.payment_reason || 'Payment Request'} - ${pr.payment_date}`,
        payment_type: pr.payment_type,
        payment_reason: pr.payment_reason,
        payment_date: pr.payment_date,
        payment_items: pr.payment_items,
        total_amount: pr.payment_items?.reduce((sum: number, item: any) =>
          sum + parseFloat(item.amount_in_figures || 0), 0
        ) || 0,
      })) || [],
    [paymentRequestsData]
  );

  const [formData, setFormData] = useState<VendorBillFormData>({
    payment_request_id: "",
    vendor_id: "",
    bill_number: "",
    bill_date: new Date().toISOString().split('T')[0],
    due_date: "",
    reference_number: "",
    description: "",
    payment_terms: "NET_30",
    currency: "NGN",
    line_items: [
      {
        id: "1",
        description: "",
        quantity: 1,
        unit_price: 0,
        amount: 0,
        account_code: ""
      }
    ],
    notes: "",
    tax_amount: 0,
    discount_amount: 0
  });

  // Calculate totals
  const subtotal = formData.line_items.reduce((sum, item) => sum + item.amount, 0);
  const total = subtotal + formData.tax_amount - formData.discount_amount;

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (bill) {
        // Edit mode - populate with existing bill data
        setFormData({
          payment_request_id: "",
          vendor_id: bill.vendor_id,
          bill_number: bill.bill_number,
          bill_date: bill.bill_date,
          due_date: bill.due_date,
          reference_number: bill.reference_number || "",
          description: bill.description || "",
          payment_terms: "NET_30",
          currency: "NGN",
          line_items: [
            {
              id: "1",
              description: bill.description || "",
              quantity: 1,
              unit_price: bill.total_amount,
              amount: bill.total_amount,
              account_code: ""
            }
          ],
          notes: "",
          tax_amount: 0,
          discount_amount: 0
        });
      } else {
        // Create mode
        setFormData({
          payment_request_id: "",
          vendor_id: "",
          bill_number: "",
          bill_date: new Date().toISOString().split('T')[0],
          due_date: "",
          reference_number: "",
          description: "",
          payment_terms: "NET_30",
          currency: "NGN",
          line_items: [
            {
              id: "1",
              description: "",
              quantity: 1,
              unit_price: 0,
              amount: 0,
              account_code: ""
            }
          ],
          notes: "",
          tax_amount: 0,
          discount_amount: 0
        });
      }
    }
  }, [open, bill]);

  // Auto-calculate due date when payment terms change
  useEffect(() => {
    if (formData.bill_date && formData.payment_terms && formData.payment_terms !== "DUE_ON_RECEIPT" && formData.payment_terms !== "COD") {
      const billDate = new Date(formData.bill_date);
      let daysToAdd = 30; // default

      switch (formData.payment_terms) {
        case "NET_15": daysToAdd = 15; break;
        case "NET_30": daysToAdd = 30; break;
        case "NET_45": daysToAdd = 45; break;
        case "NET_60": daysToAdd = 60; break;
      }

      const dueDate = new Date(billDate);
      dueDate.setDate(dueDate.getDate() + daysToAdd);

      setFormData(prev => ({
        ...prev,
        due_date: dueDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.bill_date, formData.payment_terms]);

  const generateBillNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `BILL-${year}${month}${day}-${random}`;
  };

  const handleAutoGenerateBillNumber = () => {
    setFormData(prev => ({ ...prev, bill_number: generateBillNumber() }));
  };

  const addLineItem = () => {
    const newId = String(formData.line_items.length + 1);
    setFormData(prev => ({
      ...prev,
      line_items: [
        ...prev.line_items,
        {
          id: newId,
          description: "",
          quantity: 1,
          unit_price: 0,
          amount: 0,
          account_code: ""
        }
      ]
    }));
  };

  const removeLineItem = (id: string) => {
    if (formData.line_items.length > 1) {
      setFormData(prev => ({
        ...prev,
        line_items: prev.line_items.filter(item => item.id !== id)
      }));
    }
  };

  const updateLineItem = (id: string, field: keyof BillLineItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      line_items: prev.line_items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Auto-calculate amount when quantity or unit_price changes
          if (field === 'quantity' || field === 'unit_price') {
            updatedItem.amount = updatedItem.quantity * updatedItem.unit_price;
          }

          return updatedItem;
        }
        return item;
      })
    }));
  };

  const formatCurrency = (amount: number, currency: string = "NGN") => {
    const symbol = currency === "NGN" ? "₦" : "$";
    return `${symbol}${amount.toLocaleString()}`;
  };

  const handlePaymentRequestChange = (paymentRequestId: string) => {
    const paymentRequest = paymentRequestOptions.find(pr => pr.id === paymentRequestId);
    if (paymentRequest) {
      // Auto-populate form from payment request
      const firstPaymentItem = paymentRequest.payment_items?.[0] || {};

      setFormData(prev => ({
        ...prev,
        payment_request_id: paymentRequestId,
        description: paymentRequest.payment_reason || "",
        bill_date: paymentRequest.payment_date || prev.bill_date,
        reference_number: `PR-${paymentRequestId}`,
        line_items: paymentRequest.payment_items?.map((item: any, index: number) => ({
          id: String(index + 1),
          description: `${item.payment_to || ''} - ${paymentRequest.payment_type || ''}`,
          quantity: 1,
          unit_price: parseFloat(item.amount_in_figures || 0),
          amount: parseFloat(item.amount_in_figures || 0),
          account_code: ""
        })) || prev.line_items,
      }));
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.payment_request_id) {
      toast.error("Please select a payment request");
      return;
    }
    if (!formData.bill_number.trim()) {
      toast.error("Please enter a bill number");
      return;
    }
    if (!formData.bill_date) {
      toast.error("Please enter a bill date");
      return;
    }
    if (!formData.due_date) {
      toast.error("Please enter a due date");
      return;
    }
    if (new Date(formData.due_date) <= new Date(formData.bill_date)) {
      toast.error("Due date must be after bill date");
      return;
    }
    if (formData.line_items.length === 0 || formData.line_items.every(item => !item.description.trim())) {
      toast.error("Please add at least one line item with description");
      return;
    }
    if (total <= 0) {
      toast.error("Bill total must be greater than zero");
      return;
    }

    try {
      // Here you would call your API to create/update the vendor bill
      const paymentRequest = paymentRequestOptions.find(pr => pr.id === formData.payment_request_id);
      const action = bill ? "updated" : "created";

      toast.success(
        `Vendor bill "${formData.bill_number}" ${action} successfully for Payment Request - Total: ${formatCurrency(total, formData.currency)}`
      );

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || `Failed to ${bill ? 'update' : 'create'} vendor bill`);
    }
  };

  const selectedPaymentRequest = paymentRequestOptions.find(pr => pr.id === formData.payment_request_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>{bill ? 'Edit Vendor Bill' : 'Create New Vendor Bill'}</span>
          </DialogTitle>
          <DialogDescription>
            {bill
              ? `Update bill ${bill.bill_number} from ${bill.vendor_name}`
              : 'Record a new bill from a vendor for goods or services received'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <span>Bill Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payment_request_id">Payment Request *</Label>
                  <Select
                    value={formData.payment_request_id}
                    onValueChange={handlePaymentRequestChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a payment request" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentRequestOptions.map((pr) => (
                        <SelectItem key={pr.id} value={pr.id}>
                          <div>
                            <div className="font-medium">{pr.label}</div>
                            <div className="text-xs text-gray-600">
                              {pr.payment_type} • Total: ₦{pr.total_amount.toLocaleString()}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.payment_request_id && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Payment request details auto-populated
                    </p>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="bill_number">Bill Number *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAutoGenerateBillNumber}
                    >
                      Auto Generate
                    </Button>
                  </div>
                  <Input
                    id="bill_number"
                    value={formData.bill_number}
                    onChange={(e) => setFormData({...formData, bill_number: e.target.value})}
                    placeholder="e.g., BILL-2024-001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bill_date">Bill Date *</Label>
                  <Input
                    id="bill_date"
                    type="date"
                    value={formData.bill_date}
                    onChange={(e) => setFormData({...formData, bill_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="payment_terms">Payment Terms</Label>
                  <Select
                    value={formData.payment_terms}
                    onValueChange={(value) => setFormData({...formData, payment_terms: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentTermsOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="due_date">Due Date *</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                    min={formData.bill_date}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reference_number">Reference Number</Label>
                  <Input
                    id="reference_number"
                    value={formData.reference_number}
                    onChange={(e) => setFormData({...formData, reference_number: e.target.value})}
                    placeholder="PO number, invoice number, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({...formData, currency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of goods/services received..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-4 h-4" />
                <span>Line Items</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.line_items.map((item, index) => (
                <div key={item.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Item {index + 1}</h4>
                    {formData.line_items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLineItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-5">
                      <Label>Description *</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                        placeholder="Describe the goods/services"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Unit Price ({formData.currency})</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => updateLineItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <Label>Amount ({formData.currency})</Label>
                      <Input
                        type="number"
                        value={item.amount}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <Label>Account Code (Optional)</Label>
                    <Select
                      value={item.account_code}
                      onValueChange={(value) => updateLineItem(item.id, 'account_code', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select expense category" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map((category) => (
                          <SelectItem key={category.code} value={category.code}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addLineItem}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Line Item
              </Button>
            </CardContent>
          </Card>

          {/* Tax & Totals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Tax & Totals</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tax_amount">Tax Amount ({formData.currency})</Label>
                  <Input
                    id="tax_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.tax_amount}
                    onChange={(e) => setFormData({...formData, tax_amount: parseFloat(e.target.value) || 0})}
                    placeholder="VAT, GST, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="discount_amount">Discount Amount ({formData.currency})</Label>
                  <Input
                    id="discount_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discount_amount}
                    onChange={(e) => setFormData({...formData, discount_amount: parseFloat(e.target.value) || 0})}
                    placeholder="Early payment discount, etc."
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono">{formatCurrency(subtotal, formData.currency)}</span>
                  </div>
                  {formData.tax_amount > 0 && (
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span className="font-mono">+{formatCurrency(formData.tax_amount, formData.currency)}</span>
                    </div>
                  )}
                  {formData.discount_amount > 0 && (
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span className="font-mono">-{formatCurrency(formData.discount_amount, formData.currency)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="font-mono">{formatCurrency(total, formData.currency)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Any additional notes or special instructions..."
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Bill Summary */}
          {formData.payment_request_id && formData.bill_number && total > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Bill Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Payment Request:</span>
                    <span className="font-medium">{selectedPaymentRequest?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <Badge>{selectedPaymentRequest?.payment_type}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Bill Number:</span>
                    <span className="font-mono font-bold">{formData.bill_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bill Date:</span>
                    <span>{new Date(formData.bill_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Date:</span>
                    <span>{formData.due_date ? new Date(formData.due_date).toLocaleDateString() : 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Terms:</span>
                    <span>{paymentTermsOptions.find(p => p.value === formData.payment_terms)?.label}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount:</span>
                      <span className="font-mono">{formatCurrency(total, formData.currency)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <div className="flex space-x-2">
            {total > 0 && (
              <div className="flex items-center px-3 py-2 bg-gray-100 rounded text-sm">
                <strong>Total: {formatCurrency(total, formData.currency)}</strong>
              </div>
            )}
            <Button
              onClick={handleSubmit}
              disabled={!formData.payment_request_id || !formData.bill_number.trim() || total <= 0}
            >
              {bill ? 'Update Bill' : 'Create Bill'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}