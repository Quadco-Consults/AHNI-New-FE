import { Form } from "components/ui/form";
import EmployeeRegistrationLayout from "./EmployeeRegistrationLayout";
import { useForm } from "react-hook-form";
import FormInput from "atoms/FormInput";
import FormTextArea from "atoms/FormTextArea";
import FormSelect from "atoms/FormSelect";
import { Separator } from "components/ui/separator";
import { Button } from "components/ui/button";
import { ChevronRight, Save } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";

const AdditionalInformation = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm();
  const { handleSubmit } = form;

  const handleNext = () => {
    let path = pathname;

    path = path.substring(0, path.lastIndexOf("/"));

    path += "/beneficiary-designation";
    navigate(path);
  };

  const onSubmit = () => {
    dispatch(
      openDialog({
        type: DialogType.HrSuccessModal,
        dialogProps: {
          label: "Employee information saved",
        },
      })
    );
  };

  return (
    <EmployeeRegistrationLayout>
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-lg text-center">
            Additional Information Form
          </h4>
          <p className="text-small text-center">
            To be used for all requests concerning the granting, amending &
            removal of Network access
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormInput
                name="date_of_birth"
                type="date"
                label="Date of Birth"
              />
              <FormInput name="date_of_hire" type="date" label="Date of Hire" />
              <FormInput
                name="surname"
                placeholder="Surname"
                label="Surname"
                required
              />
            </div>
            <FormTextArea name="address" label="Address" required rows={6} />
            <FormSelect
              options={[]}
              name="marital_status"
              label="Marital Status"
              placeholder="Select marital status"
              required
            />
            <div className="card-wrapper space-y-6">
              <h4 className="text-red-500 text-lg font-medium">
                Emergency contacts
              </h4>
              <Separator />
              <p className="text-sm font-medium">Contact 1</p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormInput name="name" label="Name" required />
                <FormInput name="relationship" label="Relationship" />
                <FormInput
                  name="email_address"
                  label="Email Address"
                  required
                />
              </div>
              <FormTextArea name="address" label="Address" required rows={6} />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormInput name="phone_number" label="Home Phone" required />
                <FormInput name="other_number" label="Mobile/Other" required />
              </div>
              <Separator />
              <p className="text-sm font-medium">Contact 2</p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormInput name="name" label="Name" required />
                <FormInput name="relationship" label="Relationship" />
                <FormInput
                  name="email_address"
                  label="Email Address"
                  required
                />
              </div>
              <FormTextArea name="address" label="Address" required rows={6} />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormInput name="phone_number" label="Home Phone" required />
                <FormInput name="other_number" label="Mobile/Other" required />
              </div>
            </div>
            <Separator />
            <div className="card-wrapper space-y-6">
              <h4 className="text-red-500 text-lg font-medium">
                System Analyst Authorization (Only if all previously completed
                and signed)
              </h4>
              <Separator />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormInput name="login" label="User Login Name" required />
                <FormInput
                  name="computer_name"
                  label="Computer Name (Only if previously granted)"
                />
                <FormInput
                  name="mailbox"
                  label="E-mail MailBox Alias (only if previously approved)"
                  required
                />
                <FormSelect
                  options={[]}
                  name="training"
                  label="Training Completed"
                  required
                />
                <FormSelect
                  options={[]}
                  name="signature"
                  label="Name and Signature"
                  placeholder="Select Authorization Officer"
                  required
                />
                <FormInput
                  name="date"
                  label="Date Completed"
                  type="date"
                  required
                />
              </div>
            </div>

            <div className="flex gap-x-6 justify-end">
              <Button variant="outline">
                <Save size={20} /> Save
              </Button>
              <Button type="button" onClick={handleNext}>
                Next
                <ChevronRight size={20} />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </EmployeeRegistrationLayout>
  );
};

export default AdditionalInformation;
