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
import { toast } from "sonner";
import FormButton from "atoms/FormButton";
import { updateStepCompletion } from "store/stepTracker";
import { useCreateEmployeeOnboardingAddInfoMutation } from "services/hrApi/hr-employee-onboarding-add-info";
import GoBack from "components/shared/GoBack";

const AdditionalInformation = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const id = localStorage.getItem("workforceID");

  const [createEmployeeOnboardingAddInfo, { isLoading }] =
  useCreateEmployeeOnboardingAddInfoMutation();

  const form = useForm<WorkforceAdditionalInfoFormValues>({
    resolver: zodResolver(workforceAdditionalInfoSchema), 
    defaultValues: {
      name: "", 
      relationship: "",
      home_phone: "", 
      mobile_phone: "",
      email_address: "",
      address: "",
      employee: id as string, 
    }, 
  });
  const { handleSubmit } = form;

  const handleNext = () => {
    navigate(HrRoutes.ONBOARDING_ADD_EMPLOYEE_BENEFICIARY);
  };

  const onSubmit = async (data: WorkforceAdditionalInfoFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("relationship", data.relationship);
      formData.append("home_phone", data.home_phone);
      formData.append("mobile_phone", data.mobile_phone);
      formData.append("email_address", data.email_address);
      formData.append("address", data.address);
      formData.append("employee", id as string);
      await createEmployeeOnboardingAddInfo(formData).unwrap();
      dispatch(
        updateStepCompletion({
          path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_ADD,
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
        <GoBack />
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
                  name='name'
                  label='Full Name'
                  required
                />
                <FormInput
                  name='relationship'
                  label='Relationship'
                  required
                />
                
                <FormInput
                  name='home_phone'
                  label='Home Phone'
                  required
                />
                <FormInput
                  name='mobile_phone'
                  label='Mobile/Other'
                  required
                />
                <FormInput
                  name='email_address'
                  label='Email Address'
                  required
                />
                <FormInput
                  name='address'
                  label='Address'
                  required
                /> 
             </div>   

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
