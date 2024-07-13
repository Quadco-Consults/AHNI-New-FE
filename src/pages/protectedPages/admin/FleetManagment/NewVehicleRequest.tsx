import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { Card, CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";

const NewVehicleRequest = () => {
  const form = useForm();
  return (
    <div>
      <BackNavigation extraText="Vehicle Request" />
      <div>
        <Card>
          <CardContent className="py-8">
            <Form {...form}>
              <form action="" className="flex flex-col gap-y-6">
                <FormInput
                  name="companywebsite"
                  label="Requesting Staff"
                  required
                />
                <div className="grid grid-cols-6 gap-x-5">
                  <div className="col-span-3 ">
                    <FormInput
                      name="companywebsite"
                      label="Location"
                      required
                    />
                  </div>
                  <div className="col-span-2 ">
                    <FormSelect
                      name="incoperationYear"
                      label="Date Of Request"
                      required
                    />
                  </div>
                  <div>
                    <FormInput
                      name="companywebsite"
                      label="Destination of Travle "
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-x-6">
                  <FormSelect
                    name="incoperationYear"
                    label="Time  of Departure"
                    required
                  />
                  <FormSelect
                    name="incoperationYear"
                    label="Date of Departure"
                    required
                  />
                  <div className="col-span-2 ">
                    <FormInput
                      name="companywebsite"
                      label="Point of Departure "
                      required
                    />
                  </div>
                  <FormSelect
                    name="incoperationYear"
                    label="Time  of Return"
                    required
                  />
                  <FormSelect
                    name="incoperationYear"
                    label="Date of Reture"
                    required
                  />
                </div>
                <div className="grid grid-cols-7 gap-x-6">
                  <FormSelect
                    name="incoperationYear"
                    label="No for Transport"
                    required
                  />

                  <div className="col-span-6 ">
                    <FormInput name="companywebsite" label="Names " required />
                  </div>
                </div>
                <div className="w-3/12">
                  <FormInput
                    name="companywebsite"
                    label="Supervisor"
                    required
                  />
                </div>
                <div className="w-2/12">
                  <FormButton>Raise Request</FormButton>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewVehicleRequest;
