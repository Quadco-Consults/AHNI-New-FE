"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateDeductionRateDefaults,
  useUpdateDeductionRateDefaults,
  type IDeductionRateDefaults,
} from "@/features/admin/controllers/deductionRateDefaultsController";

interface DeductionRateDefaultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: IDeductionRateDefaults | null;
}

export default function DeductionRateDefaultsModal({
  isOpen,
  onClose,
  editingItem,
}: DeductionRateDefaultsModalProps) {
  const isEditing = !!editingItem;

  const [formData, setFormData] = useState({
    default_wht_rate: "",
    default_pension_rate: "",
    default_nhis_rate: "",
    effective_date: new Date().toISOString().split('T')[0],
    is_active: true,
    notes: "",
  });

  const { createDeductionRateDefaults, isLoading: isCreating, isSuccess: createSuccess } =
    useCreateDeductionRateDefaults();

  const { updateDeductionRateDefaults, isLoading: isUpdating, isSuccess: updateSuccess } =
    useUpdateDeductionRateDefaults(editingItem?.id || "");

  // Reset form when modal opens/closes or editing item changes
  useEffect(() => {
    if (editingItem) {
      setFormData({
        default_wht_rate: String(editingItem.default_wht_rate),
        default_pension_rate: String(editingItem.default_pension_rate),
        default_nhis_rate: String(editingItem.default_nhis_rate),
        effective_date: editingItem.effective_date,
        is_active: editingItem.is_active,
        notes: editingItem.notes || "",
      });
    } else {
      setFormData({
        default_wht_rate: "",
        default_pension_rate: "",
        default_nhis_rate: "",
        effective_date: new Date().toISOString().split('T')[0],
        is_active: true,
        notes: "",
      });
    }
  }, [editingItem, isOpen]);

  // Handle success
  useEffect(() => {
    if (createSuccess || updateSuccess) {
      toast.success(`Deduction rate defaults ${isEditing ? "updated" : "created"} successfully`);
      onClose();
    }
  }, [createSuccess, updateSuccess, isEditing, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.default_wht_rate || !formData.default_pension_rate || !formData.default_nhis_rate || !formData.effective_date) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate percentage rates
    const wht = parseFloat(formData.default_wht_rate);
    const pension = parseFloat(formData.default_pension_rate);
    const nhis = parseFloat(formData.default_nhis_rate);

    if (isNaN(wht) || isNaN(pension) || isNaN(nhis)) {
      toast.error("Please enter valid percentage rates");
      return;
    }

    if (wht < 0 || wht > 100 || pension < 0 || pension > 100 || nhis < 0 || nhis > 100) {
      toast.error("Percentage rates must be between 0 and 100");
      return;
    }

    if (isEditing) {
      await updateDeductionRateDefaults(formData);
    } else {
      await createDeductionRateDefaults(formData);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Rate Configuration" : "Create Rate Configuration"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the deduction rate defaults below"
              : "Set system-wide default deduction rates for automatic calculation"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formData.is_active && !isEditing && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-amber-800">
                <strong>Note:</strong> Only one configuration can be active at a time.
                Creating an active configuration will automatically deactivate the current one.
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="wht-rate">
                WHT Rate (%) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="wht-rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="e.g., 5.00"
                value={formData.default_wht_rate}
                onChange={(e) =>
                  setFormData({ ...formData, default_wht_rate: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-1">Withholding Tax percentage</p>
            </div>

            <div>
              <Label htmlFor="pension-rate">
                Pension Rate (%) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pension-rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="e.g., 8.00"
                value={formData.default_pension_rate}
                onChange={(e) =>
                  setFormData({ ...formData, default_pension_rate: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-1">Pension contribution percentage</p>
            </div>

            <div>
              <Label htmlFor="nhis-rate">
                NHIS Rate (%) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nhis-rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="e.g., 1.75"
                value={formData.default_nhis_rate}
                onChange={(e) =>
                  setFormData({ ...formData, default_nhis_rate: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-1">NHIS contribution percentage</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="effective-date">
                Effective Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="effective-date"
                type="date"
                value={formData.effective_date}
                onChange={(e) =>
                  setFormData({ ...formData, effective_date: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-1">When these rates take effect</p>
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
                Active Configuration
              </Label>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this rate configuration..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Example Calculation:</h4>
            <div className="text-xs text-blue-800 space-y-1">
              <p>For a payment of ₦100,000 with these rates:</p>
              <ul className="ml-4 space-y-0.5">
                <li>• WHT ({formData.default_wht_rate || "0"}%): ₦{((parseFloat(formData.default_wht_rate) || 0) * 1000).toLocaleString()}</li>
                <li>• Pension ({formData.default_pension_rate || "0"}%): ₦{((parseFloat(formData.default_pension_rate) || 0) * 1000).toLocaleString()}</li>
                <li>• NHIS ({formData.default_nhis_rate || "0"}%): ₦{((parseFloat(formData.default_nhis_rate) || 0) * 1000).toLocaleString()}</li>
                <li className="font-semibold pt-1">• Total Deductions: ₦{(((parseFloat(formData.default_wht_rate) || 0) + (parseFloat(formData.default_pension_rate) || 0) + (parseFloat(formData.default_nhis_rate) || 0)) * 1000).toLocaleString()}</li>
              </ul>
            </div>
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
