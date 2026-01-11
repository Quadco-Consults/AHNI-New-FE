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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CreditCard, Calculator, User, Calendar, DollarSign, Receipt } from "lucide-react";

// Types
interface AccountsReceivable {
  id: string;
  invoice_id: string;
  invoice_number: string;
  customer_id: string;
  customer_name: string;
  invoice_date: string;
  due_date: string;
  original_amount: number;
  amount_due: number;
  amount_paid: number;
  status: ARStatus;
  aging_bucket: AgingBucket;
  days_outstanding: number;
  payment_terms: string;
  currency: string;
  collection_status: CollectionStatus;
  last_follow_up_date?: string;
  next_follow_up_date?: string;
  collection_notes?: string;
  assigned_collector?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

type ARStatus = 'OPEN' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'DISPUTED' | 'WRITTEN_OFF' | 'CANCELLED';
type AgingBucket = 'CURRENT' | 'PAST_DUE_30' | 'PAST_DUE_60' | 'PAST_DUE_90' | 'PAST_DUE_120';
type CollectionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'CONTACTED' | 'FOLLOW_UP_SCHEDULED' | 'LEGAL_ACTION' | 'WRITTEN_OFF';

type PaymentMethod =
  | 'CASH'
  | 'CHECK'
  | 'CREDIT_CARD'
  | 'BANK_TRANSFER'
  | 'ACH'
  | 'WIRE_TRANSFER'
  | 'PAYPAL'
  | 'STRIPE'
  | 'OTHER';

interface PaymentRecord {
  payment_date: string;
  amount: number;
  payment_method: PaymentMethod;
  reference_number?: string;
  notes?: string;
}

interface PaymentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountsReceivable: AccountsReceivable;
  onSuccess?: () => void;
}

// AHNI Banks for reference
const ahniBankAccounts = [
  { id: "bank_001", name: "FHI 360/AHNi-GF HQ", number: "0235139608", bank: "GTBank Plc" },
  { id: "bank_002", name: "FHI 360/AHNi-ACEBAY", number: "0234567891", bank: "GTBank Plc" },
  { id: "bank_003", name: "FHI 360/AHNi-PLANE", number: "0235678902", bank: "First Bank Plc" },
  { id: "bank_004", name: "FHI 360/AHNi-USD", number: "0236789013", bank: "Access Bank Plc" }
];

export default function PaymentForm({
  open,
  onOpenChange,
  accountsReceivable,
  onSuccess
}: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentRecord>({
    payment_date: new Date().toISOString().split('T')[0],
    amount: 0,
    payment_method: "BANK_TRANSFER",
    reference_number: "",
    notes: ""
  });

  const [isPartialPayment, setIsPartialPayment] = useState(false);
  const [remainingBalance, setRemainingBalance] = useState(0);

  // Calculate remaining balance when amount changes
  useEffect(() => {
    const remaining = accountsReceivable.amount_due - formData.amount;
    setRemainingBalance(remaining);
    setIsPartialPayment(formData.amount > 0 && remaining > 0);
  }, [formData.amount, accountsReceivable.amount_due]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        payment_date: new Date().toISOString().split('T')[0],
        amount: 0,
        payment_method: "BANK_TRANSFER",
        reference_number: "",
        notes: ""
      });
    }
  }, [open]);

  const handleFullPayment = () => {
    setFormData(prev => ({ ...prev, amount: accountsReceivable.amount_due }));
  };

  const generateReferenceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `PAY-${year}${month}${day}-${random}`;
  };

  const handleAutoReference = () => {
    setFormData(prev => ({ ...prev, reference_number: generateReferenceNumber() }));
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    const symbol = currency === "NGN" ? "₦" : "$";
    return `${symbol}${amount.toLocaleString()}`;
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.payment_date) {
      toast.error("Please enter a payment date");
      return;
    }
    if (formData.amount <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }
    if (formData.amount > accountsReceivable.amount_due) {
      toast.error("Payment amount cannot exceed the amount due");
      return;
    }
    if (!formData.payment_method) {
      toast.error("Please select a payment method");
      return;
    }

    try {
      // Here you would call your API to record the payment
      const paymentStatus = remainingBalance <= 0 ? "PAID" : "PARTIAL";

      toast.success(
        `Payment of ${formatCurrency(formData.amount, accountsReceivable.currency)} recorded successfully. Invoice status: ${paymentStatus}`
      );

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to record payment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Record Payment</span>
          </DialogTitle>
          <DialogDescription>
            Record a payment for invoice {accountsReceivable.invoice_number} from {accountsReceivable.customer_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="w-4 h-4" />
                <span>Invoice Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <Label className="text-gray-600">Invoice Number</Label>
                  <div className="font-mono font-medium">{accountsReceivable.invoice_number}</div>
                </div>
                <div>
                  <Label className="text-gray-600">Customer</Label>
                  <div className="font-medium">{accountsReceivable.customer_name}</div>
                </div>
                <div>
                  <Label className="text-gray-600">Due Date</Label>
                  <div>{new Date(accountsReceivable.due_date).toLocaleDateString()}</div>
                </div>
                <div>
                  <Label className="text-gray-600">Days Outstanding</Label>
                  <div className="font-medium text-red-600">{accountsReceivable.days_outstanding} days</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-600">Original Amount</Label>
                    <div className="text-lg font-bold">
                      {formatCurrency(accountsReceivable.original_amount, accountsReceivable.currency)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600">Already Paid</Label>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(accountsReceivable.amount_paid, accountsReceivable.currency)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600">Amount Due</Label>
                    <div className="text-xl font-bold text-red-600">
                      {formatCurrency(accountsReceivable.amount_due, accountsReceivable.currency)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Badge className={
                  accountsReceivable.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                  accountsReceivable.status === 'OPEN' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }>
                  {accountsReceivable.status} - {accountsReceivable.aging_bucket.replace(/_/g, ' ')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Payment Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payment_date">Payment Date *</Label>
                  <Input
                    id="payment_date"
                    type="date"
                    value={formData.payment_date}
                    onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="payment_method">Payment Method *</Label>
                  <Select
                    value={formData.payment_method}
                    onValueChange={(value: PaymentMethod) => setFormData({...formData, payment_method: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                      <SelectItem value="CHECK">Check</SelectItem>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                      <SelectItem value="ACH">ACH</SelectItem>
                      <SelectItem value="WIRE_TRANSFER">Wire Transfer</SelectItem>
                      <SelectItem value="PAYPAL">PayPal</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="amount">Payment Amount * ({accountsReceivable.currency})</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleFullPayment}
                  >
                    Pay Full Amount
                  </Button>
                </div>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  max={accountsReceivable.amount_due}
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                  placeholder={`0.00 (Max: ${formatCurrency(accountsReceivable.amount_due, accountsReceivable.currency)})`}
                />
                {isPartialPayment && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                    <strong>Partial Payment:</strong> Remaining balance will be {formatCurrency(remainingBalance, accountsReceivable.currency)}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="reference_number">Reference Number</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAutoReference}
                  >
                    Auto Generate
                  </Button>
                </div>
                <Input
                  id="reference_number"
                  value={formData.reference_number}
                  onChange={(e) => setFormData({...formData, reference_number: e.target.value})}
                  placeholder="Check number, transaction ID, etc."
                />
              </div>

              <div>
                <Label htmlFor="notes">Payment Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes about this payment..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* AHNI Bank Information */}
          <Card>
            <CardHeader>
              <CardTitle>AHNI Bank Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                <p className="mb-2"><strong>For reference - AHNI Bank Accounts:</strong></p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {ahniBankAccounts.map((account) => (
                    <div key={account.id} className="p-2 bg-gray-50 rounded">
                      <div className="font-medium">{account.name}</div>
                      <div className="text-xs">{account.bank} - {account.number}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          {formData.amount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-4 h-4" />
                  <span>Payment Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Payment Amount:</span>
                    <span className="font-mono font-bold text-green-600">
                      {formatCurrency(formData.amount, accountsReceivable.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining Balance:</span>
                    <span className={`font-mono font-bold ${remainingBalance <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(remainingBalance, accountsReceivable.currency)}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span><strong>New Status:</strong></span>
                      <Badge className={remainingBalance <= 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                        {remainingBalance <= 0 ? 'PAID' : 'PARTIAL'}
                      </Badge>
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
            {formData.amount > 0 && (
              <div className="flex items-center px-3 py-2 bg-gray-100 rounded text-sm">
                <strong>Payment: {formatCurrency(formData.amount, accountsReceivable.currency)}</strong>
              </div>
            )}
            <Button
              onClick={handleSubmit}
              disabled={formData.amount <= 0}
            >
              Record Payment
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}