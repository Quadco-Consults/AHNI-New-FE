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
import { usePatchWorkPlanTracker } from "@/features/programs/controllers/activityTrackerController";

const statusOptions = ["PENDING", "APPROVED"].map((option) => ({
  label: option,
  value: option,
}));

interface ChangeWorkPlanStatusModalProps {
  id: string;
  status?: string;
  onClose?: () => void;
}

export default function ChangeWorkPlanStatusModal({ 
  id, 
  status: prevStatus, 
  onClose 
}: ChangeWorkPlanStatusModalProps) {
  const [status, setStatus] = useState(prevStatus || "");

  const { patchWorkPlanTracker, isLoading } = usePatchWorkPlanTracker(id);

  const handleChangeStatus = (value: string) => {
    setStatus(value);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await patchWorkPlanTracker({ status });
      toast.success("Work plan status updated successfully");
      onClose?.();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full space-y-6">
      <h2 className="text-lg font-bold">
        Change Work Plan Tracker Status
      </h2>

      <Select
        value={status}
        defaultValue={status}
        onValueChange={handleChangeStatus}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Risk Status" />
        </SelectTrigger>

        <SelectContent>
          {statusOptions?.map((status) => (
            <SelectItem key={status.label} value={status.value}>
              {status.label}
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