import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/shared/Card";
import { Form } from "components/ui/form";
import { RouteEnum } from "constants/RouterConstants";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const CreateRegister = () => {
  const navigate = useNavigate();
  const form = useForm();

  const { handleSubmit } = form;

  const goBack = () => {
    navigate(-1);
  };

  const onSubmit = () => {
    navigate(RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER);
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
          <Card className="space-y-10 p-10">
            <FormInput name="name" label="Stakeholder Name" required />
            <FormInput name="org" label="Institution/Organization" required />
            <FormTextArea name="address" label="Physical Office Address" />
            <FormSelect
              name="state"
              label="State"
              placeholder="Select state"
              required
            />
            <FormInput name="designation" label="Designation" />
            <FormInput name="number" label="Phone Number" />
            <FormInput name="mail" label="E-Mail" />
          </Card>

          <div className="flex justify-end gap-5 pt-10">
            <FormButton
              onClick={goBack}
              type="button"
              className="bg-[#FFF2F2] text-primary dark:text-gray-500"
            >
              Cancel
            </FormButton>

            <FormButton>Create</FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateRegister;
