import FormButton from "atoms/FormButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { FormEvent, useState } from "react";
import { usePatchWorkPlanTrackerMutation } from "services/programsApi/activity-tracker";
import { toast } from "sonner";
import { closeDialog } from "store/ui";

const statusOptions = ["PENDING", "ONGOING", "COMPLETED", "CANCELED"].map(
  (option) => ({
    label: option,
    value: option,
  })
);

export default function ChangeProcurementTrackerStatusModal() {
  const { dailog } = useAppSelector((state) => state.ui);

  const id = dailog?.dialogProps?.id as string;
  const prevStatus = dailog?.dialogProps?.status as string;

  const [status, setStatus] = useState(prevStatus);

  const dispatch = useAppDispatch();

  const [patchWorkPlanTracker, { isLoading }] =
    usePatchWorkPlanTrackerMutation();

  const handleChangeStatus = (value: string) => {
    setStatus(value);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await patchWorkPlanTracker({
        id,
        body: { status },
      }).unwrap();

      dispatch(closeDialog());
      toast.success("Updated Risk Status");
    } catch (error: any) {
      toast.error(error.data.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={onSubmit} className='w-full space-y-6'>
      <h2 className='text-lg font-bold'>Change Procurement Tracker Status</h2>

      <Select
        value={status}
        defaultValue={status}
        onValueChange={handleChangeStatus}
      >
        <SelectTrigger>
          <SelectValue placeholder='Select Status' />
        </SelectTrigger>

        <SelectContent>
          {statusOptions?.map((status) => (
            <SelectItem key={status.label} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className='flex justify-end'>
        <FormButton type='submit' loading={isLoading}>
          Submit
        </FormButton>
      </div>
    </form>
  );
}
