import FormButton from "atoms/FormButton";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { FormEvent, useState } from "react";
import { usePatchWorkPlanTrackerMutation } from "services/programsApi/activity-tracker";
import { toast } from "sonner";
import { closeDialog } from "store/ui";

export default function ChangeProcurementTrackerRemarkModal() {
  const { dailog } = useAppSelector((state) => state.ui);

  const id = dailog?.dialogProps?.id as string;

  const [inputValue, setInputValue] = useState("");

  const dispatch = useAppDispatch();

  const [patchWorkPlanTracker, { isLoading }] =
    usePatchWorkPlanTrackerMutation();

  const handleChange = (value: string) => {
    setInputValue(value);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await patchWorkPlanTracker({
        id,
        // @ts-ignore
        body: { inputValue },
      }).unwrap();

      dispatch(closeDialog());
      toast.success("Updated Risk Status");
    } catch (error: any) {
      toast.error(error.data.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={onSubmit} className='w-full space-y-6'>
      <h2 className='text-lg font-bold'>Change Procurement Tracker Remark</h2>
      <div className='space-y-3'>
        <label htmlFor='remark'>Remark</label>
        <textarea
          name='remark'
          placeholder='Leave a Remark'
          required
          className='w-full border p-2'
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      <div className='flex justify-end'>
        <FormButton type='submit' loading={isLoading}>
          Submit
        </FormButton>
      </div>
    </form>
  );
}
