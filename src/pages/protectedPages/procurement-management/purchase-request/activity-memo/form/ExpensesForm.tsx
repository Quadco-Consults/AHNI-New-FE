import FormInput from "atoms/FormInput";

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
import { useGetAllItemsQuery } from "services/modules/config/item";

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
  const { data: item } = useGetAllItemsQuery({
    page: 1,
    size: 2000000,
  });

  const { control } = useFormContext();

  //   const { control, watch, setValue } = useFormContext();
  //   const { fields, remove } = useFieldArray({ control, name: "expenses" });

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
                            onChange(selectedValue); // Update the selected item value
                            // const selectedItem = item?.data?.results?.find(
                            //   (item) => item.id === selectedValue
                            // );

                            // if (selectedItem) {
                            //   // Update the unit cost field
                            //   setValue(
                            //     `expenses.${index}.unit_cost`,
                            //     selectedItem.ngn_cost || 0
                            //   );
                            // }
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
              disabled // Make this field readonly since it updates dynamically
            />
            <div className='mt-5 flex-col flex gap-5'>
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
