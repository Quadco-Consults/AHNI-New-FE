"use client";

import React from "react";
import FormInput from "@/components/atoms/FormInput";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MinusCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useGetAllItems } from "@/features/modules/controllers/config/itemController";

const ExpensesForm = ({
  fields,
  watch,
  remove,
  setValue,
}: {
  fields: any;
  remove: any;
  watch: any;
  setValue: any;
}) => {
  const { control } = useFormContext();

  // Fetch service items (parent_category = "Services")
  const { data: serviceItems, isLoading: servicesLoading, error: servicesError } = useGetAllItems({
    page: 1,
    size: 2000000,
    parent_category: "Services",
  });

  // Fetch regular items (all non-service items - could be Consumables, Assets, etc.)
  const { data: regularItems, isLoading: regularItemsLoading, error: regularItemsError } = useGetAllItems({
    page: 1,
    size: 2000000,
    // Note: We load all items here and could add a filter to exclude Services if needed
  });

  // Map service items to options
  const serviceItemsOptions = serviceItems?.data?.results?.map(({ name, id, uom }) => ({
    label: name,
    value: id,
    uom: uom,
  })) || serviceItems?.results?.map(({ name, id, uom }) => ({
    label: name,
    value: id,
    uom: uom,
  })) || [];

  // Map regular items to options (filter out Services category)
  const regularItemsResults = regularItems?.data?.results || regularItems?.results || [];
  const regularItemsOptions = regularItemsResults
    .filter((item: any) => {
      // Filter out items from Services parent category
      const parentCategoryName = item?.category?.parent?.name;
      return parentCategoryName !== "Services";
    })
    .map(({ name, id, uom }: any) => ({
      label: name,
      value: id,
      uom: uom,
    }));

  // Create a combined lookup map for item details (both service and regular items)
  const allItemsResults = [
    ...(serviceItems?.data?.results || serviceItems?.results || []),
    ...(regularItems?.data?.results || regularItems?.results || [])
  ];
  const itemsLookup = allItemsResults.reduce((acc: any, item: any) => {
    acc[item.id] = item;
    return acc;
  }, {});
  // Watch all expenses for calculation
  const watchedExpenses = watch('expenses') || [];

  // Update total costs when values change
  React.useEffect(() => {
    watchedExpenses.forEach((expense: any, index: number) => {
      const isService = expense?.is_service || false;
      let totalCost = 0;

      if (isService) {
        // For services: Total = Quantity × Duration × # of Facilities × Unit Cost
        const quantity = parseFloat(expense?.quantity || 0);
        const duration = parseFloat(expense?.duration || 1);
        const numOfFacility = parseFloat(expense?.num_of_facility || 1);
        const unitCost = parseFloat(expense?.unit_cost || 0);
        totalCost = quantity * duration * numOfFacility * unitCost;
      } else {
        // For regular items: Total = Quantity × Unit Cost
        const quantity = parseFloat(expense?.quantity || 0);
        const unitCost = parseFloat(expense?.unit_cost || 0);
        totalCost = quantity * unitCost;
      }

      // Only update if the total cost has changed to avoid infinite loops
      if (expense?.total_cost !== totalCost) {
        setValue(`expenses.${index}.total_cost`, totalCost || 0);
      }
    });
  }, [watchedExpenses, setValue]);

  // optimization for number spliting is required use: .toLocaleString()
  return (
    <div>
      {/* @ts-ignore */}
      {fields.map((field, index) => {
        // Watch if this expense is a service
        const isService = watch(`expenses.${index}.is_service`) || false;

        return (
          <div key={`expense-${field.id}-${index}`} className='border rounded-lg p-4 mt-5 bg-gray-50'>
            <div className='grid grid-cols-2 gap-5'>
              {/* Expense Type - First field for better UX */}
              <FormField
                control={control}
                name={`expenses.${index}.is_service`}
                render={({ field }) => (
                  <FormItem className='flex flex-col gap-0 mb-1.5'>
                    <FormLabel>Expense Type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const newIsService = value === 'true';
                        field.onChange(newIsService);

                        // Clear selected item when expense type changes
                        // to prevent showing a consumable in service mode or vice versa
                        setValue(`expenses.${index}.item`, '');
                        setValue(`expenses.${index}.uom`, '');
                      }}
                      value={field.value ? 'true' : 'false'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="false">Regular Item</SelectItem>
                        <SelectItem value="true">Service/Personnel</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description/Item Name - Second field, filtered by expense type */}
              <FormField
                control={control}
                name={`expenses.${index}.item`}
                render={({ field }) => {
                  const { value, onChange } = field;

                  // Determine which items to show based on expense type
                  const currentItemsOptions = isService ? serviceItemsOptions : regularItemsOptions;
                  const currentItemsLoading = isService ? servicesLoading : regularItemsLoading;
                  const currentItemsError = isService ? servicesError : regularItemsError;
                  const itemTypeLabel = isService ? "service items" : "regular items";

                  return (
                    <FormItem className='flex flex-col gap-0 mb-1.5'>
                      <FormLabel>
                        Description/Item Name
                        <span className='text-red-500 ' title='required'>
                          *
                        </span>
                      </FormLabel>
                      <Select
                        onValueChange={(selectedValue) => {
                          onChange(selectedValue);
                          // Auto-populate UOM when item is selected
                          const selectedItem = itemsLookup[selectedValue];
                          if (selectedItem && selectedItem.uom) {
                            setValue(`expenses.${index}.uom`, selectedItem.uom);
                          }
                        }}
                        value={value}
                        defaultValue={value}
                        disabled={currentItemsLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={
                              currentItemsLoading ? `Loading ${itemTypeLabel}...` :
                              currentItemsError ? `Error loading ${itemTypeLabel}` :
                              currentItemsOptions.length === 0 ? `No ${itemTypeLabel} available` :
                              `Select a ${isService ? 'service' : 'item'}`
                            } />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currentItemsOptions.length > 0 ? (
                            currentItemsOptions.map((item) => (
                              <SelectItem
                                value={item.value as string}
                                key={item.value as string}
                              >
                                {item.label}
                              </SelectItem>
                            ))
                          ) : !currentItemsLoading ? (
                            <SelectItem value="no-items" disabled>
                              No {itemTypeLabel} available
                            </SelectItem>
                          ) : null}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      {currentItemsError && (
                        <p className="text-red-500 text-xs mt-1">
                          Error loading {itemTypeLabel}: {currentItemsError.message || 'Unknown error'}
                        </p>
                      )}
                      {isService && serviceItemsOptions.length === 0 && !servicesLoading && (
                        <p className="text-amber-600 text-xs mt-1">
                          💡 Create service items in Config → Items with Parent Category = "Services"
                        </p>
                      )}
                    </FormItem>
                  );
                }}
              />

              {/* Common Fields */}
              <FormInput
                label={isService ? '# of Persons' : 'Quantity'}
                name={`expenses.${index}.quantity`}
                type='number'
                required
              />

              <FormInput
                label='Unit Cost'
                name={`expenses.${index}.unit_cost`}
                type='number'
                step="0.01"
                required
              />

              {/* Conditional Fields Based on Type */}
              {isService && (
                <>
                  <FormInput
                    label='Duration'
                    name={`expenses.${index}.duration`}
                    type='number'
                    placeholder='e.g., 1, 3, 6, 12'
                  />

                  <FormField
                    control={control}
                    name={`expenses.${index}.duration_unit`}
                    render={({ field }) => (
                      <FormItem className='flex flex-col gap-0 mb-1.5'>
                        <FormLabel>Duration Unit</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || 'month'}
                          defaultValue='month'
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="day">Day(s)</SelectItem>
                            <SelectItem value="week">Week(s)</SelectItem>
                            <SelectItem value="month">Month(s)</SelectItem>
                            <SelectItem value="year">Year(s)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormInput
                    label='# of Facilities'
                    name={`expenses.${index}.num_of_facility`}
                    type='number'
                    placeholder='Default: 1'
                  />
                </>
              )}

              <FormInput
                label='UOM (Unit of Measure)'
                name={`expenses.${index}.uom`}
                type='text'
                placeholder='Auto-populated from item'
                disabled
              />

              <div className='flex-col flex gap-5'>
                <FormInput
                  label='Total Cost'
                  name={`expenses.${index}.total_cost`}
                  type='number'
                  className='col-span-2 font-bold text-lg'
                  disabled
                />
                <Button
                  type='button'
                  variant='destructive'
                  className='w-fit'
                  onClick={() => remove(index)}
                >
                  <MinusCircle className='mr-2' />
                  Remove
                </Button>
              </div>
            </div>

            {/* Calculation Info */}
            <div className='mt-2 text-xs text-gray-600 italic'>
              {isService
                ? '💡 Calculation: # of Persons × # of Months × # of Facilities × Unit Cost'
                : '💡 Calculation: Quantity × Unit Cost × Frequency'}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExpensesForm;
