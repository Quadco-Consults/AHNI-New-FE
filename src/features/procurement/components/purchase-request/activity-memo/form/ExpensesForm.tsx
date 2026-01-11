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

  const { data: item, isLoading: itemsLoading, error: itemsError } = useGetAllItems({
    page: 1,
    size: 2000000,
  });

  // Debug console.log commented to prevent render loops
  // console.log("Items API response:", item);
  // console.log("Items loading:", itemsLoading);
  // console.log("Items error:", itemsError);

  // Map consumables data to options - try multiple data structure patterns
  const itemsOptions = item?.data?.results?.map(({ name, id, uom }) => ({
    label: name,
    value: id,
    uom: uom,
  })) || item?.results?.map(({ name, id, uom }) => ({
    label: name,
    value: id,
    uom: uom,
  })) || [];

  // Create a lookup map for item details
  const itemsLookup = item?.data?.results?.reduce((acc: any, item: any) => {
    acc[item.id] = item;
    return acc;
  }, {}) || item?.results?.reduce((acc: any, item: any) => {
    acc[item.id] = item;
    return acc;
  }, {}) || {};
  // Watch all expenses for calculation
  const watchedExpenses = watch('expenses') || [];

  // Update total costs when quantities or unit costs change
  React.useEffect(() => {
    watchedExpenses.forEach((expense: any, index: number) => {
      const quantity = parseFloat(expense?.quantity || 0);
      const unitCost = parseFloat(expense?.unit_cost || 0);
      const totalCost = quantity * unitCost;

      // Debug console.log commented to prevent render loops
      // console.log(`💰 Expense ${index} calculation:`, {
      //   quantity,
      //   unitCost,
      //   totalCost,
      //   currentTotal: expense?.total_cost
      // });

      // Only update if the total cost has changed to avoid infinite loops
      if (expense?.total_cost !== totalCost) {
        // console.log(`📝 Updating total cost for expense ${index}:`, totalCost);
        setValue(`expenses.${index}.total_cost`, totalCost || 0);
      }
    });
  }, [watchedExpenses, setValue]);

  // optimization for number spliting is required use: .toLocaleString()
  return (
    <div>
      {/* @ts-ignore */}
      {fields.map((field, index) => {
        // Note: Total cost is calculated in useEffect above

        return (
          <div key={`expense-${field.id}-${index}`} className='grid grid-cols-2 gap-5 mt-5'>
            <FormField
              control={control}
              name={`expenses.${index}.item`}
              render={({ field }) => {
                const { value, onChange } = field;

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
                      disabled={itemsLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            itemsLoading ? "Loading items..." :
                            itemsError ? "Error loading items" :
                            itemsOptions.length === 0 ? "No items available" :
                            "Select an item"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {itemsOptions.length > 0 ? (
                          itemsOptions.map((item) => (
                            <SelectItem
                              value={item.value as string}
                              key={item.value as string}
                            >
                              {item.label}
                            </SelectItem>
                          ))
                        ) : !itemsLoading ? (
                          <SelectItem value="no-items" disabled>
                            No items available
                          </SelectItem>
                        ) : null}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    {itemsError && (
                      <p className="text-red-500 text-xs mt-1">
                        Error loading items: {itemsError.message || 'Unknown error'}
                      </p>
                    )}
                  </FormItem>
                );
              }}
            />
            <FormInput
              label='UOM (Unit of Measure)'
              name={`expenses.${index}.uom`}
              type='text'
              placeholder='Auto-populated from item'
              disabled
            />
            <FormInput
              label='Quantity'
              name={`expenses.${index}.quantity`}
              type='text'
              required
            />

            <FormInput
              label='Unit Cost'
              name={`expenses.${index}.unit_cost`}
              type='text'
            />
            <div className='flex-col flex gap-5'>
              <FormInput
                label='Total Cost'
                name={`expenses.${index}.total_cost`}
                type='text'
                className='col-span-2'
                disabled
              />
              <Button
                type='button'
                className='w-fit'
                onClick={() => remove(index)}
              >
                <MinusCircle className='mr-2' />
                Remove
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExpensesForm;
