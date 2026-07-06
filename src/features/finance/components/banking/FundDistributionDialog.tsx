"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Network,
  DollarSign,
  AlertCircle,
  Plus,
  Trash2,
  MapPin,
} from "lucide-react";
import {
  useCreateFundDistribution,
  formatCurrencyAmount,
  validateDistribution,
  calculateTotalDistribution,
} from "../../controllers/fundTransferController";
import { useGetBankAccounts } from "../../controllers/accountingController";
import { BankAccount } from "../../types/accounting.types";

interface FundDistributionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mainAccount?: BankAccount; // Pre-selected main account
  onSuccess?: () => void;
}

interface Distribution {
  id: string;
  account_id: string;
  amount: string;
}

export default function FundDistributionDialog({
  open,
  onOpenChange,
  mainAccount,
  onSuccess
}: FundDistributionDialogProps) {
  // Form state
  const [mainAccountId, setMainAccountId] = useState("");
  const [distributions, setDistributions] = useState<Distribution[]>([
    { id: crypto.randomUUID(), account_id: "", amount: "" }
  ]);
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");

  // API hooks
  const { data: accountsData } = useGetBankAccounts({ is_active: true });
  const createDistribution = useCreateFundDistribution();

  const accounts = accountsData?.data?.results || [];

  // Pre-select main account if provided
  useEffect(() => {
    if (mainAccount && mainAccount.currency === "NGN") {
      setMainAccountId(mainAccount.id);
    }
  }, [mainAccount]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      if (!mainAccount) setMainAccountId("");
      setDistributions([{ id: crypto.randomUUID(), account_id: "", amount: "" }]);
      setDescription("");
      setReference("");
    }
  }, [open, mainAccount]);

  const selectedMainAccount = accounts.find((acc: BankAccount) => acc.id === mainAccountId);

  // Get location NGN accounts (excluding main account)
  const locationAccounts = accounts.filter((acc: BankAccount) => {
    if (!selectedMainAccount) return false;
    return (
      acc.id !== mainAccountId &&
      acc.currency === "NGN" &&
      acc.account_name.toLowerCase().includes("location") ||
      acc.account_name.toLowerCase().includes("state") ||
      acc.account_name.toLowerCase().includes("office")
    );
  });

  // Calculate totals
  const totalDistribution = calculateTotalDistribution(distributions);
  const mainBalance = parseFloat(selectedMainAccount?.current_balance || "0");
  const remainingBalance = mainBalance - totalDistribution;

  const addDistribution = () => {
    setDistributions([
      ...distributions,
      { id: crypto.randomUUID(), account_id: "", amount: "" }
    ]);
  };

  const removeDistribution = (id: string) => {
    if (distributions.length > 1) {
      setDistributions(distributions.filter(d => d.id !== id));
    }
  };

  const updateDistribution = (id: string, field: 'account_id' | 'amount', value: string) => {
    setDistributions(distributions.map(d =>
      d.id === id ? { ...d, [field]: value } : d
    ));
  };

  const handleSubmit = async () => {
    // Validation
    if (!mainAccountId) {
      toast.error("Please select main account");
      return;
    }

    // Filter out empty distributions
    const validDistributions = distributions.filter(d => d.account_id && d.amount);

    if (validDistributions.length === 0) {
      toast.error("Please add at least one distribution");
      return;
    }

    // Validate distribution
    if (selectedMainAccount) {
      const validation = validateDistribution(
        validDistributions,
        selectedMainAccount.current_balance || "0"
      );
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }
    }

    try {
      const distributionData = {
        main_account_id: mainAccountId,
        distributions: validDistributions.map(d => ({
          account_id: d.account_id,
          amount: d.amount
        })),
        description: description || undefined,
        reference: reference || undefined,
      };

      await createDistribution.mutateAsync(distributionData);
      toast.success(`Funds distributed to ${validDistributions.length} locations successfully!`);

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to distribute funds");
    }
  };

  const isLoading = createDistribution.isPending;
  const hasErrors = selectedMainAccount && totalDistribution > mainBalance;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Distribute Funds to Locations
          </DialogTitle>
          <DialogDescription>
            Distribute funds from main account to multiple location accounts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Main Account Selection */}
          <div className="space-y-2">
            <Label htmlFor="main_account">
              Main Account (Source) <span className="text-red-500">*</span>
            </Label>
            <Select
              value={mainAccountId}
              onValueChange={setMainAccountId}
              disabled={!!mainAccount}
            >
              <SelectTrigger id="main_account">
                <SelectValue placeholder="Select main NGN account" />
              </SelectTrigger>
              <SelectContent>
                {accounts
                  .filter((acc: BankAccount) => acc.currency === "NGN")
                  .map((account: BankAccount) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex flex-col">
                        <span>{account.account_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {account.account_number} • {formatCurrencyAmount(account.current_balance || "0", "NGN")}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {selectedMainAccount && (
              <Card className={hasErrors ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"}>
                <CardContent className="pt-4 pb-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Available Balance</p>
                      <p className="font-mono font-semibold text-green-600">
                        {formatCurrencyAmount(mainBalance, "NGN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total Distribution</p>
                      <p className={`font-mono font-semibold ${hasErrors ? "text-red-600" : "text-blue-600"}`}>
                        {formatCurrencyAmount(totalDistribution, "NGN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Remaining Balance</p>
                      <p className={`font-mono font-semibold ${hasErrors ? "text-red-600" : "text-gray-700"}`}>
                        {formatCurrencyAmount(remainingBalance, "NGN")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Distributions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Distribution to Locations</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDistribution}
                disabled={!mainAccountId || locationAccounts.length === 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Location
              </Button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {distributions.map((dist, index) => {
                const selectedAccount = accounts.find((acc: BankAccount) => acc.id === dist.account_id);
                return (
                  <Card key={dist.id} className="bg-gray-50">
                    <CardContent className="pt-4 pb-4">
                      <div className="grid grid-cols-12 gap-3 items-start">
                        <div className="col-span-1 pt-2 text-center">
                          <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                            {index + 1}
                          </Badge>
                        </div>
                        <div className="col-span-6">
                          <Label htmlFor={`account_${dist.id}`} className="text-xs">
                            Location Account
                          </Label>
                          <Select
                            value={dist.account_id}
                            onValueChange={(value) => updateDistribution(dist.id, 'account_id', value)}
                          >
                            <SelectTrigger id={`account_${dist.id}`} className="mt-1">
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              {locationAccounts.length === 0 ? (
                                <SelectItem value="none" disabled>
                                  No location accounts available
                                </SelectItem>
                              ) : (
                                locationAccounts
                                  .filter((acc: BankAccount) =>
                                    !distributions.some(d => d.id !== dist.id && d.account_id === acc.id)
                                  )
                                  .map((account: BankAccount) => (
                                    <SelectItem key={account.id} value={account.id}>
                                      <div className="flex items-center gap-2">
                                        <MapPin className="w-3 h-3" />
                                        <span>{account.account_name}</span>
                                      </div>
                                    </SelectItem>
                                  ))
                              )}
                            </SelectContent>
                          </Select>
                          {selectedAccount && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Current: {formatCurrencyAmount(selectedAccount.current_balance || "0", "NGN")}
                            </p>
                          )}
                        </div>
                        <div className="col-span-4">
                          <Label htmlFor={`amount_${dist.id}`} className="text-xs">
                            Amount (₦)
                          </Label>
                          <div className="relative mt-1">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id={`amount_${dist.id}`}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={dist.amount}
                              onChange={(e) => updateDistribution(dist.id, 'amount', e.target.value)}
                              className="pl-9"
                            />
                          </div>
                        </div>
                        <div className="col-span-1 pt-6">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDistribution(dist.id)}
                            disabled={distributions.length === 1}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Description and Reference */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="E.g., Q1 2026 fund distribution"
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
          </div>

          {/* Warning/Summary */}
          {mainAccountId && totalDistribution > 0 && (
            <div className={`flex items-start gap-2 p-3 rounded-lg ${
              hasErrors
                ? "bg-red-50 border border-red-200"
                : "bg-amber-50 border border-amber-200"
            }`}>
              <AlertCircle className={`w-5 h-5 mt-0.5 ${hasErrors ? "text-red-600" : "text-amber-600"}`} />
              <div className={`text-sm ${hasErrors ? "text-red-800" : "text-amber-800"}`}>
                {hasErrors ? (
                  <>
                    <p className="font-medium">Insufficient Balance!</p>
                    <p className="mt-1">
                      Total distribution ({formatCurrencyAmount(totalDistribution, "NGN")}) exceeds
                      available balance ({formatCurrencyAmount(mainBalance, "NGN")})
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium">Distribution Summary:</p>
                    <p className="mt-1">
                      Distribute <span className="font-semibold">{formatCurrencyAmount(totalDistribution, "NGN")}</span> to{" "}
                      <span className="font-semibold">{distributions.filter(d => d.account_id && d.amount).length}</span> locations.
                      Remaining balance: <span className="font-semibold">{formatCurrencyAmount(remainingBalance, "NGN")}</span>
                    </p>
                  </>
                )}
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
          <Button onClick={handleSubmit} disabled={isLoading || hasErrors}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Distributing...
              </>
            ) : (
              <>
                <Network className="w-4 h-4 mr-2" />
                Distribute Funds
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
