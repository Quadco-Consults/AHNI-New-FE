"use client";

import FormInput from "components/atoms/FormInput";

import { Button } from "components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
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

  const { data: item } = useGetAllItems({
    page: 1,
    size: 2000000,
  });

  //   // Map consumables data to options
  const itemsOptions = item?.data?.results?.map(({ name, id }) => ({
    label: name,
    value: id,
  }));
  // optimization for number spliting is required use: .toLocaleString()
  return (
    <div>
      {/* @ts-ignore */}
      {fields.map((field, index) => {
        const quantity = watch(`expenses.${index}.quantity`) || 0;
        const days = watch(`expenses.${index}.num_of_days`) || 0;
        const unitCost = watch(`expenses.${index}.unit_cost`) || 0;

        // Calculate total cost dynamically
        const totalCost = quantity * days * unitCost;

        setValue(`expenses.${index}.total_cost`, totalCost || 0);

        return (
          <div key={field.id} className='grid grid-cols-2 gap-5 mt-5'>
            {itemsOptions && (
              <>
                <FormField
                  control={control}
                  name={`expenses.${index}.item`}
                  render={({ field }) => {
                    const { value, onChange } = field;

                    return (
                      <FormItem className='flex flex-col gap-0 mb-1.5'>
                        <FormLabel>
                          Expenses item
                          <span className='text-red-500 ' title='required'>
                            *
                          </span>
                        </FormLabel>
                        <Select
                          onValueChange={(selectedValue) => {
                            onChange(selectedValue);
                          }}
                          value={value}
                          defaultValue={value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {itemsOptions?.map((item) => {
                              return (
                                <SelectItem
                                  value={item.value as string}
                                  key={item.value as string}
                                >
                                  {item.label}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                {/*  */}
              </>
            )}
            <FormInput
              label='Quantity'
              name={`expenses.${index}.quantity`}
              type='text'
              required
            />
            <FormInput
              label='# of Days'
              name={`expenses.${index}.num_of_days`}
              type='text'
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
                value={totalCost}
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
