"use client";

import { useState, useEffect } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { Badge } from "components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2, Calculator, User, Calendar, FileText } from "lucide-react";
import { Invoice, InvoiceFormData, InvoiceLineItem, Address } from "../../types/invoice.types";

// AHNI Customers (this would come from your customer API)
const ahniCustomers = [
  {
    id: "cust-001",
    name: "Bill & Melinda Gates Foundation",
    email: "finance@gatesfoundation.org",
    phone: "+1 206-709-3100",
    address: {
      line1: "440 5th Ave N",
      city: "Seattle",
      state: "WA",
      postal_code: "98109",
      country: "US"
    }
  },
  {
    id: "cust-002",
    name: "USAID Nigeria",
    email: "contracts@usaid.gov",
    phone: "+234 9 461 4000",
    address: {
      line1: "Plot 1075 Diplomatic Zone",
      city: "Abuja",
      state: "FCT",
      postal_code: "900001",
      country: "NG"
    }
  },
  {
    id: "cust-003",
    name: "World Health Organization (WHO)",
    email: "procurement@who.int",
    phone: "+41 22 791 21 11",
    address: {
      line1: "Avenue Appia 20",
      city: "Geneva",
      state: "Geneva",
      postal_code: "1211",
      country: "CH"
    }
  },
  {
    id: "cust-004",
    name: "Centers for Disease Control (CDC)",
    email: "contracts@cdc.gov",
    phone: "+1 800-232-4636",
    address: {
      line1: "1600 Clifton Road",
      city: "Atlanta",
      state: "GA",
      postal_code: "30329",
      country: "US"
    }
  },
  {
    id: "cust-005",
    name: "United Nations High Commissioner for Refugees (UNHCR)",
    email: "finance@unhcr.org",
    phone: "+41 22 739 8111",
    address: {
      line1: "Case Postale 2500",
      city: "Geneva",
      state: "Geneva",
      postal_code: "1211",
      country: "CH"
    }
  }
];

// AHNI Services/Products
const ahniServices = [
  {
    id: "serv-001",
    name: "HIV Prevention Program Implementation",
    description: "Comprehensive HIV prevention program implementation services",
    unit_price: 15000.00,
    tax_code: "SERVICE"
  },
  {
    id: "serv-002",
    name: "Community Health Worker Training",
    description: "Training and capacity building for community health workers",
    unit_price: 8000.00,
    tax_code: "SERVICE"
  },
  {
    id: "serv-003",
    name: "Health System Strengthening Consultation",
    description: "Technical assistance for health system strengthening initiatives",
    unit_price: 12000.00,
    tax_code: "SERVICE"
  },
  {
    id: "serv-004",
    name: "Data Collection and Analysis",
    description: "Health data collection, management, and analysis services",
    unit_price: 10000.00,
    tax_code: "SERVICE"
  },
  {
    id: "serv-005",
    name: "Program Monitoring and Evaluation",
    description: "Comprehensive monitoring and evaluation services",
    unit_price: 18000.00,
    tax_code: "SERVICE"
  },
  {
    id: "serv-006",
    name: "Malaria Prevention Program",
    description: "Malaria prevention and control program implementation",
    unit_price: 20000.00,
    tax_code: "SERVICE"
  },
  {
    id: "serv-007",
    name: "Maternal Health Services",
    description: "Maternal and child health program implementation",
    unit_price: 16000.00,
    tax_code: "SERVICE"
  }
];

// Payment terms
const paymentTerms = [
  { value: "NET_15", label: "Net 15 days" },
  { value: "NET_30", label: "Net 30 days" },
  { value: "NET_45", label: "Net 45 days" },
  { value: "NET_60", label: "Net 60 days" },
  { value: "DUE_ON_RECEIPT", label: "Due on receipt" },
  { value: "NET_10", label: "Net 10 days" }
];

interface InvoiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice;
  onSuccess?: () => void;
}

export default function InvoiceForm({
  open,
  onOpenChange,
  invoice,
  onSuccess
}: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceFormData>({
    customer_id: "",
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: "",
    payment_terms: "NET_30",
    currency: "USD",
    line_items: [],
    billing_address: {
      line1: "",
      city: "",
      state: "",
      postal_code: "",
      country: "US"
    },
    same_as_customer_address: true
  });

  const [selectedCustomer, setSelectedCustomer] = useState<typeof ahniCustomers[0] | null>(null);
  const [isAddingLineItem, setIsAddingLineItem] = useState(false);
  const [newLineItem, setNewLineItem] = useState<InvoiceLineItem>({
    description: "",
    quantity: 1,
    unit_price: 0,
    line_total: 0
  });

  // Auto-calculate due date based on payment terms
  useEffect(() => {
    if (formData.invoice_date && formData.payment_terms) {
      const invoiceDate = new Date(formData.invoice_date);
      let daysToAdd = 30; // default

      switch (formData.payment_terms) {
        case "NET_10": daysToAdd = 10; break;
        case "NET_15": daysToAdd = 15; break;
        case "NET_30": daysToAdd = 30; break;
        case "NET_45": daysToAdd = 45; break;
        case "NET_60": daysToAdd = 60; break;
        case "DUE_ON_RECEIPT": daysToAdd = 0; break;
      }

      const dueDate = new Date(invoiceDate);
      dueDate.setDate(dueDate.getDate() + daysToAdd);

      setFormData(prev => ({
        ...prev,
        due_date: dueDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.invoice_date, formData.payment_terms]);

  // Auto-populate customer address
  useEffect(() => {
    if (selectedCustomer && formData.same_as_customer_address) {
      setFormData(prev => ({
        ...prev,
        billing_address: { ...selectedCustomer.address }
      }));
    }
  }, [selectedCustomer, formData.same_as_customer_address]);

  // Calculate line item total
  useEffect(() => {
    const total = newLineItem.quantity * newLineItem.unit_price;
    const discountAmount = newLineItem.discount_percent
      ? (total * newLineItem.discount_percent / 100)
      : (newLineItem.discount_amount || 0);

    setNewLineItem(prev => ({
      ...prev,
      line_total: total - discountAmount
    }));
  }, [newLineItem.quantity, newLineItem.unit_price, newLineItem.discount_percent, newLineItem.discount_amount]);

  // Populate form when editing
  useEffect(() => {
    if (invoice) {
      const customer = ahniCustomers.find(c => c.id === invoice.customer_id);
      setSelectedCustomer(customer || null);

      setFormData({
        customer_id: invoice.customer_id,
        invoice_date: invoice.invoice_date,
        due_date: invoice.due_date,
        payment_terms: invoice.payment_terms,
        currency: invoice.currency,
        line_items: invoice.line_items,
        memo: invoice.memo,
        terms_conditions: invoice.terms_conditions,
        notes: invoice.notes,
        billing_address: invoice.billing_address,
        shipping_address: invoice.shipping_address,
        same_as_customer_address: JSON.stringify(invoice.billing_address) === JSON.stringify(customer?.address || {})
      });
    } else {
      // Reset form for new invoice
      setFormData({
        customer_id: "",
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: "",
        payment_terms: "NET_30",
        currency: "USD",
        line_items: [],
        billing_address: {
          line1: "",
          city: "",
          state: "",
          postal_code: "",
          country: "US"
        },
        same_as_customer_address: true
      });
      setSelectedCustomer(null);
    }
  }, [invoice]);

  const handleCustomerChange = (customerId: string) => {
    const customer = ahniCustomers.find(c => c.id === customerId);
    setSelectedCustomer(customer || null);
    setFormData(prev => ({ ...prev, customer_id: customerId }));
  };

  const handleServiceSelect = (serviceId: string) => {
    const service = ahniServices.find(s => s.id === serviceId);
    if (service) {
      setNewLineItem({
        description: service.description,
        quantity: 1,
        unit_price: service.unit_price,
        tax_code: service.tax_code,
        line_total: service.unit_price
      });
    }
  };

  const addLineItem = () => {
    if (!newLineItem.description || newLineItem.quantity <= 0 || newLineItem.unit_price <= 0) {
      toast.error("Please fill in all required line item fields");
      return;
    }

    setFormData(prev => ({
      ...prev,
      line_items: [...prev.line_items, { ...newLineItem, id: Date.now().toString() }]
    }));

    setNewLineItem({
      description: "",
      quantity: 1,
      unit_price: 0,
      line_total: 0
    });
    setIsAddingLineItem(false);
  };

  const removeLineItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      line_items: prev.line_items.filter((_, i) => i !== index)
    }));
  };

  const calculateSubtotal = () => {
    return formData.line_items.reduce((sum, item) => sum + item.line_total, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.075; // 7.5% VAT (adjust as needed)
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.customer_id) {
      toast.error("Please select a customer");
      return;
    }
    if (!formData.invoice_date) {
      toast.error("Please enter an invoice date");
      return;
    }
    if (formData.line_items.length === 0) {
      toast.error("Please add at least one line item");
      return;
    }
    if (!formData.billing_address.line1) {
      toast.error("Please fill in the billing address");
      return;
    }

    try {
      // Here you would call your API to create/update the invoice
      // await createInvoice.mutateAsync(formData);

      toast.success(invoice ? "Invoice updated successfully" : "Invoice created successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || `Failed to ${invoice ? 'update' : 'create'} invoice`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>{invoice ? 'Edit Invoice' : 'Create New Invoice'}</span>
          </DialogTitle>
          <DialogDescription>
            {invoice ? 'Update the invoice information below' : 'Fill in the details to create a new invoice for AHNI'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Customer Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customer">Customer *</Label>
                  <Select
                    value={formData.customer_id}
                    onValueChange={handleCustomerChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {ahniCustomers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCustomer && (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Email:</strong> {selectedCustomer.email}</p>
                    <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                    <div>
                      <strong>Address:</strong>
                      <div className="ml-2">
                        <p>{selectedCustomer.address.line1}</p>
                        <p>{selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.postal_code}</p>
                        <p>{selectedCustomer.address.country}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Invoice Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invoice_date">Invoice Date *</Label>
                    <Input
                      id="invoice_date"
                      type="date"
                      value={formData.invoice_date}
                      onChange={(e) => setFormData({...formData, invoice_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="due_date">Due Date *</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                        {paymentTerms.map((term) => (
                          <SelectItem key={term.value} value={term.value}>
                            {term.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="USD">USD (US Dollar)</SelectItem>
                        <SelectItem value="NGN">NGN (Nigerian Naira)</SelectItem>
                        <SelectItem value="EUR">EUR (Euro)</SelectItem>
                        <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calculator className="w-4 h-4" />
                  <span>Services & Items</span>
                </div>
                <Button
                  onClick={() => setIsAddingLineItem(true)}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formData.line_items.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-20">Qty</TableHead>
                      <TableHead className="w-32">Unit Price</TableHead>
                      <TableHead className="w-32">Total</TableHead>
                      <TableHead className="w-16">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.line_items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="font-mono">
                          ${item.unit_price.toLocaleString()}
                        </TableCell>
                        <TableCell className="font-mono font-medium">
                          ${item.line_total.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLineItem(index)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No items added yet. Click "Add Item" to get started.
                </div>
              )}

              {/* Add Line Item Form */}
              {isAddingLineItem && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-medium mb-3">Add New Item</h4>

                  <div className="space-y-4">
                    <div>
                      <Label>Quick Select Service</Label>
                      <Select onValueChange={handleServiceSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service template" />
                        </SelectTrigger>
                        <SelectContent>
                          {ahniServices.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name} - ${service.unit_price.toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Description *</Label>
                      <Textarea
                        value={newLineItem.description}
                        onChange={(e) => setNewLineItem({...newLineItem, description: e.target.value})}
                        placeholder="Describe the service or item"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Quantity *</Label>
                        <Input
                          type="number"
                          min="1"
                          value={newLineItem.quantity}
                          onChange={(e) => setNewLineItem({...newLineItem, quantity: parseInt(e.target.value) || 1})}
                        />
                      </div>
                      <div>
                        <Label>Unit Price *</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={newLineItem.unit_price}
                          onChange={(e) => setNewLineItem({...newLineItem, unit_price: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <div>
                        <Label>Line Total</Label>
                        <Input
                          value={`$${newLineItem.line_total.toLocaleString()}`}
                          disabled
                          className="font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingLineItem(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={addLineItem}>
                        Add Item
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Invoice Totals */}
              {formData.line_items.length > 0 && (
                <div className="mt-6 flex justify-end">
                  <div className="w-80 space-y-2">
                    <div className="border-t border-gray-200"></div>
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span className="font-mono">${calculateSubtotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (7.5%):</span>
                      <span className="font-mono">${calculateTax().toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="font-mono">${calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing Address */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="same_as_customer"
                  checked={formData.same_as_customer_address}
                  onChange={(e) => setFormData({...formData, same_as_customer_address: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="same_as_customer">Same as customer address</Label>
              </div>

              {!formData.same_as_customer_address && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label>Address Line 1 *</Label>
                    <Input
                      value={formData.billing_address.line1}
                      onChange={(e) => setFormData({
                        ...formData,
                        billing_address: {...formData.billing_address, line1: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label>City *</Label>
                    <Input
                      value={formData.billing_address.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        billing_address: {...formData.billing_address, city: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label>State/Province *</Label>
                    <Input
                      value={formData.billing_address.state}
                      onChange={(e) => setFormData({
                        ...formData,
                        billing_address: {...formData.billing_address, state: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label>Postal Code *</Label>
                    <Input
                      value={formData.billing_address.postal_code}
                      onChange={(e) => setFormData({
                        ...formData,
                        billing_address: {...formData.billing_address, postal_code: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label>Country *</Label>
                    <Select
                      value={formData.billing_address.country}
                      onValueChange={(value) => setFormData({
                        ...formData,
                        billing_address: {...formData.billing_address, country: value}
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="NG">Nigeria</SelectItem>
                        <SelectItem value="CH">Switzerland</SelectItem>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Memo</Label>
                <Input
                  value={formData.memo || ""}
                  onChange={(e) => setFormData({...formData, memo: e.target.value})}
                  placeholder="Brief description or reference"
                />
              </div>

              <div>
                <Label>Terms & Conditions</Label>
                <Textarea
                  value={formData.terms_conditions || ""}
                  onChange={(e) => setFormData({...formData, terms_conditions: e.target.value})}
                  placeholder="Enter terms and conditions for this invoice"
                  rows={3}
                />
              </div>

              <div>
                <Label>Internal Notes</Label>
                <Textarea
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Internal notes (not visible to customer)"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {formData.line_items.length > 0 && (
              <Badge variant="outline" className="px-3 py-1">
                Total: ${calculateTotal().toLocaleString()}
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleSubmit}>
              Save as Draft
            </Button>
            <Button onClick={handleSubmit}>
              {invoice ? 'Update Invoice' : 'Create Invoice'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}