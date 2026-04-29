"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, DollarSign, Calendar, Database } from "lucide-react";
import { toast } from "sonner";
import { useCreateMarketItem } from "@/features/procurement/controllers/priceIntelligenceController";
import { useGetAllItemsManager } from "@/features/modules/controllers/config/itemController";
import { MarketItemCreate } from "@/features/procurement/types/price-intelligence";

interface AddMarketItemModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  preselectedItemId?: string;
}

export default function AddMarketItemModal({ open, onOpenChange, preselectedItemId }: AddMarketItemModalProps) {
  const [isOpen, setIsOpen] = useState(open ?? false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Form state
  const [formData, setFormData] = useState<MarketItemCreate>({
    item: preselectedItemId || "",
    unit_price: 0,
    source: "Market Survey",
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
  });

  // Sync with parent controlled open state
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch items for dropdown
  const { data: itemsData, isLoading: itemsLoading } = useGetAllItemsManager({
    page: 1,
    size: 100, // Get more items for better search
    search: debouncedSearch,
    enabled: isOpen,
  });

  // Create mutation
  const { mutate: createMarketItem, isPending: isCreating } = useCreateMarketItem();

  // Handle dialog state change
  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }

    // Reset form when closing
    if (!newOpen) {
      setFormData({
        item: preselectedItemId || "",
        unit_price: 0,
        source: "Market Survey",
        date: new Date().toISOString().split('T')[0],
      });
      setSearchTerm("");
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.item) {
      toast.error("Please select an item");
      return;
    }

    if (!formData.unit_price || formData.unit_price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!formData.date) {
      toast.error("Please select a date");
      return;
    }

    // Submit
    createMarketItem(formData, {
      onSuccess: () => {
        toast.success("Market price recorded successfully!");
        handleOpenChange(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to record market price");
      },
    });
  };

  const items = itemsData?.data?.results || [];
  const selectedItem = items.find(item => item.id === formData.item);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!open && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Record Market Price
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Record Market Price
          </DialogTitle>
          <DialogDescription>
            Manually record a market price from external research or vendor quotes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Selection */}
          <div className="space-y-2">
            <Label htmlFor="item">Item *</Label>
            <div className="space-y-2">
              {/* Search Input */}
              <Input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />

              {/* Item Dropdown */}
              <Select
                value={formData.item}
                onValueChange={(value) => setFormData({ ...formData, item: value })}
                disabled={itemsLoading || !!preselectedItemId}
              >
                <SelectTrigger id="item">
                  <SelectValue placeholder={itemsLoading ? "Loading items..." : "Select an item"} />
                </SelectTrigger>
                <SelectContent>
                  {items.length === 0 ? (
                    <div className="text-sm text-gray-500 p-2 text-center">
                      {debouncedSearch ? "No items found" : "Start typing to search"}
                    </div>
                  ) : (
                    items.map((item: any) => (
                      <SelectItem key={item.id} value={item.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{item.name}</span>
                          {item.description && (
                            <span className="text-xs text-gray-500 truncate">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {/* Selected Item Display */}
              {selectedItem && (
                <div className="text-xs text-gray-600 p-2 bg-blue-50 rounded border border-blue-200">
                  <div className="font-medium">{selectedItem.name}</div>
                  {selectedItem.description && (
                    <div className="text-gray-500">{selectedItem.description}</div>
                  )}
                  {selectedItem.category?.name && (
                    <div className="text-gray-500 mt-1">Category: {selectedItem.category.name}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Price Input */}
          <div className="space-y-2">
            <Label htmlFor="price">Unit Price (₦) *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.unit_price || ""}
                onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) || 0 })}
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-gray-500">
              Enter the price per unit from your market research or vendor quote
            </p>
          </div>

          {/* Source Selection */}
          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Select
              value={formData.source}
              onValueChange={(value) => setFormData({ ...formData, source: value })}
            >
              <SelectTrigger id="source">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Market Survey">Market Survey</SelectItem>
                <SelectItem value="Vendor Quote">Vendor Quote</SelectItem>
                <SelectItem value="Online Research">Online Research</SelectItem>
                <SelectItem value="Phone Inquiry">Phone Inquiry</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="pl-10"
                required
                max={new Date().toISOString().split('T')[0]} // Can't select future dates
              />
            </div>
            <p className="text-xs text-gray-500">
              Date when this price was obtained
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Recording..." : "Record Price"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
