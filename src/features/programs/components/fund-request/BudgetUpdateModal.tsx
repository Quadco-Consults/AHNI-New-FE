"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import { useUpdateFundRequestBudget } from "@/features/programs/controllers/fundRequestController";
import { toast } from "sonner";

interface BudgetUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  fundRequestId: string;
  currentBudget: string;
  currency: string;
}

export default function BudgetUpdateModal({
  isOpen,
  onClose,
  fundRequestId,
  currentBudget,
  currency,
}: BudgetUpdateModalProps) {
  const [newBudget, setNewBudget] = useState(currentBudget);
  const { updateBudget, isLoading, isSuccess, error } = useUpdateFundRequestBudget(fundRequestId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBudget || isNaN(Number(newBudget))) {
      toast.error("Please enter a valid budget amount");
      return;
    }

    try {
      await updateBudget(newBudget);
      toast.success("Budget updated successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update budget");
    }
  };

  const handleClose = () => {
    setNewBudget(currentBudget); // Reset to original value
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Available Balance</DialogTitle>
          <DialogDescription>
            Modify the available balance for this fund request. This will perform a partial update.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current-budget" className="text-right">
                Current:
              </Label>
              <div className="col-span-3 p-2 bg-gray-50 rounded text-sm">
                {currency} {currentBudget}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-budget" className="text-right">
                New Amount:
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <span className="text-sm text-gray-500">{currency}</span>
                <Input
                  id="new-budget"
                  type="number"
                  step="0.01"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  placeholder="Enter new budget amount"
                  disabled={isLoading}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || newBudget === currentBudget}
            >
              {isLoading ? "Updating..." : "Update Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}