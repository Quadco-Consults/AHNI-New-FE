"use client";

import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";

import GoBack from "components/GoBack";

import { Form } from "components/ui/form";
import { SelectContent } from "components/ui/select";

import { HrRoutes } from "constants/RouterConstants";

import { MinusCircle } from "lucide-react";
import { useMemo } from "react";

import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useGetEmployeeOnboardings } from "@/features/hr/controllers/employeeOnboardingController";
import { useCreatePerformanceAssesment } from "@/features/hr/controllers/hrPerformanceAssessmentController";
import { toast } from "sonner";

// import ItemsAPI from "@/features/modules/controllers/config/itemsController";

// import PurchaseRequestAPI from "@/features/procurementApi/purchase-requestController";
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
  const router = useRouter();

  const cycleOptions = useMemo(
    () =>
      ["365 Appraisal Cycle", "Probationary Cycle"].map((title) => ({
        label: title,
        value: title,
      })),
    []
  );

  const { data: user } = useGetAllUsers({
    page: 1,
    size: 2000000,
    search: "",
  });

  const { data: employees, isLoading: isLoadingEmployees } = useGetEmployeeOnboardings({
    page: 1,
    size: 2000000,
  });

  const { createPerformanceAssesment } = useCreatePerformanceAssesment();

  const userOptions = useMemo(
    () =>
      user?.data.results.map(({ first_name, last_name, id }) => ({
        label: `${first_name} ${last_name}`,
        value: id,
      })),
    [user]
  );

  const employeeOptions = useMemo(
    () => {
      if (!employees?.data?.results) {
        console.log("No employee data available:", employees);
        return [];
      }
      return employees.data.results.map(
        ({ legal_firstname, legal_lastname, id }) => ({
          label: `${legal_firstname} ${legal_lastname}`,
          value: id,
        })
      );
    },
    [employees]
  );

  console.log({ employees, user, employeeOptions });

  const onSubmit = async (data: any) => {
    console.log({ data });
    try {
      // Create new advertisement
      await createPerformanceAssesment(data);
      toast.success("Job advertisement created successfully");
    } catch (e) {
      toast.error("Something went wrong");
    }

    //
    // router.push(HrRoutes.PERFORMANCE_MANAGEMENT);
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

              <FormSelect
                label='Cycle Name'
                name='cycle_name'
                placeholder='Select Cycle'
                required
                options={cycleOptions}
              />
            </div>
            <div className=''>
              <h3 className='text-yellow-darker'>Employee Information</h3>
            </div>

            <div className='grid gap-5'>
              <FormSelect
                label='Select Employee'
                name='employee'
                required
                placeholder={isLoadingEmployees ? "Loading employees..." : "Select Employee"}
                options={employeeOptions}
              />
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
                    options={userOptions}
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
                onClick={() => router.push(HrRoutes.PERFORMANCE_MANAGEMENT)}
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
