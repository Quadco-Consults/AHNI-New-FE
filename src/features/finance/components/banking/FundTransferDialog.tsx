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
  Send,
  DollarSign,
  ArrowRight,
  AlertCircle,
  Building2,
} from "lucide-react";
import {
  useCreateFundTransfer,
  formatCurrencyAmount,
  validateTransferAmount,
} from "../../controllers/fundTransferController";
import { useGetBankAccounts } from "../../controllers/accountingController";
import { BankAccount } from "../../types/accounting.types";

interface FundTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromAccount?: BankAccount; // Pre-selected source account
  onSuccess?: () => void;
}

export default function FundTransferDialog({
  open,
  onOpenChange,
  fromAccount,
  onSuccess
}: FundTransferDialogProps) {
  // Form state
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");

  // API hooks
  const { data: accountsData } = useGetBankAccounts({ is_active: true });
  const createTransfer = useCreateFundTransfer();

  const accounts = accountsData?.data?.results || [];

  // Pre-select from account if provided
  useEffect(() => {
    if (fromAccount) {
      setFromAccountId(fromAccount.id);
    }
  }, [fromAccount]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      if (!fromAccount) setFromAccountId("");
      setToAccountId("");
      setAmount("");
      setDescription("");
      setReference("");
    }
  }, [open, fromAccount]);

  const selectedFromAccount = accounts.find((acc: BankAccount) => acc.id === fromAccountId);
  const selectedToAccount = accounts.find((acc: BankAccount) => acc.id === toAccountId);

  // Get available "To" accounts (same currency, different account)
  const availableToAccounts = accounts.filter((acc: BankAccount) => {
    if (!selectedFromAccount) return false;
    return (
      acc.id !== fromAccountId &&
      acc.currency === selectedFromAccount.currency
    );
  });

  const handleSubmit = async () => {
    // Validation
    if (!fromAccountId) {
      toast.error("Please select source account");
      return;
    }
    if (!toAccountId) {
      toast.error("Please select destination account");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Validate amount against balance
    if (selectedFromAccount) {
      const validation = validateTransferAmount(
        amount,
        selectedFromAccount.current_balance || "0"
      );
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }
    }

    try {
      const transferData = {
        from_account_id: fromAccountId,
        to_account_id: toAccountId,
        amount: amount,
        description: description || undefined,
        reference: reference || undefined,
      };

      await createTransfer.mutateAsync(transferData);
      toast.success("Fund transfer completed successfully!");

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to create fund transfer");
    }
  };

  const isLoading = createTransfer.isPending;
  const currency = selectedFromAccount?.currency || "NGN";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Transfer Funds
          </DialogTitle>
          <DialogDescription>
            Transfer funds between bank accounts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Account Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from_account">
                From Account <span className="text-red-500">*</span>
              </Label>
              <Select
                value={fromAccountId}
                onValueChange={setFromAccountId}
                disabled={!!fromAccount}
              >
                <SelectTrigger id="from_account">
                  <SelectValue placeholder="Select source account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account: BankAccount) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex flex-col">
                        <span>{account.account_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {account.currency} {account.account_number}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedFromAccount && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-3 pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Available Balance</p>
                        <p className="font-mono font-semibold text-green-600">
                          {formatCurrencyAmount(
                            selectedFromAccount.current_balance || "0",
                            selectedFromAccount.currency
                          )}
                        </p>
                      </div>
                      <Badge variant="secondary">{selectedFromAccount.currency}</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="to_account">
                To Account <span className="text-red-500">*</span>
              </Label>
              <Select
                value={toAccountId}
                onValueChange={setToAccountId}
                disabled={!fromAccountId}
              >
                <SelectTrigger id="to_account">
                  <SelectValue placeholder="Select destination account" />
                </SelectTrigger>
                <SelectContent>
                  {availableToAccounts.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No available accounts
                    </SelectItem>
                  ) : (
                    availableToAccounts.map((account: BankAccount) => (
                      <SelectItem key={account.id} value={account.id}>
                        <div className="flex flex-col">
                          <span>{account.account_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {account.currency} {account.account_number}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedToAccount && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-3 pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Current Balance</p>
                        <p className="font-mono font-semibold">
                          {formatCurrencyAmount(
                            selectedToAccount.current_balance || "0",
                            selectedToAccount.currency
                          )}
                        </p>
                      </div>
                      <Badge variant="secondary">{selectedToAccount.currency}</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Transfer Flow Visualization */}
          {selectedFromAccount && selectedToAccount && (
            <Card className="bg-gray-50">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <Building2 className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                    <p className="text-xs font-medium">{selectedFromAccount.account_name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedFromAccount.bank_name}
                    </p>
                  </div>
                  <ArrowRight className="w-8 h-8 text-gray-400" />
                  <div className="text-center">
                    <Building2 className="w-8 h-8 mx-auto text-green-600 mb-2" />
                    <p className="text-xs font-medium">{selectedToAccount.account_name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedToAccount.bank_name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              Transfer Amount <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-9 text-lg font-semibold"
              />
            </div>
            {amount && selectedFromAccount && (
              <p className="text-xs text-muted-foreground">
                Amount: <span className="font-semibold">{formatCurrencyAmount(amount, currency)}</span>
              </p>
            )}
          </div>

          {/* Description and Reference */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="E.g., Fund transfer to Lagos office"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Reference Number</Label>
            <Input
              id="reference"
              placeholder="Optional internal reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>

          {/* Warning */}
          {amount && parseFloat(amount) > 0 && selectedFromAccount && selectedToAccount && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Transfer Summary:</p>
                <p className="mt-1">
                  Transfer <span className="font-semibold">{formatCurrencyAmount(amount, currency)}</span> from{" "}
                  <span className="font-semibold">{selectedFromAccount.account_name}</span> to{" "}
                  <span className="font-semibold">{selectedToAccount.account_name}</span>.
                </p>
                <p className="mt-1 text-xs">
                  This will create journal entries and update both account balances immediately.
                </p>
              </div>
            </div>
          )}
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
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Transfer Funds
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
