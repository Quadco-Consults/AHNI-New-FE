"use client";

import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2, Calculator, User, Calendar, ShoppingCart, Package } from "lucide-react";

// Types
interface SalesOrder {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  order_date: string;
  delivery_date: string;
  status: SalesOrderStatus;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  shipping_amount: number;
  line_items: SalesOrderLineItem[];
  billing_address: Address;
  shipping_address: Address;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface SalesOrderLineItem {
  id?: string;
  product_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percent?: number;
  discount_amount?: number;
  tax_amount?: number;
  line_total: number;
}

interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

type SalesOrderStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

interface SalesOrderFormData {
  customer_id: string;
  order_date: string;
  delivery_date: string;
  line_items: SalesOrderLineItem[];
  shipping_amount: number;
  notes?: string;
  billing_address: Address;
  shipping_address: Address;
  same_as_billing: boolean;
}

// AHNI Customers
const ahniCustomers = [
  {
    id: "cust-001",
    name: "Bill & Melinda Gates Foundation",
    email: "procurement@gatesfoundation.org",
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
    email: "procurement@usaid.gov",
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
    email: "procurement@cdc.gov",
    phone: "+1 800-232-4636",
    address: {
      line1: "1600 Clifton Road",
      city: "Atlanta",
      state: "GA",
      postal_code: "30329",
      country: "US"
    }
  }
];

// AHNI Products/Services
const ahniProducts = [
  {
    id: "prod-001",
    name: "HIV Test Kits (Rapid)",
    description: "Rapid HIV test kits for field testing - 100 units",
    unit_price: 250.00,
    category: "Medical Supplies"
  },
  {
    id: "prod-002",
    name: "Malaria Test Kits (RDT)",
    description: "Rapid diagnostic test for malaria detection - 100 units",
    unit_price: 180.00,
    category: "Medical Supplies"
  },
  {
    id: "prod-003",
    name: "Digital Thermometers",
    description: "Non-contact infrared thermometers - 50 units",
    unit_price: 1200.00,
    category: "Medical Equipment"
  },
  {
    id: "prod-004",
    name: "Health Education Materials",
    description: "Printed health education materials in local languages - 1000 copies",
    unit_price: 450.00,
    category: "Educational Materials"
  },
  {
    id: "prod-005",
    name: "Personal Protective Equipment (PPE) Kits",
    description: "Complete PPE kits for healthcare workers - 100 sets",
    unit_price: 850.00,
    category: "Safety Equipment"
  },
  {
    id: "prod-006",
    name: "Mobile Health Clinic Setup",
    description: "Complete mobile health clinic equipment and setup",
    unit_price: 25000.00,
    category: "Equipment"
  },
  {
    id: "prod-007",
    name: "Community Health Worker Training Materials",
    description: "Training materials and certification for CHWs - 50 trainees",
    unit_price: 2500.00,
    category: "Training"
  }
];

interface SalesOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: SalesOrder;
  onSuccess?: () => void;
}

export default function SalesOrderForm({
  open,
  onOpenChange,
  order,
  onSuccess
}: SalesOrderFormProps) {
  const [formData, setFormData] = useState<SalesOrderFormData>({
    customer_id: "",
    order_date: new Date().toISOString().split('T')[0],
    delivery_date: "",
    line_items: [],
    shipping_amount: 0,
    billing_address: {
      line1: "",
      city: "",
      state: "",
      postal_code: "",
      country: "US"
    },
    shipping_address: {
      line1: "",
      city: "",
      state: "",
      postal_code: "",
      country: "US"
    },
    same_as_billing: true
  });

  const [selectedCustomer, setSelectedCustomer] = useState<typeof ahniCustomers[0] | null>(null);
  const [isAddingLineItem, setIsAddingLineItem] = useState(false);
  const [newLineItem, setNewLineItem] = useState<SalesOrderLineItem>({
    description: "",
    quantity: 1,
    unit_price: 0,
    line_total: 0
  });

  // Auto-calculate delivery date (2 weeks from order date)
  useEffect(() => {
    if (formData.order_date) {
      const orderDate = new Date(formData.order_date);
      const deliveryDate = new Date(orderDate);
      deliveryDate.setDate(deliveryDate.getDate() + 14); // 2 weeks default

      setFormData(prev => ({
        ...prev,
        delivery_date: deliveryDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.order_date]);

  // Auto-populate customer addresses
  useEffect(() => {
    if (selectedCustomer) {
      setFormData(prev => ({
        ...prev,
        billing_address: { ...selectedCustomer.address },
        shipping_address: prev.same_as_billing ? { ...selectedCustomer.address } : prev.shipping_address
      }));
    }
  }, [selectedCustomer]);

  // Copy billing to shipping when same_as_billing changes
  useEffect(() => {
    if (formData.same_as_billing && selectedCustomer) {
      setFormData(prev => ({
        ...prev,
        shipping_address: { ...prev.billing_address }
      }));
    }
  }, [formData.same_as_billing, selectedCustomer]);

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
    if (order) {
      const customer = ahniCustomers.find(c => c.id === order.customer_id);
      setSelectedCustomer(customer || null);

      setFormData({
        customer_id: order.customer_id,
        order_date: order.order_date,
        delivery_date: order.delivery_date,
        line_items: order.line_items,
        shipping_amount: order.shipping_amount,
        notes: order.notes,
        billing_address: order.billing_address,
        shipping_address: order.shipping_address,
        same_as_billing: JSON.stringify(order.billing_address) === JSON.stringify(order.shipping_address)
      });
    } else {
      // Reset form for new order
      setFormData({
        customer_id: "",
        order_date: new Date().toISOString().split('T')[0],
        delivery_date: "",
        line_items: [],
        shipping_amount: 0,
        billing_address: {
          line1: "",
          city: "",
          state: "",
          postal_code: "",
          country: "US"
        },
        shipping_address: {
          line1: "",
          city: "",
          state: "",
          postal_code: "",
          country: "US"
        },
        same_as_billing: true
      });
      setSelectedCustomer(null);
    }
  }, [order]);

  const handleCustomerChange = (customerId: string) => {
    const customer = ahniCustomers.find(c => c.id === customerId);
    setSelectedCustomer(customer || null);
    setFormData(prev => ({ ...prev, customer_id: customerId }));
  };

  const handleProductSelect = (productId: string) => {
    const product = ahniProducts.find(p => p.id === productId);
    if (product) {
      setNewLineItem({
        product_id: product.id,
        description: product.description,
        quantity: 1,
        unit_price: product.unit_price,
        line_total: product.unit_price
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
    return subtotal * 0.075; // 7.5% VAT
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + formData.shipping_amount;
  };

  const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SO-${year}${month}${day}-${random}`;
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.customer_id) {
      toast.error("Please select a customer");
      return;
    }
    if (!formData.order_date) {
      toast.error("Please enter an order date");
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
      // Here you would call your API to create/update the sales order
      const orderNumber = order?.order_number || generateOrderNumber();

      toast.success(
        order
          ? `Sales order ${orderNumber} updated successfully`
          : `Sales order ${orderNumber} created successfully`
      );

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || `Failed to ${order ? 'update' : 'create'} sales order`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <span>{order ? 'Edit Sales Order' : 'Create New Sales Order'}</span>
          </DialogTitle>
          <DialogDescription>
            {order ? 'Update the sales order information below' : 'Fill in the details to create a new sales order for AHNI'}
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
                  <span>Order Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="order_date">Order Date *</Label>
                    <Input
                      id="order_date"
                      type="date"
                      value={formData.order_date}
                      onChange={(e) => setFormData({...formData, order_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="delivery_date">Expected Delivery *</Label>
                    <Input
                      id="delivery_date"
                      type="date"
                      value={formData.delivery_date}
                      onChange={(e) => setFormData({...formData, delivery_date: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="shipping_amount">Shipping Cost</Label>
                  <Input
                    id="shipping_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.shipping_amount}
                    onChange={(e) => setFormData({...formData, shipping_amount: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>

                {order && (
                  <div>
                    <Label>Order Number</Label>
                    <div className="font-mono text-sm font-medium p-2 bg-gray-100 rounded">
                      {order.order_number}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Products & Services</span>
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
                      <Label>Quick Select Product</Label>
                      <Select onValueChange={handleProductSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product template" />
                        </SelectTrigger>
                        <SelectContent>
                          {ahniProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - ${product.unit_price.toLocaleString()}
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
                        placeholder="Describe the product or service"
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

              {/* Order Totals */}
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
                    <div className="flex justify-between text-sm">
                      <span>Shipping:</span>
                      <span className="font-mono">${formData.shipping_amount.toLocaleString()}</span>
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

          {/* Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Address Line 1 *</Label>
                  <Input
                    value={formData.billing_address.line1}
                    onChange={(e) => setFormData({
                      ...formData,
                      billing_address: {...formData.billing_address, line1: e.target.value}
                    })}
                    disabled={!!selectedCustomer}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>City *</Label>
                    <Input
                      value={formData.billing_address.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        billing_address: {...formData.billing_address, city: e.target.value}
                      })}
                      disabled={!!selectedCustomer}
                    />
                  </div>
                  <div>
                    <Label>State *</Label>
                    <Input
                      value={formData.billing_address.state}
                      onChange={(e) => setFormData({
                        ...formData,
                        billing_address: {...formData.billing_address, state: e.target.value}
                      })}
                      disabled={!!selectedCustomer}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="same_as_billing"
                    checked={formData.same_as_billing}
                    onChange={(e) => setFormData({...formData, same_as_billing: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="same_as_billing">Same as billing address</Label>
                </div>

                {!formData.same_as_billing && (
                  <>
                    <div>
                      <Label>Address Line 1 *</Label>
                      <Input
                        value={formData.shipping_address.line1}
                        onChange={(e) => setFormData({
                          ...formData,
                          shipping_address: {...formData.shipping_address, line1: e.target.value}
                        })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>City *</Label>
                        <Input
                          value={formData.shipping_address.city}
                          onChange={(e) => setFormData({
                            ...formData,
                            shipping_address: {...formData.shipping_address, city: e.target.value}
                          })}
                        />
                      </div>
                      <div>
                        <Label>State *</Label>
                        <Input
                          value={formData.shipping_address.state}
                          onChange={(e) => setFormData({
                            ...formData,
                            shipping_address: {...formData.shipping_address, state: e.target.value}
                          })}
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Order Notes</Label>
                <Textarea
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Special instructions, delivery requirements, etc."
                  rows={3}
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
              {order ? 'Update Order' : 'Create Order'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}