"use client";

import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { MinusCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";

const GoalForm = ({ fields, remove }: { fields: any; remove: any }) => {
  return (
    <div>
      {/* @ts-ignore */}
      {fields.map((field, index) => {
        return (
          <div key={field.id}>
            <div className='grid grid-cols-2 gap-5 mt-5'>
              <FormInput
                label='Goal'
                name={`goal.${index}.goal`}
                type='text'
                required
              />
              <FormInput
                label='Weight'
                name={`goal.${index}.weight`}
                type='text'
              />
            </div>
            <div className='grid grid-cols-2 gap-5 mt-5 items-center'>
              <FormInput
                label='Competency'
                name={`goal.${index}.competency`}
                type='text'
                required
              />
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
