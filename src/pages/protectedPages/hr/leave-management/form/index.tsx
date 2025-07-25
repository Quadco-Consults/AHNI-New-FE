// import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";

import GoBack from "components/shared/GoBack";

import { Form } from "components/ui/form";
import { SelectContent, SelectItem } from "components/ui/select";

import FormTextArea from "atoms/FormTextArea";
import { HrRoutes } from "constants/RouterConstants";

import { UploadIcon } from "lucide-react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import LeaveRequestAPI from "services/hrApi/hr-leave-request";
import { toast } from "sonner";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";

// import ItemsAPI from "services/configs/items";

// import PurchaseRequestAPI from "services/procurementApi/purchase-request";
// import { toast } from "sonner";
// import { z } from "zod";

const LeaveForm = () => {
  // const { data: leaveTypes, isLoading: leaveTypesIsLoading } =
  //     useLeaveTypesQuery({});
  const dispatch = useAppDispatch();

  const [createLeaveRequest, { isLoading }] =
    LeaveRequestAPI.useCreateLeaveRequestMutation();

  const leaveTypes = [
    "Sick Leave",
    "Annual Leave",
    "Maternity",
    "Paternity",
  ].map((option) => ({
    label: option,
    value: option,
  }));

  let daysOptions = Array.from({ length: 30 }, (_, index) => index + 1).map(
    (option) => ({
      label: option,
      value: `${option}`,
    })
  );

  const form = useForm<any>({
    // resolver: zodResolver(),
    defaultValues: {},
  });

  const navigate = useNavigate();

  const { handleSubmit, getValues } = form;
  const { type } = getValues();

  //   const { fields, append, remove } = useFieldArray({
  //     control,
  //     name: "expenses",
  //   });

  const onSubmit = async (data: any) => {
    const formData = {
      type: data.type,
      reason: data.reason,
      from_day: data.from,
      to_day: data.to,
      days: data.days,
    };
    try {
      await createLeaveRequest(formData).unwrap();
      dispatch(
        openDialog({
          type: DialogType.HrSuccessModal,
          dialogProps: {
            label: "Request Created",
          },
        })
      );
    } catch (error) {
      toast.error("Something went wrong");
    }
    console.log({ data });
    // navigate(HrRoutes.LEAVE_MANAGEMENT_LEAVE_LIST);
  };

  useEffect(() => {
    console.log("hshs", type);

    const days = Array.from({ length: 30 }, (_, index) => index + 1);

    daysOptions = days.map((option) => ({
      label: option,
      value: `${option}`,
    }));
  }, type);

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
                  {leaveTypes?.map((leave) => (
                    <SelectItem key={leave.label} value={leave.value}>
                      {leave.label}
                    </SelectItem>
                  ))}
                  {/* {leaveTypesIsLoading ? (
                    <LoadingSpinner />
                  ) : (
                    leaveTypes?.results?.map(
                      (leave: leaveTypesData) => (
                        <SelectItem key={leave?.id} value={leave?.id}>
                          {leave?.name}
                        </SelectItem>
                      )
                    )
                  )} */}
                </SelectContent>
              </FormSelect>

              <div>
                <FormTextArea label='Reason' name='reason' required />
              </div>
              <div className='grid grid-cols-3 gap-5'>
                <FormInput label='From' name='from' type='date' required />
                <FormInput label='To' name='to' type='date' required />
              </div>
            </div>
            <FormSelect label='Number of days' name='days' required>
              <SelectContent>
                {daysOptions?.map((day) => (
                  <SelectItem key={day.label} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
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
                loading={isLoading}
                disabled={isLoading}
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
