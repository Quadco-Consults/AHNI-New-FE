"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
// TODO: Add update function to procurementTrackerController
// import { useUpdateProcurementTrackerManager } from "@/features/procurement/controllers/procurementTrackerController";

interface ChangeProcurementTrackerRemarkModalProps {
  id: string;
  onClose?: () => void;
}

export default function ChangeProcurementTrackerRemarkModal({ 
  id, 
  onClose 
}: ChangeProcurementTrackerRemarkModalProps) {
  const [inputValue, setInputValue] = useState("");

  // TODO: Implement procurement tracker update controller
  const isLoading = false;

  const handleChange = (value: string) => {
    setInputValue(value);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // TODO: Implement actual API call
      console.log("Updating procurement tracker remark:", { id, remark: inputValue });
      toast.success("Procurement tracker remark updated successfully");
      onClose?.();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full space-y-6">
      <h2 className="text-lg font-bold">Change Procurement Tracker Remark</h2>
      <div className="space-y-3">
        <label htmlFor="remark">Remark</label>
        <textarea
          name="remark"
          placeholder="Leave a Remark"
          required
          className="w-full border p-2 rounded-md border-gray-300 focus:border-olive focus:outline-none"
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <FormButton type="submit" loading={isLoading}>
          Submit
        </FormButton>
      </div>
    </form>
  );
}