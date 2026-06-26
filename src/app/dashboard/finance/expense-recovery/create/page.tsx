"use client";

import { useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building2,
  Calculator,
  Plus,
  Trash2,
  FileText,
  Users,
  DollarSign,
  Percent,
  CalendarDays,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useGetVendorBill, useCreateRecoveryInvoice } from "@/features/finance/controllers/expenseRecoveryController";
import { useGetCustomers } from "@/features/finance/controllers/customerController";

interface AllocationItem {
  id: string;
  customer_id: string;
  customer_name: string;
  allocation_percentage: string;
  amount: number;
}

export default function CreateRecoveryInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const billId = searchParams.get("bill");

  // Fetch vendor bill
  const { data: billData, isLoading: isBillLoading } = useGetVendorBill(
    billId || "",
    !!billId
  );
  const selectedBill = billData?.data;

  // Fetch customers
  const { data: customersData, isLoading: isCustomersLoading } = useGetCustomers();
  const customers = customersData?.data || [];

  // Create recovery invoice mutation
  const createRecoveryMutation = useCreateRecoveryInvoice();

  const [formData, setFormData] = useState({
    invoice_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    description: "",
    notes: "",
  });

  const [allocations, setAllocations] = useState<AllocationItem[]>([
    {
      id: "1",
      customer_id: "",
      customer_name: "",
      allocation_percentage: "",
      amount: 0,
    },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const calculateAmount = (percentage: string) => {
    const pct = parseFloat(percentage);
    if (isNaN(pct) || !selectedBill) return 0;
    return (selectedBill.total_amount * pct) / 100;
  };

  const getTotalAllocatedPercentage = () => {
    return allocations.reduce((sum, alloc) => {
      const pct = parseFloat(alloc.allocation_percentage);
      return sum + (isNaN(pct) ? 0 : pct);
    }, 0);
  };

  const getTotalAllocatedAmount = () => {
    return allocations.reduce((sum, alloc) => sum + alloc.amount, 0);
  };

  const getAhniShare = () => {
    const totalAllocated = getTotalAllocatedPercentage();
    return Math.max(0, 100 - totalAllocated);
  };

  const getAhniAmount = () => {
    if (!selectedBill) return 0;
    return selectedBill.total_amount - getTotalAllocatedAmount();
  };

  const handleAllocationChange = (
    id: string,
    field: string,
    value: string
  ) => {
    setAllocations((prev) =>
      prev.map((alloc) => {
        if (alloc.id === id) {
          const updated = { ...alloc, [field]: value };
          if (field === "allocation_percentage") {
            updated.amount = calculateAmount(value);
          }
          if (field === "customer_id") {
            const customer = customers.find((c) => c.id === value);
            updated.customer_name = customer?.name || "";
          }
          return updated;
        }
        return alloc;
      })
    );
  };

  const addAllocation = () => {
    setAllocations((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        customer_id: "",
        customer_name: "",
        allocation_percentage: "",
        amount: 0,
      },
    ]);
  };

  const removeAllocation = (id: string) => {
    if (allocations.length > 1) {
      setAllocations((prev) => prev.filter((alloc) => alloc.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!billId || !selectedBill) {
      toast.error("Vendor bill not found");
      return;
    }

    // Validation
    const totalPercentage = getTotalAllocatedPercentage();
    if (totalPercentage > 100) {
      toast.error("Total allocation cannot exceed 100%");
      return;
    }

    if (totalPercentage === 0) {
      toast.error("Please add at least one allocation");
      return;
    }

    const invalidAllocations = allocations.filter(
      (a) => !a.customer_id || !a.allocation_percentage
    );
    if (invalidAllocations.length > 0) {
      toast.error("Please complete all allocation fields");
      return;
    }

    // Submit to API
    createRecoveryMutation.mutate(
      {
        vendor_bill_id: billId,
        allocations: allocations.map((a) => ({
          customer_id: a.customer_id,
          allocation_percentage: parseFloat(a.allocation_percentage),
        })),
        invoice_date: formData.invoice_date,
        due_date: formData.due_date,
        description: formData.description,
        notes: formData.notes,
      },
      {
        onSuccess: (response) => {
          toast.success("Recovery invoice created successfully!");
          router.push("/dashboard/finance/expense-recovery");
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to create recovery invoice");
        },
      }
    );
  };

  // Loading state
  if (isBillLoading || isCustomersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading vendor bill...</p>
        </div>
      </div>
    );
  }

  // Bill not found
  if (!selectedBill) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Vendor Bill Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requested vendor bill could not be found.
          </p>
          <Link href="/dashboard/finance/expense-recovery">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Expense Recovery
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/finance/expense-recovery">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create Recovery Invoice
          </h1>
          <p className="text-muted-foreground">
            Allocate shared expenses and create recovery invoices
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bill Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Vendor Bill Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Bill Number
              </Label>
              <p className="font-mono font-bold text-lg">
                {selectedBill.bill_number}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Service Type
              </Label>
              <Badge variant="outline" className="mt-1">
                {selectedBill.service_type}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Vendor
              </Label>
              <p className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {selectedBill.vendor}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Bill Date
              </Label>
              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {new Date(selectedBill.bill_date).toLocaleDateString()}
              </p>
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Description
              </Label>
              <p className="text-sm">{selectedBill.description}</p>
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Total Bill Amount
              </Label>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(selectedBill.total_amount)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Allocation Calculator */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Cost Allocation Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Allocations */}
            {allocations.map((allocation, index) => (
              <div
                key={allocation.id}
                className="p-4 border rounded-lg bg-muted/30 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Allocation #{index + 1}
                  </h4>
                  {allocations.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAllocation(allocation.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="md:col-span-1">
                    <Label htmlFor={`customer-${allocation.id}`}>
                      Customer / Co-Tenant
                    </Label>
                    <Select
                      value={allocation.customer_id}
                      onValueChange={(value) =>
                        handleAllocationChange(
                          allocation.id,
                          "customer_id",
                          value
                        )
                      }
                    >
                      <SelectTrigger id={`customer-${allocation.id}`}>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer: any) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`percentage-${allocation.id}`}>
                      Allocation %
                    </Label>
                    <div className="relative">
                      <Input
                        id={`percentage-${allocation.id}`}
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={allocation.allocation_percentage}
                        onChange={(e) =>
                          handleAllocationChange(
                            allocation.id,
                            "allocation_percentage",
                            e.target.value
                          )
                        }
                        className="pr-8"
                        placeholder="0.00"
                      />
                      <Percent className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div>
                    <Label>Recovery Amount</Label>
                    <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
                      <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="font-semibold">
                        {formatCurrency(allocation.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Allocation Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAllocation}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Allocation
            </Button>

            <Separator />

            {/* Summary */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
              <h4 className="font-semibold text-lg">Allocation Summary</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Total Allocated to Co-Tenants
                  </Label>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-orange-600">
                      {getTotalAllocatedPercentage().toFixed(2)}%
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({formatCurrency(getTotalAllocatedAmount())})
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    AHNI's Share (Remaining)
                  </Label>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-green-600">
                      {getAhniShare().toFixed(2)}%
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({formatCurrency(getAhniAmount())})
                    </span>
                  </div>
                </div>
              </div>

              {getTotalAllocatedPercentage() > 100 && (
                <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
                  <p className="text-sm text-destructive font-medium">
                    ⚠ Total allocation exceeds 100%. Please adjust.
                  </p>
                </div>
              )}

              {getTotalAllocatedPercentage() === 100 && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                    ✓ Full cost recovery - AHNI's share is 0%
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Invoice Details */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="invoice_date">Invoice Date</Label>
                <Input
                  id="invoice_date"
                  type="date"
                  value={formData.invoice_date}
                  onChange={(e) =>
                    setFormData({ ...formData, invoice_date: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) =>
                    setFormData({ ...formData, due_date: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Additional Description (Optional)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Add any additional details..."
              />
            </div>

            <div>
              <Label htmlFor="notes">Internal Notes (Optional)</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Internal notes for record keeping..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/dashboard/finance/expense-recovery">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={
              getTotalAllocatedPercentage() > 100 ||
              getTotalAllocatedPercentage() === 0 ||
              createRecoveryMutation.isPending
            }
          >
            {createRecoveryMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Recovery Invoice"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
