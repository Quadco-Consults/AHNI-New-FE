import { useForm } from "react-hook-form";
import EmployeeRegistrationLayout from "./EmployeeRegistrationLayout";
import { Form, FormLabel } from "components/ui/form";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import { Separator } from "components/ui/separator";
import { Button } from "components/ui/button";
import { AddIcon } from "assets/svgs/CAndGSvgs";
import { ChevronRight, Save } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";

const EmployeeInformation = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm();
  const { handleSubmit } = form;

  const handleNext = () => {
    let path = pathname;

    path = path.substring(0, path.lastIndexOf("/"));

    path += "/additional-information";
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
            Employee Information Form
          </h4>
          <p className="text-small text-center">
            Fill the form below, in a case where changes occur, please provide
            an updated form to Human Resources.
            <br /> Telephone numbers are released to supervisory staff for
            emergency purposes only.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <FormLabel className="font-semibold">
                Employee Legal Name:
                <span className="text-red-500">*</span>
              </FormLabel>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormInput name="surname" placeholder="Surname" />
                <FormInput name="middle_name" placeholder="Middle name" />
                <FormInput name="first_name" placeholder="First name" />
              </div>
            </div>
            <FormInput name="designation" label="Designation" required />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormInput name="phone_number" label="Phone Number" required />
              <FormInput name="other_number" label="Mobile/Other" required />
            </div>
            <FormInput name="passport" type="file" label="Passport" required />
            <FormInput
              name="signature"
              type="file"
              label="Signature"
              required
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormInput name="department" label="Department/Unit" required />
              <FormInput name="tel" label="Tel. Ext." required />
            </div>
            <FormInput name="project_name" label="Project Name" required />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormSelect
                options={[]}
                name="type"
                label="Type"
                placeholder="Select type"
                required
              />
              <FormSelect
                options={[]}
                name="status"
                label="Status"
                placeholder="Select status"
                required
              />
              <FormSelect
                options={[]}
                name="computer"
                label="Do you have a Computer?"
                required
              />
              <FormSelect
                options={[]}
                name="email"
                label="Do you require Email access?"
                required
              />
            </div>

            <div className="card-wrapper space-y-6">
              <h4 className="text-red-500 text-lg font-medium">
                Qualification
              </h4>
              <Separator />
              <Button variant="ghost">
                <AddIcon /> Add Qualification
              </Button>
            </div>

            <div className="card-wrapper space-y-6">
              <h4 className="text-red-500 text-lg font-medium">
                Group Membership & Location
              </h4>
              <Separator />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormSelect
                  options={[]}
                  name="group"
                  label="Group Membership"
                  placeholder="Select group"
                  required
                />
                <FormSelect
                  options={[]}
                  name="location"
                  label="Location"
                  placeholder="Select location"
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

export default EmployeeInformation;
