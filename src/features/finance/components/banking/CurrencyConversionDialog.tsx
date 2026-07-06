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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowRightLeft,
  DollarSign,
  Building2,
  AlertCircle,
  TrendingDown,
  Calculator,
} from "lucide-react";
import {
  useCreateCurrencyConversion,
  useCompleteCurrencyConversion,
  calculateNGNEquivalent,
  calculateNetNGN,
  formatCurrencyAmount,
} from "../../controllers/currencyConversionController";
import { useGetBankAccounts } from "../../controllers/accountingController";
import { BankAccount } from "../../types/accounting.types";

// Nigerian Banks/Bureaus
const currencyExchangeProviders = [
  "First Bank of Nigeria Limited",
  "Guaranty Trust Bank Plc",
  "Access Bank Plc",
  "Zenith Bank Plc",
  "UBA Plc",
  "Fidelity Bank Plc",
  "Ecobank Nigeria",
  "Stanbic IBTC Bank",
  "Sterling Bank",
  "Travelex",
  "Bureau de Change",
  "Other"
];

interface CurrencyConversionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceAccount?: BankAccount; // Pre-selected USD account
  onSuccess?: () => void;
}

export default function CurrencyConversionDialog({
  open,
  onOpenChange,
  sourceAccount,
  onSuccess
}: CurrencyConversionDialogProps) {
  // Form state
  const [sourceAccountId, setSourceAccountId] = useState("");
  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [usdAmount, setUsdAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [bankCharges, setBankCharges] = useState("0");
  const [bankOrBureauName, setBankOrBureauName] = useState("");
  const [bankReference, setBankReference] = useState("");
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [autoComplete, setAutoComplete] = useState(true);

  // API hooks
  const { data: accountsData } = useGetBankAccounts({ is_active: true });
  const createConversion = useCreateCurrencyConversion();
  const completeConversion = useCompleteCurrencyConversion();

  const accounts = accountsData?.data?.results || [];
  const usdAccounts = accounts.filter((acc: BankAccount) => acc.currency === "USD");
  const ngnAccounts = accounts.filter((acc: BankAccount) => acc.currency === "NGN");

  // Calculate derived values
  const ngnEquivalent = calculateNGNEquivalent(usdAmount, exchangeRate);
  const netNGN = calculateNetNGN(ngnEquivalent, bankCharges);

  // Pre-select source account if provided
  useEffect(() => {
    if (sourceAccount && sourceAccount.currency === "USD") {
      setSourceAccountId(sourceAccount.id);
    }
  }, [sourceAccount]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      if (!sourceAccount) setSourceAccountId("");
      setDestinationAccountId("");
      setUsdAmount("");
      setExchangeRate("");
      setBankCharges("0");
      setBankOrBureauName("");
      setBankReference("");
      setPurpose("");
      setNotes("");
      setAutoComplete(true);
    }
  }, [open, sourceAccount]);

  const selectedSourceAccount = accounts.find((acc: BankAccount) => acc.id === sourceAccountId);
  const selectedDestAccount = accounts.find((acc: BankAccount) => acc.id === destinationAccountId);

  const handleSubmit = async () => {
    // Validation
    if (!sourceAccountId) {
      toast.error("Please select a USD source account");
      return;
    }
    if (!destinationAccountId) {
      toast.error("Please select a NGN destination account");
      return;
    }
    if (!usdAmount || parseFloat(usdAmount) <= 0) {
      toast.error("Please enter a valid USD amount");
      return;
    }
    if (!exchangeRate || parseFloat(exchangeRate) <= 0) {
      toast.error("Please enter a valid exchange rate");
      return;
    }
    if (!bankOrBureauName) {
      toast.error("Please select bank/bureau name");
      return;
    }

    // Check sufficient balance
    if (selectedSourceAccount) {
      const balance = parseFloat(selectedSourceAccount.current_balance || "0");
      const amount = parseFloat(usdAmount);
      if (amount > balance) {
        toast.error(`Insufficient balance. Available: $${balance.toLocaleString()}`);
        return;
      }
    }

    try {
      const conversionData = {
        source_usd_account_id: sourceAccountId,
        destination_ngn_account_id: destinationAccountId,
        usd_amount: usdAmount,
        exchange_rate: exchangeRate,
        bank_charges: bankCharges || "0",
        bank_or_bureau_name: bankOrBureauName,
        bank_reference_number: bankReference || undefined,
        purpose: purpose || undefined,
        notes: notes || undefined,
      };

      const result = await createConversion.mutateAsync(conversionData);
      const conversionId = result.data?.id || (result as any).id;

      // Auto-complete if checkbox is checked
      if (autoComplete && conversionId) {
        await completeConversion.mutateAsync({ conversion_id: conversionId });
        toast.success("Currency conversion completed successfully!");
      } else {
        toast.success("Currency conversion created as draft");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to create currency conversion");
    }
  };

  const isLoading = createConversion.isPending || completeConversion.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            Convert USD to NGN
          </DialogTitle>
          <DialogDescription>
            Convert US Dollars to Nigerian Naira with automatic accounting entries
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Account Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source_account">
                From USD Account <span className="text-red-500">*</span>
              </Label>
              <Select
                value={sourceAccountId}
                onValueChange={setSourceAccountId}
                disabled={!!sourceAccount}
              >
                <SelectTrigger id="source_account">
                  <SelectValue placeholder="Select USD account" />
                </SelectTrigger>
                <SelectContent>
                  {usdAccounts.map((account: BankAccount) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{account.account_name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ${parseFloat(account.current_balance || "0").toLocaleString()}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSourceAccount && (
                <div className="text-sm text-muted-foreground">
                  Balance: <span className="font-mono font-semibold text-green-600">
                    ${parseFloat(selectedSourceAccount.current_balance || "0").toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination_account">
                To NGN Account <span className="text-red-500">*</span>
              </Label>
              <Select value={destinationAccountId} onValueChange={setDestinationAccountId}>
                <SelectTrigger id="destination_account">
                  <SelectValue placeholder="Select NGN account" />
                </SelectTrigger>
                <SelectContent>
                  {ngnAccounts.map((account: BankAccount) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{account.account_name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ₦{parseFloat(account.current_balance || "0").toLocaleString()}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedDestAccount && (
                <div className="text-sm text-muted-foreground">
                  Balance: <span className="font-mono font-semibold text-green-600">
                    ₦{parseFloat(selectedDestAccount.current_balance || "0").toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Conversion Amounts */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="usd_amount">
                USD Amount <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="usd_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={usdAmount}
                  onChange={(e) => setUsdAmount(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exchange_rate">
                Exchange Rate (₦/USD) <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calculator className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="exchange_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="1580.50"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank_charges">Bank Charges (₦)</Label>
              <div className="relative">
                <TrendingDown className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="bank_charges"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={bankCharges}
                  onChange={(e) => setBankCharges(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Calculation Summary */}
          {usdAmount && exchangeRate && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">NGN Equivalent:</span>
                    <span className="font-mono font-semibold">
                      {formatCurrencyAmount(ngnEquivalent, "NGN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank Charges:</span>
                    <span className="font-mono text-red-600">
                      -{formatCurrencyAmount(bankCharges || "0", "NGN")}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold">Net NGN Deposited:</span>
                    <span className="font-mono font-bold text-green-600 text-lg">
                      {formatCurrencyAmount(netNGN, "NGN")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bank/Bureau Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bank_bureau">
                Bank/Bureau <span className="text-red-500">*</span>
              </Label>
              <Select value={bankOrBureauName} onValueChange={setBankOrBureauName}>
                <SelectTrigger id="bank_bureau">
                  <SelectValue placeholder="Select bank or bureau" />
                </SelectTrigger>
                <SelectContent>
                  {currencyExchangeProviders.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank_reference">Bank Reference Number</Label>
              <Input
                id="bank_reference"
                placeholder="Optional transaction reference"
                value={bankReference}
                onChange={(e) => setBankReference(e.target.value)}
              />
            </div>
          </div>

          {/* Purpose and Notes */}
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              placeholder="E.g., Q1 2026 project funding"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional details about this conversion..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Auto-complete Option */}
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="auto_complete"
              checked={autoComplete}
              onChange={(e) => setAutoComplete(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="auto_complete" className="cursor-pointer">
              <div className="flex items-center gap-2">
                <span>Complete conversion immediately</span>
                <Badge variant="secondary" className="text-xs">Recommended</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                This will update account balances and create journal entries automatically
              </p>
            </Label>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Important:</p>
              <p className="mt-1">
                Completing this conversion will debit ${usdAmount || "0"} from the source account
                and credit ₦{netNGN} to the destination account. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {completeConversion.isPending ? "Completing..." : "Creating..."}
              </>
            ) : (
              <>
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                {autoComplete ? "Convert & Complete" : "Create Draft"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
