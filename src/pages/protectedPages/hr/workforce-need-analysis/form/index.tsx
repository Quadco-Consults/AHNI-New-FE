// import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import Card from "components/shared/Card";
// import AddSquareIcon from "components/icons/AddSquareIcon";
import GoBack from "components/shared/GoBack";

// import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { SelectContent } from "components/ui/select";
import { Separator } from "components/ui/separator";
import { HrRoutes } from "constants/RouterConstants";

import { UploadIcon } from "lucide-react";
// import { ItemsResultsData } from "definations/configs/itmes";
// import { SampleMemoSchema } from "definations/procurement-validator";
// import { MinusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

// import ItemsAPI from "services/configs/items";

// import PurchaseRequestAPI from "services/procurementApi/purchase-request";
// import { toast } from "sonner";
// import { z } from "zod";

const CreateActivityMemo = () => {
  const form = useForm<any>({
    // resolver: zodResolver(),
    defaultValues: {},
  });

  const navigate = useNavigate();

  const { handleSubmit } = form;

  //   const { fields, append, remove } = useFieldArray({
  //     control,
  //     name: "expenses",
  //   });

  const onSubmit = async (data: any) => {
    console.log({ data });
    navigate(HrRoutes.WORKFORCE_NEED_ANALYSIS);
  };
  const lon = form.getValues();

  console.log({ lon });

  return (
    <div className=''>
      <GoBack />

      <div className='pt-20'>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6'
          >
            <div className='grid gap-5'>
              <FormSelect label='Position' name='position' required>
                <SelectContent>
                  {/* {departmentsIsLoading ? (
                    <LoadingSpinner />
                  ) : (
                    departments?.results?.map(
                      (department: DepartmentsResultsData) => (
                        <SelectItem key={department?.id} value={department?.id}>
                          {department?.name}
                        </SelectItem>
                      )
                    )
                  )} */}
                </SelectContent>
              </FormSelect>{" "}
              <FormSelect label='Location' name='location' required>
                <SelectContent>
                  {/* {departmentsIsLoading ? (
                    <LoadingSpinner />
                  ) : (
                    departments?.results?.map(
                      (department: DepartmentsResultsData) => (
                        <SelectItem key={department?.id} value={department?.id}>
                          {department?.name}
                        </SelectItem>
                      )
                    )
                  )} */}
                </SelectContent>
              </FormSelect>{" "}
            </div>
            <Card>
              <span className='text-p'>Staff Information</span>
              <div className='grid grid-cols-3 gap-5'>
                <FormInput
                  label='Current Staff'
                  name='current_staff'
                  type='text'
                  required
                />
                <FormInput
                  label='Required Staff Based on WISN'
                  name='required_staff_based_on_WISN'
                  type='text'
                  required
                />
                <FormInput
                  label='Shortage or excess'
                  name='shortage_or_excess'
                  type='text'
                  required
                />
              </div>
              <div className='grid grid-cols-3 gap-5 mt-8'>
                <FormInput
                  label='Workforce Problem'
                  name='workforce_problem'
                  type='text'
                  required
                />
                <FormInput
                  label='WISN Ratio'
                  name='wisn_ratio'
                  type='text'
                  required
                />
                <FormInput
                  label='Workload Pressure'
                  name='workload_pressure'
                  type='text'
                  required
                />
              </div>
            </Card>

            <Separator className='my-4' />
            <div className='flex justify-end'>
              <FormButton
                // loading={isLoading}
                // disabled={isLoading}
                type='submit'
                className='flex items-center justify-center gap-2'
              >
                <UploadIcon />
                Submit
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateActivityMemo;
