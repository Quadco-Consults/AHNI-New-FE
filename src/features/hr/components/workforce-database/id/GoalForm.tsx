"use client";

import FormInput from "@/components/FormInput";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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

const GoalForm = ({ fields, remove }: { fields: any; remove: any }) => {
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
        return (
          <div key={field.id}>
            <div className='grid grid-cols-2 gap-5 mt-5'>
              <FormInput
                label='Goal'
                name={`goal.${index}.quantity`}
                type='text'
                required
              />
              <FormInput
                label='Weight'
                name={`goal.${index}.num_of_days`}
                type='text'
              />
            </div>
            <div className='grid grid-cols-2 gap-5 mt-5 items-center'>
              {itemsOptions && (
                <>
                  <FormField
                    control={control}
                    name={`goal.${index}.item`}
                    render={({ field }) => {
                      const { value, onChange } = field;

                      return (
                        <FormItem className='flex flex-col gap-0 mb-1.5 h-full justify-between'>
                          <FormLabel>
                            Goal group
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
                        </FormItem>
                      );
                    }}
                  />
                  {/*  */}
                </>
              )}
              <Button
                type='button'
                className='rounded-full'
                size={"icon"}
                onClick={() => remove(index)}
                variant={"custom"}
              >
                <MinusCircle size={20} />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GoalForm;
