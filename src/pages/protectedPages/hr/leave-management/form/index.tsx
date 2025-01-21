// import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";

import GoBack from "components/shared/GoBack";

import { Form } from "components/ui/form";
import { SelectContent } from "components/ui/select";

import FormTextArea from "atoms/FormTextArea";
import { HrRoutes } from "constants/RouterConstants";

import { UploadIcon } from "lucide-react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

// import ItemsAPI from "services/configs/items";

// import PurchaseRequestAPI from "services/procurementApi/purchase-request";
// import { toast } from "sonner";
// import { z } from "zod";

const LeaveForm = () => {
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
    navigate(HrRoutes.LEAVE_MANAGEMENT);
  };

  return (
    <div className=''>
      <GoBack />

      <div className='pt-10'>
        <h3 className='text-[18px] pb-10'>New Leave Submission</h3>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6'
          >
            <div className='grid gap-5'>
              <FormSelect label='Leave Type' name='type' required>
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
              <div>
                <FormTextArea label='Reason' name='reason' required />
              </div>
              <div className='grid grid-cols-3 gap-5'>
                <FormInput label='From' name='from' type='date' required />
                <FormInput label='To' name='to' type='date' required />
              </div>
            </div>
            <FormSelect label='Nimber of days' name='days' required>
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
            <div className='flex justify-end gap-2'>
              <FormButton
                // loading={isLoading}
                // disabled={isLoading}
                type='button'
                className='flex items-center justify-center gap-2 bg-alternate text-primary'
                onClick={() => navigate(HrRoutes.GRIEVANCE_MANAGEMENT)}
              >
                Cancel
              </FormButton>
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

export default LeaveForm;
