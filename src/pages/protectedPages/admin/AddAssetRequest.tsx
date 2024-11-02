import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import { APPROVAL_PROCESS } from "./FacilitiesManagment/FacilitiesMaintanance";
import { Button } from "components/ui/button";

const AddAssetRequest = () => {
  const form = useForm();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-5">
        <GoBack />
        <h4 className="text-xl font-bold">Asset Request</h4>
      </div>
      <Card>
        <Form {...form}>
          <form className="space-y-6">
            <FormInput name="" label="Asset Code" />
            <FormInput name="" label="Asset Name" />
            <FormInput name="" label="Asset Condition" />
            <FormSelect
              label="Request Type"
              name=""
              placeholder="Select request type"
              options={[
                { label: "Movement", value: "movement" },
                { label: "Disposal", value: "disposal" },
              ]}
            />
            <FormInput name="" label="Recommendation" />
            <FormTextArea name="" label="Description" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <FormTextArea
                  name=""
                  label="Justification for Disposal"
                  placeholder="This can be repaired and we donate it to CBOs"
                />
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <FormSelect
                    name=""
                    placeholder="Select approval"
                    options={APPROVAL_PROCESS}
                  />
                  <FormSelect
                    name=""
                    placeholder="Select name"
                    options={APPROVAL_PROCESS}
                  />
                </div>
                <Button variant="custom" type="button">
                  Approve
                </Button>
              </div>
              <div className="space-y-2">
                <FormTextArea
                  name=""
                  label="GT CT Approval"
                  placeholder="This can be repaired and we donate it to CBOs"
                />
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <FormSelect
                    name=""
                    placeholder="Select approval"
                    options={APPROVAL_PROCESS}
                  />
                  <FormSelect
                    name=""
                    placeholder="Select name"
                    options={APPROVAL_PROCESS}
                  />
                </div>
                <Button variant="custom" type="button">
                  Approve
                </Button>
              </div>
              <div className="space-y-2">
                <FormTextArea
                  name=""
                  label="CCM Approval"
                  placeholder="This can be repaired and we donate it to CBOs"
                />
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <FormSelect
                    name=""
                    placeholder="Select approval"
                    options={APPROVAL_PROCESS}
                  />
                  <FormSelect
                    name=""
                    placeholder="Select name"
                    options={APPROVAL_PROCESS}
                  />
                </div>
                <Button variant="custom" type="button">
                  Approve
                </Button>
              </div>
              <div className="space-y-2">
                <FormTextArea name="" label="Remarks" />
                <FormSelect
                  name=""
                  placeholder="Select approval"
                  options={APPROVAL_PROCESS}
                />
                <Button variant="custom" type="button">
                  Approve
                </Button>
              </div>
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

export default AddAssetRequest;
