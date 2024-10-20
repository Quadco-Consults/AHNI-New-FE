import { Separator } from "components/ui/separator";
import EmployeeRegistrationLayout from "./EmployeeRegistrationLayout";
import FormInput from "atoms/FormInput";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "components/ui/button";
import { ChevronRight, Save } from "lucide-react";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";

const Salary = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm();
  const { handleSubmit } = form;

  const handleNext = () => {
    let path = pathname;

    path = path.substring(0, path.lastIndexOf("/"));

    path += "/pension-scheme-enrolment";
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
      <div className="space-y-10 max-w-4xl mx-auto">
        <div>
          <h4 className="font-semibold text-lg text-center">
            Salary Account Details Form
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
              Bank Account Details
            </h4>
            <Separator />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormInput name="bank_name" label="Bank Name" required />
              <FormInput name="branch_name" label="Branch Name" required />
              <FormInput name="account_name" label="Account Name" required />
              <FormInput
                name="account_number"
                label="Account Number"
                required
              />
              <FormInput name="sort_code" label="Sort Code" required />
              <FormInput name="date" label="Date" type="date" required />
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

export default Salary;
