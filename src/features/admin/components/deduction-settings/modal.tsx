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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateDeductionSetting,
  useUpdateDeductionSetting,
  type IDeductionSetting,
} from "@/features/admin/controllers/deductionSettingsController";

interface DeductionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: IDeductionSetting | null;
}

export default function DeductionSettingsModal({
  isOpen,
  onClose,
  editingItem,
}: DeductionSettingsModalProps) {
  const isEditing = !!editingItem;

  const [formData, setFormData] = useState({
    payment_type: "CONSULTANT",
    deduction_name: "",
    amount: "",
    is_active: true,
    description: "",
  });

  const { createDeductionSetting, isLoading: isCreating, isSuccess: createSuccess } =
    useCreateDeductionSetting();

  const { updateDeductionSetting, isLoading: isUpdating, isSuccess: updateSuccess } =
    useUpdateDeductionSetting(editingItem?.id || "");

  // Reset form when modal opens/closes or editing item changes
  useEffect(() => {
    if (editingItem) {
      setFormData({
        payment_type: editingItem.payment_type,
        deduction_name: editingItem.deduction_name,
        amount: String(editingItem.amount),
        is_active: editingItem.is_active,
        description: editingItem.description || "",
      });
    } else {
      setFormData({
        payment_type: "CONSULTANT",
        deduction_name: "",
        amount: "",
        is_active: true,
        description: "",
      });
    }
  }, [editingItem, isOpen]);

  // Handle success
  useEffect(() => {
    if (createSuccess || updateSuccess) {
      toast.success(`Deduction setting ${isEditing ? "updated" : "created"} successfully`);
      onClose();
    }
  }, [createSuccess, updateSuccess, isEditing, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.deduction_name || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isEditing) {
      await updateDeductionSetting(formData);
    } else {
      await createDeductionSetting(formData);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Deduction Setting" : "Create Deduction Setting"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the deduction setting details below"
              : "Add a new system-wide deduction setting"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payment-type">
                Payment Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.payment_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, payment_type: value })
                }
                disabled={isEditing} // Can't change payment type when editing
              >
                <SelectTrigger id="payment-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONSULTANT">Consultant</SelectItem>
                  <SelectItem value="ADHOC_STAFF">Adhoc Staff</SelectItem>
                  <SelectItem value="VENDOR">Vendor</SelectItem>
                  <SelectItem value="PURCHASE_ORDER">Purchase Order</SelectItem>
                  <SelectItem value="FACILITATOR">Facilitator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="deduction-name">
                Deduction Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="deduction-name"
                placeholder="e.g., Tax, Pension, Insurance"
                value={formData.deduction_name}
                onChange={(e) =>
                  setFormData({ ...formData, deduction_name: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">
                Amount (₦) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="is-active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label htmlFor="is-active" className="cursor-pointer">
                Active
              </Label>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Additional notes about this deduction..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEditing ? "Update" : "Create"}</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
