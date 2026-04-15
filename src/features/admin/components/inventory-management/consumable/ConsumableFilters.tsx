"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import { useGetAllCategories } from "@/features/modules/controllers/config/categoryController";
import { useGetAllStores } from "@/features/admin/controllers/storeController";

interface ConsumableFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilterChange: (filters: ConsumableFilters) => void;
  currentFilters: ConsumableFilters;
}

export interface ConsumableFilters {
  category__name: string;
  stock_status: string;
  store: string;
}

const DEFAULT_FILTERS: ConsumableFilters = {
  category__name: "all",
  stock_status: "all",
  store: "all",
};

export default function ConsumableFilters({
  open,
  onOpenChange,
  onFilterChange,
  currentFilters,
}: ConsumableFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ConsumableFilters>(currentFilters);

  // Fetch categories for consumable types
  const { data: categoriesData } = useGetAllCategories({
    page: 1,
    size: 1000,
    search: "",
  });

  // Fetch stores
  const { data: storesData } = useGetAllStores({
    page: 1,
    size: 1000,
    is_active: true,
    enabled: open,
  });

  // Get consumable subcategories (Medical, IT, etc.)
  const consumableTypeOptions = useMemo(() => {
    const results = (categoriesData as any)?.data?.results || (categoriesData as any)?.results;
    if (!results) {
      return [];
    }

    // Find the Consumables parent category
    const consumablesParent = results.find(
      (cat: any) =>
        cat.job_category === 'GOODS' &&
        !cat.parent &&
        (cat.name.toLowerCase().includes('consumable') || cat.code === 'CON')
    );

    if (!consumablesParent) {
      return [];
    }

    // Get subcategories under Consumables
    const subcategories = results.filter((cat: any) => {
      if (typeof cat.parent === 'string') {
        return cat.parent === consumablesParent.id;
      } else if (cat.parent && typeof cat.parent === 'object') {
        return cat.parent.id === consumablesParent.id;
      }
      return false;
    });

    return subcategories.map((cat: any) => ({
      label: cat.name,
      value: cat.name,
    }));
  }, [categoriesData]);

  const storeOptions = useMemo(() => {
    const results = (storesData as any)?.data?.results || (storesData as any)?.results;
    if (!results) {
      return [];
    }

    return results.map((store: any) => ({
      label: store.name,
      value: store.id,
    }));
  }, [storesData]);

  const stockStatusOptions = [
    { label: "All Stock Status", value: "all" },
    { label: "In Stock", value: "IN_STOCK" },
    { label: "Low Stock", value: "LOW_STOCK" },
    { label: "Out of Stock", value: "OUT_OF_STOCK" },
  ];

  const handleFilterChange = (
    key: keyof ConsumableFilters,
    value: string
  ) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
  };

  const applyFilters = () => {
    // Convert "all" values to empty strings for API
    const apiFilters = {
      category__name: localFilters.category__name === "all" ? "" : localFilters.category__name,
      stock_status: localFilters.stock_status === "all" ? "" : localFilters.stock_status,
      store: localFilters.store === "all" ? "" : localFilters.store,
    };
    onFilterChange(apiFilters);
    onOpenChange(false);
  };

  const clearFilters = () => {
    setLocalFilters(DEFAULT_FILTERS);
    const apiFilters = {
      category__name: "",
      stock_status: "",
      store: "",
    };
    onFilterChange(apiFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(localFilters).filter(
      (value) => value !== "" && value !== "all"
    ).length;
  };

  const hasActiveFilters = getActiveFilterCount() > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <span>Filter Consumables</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-auto">
                {getActiveFilterCount()}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Filter consumables by type, stock status, and store
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Consumable Type */}
          <div>
            <Label>Consumable Type</Label>
            <Select
              value={localFilters.category__name}
              onValueChange={(value) => handleFilterChange("category__name", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {consumableTypeOptions.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stock Status */}
          <div>
            <Label>Stock Status</Label>
            <Select
              value={localFilters.stock_status}
              onValueChange={(value) => handleFilterChange("stock_status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {stockStatusOptions.map((option) => (
                  <SelectItem key={option.value || "all"} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Store */}
          <div>
            <Label>Store</Label>
            <Select
              value={localFilters.store}
              onValueChange={(value) => handleFilterChange("store", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Stores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {storeOptions.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="space-y-2">
              <Label>Active Filters</Label>
              <div className="flex flex-wrap gap-2">
                {localFilters.category__name && localFilters.category__name !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Type: {localFilters.category__name}
                    <X
                      size={12}
                      className="cursor-pointer"
                      onClick={() => handleFilterChange("category__name", "all")}
                    />
                  </Badge>
                )}
                {localFilters.stock_status && localFilters.stock_status !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Status: {localFilters.stock_status}
                    <X
                      size={12}
                      className="cursor-pointer"
                      onClick={() => handleFilterChange("stock_status", "all")}
                    />
                  </Badge>
                )}
                {localFilters.store && localFilters.store !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Store: {storeOptions.find((s: any) => s.value === localFilters.store)?.label}
                    <X
                      size={12}
                      className="cursor-pointer"
                      onClick={() => handleFilterChange("store", "all")}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-4 border-t">
            <Button onClick={applyFilters} className="w-full">
              Apply Filters
            </Button>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="w-full">
                <X size={16} className="mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
