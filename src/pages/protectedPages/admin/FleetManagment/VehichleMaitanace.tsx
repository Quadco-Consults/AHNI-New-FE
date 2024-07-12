import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";

const VehichleMaitanace = () => {
  const form = useForm();
  return (
    <div>
      <BackNavigation extraText="Asset Maintenance Ticket" />
      <Form {...form}>
        <form className="flex flex-col gap-y-8" action="">
          <div className="grid grid-cols-2 gap-x-8 ">
            <FormSelect name="trial " label="Classification" />
            <FormSelect name="trial " label="Maintenance Type" />
          </div>
          <FormSelect name="triel" label="Asset" />
          <FormInput name="nnn" label="Description of Proplem" />
          <FormButton className="w-32">Raise Request</FormButton>
        </form>
      </Form>
    </div>
  );
};

export default VehichleMaitanace;
