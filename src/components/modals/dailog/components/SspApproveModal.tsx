import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { Form } from "components/ui/form";
import { cn } from "lib/utils";
import { Angry, Smile } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const SspApproveModal = () => {
  const [status, setStatus] = useState("");

  const form = useForm({
    defaultValues: {
      title: [
        {
          descriptionOfItems: "",
          numberOfPersons: "",
          numberOfDays: "",
          fco: "",
          unitCost: "",
          total: "",
        },
      ],
    },
  });

  const { handleSubmit } = form;

  const onSubmit = (data: any) => {
    console.table(">>>>>>>>>>>>>>>>", data);
  };

  return (
    <div className="w-full">
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

          <FormInput name="approve" label="Approved by" />
          <FormInput name="review" label="Reviewed by" />

          <FormButton className="w-1/4 mx-auto">Submit</FormButton>
        </form>
      </Form>
    </div>
  );
};

export default SspApproveModal;
