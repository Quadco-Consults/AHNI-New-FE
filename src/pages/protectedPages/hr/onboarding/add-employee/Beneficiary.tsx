import { useForm } from "react-hook-form";
import { Form } from "components/ui/form";
// import FormCheckBox from "atoms/FormCheckBox";
import { Separator } from "components/ui/separator";
import { Button } from "components/ui/button";
import FormInput from "atoms/FormInput";
import { ChevronRight, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { HrRoutes } from "constants/RouterConstants";
import Card from "components/shared/Card";
import {
  HrBeneficiaryFormValues,
  hrBeneficiarySchema,
  HrContingentBeneficiaryFormValues,
  hrContingentBeneficiarySchema,
} from "definations/hr-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import HrBeneficiaryAPI from "services/hrApi/hr-beneficiary";
import { toast } from "sonner";
import FormButton from "atoms/FormButton";
import { updateStepCompletion } from "store/stepTracker";

const Beneficiary = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [createHrBeneficiaryMutation, { isLoading }] =
    HrBeneficiaryAPI.useCreateHrBeneficiaryMutation();

  const beneficiaryForm = useForm<HrBeneficiaryFormValues>({
    resolver: zodResolver(hrBeneficiarySchema),
    defaultValues: {
      name: "",
      relationship: "",
      percentage: "",
      phone_number: "",
      beneficiary_type: "primary",
      employee: localStorage.getItem("workforceID") as string,
    },
  });

  const contingentBeneficiaryForm = useForm<HrContingentBeneficiaryFormValues>({
    resolver: zodResolver(hrContingentBeneficiarySchema),
    defaultValues: {
      name: "",
      relationship: "",
      phone_number: "",
      beneficiary_type: "contingent",
      employee: localStorage.getItem("workforceID") as string,
    },
  });

  const handleNext = () => {
    navigate(HrRoutes.ONBOARDING_ADD_EMPLOYEE_ID_CARD);
  };

  const onSubmit = async (data: HrBeneficiaryFormValues) => {
    try {
      await createHrBeneficiaryMutation(data).unwrap();
      dispatch(
        openDialog({
          type: DialogType.HrSuccessModal,
          dialogProps: {
            label: "Beneficiary information saved",
          },
        })
      );
      beneficiaryForm.reset();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const submitHandler = async (data: HrContingentBeneficiaryFormValues) => {
    try {
      await createHrBeneficiaryMutation(data).unwrap();
      dispatch(
        updateStepCompletion({
          path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_BENEFICIARY,
        })
      );

      dispatch(
        openDialog({
          type: DialogType.HrSuccessModal,
          dialogProps: {
            label: "Contingent Beneficiary information saved",
          },
        })
      );
      contingentBeneficiaryForm.reset();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Card className='space-y-6 mt-6 max-w-4xl mx-auto'>
        <div>
          <h4 className='font-semibold text-lg text-center'>
            Beneficiary Designation Form
          </h4>
          <p className='text-small text-center'>
            To be used for all requests concerning the granting, amending &
            removal of Network access
          </p>
        </div>

        <Form {...beneficiaryForm}>
          <form
            onSubmit={beneficiaryForm.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            <div className='card-wrapper bg-gray-100'>
              <p className='text-small'>
                I designate the person(s) named below as my primary
                beneficiary(ies) to receive payment under the policy in the
                event of death.
              </p>
            </div>
            <div className='card-wrapper space-y-6'>
              <h4 className='text-red-500 text-lg font-medium'>
                Primary Beneficiary(ies)
              </h4>

              <FormInput
                name='name'
                label='Beneficiary Names (Last, First)'
                required
              />
              <FormInput name='percentage' label='% of Benefit' required />
              <FormInput
                name='relationship'
                label='Relationship with Employee'
                required
              />
              <FormInput name='phone_number' label='Phone Number' required />
            </div>

            <FormButton
              loading={isLoading}
              disabled={isLoading}
              variant='outline'
            >
              <Save size={20} /> Save
            </FormButton>
          </form>
        </Form>

        <Form {...contingentBeneficiaryForm}>
          <form
            onSubmit={contingentBeneficiaryForm.handleSubmit(submitHandler)}
            className='space-y-6'
          >
            {/* <div className="flex justify-end gap-x-4">
            <FormCheckBox name="new" label="New" reverse />
            <FormCheckBox name="change" label="Change" reverse />
          </div> */}

            <div className='card-wrapper space-y-6'>
              <h4 className='text-red-500 text-lg font-medium'>
                Contingent Beneficiary
              </h4>
              <p className='text-small'>
                (Used only if any of the above beneficiaries passes on before
                you. The % allocated to the affected primary beneficiary will be
                transferred to the contingent beneficiary in the order listed
                below)
              </p>
              <Separator />
              <FormInput
                name='name'
                label='Contingent Beneficiary Names (Last, First)'
                required
              />
              <FormInput
                name='relationship'
                label='Relationship with Employee'
                required
              />
              <FormInput name='phone_number' label='Phone Number' required />
            </div>
            {/* <Separator />
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
              <FormInput name="witness" label="Full Name of Witness" required />
              <FormInput type="date" name="date" label="Date" required />
            </div>
            <FormInput
              type="file"
              name="signature"
              label="Witness Signature"
              required
            />
          </div> */}

            <FormButton
              loading={isLoading}
              disabled={isLoading}
              variant='outline'
            >
              <Save size={20} /> Save
            </FormButton>
          </form>
        </Form>
        <div className='flex gap-x-6 justify-end'>
          <Button type='button' onClick={handleNext}>
            Next
            <ChevronRight size={20} />
          </Button>
        </div>
      </Card>
      {/* <Button
        onClick={() =>
          dispatch(
            updateStepCompletion({
              path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_ID_CARD,
            })
          )
        }
      >
        Hello
      </Button> */}
    </>
  );
};

export default Beneficiary;
