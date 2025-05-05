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
import { useGetUsersQuery } from "services/usersAPI";
import { toast } from "sonner";
import { closeDialog } from "store/ui";

export default function AssignToModal() {
  const { dailog } = useAppSelector((state) => state.ui);

  const id = dailog?.dialogProps?.id as string;
  const prevStatus = dailog?.dialogProps?.status as string;

  const [status, setStatus] = useState(prevStatus);

  const dispatch = useAppDispatch();

  const [patchWorkPlanTracker, { isLoading }] =
    usePatchWorkPlanTrackerMutation();

  const { data: users } = useGetUsersQuery({});

  const usersOption =
    // @ts-ignore
    users?.data?.results?.map((el) => ({
      value: el?.id,
      label: `${el?.first_name} ${el?.last_name}`,
    })) || [];
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
      <h2 className='text-lg font-bold'>Assign to</h2>

      <Select
        value={status}
        defaultValue={status}
        onValueChange={handleChangeStatus}
      >
        <SelectTrigger>
          <SelectValue placeholder='Select User' />
        </SelectTrigger>

        <SelectContent className='max-h-[300px] overflow-auto'>
          {/* @ts-ignore */}
          {usersOption?.map((user) => (
            <SelectItem key={user.label} value={user.value}>
              {user.label}
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
