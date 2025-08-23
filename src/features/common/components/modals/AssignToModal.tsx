"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { usePatchWorkPlanTracker } from "@/features/programs/controllers/activityTrackerController";

interface AssignToModalProps {
  id: string;
  status?: string;
  onClose?: () => void;
}

export default function AssignToModal({ id, status: prevStatus, onClose }: AssignToModalProps) {
  const [status, setStatus] = useState(prevStatus || "");

  const { patchWorkPlanTracker, isLoading } = usePatchWorkPlanTracker(id);
  const { data: users } = useGetAllUsers({
    page: 1,
    size: 100,
    search: "",
  });

  const usersOption = users?.data?.results?.map((el: any) => ({
    value: el?.id,
    label: `${el?.first_name} ${el?.last_name}`,
  })) || [];

  const handleChangeStatus = (value: string) => {
    setStatus(value);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await patchWorkPlanTracker({ status });
      toast.success("User assigned successfully");
      onClose?.();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full space-y-6">
      <h2 className="text-lg font-bold">Assign to</h2>

      <Select
        value={status}
        defaultValue={status}
        onValueChange={handleChangeStatus}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select User" />
        </SelectTrigger>

        <SelectContent className="max-h-[300px] overflow-auto">
          {usersOption?.map((user: any) => (
            <SelectItem key={user.label} value={user.value}>
              {user.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex justify-end">
        <FormButton type="submit" loading={isLoading}>
          Submit
        </FormButton>
      </div>
    </form>
  );
}