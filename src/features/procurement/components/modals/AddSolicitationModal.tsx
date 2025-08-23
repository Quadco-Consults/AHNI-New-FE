"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import FormTextArea from "@/components/FormTextArea";
// TODO: Add create/update functions to solicitationEvaluationCriteriaController
// import { 
//   useCreateSolicitationEvaluationCriteriaManager,
//   useUpdateSolicitationEvaluationCriteriaManager 
// } from "@/features/procurement/controllers/solicitationEvaluationCriteriaController";
import {
  SolicitationCriteriaResultsData,
} from "@/features/procurement/types/solicitation-criteria";
import { z } from "zod";

// Define schema locally since it's not in the types file
const SolicitationEvaluationCriteriaSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type TSolicitationEvaluationCriteriaFormValues = z.infer<typeof SolicitationEvaluationCriteriaSchema>;

interface AddSolicitationModalProps {
  data?: SolicitationCriteriaResultsData;
  isUpdate?: boolean;
  onClose?: () => void;
}

const AddSolicitationModal = ({ data, isUpdate, onClose }: AddSolicitationModalProps) => {
  const form = useForm<TSolicitationEvaluationCriteriaFormValues>({
    resolver: zodResolver(SolicitationEvaluationCriteriaSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
    },
  });

  // TODO: Implement solicitation criteria controllers
  const isLoading = false;
  const updateLoading = false;

  const onSubmit: SubmitHandler<TSolicitationEvaluationCriteriaFormValues> = async (formData) => {
    try {
      if (isUpdate && data?.id) {
        // TODO: Implement actual API call
        console.log("Updating solicitation criteria:", { id: data.id, ...formData });
        toast.success("Solicitation Criteria updated successfully");
      } else {
        // TODO: Implement actual API call
        console.log("Creating solicitation criteria:", formData);
        toast.success("Solicitation Criteria added successfully");
      }
      onClose?.();
      form.reset();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <CardContent>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-7"
        >
          <FormInput
            label="Name"
            name="name"
            placeholder="Enter Name"
            required
          />

          <FormTextArea
            label="Description"
            name="description"
            placeholder="Enter Description"
          />
          
          <div className="flex justify-start gap-4">
            <FormButton loading={isLoading || updateLoading}>
              Save
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddSolicitationModal;