"use client";

import { useState, useEffect } from "react";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
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
import { toast } from "sonner";
import { useCreateBankAccount, useUpdateBankAccount } from "../../controllers/accountingController";
import { BankAccount, BankAccountType, BankAccountFormData } from "../../types/accounting.types";

// Nigerian Banks List
const nigerianBanks = [
  { name: "Access Bank Plc", code: "044" },
  { name: "Citibank Nigeria Limited", code: "023" },
  { name: "Ecobank Nigeria Plc", code: "050" },
  { name: "Fidelity Bank Plc", code: "070" },
  { name: "First Bank of Nigeria Limited", code: "011" },
  { name: "First City Monument Bank Plc", code: "214" },
  { name: "Guaranty Trust Bank Plc", code: "058" },
  { name: "Heritage Banking Company Ltd", code: "030" },
  { name: "Keystone Bank Limited", code: "082" },
  { name: "Polaris Bank Limited", code: "076" },
  { name: "Providus Bank", code: "101" },
  { name: "Stanbic IBTC Bank Plc", code: "221" },
  { name: "Standard Chartered Bank Nigeria Limited", code: "068" },
  { name: "Sterling Bank Plc", code: "232" },
  { name: "Union Bank of Nigeria Plc", code: "032" },
  { name: "United Bank For Africa Plc", code: "033" },
  { name: "Unity Bank Plc", code: "215" },
  { name: "Wema Bank Plc", code: "035" },
  { name: "Zenith Bank Plc", code: "057" }
];

// AHNI GL Accounts for bank accounts
const bankGLAccounts = [
  { code: "1100", name: "Cash and Cash Equivalents" },
  { code: "1110", name: "Checking Account - NGN" },
  { code: "1111", name: "Checking Account - USD" },
  { code: "1120", name: "Savings Account - NGN" },
  { code: "1121", name: "Savings Account - USD" },
  { code: "1130", name: "Money Market Account" },
  { code: "1140", name: "Petty Cash" },
  { code: "1150", name: "Bank Drafts and Cashier's Checks" }
];

interface BankAccountFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: BankAccount;
  onSuccess?: () => void;
}

export default function BankAccountForm({
  open,
  onOpenChange,
  account,
  onSuccess
}: BankAccountFormProps) {
  const [formData, setFormData] = useState<BankAccountFormData>({
    account_name: "",
    account_number: "",
    bank_name: "",
    account_type: "CHECKING",
    currency: "NGN",
    gl_account: "",
    is_active: true
  });

  const createBankAccount = useCreateBankAccount();
  const updateBankAccount = useUpdateBankAccount(account?.id || "");

  // Populate form when editing
  useEffect(() => {
    if (account) {
      setFormData({
        account_name: account.account_name,
        account_number: account.account_number,
        bank_name: account.bank_name,
        account_type: account.account_type,
        currency: account.currency,
        gl_account: typeof account.gl_account === 'string' ? account.gl_account : account.gl_account.id,
        is_active: account.is_active
      });
    } else {
      // Reset form for new account
      setFormData({
        account_name: "",
        account_number: "",
        bank_name: "",
        account_type: "CHECKING",
        currency: "NGN",
        gl_account: "",
        is_active: true
      });
    }
  }, [account]);

  const handleSubmit = async () => {
    // Validation
    if (!formData.account_name.trim()) {
      toast.error("Account name is required");
      return;
    }
    if (!formData.account_number.trim()) {
      toast.error("Account number is required");
      return;
    }
    if (!formData.bank_name) {
      toast.error("Bank name is required");
      return;
    }
    if (!formData.gl_account) {
      toast.error("GL Account is required");
      return;
    }

    try {
      if (account) {
        await updateBankAccount.updateBankAccount(formData);
        toast.success("Bank account updated successfully");
      } else {
        await createBankAccount.createBankAccount(formData);
        toast.success("Bank account created successfully");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || `Failed to ${account ? 'update' : 'create'} bank account`);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const isLoading = createBankAccount.isLoading || updateBankAccount.isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {account ? 'Edit Bank Account' : 'Add New Bank Account'}
          </DialogTitle>
          <DialogDescription>
            {account
              ? 'Update the bank account information below'
              : 'Add a new bank account to AHNI\'s financial system'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="account_name">Account Name *</Label>
              <Input
                id="account_name"
                value={formData.account_name}
                onChange={(e) => setFormData({...formData, account_name: e.target.value})}
                placeholder="e.g., FHI 360/AHNi-GF HQ"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use AHNI project naming convention
              </p>
            </div>
            <div>
              <Label htmlFor="account_number">Account Number *</Label>
              <Input
                id="account_number"
                value={formData.account_number}
                onChange={(e) => setFormData({...formData, account_number: e.target.value})}
                placeholder="e.g., 0235139608"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Bank account number (10 digits)
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="bank_name">Bank Name *</Label>
            <Select
              value={formData.bank_name}
              onValueChange={(value) => setFormData({...formData, bank_name: value})}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
              <SelectContent>
                {nigerianBanks.map((bank) => (
                  <SelectItem key={bank.code} value={bank.name}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Select the bank where this account is held
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="account_type">Account Type *</Label>
              <Select
                value={formData.account_type}
                onValueChange={(value) => setFormData({...formData, account_type: value as BankAccountType})}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CHECKING">Checking</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                  <SelectItem value="MONEY_MARKET">Money Market</SelectItem>
                  <SelectItem value="CREDIT_LINE">Credit Line</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currency">Currency *</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({...formData, currency: value})}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">NGN (Naira)</SelectItem>
                  <SelectItem value="USD">USD (Dollar)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="gl_account">GL Account *</Label>
              <Select
                value={formData.gl_account}
                onValueChange={(value) => setFormData({...formData, gl_account: value})}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select GL account" />
                </SelectTrigger>
                <SelectContent>
                  {bankGLAccounts.map((account) => (
                    <SelectItem key={account.code} value={account.code}>
                      {account.code} - {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              className="rounded"
              disabled={isLoading}
            />
            <Label htmlFor="is_active">Account is active</Label>
            <p className="text-xs text-gray-500">
              Only active accounts can be used for transactions
            </p>
          </div>

          {/* AHNI-specific information */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">AHNI Guidelines</h3>
            <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
              <ul className="space-y-1">
                <li>• Account names should follow project naming conventions</li>
                <li>• Each project should have dedicated bank accounts</li>
                <li>• USD accounts are required for international donors</li>
                <li>• GL accounts must be properly mapped for reconciliation</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (account ? 'Updating...' : 'Creating...') : (account ? 'Update Account' : 'Create Account')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}