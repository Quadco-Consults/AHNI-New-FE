"use client";

import { Button } from "components/ui/button";
import { useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import { useRouter } from "next/navigation";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import ProcurementPlanLayout from "../ProcurementPlanLayout";
import FormTextArea from "components/atoms/FormTextArea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProcurementMilestoneSchema } from "@/features/procurement/types/procurement-validator";
import ProcurementPlanAPI from "@/features/procurement/controllers/procurementPlanController";
import { toast } from "sonner";
import { RouteEnum } from "constants/RouterConstants";

const ProcurementMilestonesForm = () => {
  const router = useRouter();

  const { createProcurementPlanMutation, isLoading } =
    ProcurementPlanAPI.useCreateProcurementPlan();

  const form = useForm<z.infer<typeof ProcurementMilestoneSchema>>({
    resolver: zodResolver(ProcurementMilestoneSchema),
    defaultValues: {
      milestone_name: "",
      milestone_description: "",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: z.infer<typeof ProcurementMilestoneSchema>) => {
    const formData = {
      ...data,
      ...JSON.parse(localStorage.getItem("procurementPlan") as any),
    };
    try {
      await createProcurementPlanMutation(formData)();
      toast.success("Successfully created.");
      localStorage.removeItem("procurementPlan");
      sessionStorage.removeItem("procurementPlanSteps");
      router.push(RouteEnum.PROCUREMENT_PLAN);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <ProcurementPlanLayout>
      <section className="w-full space-y-8">
        <h3 className="text-lg font-bold">Procurement Milestones</h3>
        <Form {...form}>
          <form className="space-y-6 " onSubmit={handleSubmit(onSubmit)}>
            <FormInput name="milestone_name" label="Milestone Name" />
            <FormTextArea
              name="milestone_description"
              label="Milestone Description"
            />

            <div className="w-full flex items-center justify-end gap-5">
              <Button
                type="button"
                className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <FormButton
                type="submit"
                loading={isLoading}
                disabled={isLoading}
              >
                Finish
              </FormButton>
            </div>
          </form>
        </Form>
      </section>
    </ProcurementPlanLayout>
  );
};

export default ProcurementMilestonesForm;
