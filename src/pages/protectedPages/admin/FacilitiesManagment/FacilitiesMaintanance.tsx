import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";

const FacilitiesMaintanance = () => {
  const form = useForm();
  return (
    <div className="flex flex-col gap-y-6">
      <BackNavigation extraText="Facility Maintenance Ticket" />
      <Form {...form}>
        <form className="flex flex-col gap-y-6" action="">
          <div className="grid grid-cols-2 gap-x-4">
            <FormSelect label="Facility " name="facility" required />
            <FormSelect label="Maintenance Type " name="facility" required />
          </div>
          <FormInput label="Description of Proplem" name="problem" required />
          <FormButton className="w-32">Raise Request</FormButton>
        </form>
      </Form>
    </div>
  );
};

export default FacilitiesMaintanance;
