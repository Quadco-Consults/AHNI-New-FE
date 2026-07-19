"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import RfqLayout from "./RfqLayout";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/FormInput";
import FormTextArea from "@/components/FormTextArea";
import FormButton from "@/components/FormButton";
import FadedButton from "@/components/FadedButton";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
import { toast } from "sonner";
import { useGetAllCategories } from "@/features/modules/controllers/config/categoryController";
import { CategoryResultsData } from "@/features/admin/types/config/category";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Schema for individual lot
const LotSchema = z.object({
  name: z.string().min(1, "Lot name is required"),
  description: z.string().optional(),
  estimated_budget: z.union([
    z.string().optional(),
    z.number().optional()
  ]),
  categories: z.array(z.string()).min(1, "At least one category must be selected"),
});

const LotsFormSchema = z.object({
  lots: z.array(LotSchema).min(1, "At least one lot is required"),
});

type LotsFormData = z.infer<typeof LotsFormSchema>;

const Lots = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quotationData, setQuotationData] = useState<any>(null);
  const [categorySearchParams, setCategorySearchParams] = useState("");

  const categoryQueryResult = useGetAllCategories({
    no_paginate: true,
    search: categorySearchParams,
  });

  // @ts-ignore
  const allCategories = categoryQueryResult?.data?.data?.results || [];

  const form = useForm<LotsFormData>({
    resolver: zodResolver(LotsFormSchema),
    defaultValues: {
      lots: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lots",
  });

  // Load quotation data from sessionStorage
  useEffect(() => {
    const storedData = sessionStorage.getItem("rfqQuotationFormData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setQuotationData(parsed);
        console.log("📋 Loaded quotation data for lots:", parsed);

        // Auto-create lots based on selected categories
        if (parsed.categories && parsed.categories.length > 0 && fields.length === 0) {
          const eoiCategories = allCategories.filter((cat: CategoryResultsData) =>
            parsed.categories.includes(cat.id)
          );

          // Create one lot per category by default
          const autoLots = eoiCategories.map((cat: CategoryResultsData) => ({
            name: `Lot - ${cat.name}`,
            description: cat.description || "",
            estimated_budget: "",
            categories: [cat.id],
          }));

          form.reset({ lots: autoLots });
          console.log("✅ Auto-created lots from categories:", autoLots);
        }
      } catch (error) {
        console.error("Error parsing quotation data:", error);
      }
    }
  }, [allCategories, fields.length, form]);

  const onSubmit: SubmitHandler<LotsFormData> = (data) => {
    console.log("📦 Lot Configuration Data:", data);

    // Save lot configuration to sessionStorage
    sessionStorage.setItem("rfqLotsData", JSON.stringify(data));

    toast.success(`${data.lots.length} lot(s) configured successfully!`);

    // Navigate to items page
    const currentParams = searchParams?.toString() || "";
    const basePath = "/dashboard/procurement/solicitation-management/rfq/create/items";
    const finalPath = currentParams ? `${basePath}?${currentParams}` : basePath;

    console.log("🔗 Navigating to Items page:", finalPath);
    router.push(finalPath);
  };

  const handleAddLot = () => {
    append({
      name: "",
      description: "",
      estimated_budget: "",
      categories: [],
    });
  };

  const handleRemoveLot = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast.error("You must have at least one lot");
    }
  };

  // Get selected categories for a specific lot
  const getSelectedCategories = (lotIndex: number) => {
    const selectedCategoryIds = form.watch(`lots.${lotIndex}.categories`) || [];
    return allCategories.filter((cat: CategoryResultsData) =>
      selectedCategoryIds.includes(cat.id)
    );
  };

  // Get categories used in EOI
  const eoiCategories = useMemo(() => {
    if (!quotationData?.categories) return [];
    return allCategories.filter((cat: CategoryResultsData) =>
      quotationData.categories.includes(cat.id)
    );
  }, [quotationData, allCategories]);

  return (
    <RfqLayout step="lots" title="Configure Lots">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-sm text-blue-900 mb-2">
              Lot-Based Tendering
            </h4>
            <p className="text-xs text-blue-800 mb-3">
              Configure lots for this tender. Each lot represents a package that vendors can bid on separately.
              Categories from your EOI have been pre-configured as individual lots. You can combine or split them as needed.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium text-blue-900">Selected Categories:</span>
              {eoiCategories.map((cat: CategoryResultsData) => (
                <Badge key={cat.id} variant="outline" className="bg-white text-xs">
                  {cat.name}
                </Badge>
              ))}
            </div>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed">
              <p className="text-gray-500 mb-4">No lots configured yet</p>
              <Button type="button" onClick={handleAddLot}>
                <AddSquareIcon />
                Add First Lot
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {fields.map((field, index) => {
                const selectedCategories = getSelectedCategories(index);

                return (
                  <div
                    key={field.id}
                    className="border rounded-lg p-6 bg-white shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">Lot {index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLot(index)}
                        disabled={fields.length === 1}
                      >
                        <DeleteIcon />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormInput
                        name={`lots.${index}.name`}
                        label="Lot Name"
                        placeholder="e.g., Lot - Medical Supplies"
                        required
                      />
                      <FormInput
                        name={`lots.${index}.estimated_budget`}
                        label="Estimated Budget (₦)"
                        placeholder="e.g., 5000000"
                        type="number"
                      />
                    </div>

                    <div className="mb-4">
                      <FormTextArea
                        name={`lots.${index}.description`}
                        label="Description"
                        placeholder="Describe what this lot contains..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Categories for this Lot *
                      </Label>
                      {selectedCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {selectedCategories.map((cat: CategoryResultsData) => (
                            <Badge key={cat.id} className="bg-primary text-xs">
                              {cat.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg border max-h-60 overflow-y-auto">
                        {eoiCategories.map((category: CategoryResultsData) => {
                          const selectedCategoryIds =
                            form.watch(`lots.${index}.categories`) || [];
                          const isChecked = selectedCategoryIds.includes(category.id);

                          return (
                            <div
                              key={category.id}
                              className="flex items-start space-x-3 p-3 bg-white rounded border hover:border-primary cursor-pointer"
                              onClick={() => {
                                const currentCategories = form.getValues(
                                  `lots.${index}.categories`
                                );
                                const newCategories = isChecked
                                  ? currentCategories.filter((id) => id !== category.id)
                                  : [...currentCategories, category.id];
                                form.setValue(`lots.${index}.categories`, newCategories);
                              }}
                            >
                              <Checkbox checked={isChecked} className="mt-1" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{category.name}</p>
                                <p className="text-xs text-gray-500">
                                  {category.code}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-center">
                <FadedButton type="button" onClick={handleAddLot}>
                  <AddSquareIcon />
                  Add Another Lot
                </FadedButton>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Back
            </Button>
            <FormButton type="submit" disabled={fields.length === 0}>
              Continue to Items
            </FormButton>
          </div>
        </form>
      </Form>
    </RfqLayout>
  );
};

export default Lots;
