import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";

const CreateItemRequisition = () => {
  const form = useForm();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-x-5">
        <GoBack />
        <h4 className="text-xl font-bold">Item Requisition</h4>
      </div>
      <Card>
        <Form {...form}>
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormInput name="expiry_date" type="date" label="Expiry Date" />
              <FormInput name="" label="Name Requestor" />
              <FormInput name="" label="Department/Unit" />
              <FormInput name="" label="Re-order Level" />
              <FormInput name="" label="Date Requested" />
              <FormInput name="" label="Date Treated" />
              <FormInput name="" label="Item Requested" />
              <FormInput name="" label="Quantity Requested" />
              <FormSelect name="" label="Approved by" options={[]} />
              <FormSelect
                name=""
                label="Status"
                options={[
                  { label: "Treated", value: "treated" },
                  { label: "Untreated", value: "untreated" },
                ]}
              />
            </div>
            <div className="flex justify-end">
              <FormButton>Submit</FormButton>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateItemRequisition;
