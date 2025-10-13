"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import FormTextArea from "@/components/FormTextArea";
import FormButton from "@/components/FormButton";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AdminRoutes } from "@/constants/RouterConstants";
import {
  StoreTransferSchema,
  TStoreTransferFormValues,
} from "@/features/admin/types/inventory-management/store-transfer";
import {
  useCreateStoreTransfer,
  useUpdateStoreTransfer,
  useGetSingleStoreTransfer,
} from "@/features/admin/controllers/storeTransferController";
import { useGetAllStores } from "@/features/admin/controllers/storeController";
import { useGetAllItems } from "@/features/modules/controllers/config/itemController";
import { useGetItemStocksByItem } from "@/features/admin/controllers/itemStoreStockController";

export default function CreateStoreTransfer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEdit = !!id;

  const [selectedSourceStore, setSelectedSourceStore] = useState<string>("");

  const form = useForm<TStoreTransferFormValues>({
    resolver: zodResolver(StoreTransferSchema),
    defaultValues: {
      source_store: "",
      destination_store: "",
      transfer_reason: "",
      expected_delivery_date: "",
      items: [{ item: "", quantity: 0, remark: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Fetch data
  const { data: existingTransfer } = useGetSingleStoreTransfer(id || "", isEdit);
  const { data: storesData } = useGetAllStores({
    page: 1,
    size: 1000,
    is_active: true,
  });
  const { data: itemsData } = useGetAllItems({
    page: 1,
    size: 10000,
  });

  // Mutations
  const { createStoreTransfer, isLoading: isCreating } = useCreateStoreTransfer();
  const { updateStoreTransfer, isLoading: isUpdating } = useUpdateStoreTransfer(
    id || ""
  );

  // Store options
  const storeOptions = useMemo(() => {
    if (!storesData?.data?.results) return [];
    return storesData.data.results.map((store: any) => ({
      label: `${store.name} (${store.code}) - ${store.store_type === "CENTRAL" ? "Central" : "Location"}`,
      value: store.id,
    }));
  }, [storesData]);

  // Item options
  const itemOptions = useMemo(() => {
    if (!itemsData?.data?.results) return [];
    return itemsData.data.results.map((item: any) => ({
      label: `${item.name} - ${item.category?.name || "N/A"}`,
      value: item.id,
    }));
  }, [itemsData]);

  // Watch source store to filter available items
  const sourceStore = form.watch("source_store");
  useEffect(() => {
    setSelectedSourceStore(sourceStore);
  }, [sourceStore]);

  // Load existing transfer data for edit
  useEffect(() => {
    if (existingTransfer?.data) {
      const transfer = existingTransfer.data;
      form.reset({
        source_store: transfer.source_store,
        destination_store: transfer.destination_store,
        transfer_reason: transfer.transfer_reason,
        expected_delivery_date: transfer.expected_delivery_date || "",
        items: transfer.items.map((item) => ({
          item: item.item,
          quantity: item.quantity_requested,
          remark: item.remark || "",
        })),
      });
    }
  }, [existingTransfer, form]);

  const onSubmit = async (data: TStoreTransferFormValues) => {
    try {
      // Validate that source and destination stores are different
      if (data.source_store === data.destination_store) {
        toast.error("Source and destination stores must be different");
        return;
      }

      // Validate that at least one item has quantity
      const itemsWithQuantity = data.items.filter(
        (item) => item.quantity && item.quantity > 0
      );

      if (itemsWithQuantity.length === 0) {
        toast.error("Please add at least one item with quantity");
        return;
      }

      if (isEdit) {
        await updateStoreTransfer(data);
        toast.success("Store transfer updated successfully");
      } else {
        await createStoreTransfer(data);
        toast.success("Store transfer created successfully");
      }

      router.push(AdminRoutes.STORE_TRANSFERS);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          `Failed to ${isEdit ? "update" : "create"} store transfer`
      );
    }
  };

  const addItem = () => {
    append({ item: "", quantity: 0, remark: "" });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast.error("At least one item is required");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(AdminRoutes.STORE_TRANSFERS)}
          className="mt-1"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Edit Store Transfer" : "Create Store Transfer"}
          </h1>
          <p className="text-gray-600 mt-1">
            Transfer inventory items between stores
          </p>
        </div>
      </div>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Store Selection */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-4">
                📦 Store Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  label="Source Store (From)"
                  name="source_store"
                  placeholder="Select source store"
                  required
                  options={storeOptions}
                  disabled={isEdit} // Can't change source store on edit
                />

                <FormSelect
                  label="Destination Store (To)"
                  name="destination_store"
                  placeholder="Select destination store"
                  required
                  options={storeOptions}
                  disabled={isEdit} // Can't change destination store on edit
                />
              </div>
            </div>

            {/* Transfer Details */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                📋 Transfer Details
              </h3>
              <div className="space-y-4">
                <FormTextArea
                  label="Transfer Reason"
                  name="transfer_reason"
                  placeholder="Enter the reason for this transfer..."
                  required
                  rows={3}
                />

                <FormInput
                  label="Expected Delivery Date (Optional)"
                  name="expected_delivery_date"
                  type="date"
                  placeholder="Select expected delivery date"
                />
              </div>
            </div>

            {/* Items Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">📦 Items to Transfer</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Item
                </Button>
              </div>

              {!selectedSourceStore && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Please select a source store first to see available items
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <Card
                    key={field.id}
                    className="p-4 border border-gray-200 bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-800">
                        Item #{index + 1}
                      </h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormSelect
                        label="Item"
                        name={`items.${index}.item`}
                        placeholder="Select item"
                        required
                        options={itemOptions}
                        disabled={!selectedSourceStore}
                      />

                      <FormInput
                        label="Quantity"
                        name={`items.${index}.quantity`}
                        type="number"
                        placeholder="Enter quantity"
                        required
                        min="0.01"
                        step="0.01"
                      />

                      <FormInput
                        label="Remark (Optional)"
                        name={`items.${index}.remark`}
                        placeholder="Enter remark"
                      />
                    </div>

                    {/* Show available quantity from source store */}
                    <ItemStockInfo
                      itemId={form.watch(`items.${index}.item`)}
                      storeId={selectedSourceStore}
                    />
                  </Card>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(AdminRoutes.STORE_TRANSFERS)}
                disabled={isCreating || isUpdating}
              >
                Cancel
              </Button>
              <FormButton
                type="submit"
                size="lg"
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                  ? "Update Transfer"
                  : "Create Transfer"}
              </FormButton>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}

// Helper component to show available stock
function ItemStockInfo({
  itemId,
  storeId,
}: {
  itemId: string;
  storeId: string;
}) {
  const { data: stockData } = useGetItemStocksByItem(itemId, !!itemId && !!storeId);

  if (!itemId || !storeId) return null;

  const storeStock = stockData?.data?.results?.find(
    (stock: any) => stock.store === storeId
  );

  if (!storeStock) {
    return (
      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
        <p className="text-xs text-red-700">
          ⚠️ This item is not available in the source store
        </p>
      </div>
    );
  }

  const availableQty = storeStock.available_quantity || 0;
  const isLowStock = availableQty <= (storeStock.re_order_level || 0);

  return (
    <div
      className={`mt-2 p-2 border rounded ${
        isLowStock
          ? "bg-yellow-50 border-yellow-200"
          : "bg-green-50 border-green-200"
      }`}
    >
      <p className={`text-xs ${isLowStock ? "text-yellow-700" : "text-green-700"}`}>
        ✓ Available in source store: <strong>{availableQty}</strong> units
        {isLowStock && " (Low stock)"}
      </p>
    </div>
  );
}
