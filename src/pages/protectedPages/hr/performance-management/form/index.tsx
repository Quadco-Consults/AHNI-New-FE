import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";

import GoBack from "components/shared/GoBack";

import { Form } from "components/ui/form";
import { SelectContent } from "components/ui/select";

import { HrRoutes } from "constants/RouterConstants";

import { MinusCircle } from "lucide-react";

import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

// import ItemsAPI from "services/configs/items";

// import PurchaseRequestAPI from "services/procurementApi/purchase-request";
// import { toast } from "sonner";
// import { z } from "zod";

const NewPerformance = () => {
  const form = useForm<any>({
    // resolver: zodResolver(),
    defaultValues: {},
  });

  const { control, handleSubmit } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "evaluators", // The name of the array in the form data
  });
  const navigate = useNavigate();

  //   const { fields, append, remove } = useFieldArray({
  //     control,
  //     name: "expenses",
  //   });

  const onSubmit = async (data: any) => {
    console.log({ data });

    navigate(HrRoutes.PERFORMANCE_MANAGEMENT);
  };

  return (
    <div className=''>
      <GoBack />

      <div className='pt-10'>
        <h3 className='text-[18px] pb-10'>
          Initiate New Performance Asessment
        </h3>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6'
          >
            <div className=''>
              <h3 className='text-yellow-darker'>Appraisal Information</h3>
            </div>

            <div className='grid gap-5 grid-cols-2'>
              <FormInput
                label='Description'
                name='description'
                type='text'
                required
              />
              <FormInput
                label='Cycle Name'
                name='cycle_name'
                type='text'
                required
              />
            </div>
            <div className=''>
              <h3 className='text-yellow-darker'>Employee Information</h3>
            </div>

            <div className='grid gap-5'>
              <FormSelect
                label='Select Employee'
                name='select_employee'
                required
              >
                <SelectContent></SelectContent>
              </FormSelect>{" "}
            </div>
            <div className=''>
              <h3 className='text-yellow-darker'>Evaluators</h3>
            </div>

            <div className='grid gap-5'>
              {fields.map((field, index) => (
                <div key={field.id} className='flex gap-4 items-center'>
                  {/* AHNI STAFF for evaluators */}
                  <FormSelect
                    label={`Select Evaluator ${index + 1}`}
                    name={`evaluators.${index}.evaluator`}
                    required
                  >
                    <SelectContent></SelectContent>
                  </FormSelect>
                  <FormButton
                    type='button'
                    className='text-red-500 bg-transparent'
                    onClick={() => remove(index)}
                  >
                    <MinusCircle />
                  </FormButton>
                </div>
              ))}{" "}
              <FormButton
                type='button'
                className='text-primary bg-alternate'
                onClick={
                  () => append({ evaluator: "" }) // Add a new empty evaluator
                }
              >
                Add Evaluator
              </FormButton>
            </div>
            <div className='flex justify-end gap-2'>
              <FormButton
                // loading={isLoading}
                // disabled={isLoading}
                type='button'
                className='flex items-center justify-center gap-2 text-primary bg-alternate'
                onClick={() => navigate(HrRoutes.PERFORMANCE_MANAGEMENT)}
              >
                Cancel
              </FormButton>
              <FormButton
                // loading={isLoading}
                // disabled={isLoading}
                type='submit'
                className='flex items-center justify-center gap-2'
              >
                Create
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewPerformance;
