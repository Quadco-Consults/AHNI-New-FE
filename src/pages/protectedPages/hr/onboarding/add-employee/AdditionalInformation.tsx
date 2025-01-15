import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import FormInput from "atoms/FormInput";
import FormTextArea from "atoms/FormTextArea";
import FormSelect from "atoms/FormSelect";
import { Separator } from "components/ui/separator";
import { Button } from "components/ui/button";
import { ChevronRight, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { HrRoutes } from "constants/RouterConstants";
import Card from "components/shared/Card";
import {
  WorkforceAdditionalInfoFormValues,
  workforceAdditionalInfoSchema,
} from "definations/hr-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { workforceAdditionalInfoValues } from "definations/hr-types/workforce";
import WorkforceAPI from "services/hrApi/workforce";
import { toast } from "sonner";
import FormButton from "atoms/FormButton";
import { updateStepCompletion } from "store/stepTracker";

const AdditionalInformation = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const id = localStorage.getItem("workforceID");

  const [updateMutation, { isLoading }] =
    WorkforceAPI.useUpdateWorkforceAdditionalInfoMutation();

  const form = useForm<WorkforceAdditionalInfoFormValues>({
    resolver: zodResolver(workforceAdditionalInfoSchema),
    defaultValues: workforceAdditionalInfoValues,
  });
  const { handleSubmit } = form;

  const handleNext = () => {
    navigate(HrRoutes.ONBOARDING_ADD_EMPLOYEE_BENEFICIARY);
  };

  const onSubmit = async (data: WorkforceAdditionalInfoFormValues) => {
    try {
      await updateMutation({ path: { id: id as string }, body: data }).unwrap();
      dispatch(
        updateStepCompletion({
          path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_INFO,
        })
      );
      dispatch(
        openDialog({
          type: DialogType.HrSuccessModal,
          dialogProps: {
            label: "Employee information saved",
          },
        })
      );
      form.reset();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Card className='space-y-6 mt-6'>
        <div>
          <h4 className='font-semibold text-lg text-center'>
            Additional Information Form
          </h4>
          <p className='text-small text-center'>
            To be used for all requests concerning the granting, amending &
            removal of Network access
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormInput
                name='date_of_birth'
                type='date'
                label='Date of Birth'
              />
              {/* <FormInput name="date_of_hire" type="date" label="Date of Hire" /> */}
              <FormSelect
                options={[
                  { label: "Christian", value: "christian" },
                  { label: "Muslim", value: "muslim" },
                  { label: "Others", value: "others" },
                ]}
                name='religion'
                placeholder='Religion'
                label='Religion'
                required
              />
            </div>
            <FormTextArea name='address' label='Address' required rows={6} />
            <FormSelect
              options={[
                { label: "Single", value: "single" },
                { label: "Married", value: "married" },
              ]}
              name='marital_status'
              label='Marital Status'
              placeholder='Select marital status'
              required
            />
            <div className='card-wrapper space-y-6'>
              <h4 className='text-red-500 text-lg font-medium'>
                Emergency contacts
              </h4>
              <Separator />
              <p className='text-sm font-medium'>Contact 1</p>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <FormInput
                  name='emergency_contact_one.name'
                  label='Name'
                  required
                />
                <FormInput
                  name='emergency_contact_one.relationship'
                  label='Relationship'
                />
                <FormInput
                  name='emergency_contact_one.email'
                  label='Email Address'
                  required
                />
              </div>
              <FormTextArea
                name='emergency_contact_one.address'
                label='Address'
                required
                rows={6}
              />
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormInput
                  name='emergency_contact_one.phone_number_1'
                  label='Home Phone'
                  required
                />
                <FormInput
                  name='emergency_contact_one.phone_number_2'
                  label='Mobile/Other'
                  required
                />
              </div>
              <Separator />
              <p className='text-sm font-medium'>Contact 2</p>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <FormInput
                  name='emergency_contact_two.name'
                  label='Name'
                  required
                />
                <FormInput
                  name='emergency_contact_two.relationship'
                  label='Relationship'
                />
                <FormInput
                  name='emergency_contact_two.email'
                  label='Email Address'
                  required
                />
              </div>
              <FormTextArea
                name='emergency_contact_two.address'
                label='Address'
                required
                rows={6}
              />
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormInput
                  name='emergency_contact_two.phone_number_1'
                  label='Home Phone'
                  required
                />
                <FormInput
                  name='emergency_contact_two.phone_number_2'
                  label='Mobile/Other'
                  required
                />
              </div>
            </div>
            {/* <Separator />
          <div className="card-wrapper space-y-6">
            <h4 className="text-red-500 text-lg font-medium">
              System Analyst Authorization (Only if all previously completed and
              signed)
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
          </div> */}

            <div className='flex gap-x-6 justify-end'>
              <FormButton
                loading={isLoading}
                disabled={isLoading}
                variant='outline'
              >
                <Save size={20} /> Save
              </FormButton>
              <Button type='button' onClick={handleNext}>
                Next
                <ChevronRight size={20} />
              </Button>
            </div>
          </form>
        </Form>
      </Card>
      {/* <Button
        onClick={() =>
          dispatch(
            updateStepCompletion({
              path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_INFO,
            })
          )
        }
      >
        Hello
      </Button> */}
    </>
  );
};

export default AdditionalInformation;
