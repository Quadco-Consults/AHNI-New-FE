"use client";

import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormTextArea from "@/components/FormTextArea";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Angry, Smile } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ApprovalModalProps {
  label?: string;
  onSubmit?: (data: { approved_by: string; comment: string; status: string }) => void;
  onClose?: () => void;
}

const ApprovalModal = ({ label, onSubmit, onClose }: ApprovalModalProps) => {
  const [status, setStatus] = useState("");

  const form = useForm({
    defaultValues: {
      approved_by: "",
      comment: "",
    },
  });

  const { handleSubmit } = form;

  const handleFormSubmit = (data: any) => {
    const formData = {
      ...data,
      status,
    };
    console.table(">>>>>>>>>>>>>>>>", formData);
    if (onSubmit) {
      onSubmit(formData);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="w-full space-y-6">
      <h4 className="text-center font-semibold text-lg">{label}</h4>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-5">
            <button
              type="button"
              onClick={() => setStatus("Approve")}
              className={cn(
                "p-5 rounded-lg text-center border border-green-500 text-green-500",
                status === "Approve" && "border-2 bg-green-50"
              )}
            >
              <Smile className="mx-auto" />
              <h4>Approve</h4>
            </button>
            <button
              type="button"
              onClick={() => setStatus("Reject")}
              className={cn(
                "p-5 rounded-lg text-center border border-red-500 text-red-500",
                status === "Reject" && "border-2 bg-red-50"
              )}
            >
              <Angry className="mx-auto" />
              <h4>Reject</h4>
            </button>
          </div>

          <FormInput name="approved_by" label="Approved by" />
          <FormTextArea name="comment" label="Comment" />

          <FormButton className="w-1/4 mx-auto">Done</FormButton>
        </form>
      </Form>
    </div>
  );
};

export default ApprovalModal;