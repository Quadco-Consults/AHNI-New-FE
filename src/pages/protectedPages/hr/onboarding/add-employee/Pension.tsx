import { Separator } from "components/ui/separator";
import EmployeeRegistrationLayout from "./EmployeeRegistrationLayout";
import FormInput from "atoms/FormInput";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/button";
import { Save } from "lucide-react";
import FormSelect from "atoms/FormSelect";
import { HrRoutes } from "constants/RouterConstants";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";

const Pension = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm();
  const { handleSubmit } = form;

  const handleNext = () => {
    sessionStorage.removeItem("employeeCompletedSteps");
    navigate(HrRoutes.ONBOARDING);
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
      <div className="space-y-10 max-w-4xl mx-auto">
        <div>
          <h4 className="font-semibold text-lg text-center">
            Pension Scheme Enrolment Form
          </h4>
          <p className="text-small text-center">
            FORMS MUST BE AND COMPLETED IN UPPER CASE
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="card-wrapper space-y-6"
          >
            <h4 className="text-red-500 text-lg font-medium">
              Pension Fund Administration (PFA) selection
            </h4>
            <Separator />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormInput
                name="pfa_name"
                label="Name of selected PFA"
                required
              />
              <FormInput name="rsa_number" label="RSA Number" required />
              <FormInput
                name="account_name"
                label="PFC (Pension Fund Custodian) Account Name"
                required
              />
              <FormInput
                name="account_number"
                label="PFC Account Number"
                required
              />
            </div>
            <FormSelect
              options={[]}
              name="saving_account"
              label="Do you already have a Retirement Savings Account with any PFA?"
              required
            />
            <FormSelect
              options={[]}
              name="account_detail"
              label="If you have an existing PFA, are the account details you have provided above for the existing PFA?"
              required
            />
            <FormInput name="date" label="Date" type="date" required />

            <div className="flex gap-x-6 justify-end">
              <Button variant="outline">
                <Save size={20} /> Save
              </Button>
              <Button type="button" onClick={handleNext}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </EmployeeRegistrationLayout>
  );
};

export default Pension;
