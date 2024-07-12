import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { Form } from "components/ui/form";
import { ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";

const AddAssets = () => {
  const form = useForm();
  return (
    <div className="space-y-6">
      <BackNavigation extraText="Asset Registration" />
      <div>
        <Form {...form}>
          <form action="" className="flex flex-col gap-y-7">
            <FormSelect label="Asset" name="asset" required />
            <FormInput label="Assignee" name="assignee" required />
            <div className="grid grid-cols-3 gap-x-14">
              <FormSelect label="Implementer" name="implementer" required />
              <FormSelect
                label="Date of Acquisition"
                name="aqusition"
                required
              />
              <FormSelect label="Select State" name="state" required />
            </div>
            <div className="grid grid-cols-3 gap-x-14">
              <FormSelect label="Asset Condition" name="implementer" required />
              <FormSelect label="Location" name="aqusition" required />
              <FormSelect label="Estimated Life Span" name="state" required />
            </div>
            <div className="grid grid-cols-3 gap-x-14">
              <FormSelect label="Classification" name="implementer" required />
              <div className="grid grid-cols-2 gap-x-10">
                <FormInput name="" label="Cost in USD" />
                <FormInput name="" label="Cost in NGN" />
              </div>
              <FormSelect label="Unit" name="state" required />
            </div>
            <div>
              <FormButton suffix={<ChevronRight />}>Add Asset</FormButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddAssets;
