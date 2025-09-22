"use client";

import React from "react";
import { Separator } from "components/ui/separator";
import FormInput from "components/atoms/FormInput";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation"; 
import { Button } from "components/ui/button";
import { Save } from "lucide-react";
import { HrRoutes } from "constants/RouterConstants";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import Card from "components/Card";
import {
  WorkforcePensionFormValues,
  workforcePensionSchema,
} from "features/hr/types/hr-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import { updateStepCompletion } from "store/stepTracker";
import {
  useCreateEmployeeOnboardingPension,
  useGetEmployeeOnboardingPension,
  useUpdateEmployeeOnboardingPension,
} from "@/features/hr/controllers/hrEmployeeOnboardingPensionController";
import FormCheckBox from "components/atoms/FormCheckBox";
import GoBack from "components/GoBack";

const Pension = () => {
  const id = localStorage.getItem("workforceID") || "";

  const router = useRouter();
  const dispatch = useAppDispatch();

  const { createEmployeeOnboardingPension, isLoading } =
    useCreateEmployeeOnboardingPension();
  const { updateEmployeeOnboardingPension, isLoading: updateLoading } =
    useUpdateEmployeeOnboardingPension();

  const { data: pension, isLoading: pensionLoading } =
    useGetEmployeeOnboardingPension({ employee: id });
  console.log({ pension });

  const form = useForm<WorkforcePensionFormValues>({
    resolver: zodResolver(workforcePensionSchema),
    defaultValues: {
      pfa_name: "",
      rsa_number: "",
      pfc_account_name: "",
      pfc_account_number: "",
      has_existing_retirement_savings: true,
      is_match_existing_pfa: true,
      pfa_registeration_date: "",
      employee: id as string,
    },
  });

  const { handleSubmit } = form;

  const handleNext = () => {
    router.push(HrRoutes.ONBOARDING_START);
  };

  const onSubmit = async (data: WorkforcePensionFormValues) => {
    if (pension && pension.data.results.length) {
      try {
        await updateEmployeeOnboardingPension(data)();
        dispatch(
          updateStepCompletion({
            path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_PENSION,
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
    } else {
      try {
        await createEmployeeOnboardingPension(data)();
        dispatch(
          updateStepCompletion({
            path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_PENSION,
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
    }
  };

  React.useEffect(() => {
    if (pension) {
      console.log(pension);

      // form.reset({
      //   pfa_name: "",
      //   rsa_number: "",
      //   pfc_account_name: "",
      //   pfc_account_number: "",
      //   has_existing_retirement_savings: true,
      //   is_match_existing_pfa: true,
      //   pfa_registeration_date: "",
      //   employee: id as string,
      // });
    }
  }, [pensionLoading]);

  return (
    <>
      <GoBack />
      <Card className='space-y-10 mt-6 max-w-4xl mx-auto'>
        <div>
          <h4 className='font-semibold text-lg text-center'>
            Pension Scheme Enrolment Form
          </h4>
          <p className='text-small text-center'>
            FORMS MUST BE AND COMPLETED IN UPPER CASE
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='card-wrapper space-y-6'
          >
            <h4 className='text-red-500 text-lg font-medium'>
              Pension Fund Administration (PFA) selection
            </h4>
            <Separator />
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormInput
                name='pfa_name'
                label='Name of selected PFA'
                required
              />
              <FormInput name='rsa_number' label='RSA Number' required />
              <FormInput
                name='pfc_account_name'
                label='PFC (Pension Fund Custodian) Account Name'
                required
              />
              <FormInput
                name='pfc_account_number'
                label='PFC Account Number'
                required
              />
            </div>
            <FormCheckBox
              label='Do you already have a Retirement Savings Account with any PFA?'
              name='has_existing_retirement_savings'
              required
            />
            <FormCheckBox
              label='If you have an existing PFA, are the account details you have provided above for the existing PFA?'
              name='is_match_existing_pfa'
              required
            />
            <FormInput
              name='pfa_registeration_date'
              label='PFA Registeration Date'
              type='date'
              required
            />

            <div className='flex gap-x-6 justify-end'>
              <FormButton
                loading={isLoading || updateLoading}
                disabled={isLoading || updateLoading}
                variant='outline'
              >
                <Save size={20} /> Save
              </FormButton>
              <Button type='button' onClick={handleNext}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </Card>
      {/* <Button
        onClick={() =>
          dispatch(
            updateStepCompletion({
              path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_PENSION,
            })
          )
        }
      >
        Hello
      </Button> */}
    </>
  );
};

export default Pension;
