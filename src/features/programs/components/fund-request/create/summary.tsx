"use client";

import { useRouter, usePathname } from "next/navigation";
import FormButton from "@/components/FormButton";
import { Button } from "@/components/ui/button";
import FundRequstLayout from "./Layout";
import React, { useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FundRequestActivitySchema,
  TFundRequestActivityFormValues,
} from "@/features/programs/types/program-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/atoms/FormInput";
import FormSelect from "@/components/atoms/FormSelect";
import { useGetAllCostCategoriesManager } from "@/features/modules/controllers/finance/costCategoryController";
import ActivityBulkImport from "../ActivityBulkImport";
import { Copy, Trash2 } from "lucide-react";

const FundSummary: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<TFundRequestActivityFormValues>({
    resolver: zodResolver(FundRequestActivitySchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "activities",
  });

  const { data: costCategory, refetch: refetchCategories } = useGetAllCostCategoriesManager({
    page: 1,
    size: 2000000,
  });

  // Fallback categories if API fails
  const fallbackCategories = [
    { id: "27d47188-300e-426c-a66f-96595edf7614", name: "TEST CATEGORY" },
    { id: "5c976aa2-bd63-4b17-9c6d-6c32c501f9d0", name: "mby" }
  ];

  const categoriesData = (costCategory as any)?.data?.results || (costCategory as any)?.results || [];
  const categoriesToUse = categoriesData.length > 0 ? categoriesData : fallbackCategories;

  const costCategoryOptions = categoriesToUse.map(
    ({ name, id }: any) => ({
      label: name,
      value: id,
    })
  );

  // Debug logging
  console.log("Cost category raw data:", costCategory);
  console.log("Categories data extracted:", categoriesData);
  console.log("Using fallback?", categoriesData.length === 0);
  console.log("Final cost category options:", costCategoryOptions);

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<TFundRequestActivityFormValues> = async ({
    activities,
  }) => {
    const programFundRequest = JSON.parse(
      typeof window !== 'undefined' ? localStorage.getItem("programFundRequest") || "{}" : "{}"
    );

    const payload = {
      ...programFundRequest,
      activities,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem("programFundRequest", JSON.stringify(payload));
    }

    let path = pathname || "";

    path = path.substring(0, path.lastIndexOf("/"));

    path += "/preview";

    router.push(path);
  };

  return (
    <FundRequstLayout>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Table className='border rounded-xl'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[300px]'>
                  Description of Activity
                </TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Cost</TableHead>

                <TableHead>Frequency</TableHead>
                <TableHead>Cost Category</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <FormInput
                      id='activity_description'
                      name={`activities.${index}.activity_description`}
                      placeholder=''
                    />
                  </TableCell>
                  <TableCell>
                    <FormInput
                      id='quantity'
                      name={`activities.${index}.quantity`}
                      placeholder=''
                    />
                  </TableCell>

                  <TableCell>
                    <FormInput
                      id='unit_cost'
                      name={`activities.${index}.unit_cost`}
                      placeholder=''
                    />
                  </TableCell>

                  <TableCell>
                    <FormInput
                      id='frequency'
                      name={`activities.${index}.frequency`}
                      placeholder=''
                    />
                  </TableCell>
                  <TableCell>
                    <FormSelect
                      id='category'
                      name={`activities.${index}.category`}
                      placeholder='Select Cost Category'
                      options={costCategoryOptions}
                    />
                  </TableCell>
                  <TableCell>
                    <FormInput
                      id='comment'
                      name={`activities.${index}.comment`}
                      placeholder=''
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Duplicate this activity
                          const currentActivity = form.getValues(`activities.${index}`);
                          append({
                            activity_description: currentActivity.activity_description,
                            quantity: Number(currentActivity.quantity) || 1,
                            unit_cost: Number(currentActivity.unit_cost) || 0,
                            frequency: Number(currentActivity.frequency) || 1,
                            comment: currentActivity.comment,
                            category: currentActivity.category,
                          });
                        }}
                        title="Duplicate activity"
                      >
                        <Copy size={14} />
                      </Button>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => remove(index)}
                          title="Remove activity"
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Bulk Import and Quick Actions */}
          <ActivityBulkImport
            onImport={(activities) => {
              // Map category names to category IDs
              const categories = (costCategory as any)?.data?.results || (costCategory as any)?.results || [];
              const categoryMap = new Map(
                categories.map((cat: any) => [
                  cat.name.toLowerCase(),
                  cat.id
                ])
              );

              // Map imported activities to the expected format with category IDs
              const mappedActivities = activities.map(activity => {
                const categoryId = categoryMap.get(activity.category.toLowerCase()) || activity.category || "";

                return {
                  activity_description: activity.activity_description,
                  quantity: Number(activity.quantity) || 1, // Convert to number for form handling
                  unit_cost: Number(activity.unit_cost) || 0, // Convert to number for form handling
                  frequency: Number(activity.frequency) || 1, // Convert to number for form handling
                  comment: activity.comment,
                  category: String(categoryId), // Now using category ID instead of name
                };
              });

              // Append all activities at once
              mappedActivities.forEach(activity => append(activity));
            }}
            categories={((costCategory as any)?.data?.results || (costCategory as any)?.results || []).map((cat: any) => ({
              id: cat.id,
              name: cat.name
            }))}
            onCategoriesCreated={() => {
              // Refetch categories after new ones are created
              refetchCategories();
            }}
            onAddMultiple={(count) => {
              // Add multiple empty rows
              for (let i = 0; i < count; i++) {
                append({
                  activity_description: "",
                  quantity: 1, // Default to 1 for numeric validation
                  unit_cost: 0, // Default to 0 for numeric validation
                  frequency: 1, // Default to 1 for numeric validation
                  comment: "",
                  category: "",
                });
              }
            }}
            existingActivities={fields.map((field, index) => ({
              activity_description: form.watch(`activities.${index}.activity_description`) || "",
              quantity: form.watch(`activities.${index}.quantity`) || "",
              unit_cost: form.watch(`activities.${index}.unit_cost`) || "",
              frequency: form.watch(`activities.${index}.frequency`) || "",
              comment: form.watch(`activities.${index}.comment`) || "",
              category: form.watch(`activities.${index}.category`) || "",
            }))}
          />

          <Button
            type='button'
            variant='outline'
            className='text-[#DEA004] w-[250px] mt-5'
            onClick={() =>
              append({
                activity_description: "",
                quantity: 1, // Default to 1 for numeric validation
                unit_cost: 0, // Default to 0 for numeric validation
                frequency: 1, // Default to 1 for numeric validation
                comment: "",
                category: "",
              })
            }
          >
            {fields.length > 0 ? "Click to add another" : "Add summary"}
          </Button>

          <div className='flex justify-end gap-5 pt-24'>
            <FormButton
              onClick={() => router.back()}
              type='button'
              className='bg-[#FFF2F2] text-primary dark:text-gray-500'
            >
              Back
            </FormButton>

            <FormButton type='submit'>Next</FormButton>
          </div>
        </form>
      </Form>
    </FundRequstLayout>
  );
};

export default FundSummary;
