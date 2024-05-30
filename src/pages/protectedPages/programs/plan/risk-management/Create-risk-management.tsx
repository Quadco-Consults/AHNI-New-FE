import { useNavigate } from "react-router-dom";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/shared/Card";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import FormSelect from "atoms/FormSelect";
import FormInput from "atoms/FormInput";
import FormTextArea from "atoms/FormTextArea";
import { Button } from "components/ui/button";
import { RouteEnum } from "constants/RouterConstants";

const CreateRickManagement = () => {
  const navigate = useNavigate();
  const form = useForm();

  const { handleSubmit } = form;

  const goBack = () => {
    navigate(-1);
  };

  const onSubmit = () => {
    navigate(RouteEnum.PROGRAM_RISK_MANAGEMENT);
  };

  return (
    <div className="space-y-6 min-h-screen">
      <button
        onClick={goBack}
        className="w-[3rem] aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center"
      >
        <LongArrowLeft />
      </button>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="space-y-5 py-5">
            <FormInput
              name="risk"
              label="Risk Number Name"
              placeholder="Enter Risk Number"
            />
            <FormSelect
              name="category"
              label="Risk Category"
              placeholder="Select Risk Category"
              required
            />
            <FormTextArea name="description" label="Risk Description" />
            <FormInput name="risk" label="Risk Owner" />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <FormSelect
                name="category"
                label="Impact Level"
                placeholder="High"
                required
              />
              <FormSelect
                name="category"
                label="Probability of Occurrence"
                placeholder="High"
                required
              />
              <FormSelect
                name="category"
                label="Total Risk on Response"
                placeholder="High"
                required
              />
            </div>

            <FormTextArea name="description" label="Risk Response" />
            <FormInput name="risk" label="Implementation Timeline" />
            <FormSelect
              name="category"
              label="Risk Status"
              placeholder="Closed"
              required
            />
          </Card>

          <div className="flex justify-end gap-5 mt-16">
            <Button className="bg-[#FFF2F2] text-primary ">Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateRickManagement;
