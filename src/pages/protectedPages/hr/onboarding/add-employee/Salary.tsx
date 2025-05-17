import React from "react";
import { Separator } from "components/ui/separator";
import FormInput from "atoms/FormInput";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, generatePath, Link } from "react-router-dom";
import { Button } from "components/ui/button";
import { ChevronRight, Save } from "lucide-react";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { HrRoutes } from "constants/RouterConstants";
import Card from "components/shared/Card";
import {
  WorkforceBankAccountFormValues,
  workforceBankAccountSchema,
} from "definations/hr-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FormButton from "atoms/FormButton";
import { updateStepCompletion } from "store/stepTracker";
import {
  useCreateEmployeeOnboardingBankAcctMutation,
  useGetEmployeeOnboardingBankAcctQuery,
  useUpdateEmployeeOnboardingBankAcctMutation,
} from "services/hrApi/hr-employee-onboarding-bank-account";
import GoBack from "components/shared/GoBack";

const Salary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [createEmployeeOnboardingBankAcct, { isLoading }] =
    useCreateEmployeeOnboardingBankAcctMutation();
  const [updateEmployeeOnboardingBankAcct, { isLoading: updateLoading }] =
    useUpdateEmployeeOnboardingBankAcctMutation();

  const { data: bankData, isLoading: dataLoading } =
    useGetEmployeeOnboardingBankAcctQuery({ employee: id as string });

  const form = useForm<WorkforceBankAccountFormValues>({
    resolver: zodResolver(workforceBankAccountSchema),
    defaultValues: {
      bank_name: "",
      branch_name: "",
      account_name: "",
      account_number: "",
      sort_code: "",
      employee: id as string,
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: WorkforceBankAccountFormValues) => {
    // console.log("---->", data);

    if (bankData && bankData.data.results.length) {
      // console.log(data);
      try {
        await updateEmployeeOnboardingBankAcct({
          id: bankData.data.results[0].id,
          body: data,
        }).unwrap();

        dispatch(
          updateStepCompletion({
            path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_SALARY,
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
        console.log(error);
        toast.error("Something went wrong");
      }
    } else {
      try {
        await createEmployeeOnboardingBankAcct(data).unwrap();

        dispatch(
          updateStepCompletion({
            path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_SALARY,
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
    if (bankData && bankData.data.results.length) {
      console.log(bankData.data);
      form.reset({
        bank_name: bankData.data.results[0].bank_name,
        branch_name: bankData.data.results[0].branch_name,
        account_name: bankData.data.results[0].account_name,
        account_number: bankData.data.results[0].account_number,
        sort_code: bankData.data.results[0].sort_code,
        employee: id as string,
      });
    }
  }, [dataLoading]);

  return (
    <>
      <GoBack />
      <Card className='space-y-10 mt-6 max-w-4xl mx-auto'>
        <div>
          <h4 className='font-semibold text-lg text-center'>
            Salary Account Details Form
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
              Bank Account Details
            </h4>
            <Separator />
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormInput name='bank_name' label='Bank Name' required />
              <FormInput name='branch_name' label='Branch Name' required />
              <FormInput name='account_name' label='Account Name' required />
              <FormInput
                name='account_number'
                label='Account Number'
                required
              />
              <FormInput name='sort_code' label='Sort Code' required />
            </div>
            <div className='flex gap-x-6 justify-end'>
              <FormButton
                loading={isLoading || updateLoading}
                disabled={isLoading || updateLoading}
                variant='outline'
              >
                <Save size={20} /> Save
              </FormButton>

              <Link
                to={generatePath(HrRoutes.ONBOARDING_ADD_EMPLOYEE_PENSION, {
                  id,
                })}
                className='flex flex-col items-start justify-between gap-1'
              >
                <Button type='button'>
                  Next
                  <ChevronRight size={20} />
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </Card>

      {/* <Button
        onClick={() =>
          dispatch(
            updateStepCompletion({
              path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_SALARY,
            })
          )
        }
      >
        Hello
      </Button> */}
    </>
  );
};

export default Salary;
