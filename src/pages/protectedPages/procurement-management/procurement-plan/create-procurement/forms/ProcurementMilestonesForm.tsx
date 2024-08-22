import { Button } from "components/ui/button";
import { useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import { useNavigate } from "react-router-dom";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import ProcurementPlanLayout from "../ProcurementPlanLayout";
import FormTextArea from "atoms/FormTextArea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProcurementMilestoneSchema } from "definations/procurement-validator";
import ProcurementPlanAPI from "services/procurementApi/procurement-plan";
import { toast } from "sonner";
import { RouteEnum } from "constants/RouterConstants";

const ProcurementMilestonesForm = () => {
  const navigate = useNavigate();

  const [createProcurementPlanMutation, { isLoading }] =
    ProcurementPlanAPI.useCreateProcurementPlanMutation();

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
      await createProcurementPlanMutation(formData).unwrap();
      toast.success("Successfully created.");
      localStorage.removeItem("procurementPlan");
      sessionStorage.removeItem("procurementPlanSteps");
      navigate(RouteEnum.PROCUREMENT_PLAN);
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
                onClick={() => navigate(-1)}
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
