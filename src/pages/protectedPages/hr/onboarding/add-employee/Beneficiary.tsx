import { useForm } from "react-hook-form";
import EmployeeRegistrationLayout from "./EmployeeRegistrationLayout";
import { Form } from "components/ui/form";
import FormCheckBox from "atoms/FormCheckBox";
import { Separator } from "components/ui/separator";
import { Button } from "components/ui/button";
import PencilIcon from "components/icons/PencilIcon";
import DescriptionCard from "components/shared/DescriptionCard";
import AddSquareIcon from "components/icons/AddSquareIcon";
import FormSelect from "atoms/FormSelect";
import FormInput from "atoms/FormInput";
import { ChevronRight, Save } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";

const Beneficiary = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm();
  const { handleSubmit } = form;

  const handleNext = () => {
    let path = pathname;

    path = path.substring(0, path.lastIndexOf("/"));

    path += "/id-card-information";
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
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h4 className="font-semibold text-lg text-center">
            Beneficiary Designation Form
          </h4>
          <p className="text-small text-center">
            To be used for all requests concerning the granting, amending &
            removal of Network access
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-end gap-x-4">
              <FormCheckBox name="new" label="New" reverse />
              <FormCheckBox name="change" label="Change" reverse />
            </div>
            <div className="card-wrapper bg-gray-100">
              <p className="text-small">
                I designate the person(s) named below as my primary
                beneficiary(ies) to receive payment under the policy in the
                event of death.
              </p>
            </div>
            <div className="card-wrapper space-y-6">
              <h4 className="text-red-500 text-lg font-medium">
                Primary Beneficiary(ies)
              </h4>
              <Separator />
              <div className="card-wrapper space-y-6 border-yellow-500">
                <div className="flex justify-end">
                  <Button variant="custom">
                    <PencilIcon />
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <DescriptionCard
                      label="Beneficiary Names (Last, First)"
                      description="Adebayo Grace"
                    />
                    <DescriptionCard
                      label="Relationship with Employee"
                      description="Spouse"
                    />
                  </div>
                  <div className="space-y-6">
                    <DescriptionCard label="% of Benefit" description="50%" />
                    <DescriptionCard
                      label="Phone Number"
                      description="08039876543"
                    />
                  </div>
                </div>
                <Button type="button">
                  <AddSquareIcon />
                  Add
                </Button>
              </div>
            </div>
            <Separator />
            <div className="card-wrapper space-y-6">
              <h4 className="text-red-500 text-lg font-medium">
                Contingent Beneficiary
              </h4>
              <p className="text-small">
                (Used only if any of the above beneficiaries passes on before
                you. The % allocated to the affected primary beneficiary will be
                transferred to the contingent beneficiary in the order listed
                below)
              </p>
              <Separator />
              <div className="card-wrapper space-y-6 border-yellow-500">
                <div className="flex justify-end">
                  <Button variant="custom">
                    <PencilIcon />
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <DescriptionCard
                      label="Contingent Beneficiary Names (Last, First)"
                      description="Adebayo Grace"
                    />
                    <DescriptionCard
                      label="Phone Number"
                      description="08039876543"
                    />
                  </div>
                  <div className="space-y-6">
                    <DescriptionCard
                      label="Relationship with employee"
                      description="Brother"
                    />
                  </div>
                </div>
                <Button type="button">
                  <AddSquareIcon />
                  Add
                </Button>
              </div>
            </div>
            <Separator />
            <div className="card-wrapper space-y-6">
              <h4 className="text-red-500 text-lg font-medium">
                Authorization and Signatories
              </h4>
              <p className="text-small">
                By signing this document, I understand and agree that this
                Beneficiary Designation Form will apply to AHNi Business Travel/
                Accidental death and Dismemberment Policy.
              </p>
              <Separator />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormSelect
                  options={[]}
                  name="employee"
                  label="Employee"
                  placeholder="Select Employee"
                  required
                />
                <FormInput type="date" name="date" label="Date" required />
                <FormInput
                  name="witness"
                  label="Full Name of Witness"
                  required
                />
                <FormInput type="date" name="date" label="Date" required />
              </div>
              <FormInput
                type="file"
                name="signature"
                label="Witness Signature"
                required
              />
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

export default Beneficiary;
