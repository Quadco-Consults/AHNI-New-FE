import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormTextArea from "atoms/FormTextArea";
import { Form } from "components/ui/form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { cn } from "lib/utils";
import { Angry, Smile } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { closeDialog, dailogSelector } from "store/ui";

const ApprovalModal = () => {
  const [status, setStatus] = useState("");
  const dispatch = useAppDispatch();

  const { dialogProps } = useAppSelector(dailogSelector);
  const label = dialogProps?.label;

  const form = useForm({
    defaultValues: {
      approved_by: "",
      comment: "",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = (data: any) => {
    console.table(">>>>>>>>>>>>>>>>", data);
    dispatch(closeDialog());
  };

  return (
    <div className="w-full space-y-6">
      <h4 className="text-center font-semibold text-lg">{label}</h4>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-5">
            <button
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

          <FormInput name="approve_by" label="Approved by" />
          <FormTextArea name="comment" label="Comment" />

          <FormButton className="w-1/4 mx-auto">Done</FormButton>
        </form>
      </Form>
    </div>
  );
};

export default ApprovalModal;
