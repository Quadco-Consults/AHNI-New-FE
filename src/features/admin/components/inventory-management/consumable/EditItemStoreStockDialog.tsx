"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { useUpdateItemStoreStock } from "@/features/admin/controllers/itemStoreStockController";
import { useUpdateItem } from "@/features/modules/controllers/config/itemController";
import { useGetAllCategories } from "@/features/modules/controllers/config/categoryController";
import { Package, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";

interface EditItemStoreStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stockData: {
    id: string;
    itemId: string;
    itemName: string;
    itemDescription: string;
    itemUom: string;
    itemCategory: string;
    quantity: number;
    available_quantity: number;
    reserved_quantity: number;
    re_order_level: number;
    buffer_stock: number;
    max_stock: number;
  };
  storeId: string;
}

export default function EditItemStoreStockDialog({
  open,
  onOpenChange,
  stockData,
  storeId,
}: EditItemStoreStockDialogProps) {
  const queryClient = useQueryClient();
  const { updateItemStoreStock, isLoading: isLoadingStock } = useUpdateItemStoreStock(stockData.id);
  const { updateItem, isLoading: isLoadingItem } = useUpdateItem(stockData.itemId);

  // Fetch categories for dropdown
  const { data: categoriesData } = useGetAllCategories({
    page: 1,
    size: 1000,
    search: "",
    enabled: open,
  });

  // Unit of measurement options
  const uomOptions = [
    "Box", "Piece", "Bottle", "Pack", "Ream", "Carton",
    "Roll", "Kg", "Litre", "Meter", "Unit", "Set"
  ];

  // Get consumable subcategories
  const consumableCategories = useMemo(() => {
    console.log("📦 CATEGORY DEBUG - Raw categories data:", categoriesData);
    console.log("📦 CATEGORY DEBUG - Dialog open:", open);

    // Handle different possible response structures
    // API returns: { status: true, message: "...", data: { results: [...], pagination: {...} } }
    const categories = categoriesData?.data?.results || categoriesData?.results || [];

    if (categories.length === 0) {
      console.log("⚠️ No categories found in results");
      console.log("📦 Checking categoriesData structure:", {
        hasData: !!categoriesData?.data,
        hasResults: !!categoriesData?.results,
        dataResults: categoriesData?.data?.results,
      });
      return [];
    }

    console.log("📦 CATEGORY DEBUG - All categories count:", categories.length);
    console.log("📦 CATEGORY DEBUG - All categories:", categories);

    // Find the "Consumables" parent category
    const consumablesParent = categories.find(
      (cat: any) => {
        const isConsumables = cat.name?.toLowerCase() === "consumables";
        const hasNoParent = !cat.parent || cat.parent === null;
        console.log(`📦 Checking category: "${cat.name}", id: ${cat.id}, isConsumables: ${isConsumables}, hasNoParent: ${hasNoParent}, parent: ${cat.parent}`);
        return isConsumables && hasNoParent;
      }
    );

    console.log("📦 CATEGORY DEBUG - Consumables parent found:", consumablesParent);

    if (!consumablesParent) {
      console.log("⚠️ Consumables parent category not found. Available categories:",
        categories.map((c: any) => ({ name: c.name, parent: c.parent }))
      );
      // Fallback: return all categories without parent (top-level ones)
      const topLevelCategories = categories.filter((cat: any) => !cat.parent || cat.parent === null);
      console.log("📦 Returning all top-level categories as fallback:", topLevelCategories);
      return topLevelCategories.map((cat: any) => ({
        label: cat.name,
        value: cat.id,
      }));
    }

    // Get all subcategories of "Consumables"
    const subcategories = categories.filter(
      (cat: any) => cat.parent === consumablesParent.id
    );

    console.log("📦 CATEGORY DEBUG - Subcategories of Consumables found:", subcategories);

    const options = subcategories.map((cat: any) => ({
      label: cat.name,
      value: cat.id,
    }));

    console.log("📦 CATEGORY DEBUG - Final options:", options);

    return options;
  }, [categoriesData, open]);

  const [itemFormData, setItemFormData] = useState({
    name: stockData.itemName || "",
    description: stockData.itemDescription || "",
    uom: stockData.itemUom || "",
    category: stockData.itemCategory || "",
  });

  const [stockFormData, setStockFormData] = useState({
    quantity: stockData.quantity || 0,
    available_quantity: stockData.available_quantity || 0,
    reserved_quantity: stockData.reserved_quantity || 0,
    re_order_level: stockData.re_order_level || 0,
    buffer_stock: stockData.buffer_stock || 0,
    max_stock: stockData.max_stock || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isLoading = isLoadingStock || isLoadingItem;

  // Reset form when dialog opens or stockData changes
  useEffect(() => {
    if (open) {
      setItemFormData({
        name: stockData.itemName || "",
        description: stockData.itemDescription || "",
        uom: stockData.itemUom || "",
        category: stockData.itemCategory || "",
      });
      setStockFormData({
        quantity: stockData.quantity || 0,
        available_quantity: stockData.available_quantity || 0,
        reserved_quantity: stockData.reserved_quantity || 0,
        re_order_level: stockData.re_order_level || 0,
        buffer_stock: stockData.buffer_stock || 0,
        max_stock: stockData.max_stock || 0,
      });
      setErrors({});
    }
  }, [open, stockData]);

  const handleItemInputChange = (field: string, value: string) => {
    setItemFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleStockInputChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setStockFormData((prev) => ({
      ...prev,
      [field]: numValue,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate item master data
    if (!itemFormData.name.trim()) {
      newErrors.name = "Item name is required";
    }
    if (!itemFormData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!itemFormData.uom.trim()) {
      newErrors.uom = "Unit of measurement is required";
    }

    // Validate stock data
    if (stockFormData.quantity < 0) {
      newErrors.quantity = "Quantity cannot be negative";
    }
    if (stockFormData.available_quantity < 0) {
      newErrors.available_quantity = "Available quantity cannot be negative";
    }
    if (stockFormData.reserved_quantity < 0) {
      newErrors.reserved_quantity = "Reserved quantity cannot be negative";
    }
    if (stockFormData.re_order_level < 0) {
      newErrors.re_order_level = "Reorder level cannot be negative";
    }
    if (stockFormData.buffer_stock < 0) {
      newErrors.buffer_stock = "Buffer stock cannot be negative";
    }
    if (stockFormData.max_stock < 0) {
      newErrors.max_stock = "Max stock cannot be negative";
    }

    // Check if quantity equals available + reserved
    if (stockFormData.quantity !== stockFormData.available_quantity + stockFormData.reserved_quantity) {
      newErrors.quantity = "Total quantity must equal available + reserved";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      // Prepare item update payload
      // Only include category if it's a valid UUID (matches UUID pattern)
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const itemPayload: any = {
        name: itemFormData.name,
        description: itemFormData.description,
        uom: itemFormData.uom,
      };

      // Only add category if it's a valid UUID
      if (itemFormData.category && uuidPattern.test(itemFormData.category)) {
        itemPayload.category = itemFormData.category;
      }

      // Update item master data first
      await updateItem(itemPayload);

      // Then update stock levels
      await updateItemStoreStock(stockFormData);

      toast.success("Item and stock levels updated successfully");

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["store-inventory-comprehensive", storeId] });
      queryClient.invalidateQueries({ queryKey: ["item-store-stocks"] });
      queryClient.invalidateQueries({ queryKey: ["item-store-stock", stockData.id] });
      queryClient.invalidateQueries({ queryKey: ["item", stockData.itemId] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["consumables"] });

      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update item");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-indigo-600" />
            Edit Consumable - {stockData.itemName}
          </DialogTitle>
          <DialogDescription>
            Update item details and stock levels for this consumable
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Item Master Data Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm">Item Details</h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Item Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={itemFormData.name}
                  onChange={(e) => handleItemInputChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                  placeholder="Enter item name"
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={itemFormData.description}
                  onChange={(e) => handleItemInputChange("description", e.target.value)}
                  className={errors.description ? "border-red-500" : ""}
                  placeholder="Enter item description"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-xs text-red-500">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="uom" className="text-sm font-medium">
                    Unit of Measurement <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={itemFormData.uom}
                    onValueChange={(value) => handleItemInputChange("uom", value)}
                  >
                    <SelectTrigger className={errors.uom ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {uomOptions.map((uom) => (
                        <SelectItem key={uom} value={uom}>
                          {uom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.uom && (
                    <p className="text-xs text-red-500">{errors.uom}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category/Subcategory
                  </Label>
                  <Select
                    value={itemFormData.category}
                    onValueChange={(value) => handleItemInputChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {consumableCategories.map((cat: any) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">Optional consumable type</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Stock Quantities Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm">Stock Quantities</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Total Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={stockFormData.quantity}
                  onChange={(e) => handleStockInputChange("quantity", e.target.value)}
                  className={errors.quantity ? "border-red-500" : ""}
                />
                {errors.quantity && (
                  <p className="text-xs text-red-500">{errors.quantity}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="available_quantity" className="text-sm font-medium">
                  Available Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="available_quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={stockFormData.available_quantity}
                  onChange={(e) => handleStockInputChange("available_quantity", e.target.value)}
                  className={errors.available_quantity ? "border-red-500" : ""}
                />
                {errors.available_quantity && (
                  <p className="text-xs text-red-500">{errors.available_quantity}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reserved_quantity" className="text-sm font-medium">
                  Reserved Quantity
                </Label>
                <Input
                  id="reserved_quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={stockFormData.reserved_quantity}
                  onChange={(e) => handleStockInputChange("reserved_quantity", e.target.value)}
                  className={errors.reserved_quantity ? "border-red-500" : ""}
                />
                {errors.reserved_quantity && (
                  <p className="text-xs text-red-500">{errors.reserved_quantity}</p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Total Quantity must equal Available + Reserved
              </p>
            </div>
          </div>

          {/* Threshold Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm">Stock Thresholds</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="re_order_level" className="text-sm font-medium">
                  Reorder Level
                </Label>
                <Input
                  id="re_order_level"
                  type="number"
                  min="0"
                  step="1"
                  value={stockFormData.re_order_level}
                  onChange={(e) => handleStockInputChange("re_order_level", e.target.value)}
                  className={errors.re_order_level ? "border-red-500" : ""}
                />
                {errors.re_order_level && (
                  <p className="text-xs text-red-500">{errors.re_order_level}</p>
                )}
                <p className="text-xs text-gray-500">Triggers low stock alert</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buffer_stock" className="text-sm font-medium">
                  Buffer Stock
                </Label>
                <Input
                  id="buffer_stock"
                  type="number"
                  min="0"
                  step="1"
                  value={stockFormData.buffer_stock}
                  onChange={(e) => handleStockInputChange("buffer_stock", e.target.value)}
                  className={errors.buffer_stock ? "border-red-500" : ""}
                />
                {errors.buffer_stock && (
                  <p className="text-xs text-red-500">{errors.buffer_stock}</p>
                )}
                <p className="text-xs text-gray-500">Critical stock level</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_stock" className="text-sm font-medium">
                  Max Stock
                </Label>
                <Input
                  id="max_stock"
                  type="number"
                  min="0"
                  step="1"
                  value={stockFormData.max_stock}
                  onChange={(e) => handleStockInputChange("max_stock", e.target.value)}
                  className={errors.max_stock ? "border-red-500" : ""}
                />
                {errors.max_stock && (
                  <p className="text-xs text-red-500">{errors.max_stock}</p>
                )}
                <p className="text-xs text-gray-500">Maximum storage capacity</p>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Stock Alert Levels:</strong>
            </p>
            <ul className="text-xs text-yellow-800 mt-2 space-y-1 list-disc list-inside">
              <li>Available = 0: Out of Stock</li>
              <li>Available ≤ Buffer Stock: Critical</li>
              <li>Available ≤ Reorder Level: Low Stock</li>
              <li>Available &gt; Reorder Level: OK</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
