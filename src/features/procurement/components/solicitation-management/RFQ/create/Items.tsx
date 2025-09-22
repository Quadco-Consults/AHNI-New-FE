"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import RfqLayout from "./RfqLayout";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import FormInput from "components/atoms/FormInput";
import FormTextArea from "components/atoms/FormTextArea";
import FormSelect from "components/atoms/FormSelectField";
import { SelectContent, SelectItem } from "components/ui/select";
import FormButton from "@/components/FormButton";
import FadedButton from "components/atoms/FadedButton";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { toast } from "sonner";
import { useGetPurchaseRequestById } from "@/features/procurement/controllers/purchaseRequestController";
import { useCreateSolicitation } from "@/features/procurement/controllers/solicitationController";
import { useGetAllItems } from "@/features/modules/controllers";
import { useGetAllLots } from "@/features/procurement/controllers/lotsController";
import { LoadingSpinner } from "components/Loading";

// Schema for RFQ Items
const RFQItemSchema = z.object({
  item: z.string().uuid().optional(),
  description: z.string().min(1, "Item description is required"),
  quantity: z.string().min(1, "Quantity is required"),
  unit: z.string().min(1, "Unit is required"),
  specifications: z.string().optional(),
  lot: z.string().optional(), // Optional lot field
  frequency: z.string().min(1, "Frequency is required").default("1"),
  number_of_days: z.string().min(1, "Number of days is required").default("1"),
});

const RFQItemsFormSchema = z.object({
  items: z.array(RFQItemSchema).min(1, "At least one item is required"),
});

type RFQItemsFormData = z.infer<typeof RFQItemsFormSchema>;

const Items = () => {
  const router = useRouter();
  const [quotationData, setQuotationData] = useState<any>(null);
  const [isPopulating, setIsPopulating] = useState(false);

  const form = useForm<RFQItemsFormData>({
    resolver: zodResolver(RFQItemsFormSchema),
    defaultValues: {
      items: [
        {
          item: "",
          description: "", // Auto-populated when item is selected
          quantity: "",
          unit: "", // Auto-populated when item is selected
          specifications: "",
          lot: "",
          frequency: "1", // Default to 1 as per backend
          number_of_days: "1", // Default to 1 as per backend
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Get purchase request ID from quotation data
  const purchaseRequestId = quotationData?.purchase_request;

  // Fetch purchase request data if ID exists
  const { data: purchaseRequestData, isLoading: isPRLoading } = useGetPurchaseRequestById(
    purchaseRequestId as string,
    !!purchaseRequestId
  );

  // Fetch items and lots for dropdowns
  const { data: itemsData, isLoading: isItemsLoading } = useGetAllItems({ no_paginate: true });
  const { data: lotsData, isLoading: isLotsLoading } = useGetAllLots({ page: 1, size: 1000 });

  // Get the first available lot as default
  const defaultLot = (lotsData as any)?.results?.[0]?.id;

  // Load quotation data from sessionStorage
  useEffect(() => {
    const storedData = sessionStorage.getItem("rfqQuotationFormData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setQuotationData(parsed);
        console.log("📋 Loaded quotation data:", parsed);
      } catch (error) {
        console.error("Error parsing quotation data:", error);
      }
    }
  }, []);

  // Populate items when purchase request data is loaded
  useEffect(() => {
    if (purchaseRequestData?.data?.items && !isPopulating) {
      setIsPopulating(true);

      console.log("🔄 Populating items from Purchase Request:", purchaseRequestData.data.items);

      // Clear existing items first
      form.setValue("items", []);

      // Transform PR items to RFQ items format with auto-populated descriptions
      const transformedItems = purchaseRequestData.data.items.map((prItem: any) => {
        // Find the full item details to auto-populate description
        const fullItemDetails = itemsData?.data?.results?.find((item: any) => item.id === prItem.item);

        return {
          item: prItem.item || "",
          description: fullItemDetails?.name || prItem.item_detail?.name || prItem.description || "",
          quantity: prItem.quantity?.toString() || "",
          unit: fullItemDetails?.uom || prItem.unit || "pieces",
          specifications: prItem.specifications || prItem.description || "",
          lot: "",
          frequency: "1", // Default frequency
          number_of_days: "1", // Default number of days
        };
      });

      // Set the transformed items
      form.setValue("items", transformedItems);

      toast.success(`Populated ${transformedItems.length} items from Purchase Request!`);
      setIsPopulating(false);
    }
  }, [purchaseRequestData, form, isPopulating]);

  // Create solicitation hook
  const { createSolicitation, isLoading: isCreating } = useCreateSolicitation();

  const onSubmit: SubmitHandler<RFQItemsFormData> = async (data) => {
    try {
      // Transform items to match API format (SolicitationItemsSchema)
      const transformedItems = data.items
        .filter(item => item.item && item.quantity) // Only include items with required fields
        .map((item) => {
          let lotValue = item.lot;
          // Handle "no-lot" selection
          if (!lotValue || lotValue === "no-lot") {
            lotValue = null; // Send null for no lot
          }

          const transformedItem: any = {
            item: item.item, // UUID of the item
            quantity: parseInt(item.quantity),
            description: item.description, // Keep description for reference
            specification: item.specifications || "", // Keep specifications
            frequency: parseInt(item.frequency) || 1, // Convert to integer
            number_of_days: parseInt(item.number_of_days) || 1, // Convert to integer
          };

          // Include lot field (null if no lot selected)
          transformedItem.lot = lotValue;

          return transformedItem;
        });

      // Basic validation for required fields
      if (transformedItems.length === 0) {
        toast.error("Please add at least one item");
        return;
      }

      console.log("✅ Items validation passed:", transformedItems);

      // Prepare final solicitation data for API
      const finalData = {
        ...quotationData,
        solicitation_items: transformedItems, // Backend expects 'solicitation_items' array format
        solicitation_evaluations: [], // Empty criteria array since we're skipping evaluation criteria
      };

      console.log("🚀 Creating RFQ with complete data:", finalData);

      // Create RFQ using the API (cast to any to handle extended schema)
      const result = await createSolicitation(finalData as any);

      if (result) {
        // Show success message
        toast.success("RFQ created successfully!");

        // Navigate back to RFQ listing
        router.push("/dashboard/procurement/solicitation-management/rfq");

        // Clear stored form data after successful creation
        setTimeout(() => {
          sessionStorage.removeItem("rfqQuotationFormData");
          sessionStorage.removeItem("rfqCompleteFormData");
        }, 1000);
      }

    } catch (error) {
      console.error("Error creating RFQ:", error);
      toast.error("Failed to create RFQ. Please try again.");
    }
  };

  const addNewItem = () => {
    append({
      item: "",
      description: "", // Auto-populated when item is selected
      quantity: "",
      unit: "", // Auto-populated when item is selected
      specifications: "",
      lot: "",
      frequency: "1", // Default frequency
      number_of_days: "1", // Default number of days
    });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast.error("At least one item is required");
    }
  };

  return (
    <RfqLayout>
      <div className="p-5">
        <div className="mb-6">
          <h4 className="font-semibold text-lg">Add Items to RFQ</h4>
          <p className="text-gray-600 text-sm mt-2">
            Add all items/services you want to request quotations for
          </p>

          {quotationData && (
            <div className="mt-4 space-y-2">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>RFQ:</strong> {quotationData.title || "Untitled RFQ"}
                </p>
              </div>

              {purchaseRequestId && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Purchase Request:</strong> {purchaseRequestData?.data?.ref_number || purchaseRequestId}
                  </p>
                  {isPRLoading && (
                    <p className="text-xs text-green-600 mt-1">
                      Loading purchase request items...
                    </p>
                  )}
                  {purchaseRequestData?.data?.items && (
                    <p className="text-xs text-green-600 mt-1">
                      ✅ {purchaseRequestData.data.items.length} items loaded from this purchase request
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {(isPRLoading || isPopulating) && (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
            <span className="ml-2 text-gray-600">
              {isPRLoading ? "Loading purchase request..." : "Populating items..."}
            </span>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-200 rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-gray-900">
                    Item {index + 1}
                  </h5>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <DeleteIcon />
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Item Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormSelect
                      name={`items.${index}.item`}
                      label="Select Item"
                      placeholder="Choose an item"
                      onValueChange={(value) => {
                        // Auto-populate description when item is selected
                        const selectedItem = itemsData?.data?.results?.find((item: any) => item.id === value);
                        if (selectedItem) {
                          form.setValue(`items.${index}.description`, selectedItem.name || selectedItem.description || '');
                          // Also auto-populate unit if available
                          if ((selectedItem as any).uom) {
                            form.setValue(`items.${index}.unit`, (selectedItem as any).uom);
                          }
                        }
                      }}
                    >
                      <SelectContent>
                        {isItemsLoading && <LoadingSpinner />}
                        {itemsData?.data?.results?.map((item: any) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </FormSelect>

                    <FormSelect
                      name={`items.${index}.lot`}
                      label="Select Lot (Optional)"
                      placeholder="Choose a lot or leave empty"
                    >
                      <SelectContent>
                        {isLotsLoading && <LoadingSpinner />}
                        <SelectItem value="no-lot">No Lot Required</SelectItem>
                        {lotsData?.results?.map((lot: any) => (
                          <SelectItem key={lot.id} value={lot.id}>
                            {lot.name} - Packet #{lot.packet_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </FormSelect>
                  </div>

                  {/* Description and Quantity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      name={`items.${index}.description`}
                      label="Item Description (Auto-filled from selected item)"
                      placeholder="Auto-populated when item is selected"
                      required
                      readOnly
                      className="bg-gray-50"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <FormInput
                        name={`items.${index}.quantity`}
                        label="Quantity"
                        placeholder="e.g., 10"
                        type="number"
                        required
                      />
                      <FormInput
                        name={`items.${index}.unit`}
                        label="Unit"
                        placeholder="e.g., pieces, kg, meters"
                        required
                      />
                    </div>
                  </div>

                </div>

                {/* Frequency and Number of Days */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    name={`items.${index}.frequency`}
                    label="Frequency"
                    placeholder="e.g., 1"
                    type="number"
                    min="1"
                    required
                  />
                  <FormInput
                    name={`items.${index}.number_of_days`}
                    label="Number of Days"
                    placeholder="e.g., 30"
                    type="number"
                    min="1"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <FormTextArea
                    name={`items.${index}.specifications`}
                    label="Specifications (Optional)"
                    placeholder="Enter detailed specifications or requirements"
                    rows={3}
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-center">
              <FadedButton
                type="button"
                className="text-primary"
                onClick={addNewItem}
              >
                <AddSquareIcon />
                Add Another Item
              </FadedButton>
            </div>

            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <FormButton type="submit" disabled={isCreating || isPRLoading || isPopulating}>
                {isCreating ? "Creating RFQ..." : "Create RFQ"}
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </RfqLayout>
  );
};

export default Items;
