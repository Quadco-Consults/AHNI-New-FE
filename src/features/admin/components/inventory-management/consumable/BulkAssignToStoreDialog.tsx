"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useGetAllStores } from "@/features/admin/controllers/storeController";
import { useGetAllItemsQuery } from "@/features/modules/controllers/config/itemController";
import { AlertCircle, Store, Package, CheckCircle, Loader2 } from "lucide-react";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

interface BulkAssignToStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BulkAssignToStoreDialog({
  open,
  onOpenChange,
}: BulkAssignToStoreDialogProps) {
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [defaultQuantity, setDefaultQuantity] = useState<string>("0");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<{
    success: number;
    failed: number;
    skipped: number;
  }>({ success: 0, failed: 0, skipped: 0 });

  // Consumables category UUID
  const CONSUMABLES_CATEGORY_ID = "fadb6228-23de-4b04-9eac-b75940cf622f";

  // Fetch stores (only when dialog is open)
  const { data: storesData } = useGetAllStores({
    page: 1,
    size: 1000,
    is_active: true,
    enabled: open,
  });

  // Fetch all consumables
  const { data: itemsData } = useGetAllItemsQuery({
    page: 1,
    size: 10000,
    category: CONSUMABLES_CATEGORY_ID,
  });

  // Store options
  const storeOptions = useMemo(() => {
    if (!storesData?.data?.results) return [];
    return storesData.data.results.map((store: any) => ({
      label: `${store.name} (${store.code}) - ${
        store.store_type === "CENTRAL" ? "Central Store" : "Location Store"
      }`,
      value: store.id,
      storeData: store,
    }));
  }, [storesData]);

  const totalConsumables = itemsData?.data?.results?.length || 0;

  const handleBulkAssign = async () => {
    if (!selectedStore) {
      toast.error("Please select a store");
      return;
    }

    if (!defaultQuantity || parseFloat(defaultQuantity) < 0) {
      toast.error("Please enter a valid default quantity");
      return;
    }

    const consumables = itemsData?.data?.results || [];
    if (consumables.length === 0) {
      toast.error("No consumables found to assign");
      return;
    }

    setIsProcessing(true);
    setProgress({ current: 0, total: consumables.length });
    setResults({ success: 0, failed: 0, skipped: 0 });

    let successCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < consumables.length; i++) {
      const item = consumables[i];
      setProgress({ current: i + 1, total: consumables.length });

      try {
        // Check if item already has stock in this store
        const checkResponse = await AxiosWithToken.get(
          "/admins/inventory/item-store-stocks/",
          {
            params: {
              item: item.id,
              store: selectedStore,
            },
          }
        );

        if (
          checkResponse.data?.data?.results &&
          checkResponse.data.data.results.length > 0
        ) {
          console.log(`Skipped ${item.name} - already exists in store`);
          skippedCount++;
          continue;
        }

        // Create stock record using GRN endpoint
        const grnPayload = {
          destination_store: selectedStore,
          items: [
            {
              item: item.id,
              quantity_received: parseFloat(defaultQuantity),
              unit_price: 0,
              expiry_date: null,
            },
          ],
          received_date: new Date().toISOString().split("T")[0],
          reference_number: `BULK-ASSIGN-${Date.now()}-${i}`,
          description: `Bulk assignment of existing consumables to store`,
          status: "received", // Mark as already received
        };

        await AxiosWithToken.post(
          "/admins/inventory/good-receive-notes/",
          grnPayload
        );

        successCount++;
        console.log(`✓ Assigned ${item.name} to store`);
      } catch (error: any) {
        failedCount++;
        console.error(`✗ Failed to assign ${item.name}:`, error);
      }
    }

    setResults({
      success: successCount,
      failed: failedCount,
      skipped: skippedCount,
    });
    setIsProcessing(false);

    if (successCount > 0) {
      toast.success(
        `Successfully assigned ${successCount} consumables to store`
      );
    }
    if (failedCount > 0) {
      toast.error(`Failed to assign ${failedCount} consumables`);
    }
    if (skippedCount > 0) {
      toast.info(`Skipped ${skippedCount} consumables (already in store)`);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setSelectedStore("");
      setDefaultQuantity("0");
      setProgress({ current: 0, total: 0 });
      setResults({ success: 0, failed: 0, skipped: 0 });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-indigo-600" />
            Bulk Assign Consumables to Store
          </DialogTitle>
          <DialogDescription>
            Assign all consumables to a default store in one operation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Warning Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-900 mb-1">
                  Important Information
                </h4>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                  <li>This will assign ALL {totalConsumables} consumables to the selected store</li>
                  <li>Items already in the store will be skipped</li>
                  <li>Each assignment creates a Good Receive Note (GRN)</li>
                  <li>This operation cannot be undone automatically</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Store Selection */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="store">
                Select Default Store <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedStore}
                onValueChange={setSelectedStore}
                disabled={isProcessing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a store (e.g., AHNI HQ)" />
                </SelectTrigger>
                <SelectContent>
                  {storeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Typically select your central store or main warehouse
              </p>
            </div>

            <div>
              <Label htmlFor="quantity">
                Default Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="1"
                value={defaultQuantity}
                onChange={(e) => setDefaultQuantity(e.target.value)}
                placeholder="Enter default quantity (e.g., 100)"
                disabled={isProcessing}
              />
              <p className="text-xs text-gray-500 mt-1">
                Initial stock quantity for each consumable (can be 0 for inventory setup)
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-blue-900">Processing...</span>
                <span className="text-blue-700">
                  {progress.current} of {progress.total}
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(progress.current / progress.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Results */}
          {(results.success > 0 || results.failed > 0 || results.skipped > 0) && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Results</h4>
              <div className="space-y-2">
                {results.success > 0 && (
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span>Successfully assigned: {results.success}</span>
                  </div>
                )}
                {results.skipped > 0 && (
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <AlertCircle className="h-4 w-4" />
                    <span>Skipped (already in store): {results.skipped}</span>
                  </div>
                )}
                {results.failed > 0 && (
                  <div className="flex items-center gap-2 text-sm text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <span>Failed: {results.failed}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Cancel"}
          </Button>
          <Button
            type="button"
            onClick={handleBulkAssign}
            disabled={isProcessing || !selectedStore}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <Store className="h-4 w-4 mr-2" />
                Assign All to Store
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
