import RoundBack from "assets/svgs/RoundBack";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { Form } from "components/ui/form";
import { ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const CreateConsumables = () => {
  const form = useForm();

  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center gap-x-2">
        <div onClick={() => navigate(-1)}>
          <RoundBack />
        </div>
        <h4 className="text-xl font-bold">Item Registration</h4>
      </div>
      <div>
        <Form {...form}>
          <form className="flex flex-col gap-y-8" action="">
            <FormSelect name="incoperationYear" label="Item" required />
            <div className="grid grid-cols-8 gap-x-16">
              <div className="col-span-2">
                <FormInput name="companywebsite" label="Quantity" required />
              </div>
              <div className="col-span-3">
                <FormSelect
                  name="incoperationYear"
                  label="Stock Control Method"
                  required
                />
              </div>
              <div className="col-span-3">
                <FormSelect name="incoperationYear" label="Category" required />
              </div>
            </div>
            <div className="grid grid-cols-8 gap-x-16">
              <div className="col-span-2">
                <FormInput name="companywebsite" label="Expiry Date" />
              </div>
              <div className="col-span-2">
                <FormInput name="companywebsite" label="Minimum Stock Level" />
              </div>
            </div>
            <FormButton className="w-28" suffix={<ChevronRight size={14} />}>
              Continue
            </FormButton>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateConsumables;
