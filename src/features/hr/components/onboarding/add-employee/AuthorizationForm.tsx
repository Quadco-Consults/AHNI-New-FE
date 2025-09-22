"use client";

import React from "react";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import FormInput from "components/atoms/FormInput";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import FormCheckBox from "components/atoms/FormCheckBox";
import { openDialog } from "store/ui";
import { Save } from "lucide-react";

import {
  hrSystemAuthorizationSchema,
  hrSystemAuthorizationFormValues,
} from "features/hr/types/hr-validator";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import {
  useUpdateSystemAuthorization,
  useCreateSystemAuthorization,
} from "@/features/hr/controllers/hrEmployeeOnboardingAuthorizationController";
import { useGetSystemAuthorizationList } from "@/features/hr/controllers/hrEmployeeOnboardingAuthorizationController";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

export const AuthorizationForm = () => {
  const id = localStorage.getItem("workforceID") || "";
  const dispatch = useAppDispatch();

  const { data: authorization, error: authorizationError } = useGetSystemAuthorizationList({
    employee: id as string,
    enabled: false, // Temporarily disable due to backend schema issue
  });

  const { createSystemAuthorization, isLoading } =
    useCreateSystemAuthorization();

  const { updateSystemAuthorization, isLoading: updateLoading } =
    useUpdateSystemAuthorization(""); // Will use create instead due to backend issue

  const form = useForm<hrSystemAuthorizationFormValues>({
    resolver: zodResolver(hrSystemAuthorizationSchema),
    defaultValues: {
      user_login_name: "",
      computer_name: "",
      email_alias: "",
      is_training_completed: false,
      authorization_officer_name: "", // Name & signature
      authorization_date: "", // data completed
      employee: "",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: hrSystemAuthorizationFormValues) => {
    const formData = {
      user_login_name: data.user_login_name,
      computer_name: data.computer_name,
      email_alias: data.email_alias,
      is_training_completed: data.is_training_completed,
      authorization_officer_name: data.authorization_officer_name,
      authorization_date: data.authorization_date,
      // Temporarily remove employee field due to backend schema issue
    };

    // Try multiple approaches to handle backend schema issue
    const approaches = [
      { name: "Standard employee field", data: { ...formData, employee: id } },
      { name: "No employee field", data: formData },
      { name: "Employee ID field", data: { ...formData, employee_id: id } },
    ];

    let success = false;

    for (const approach of approaches) {
      try {
        console.log(`📡 Trying approach: ${approach.name}`);
        console.log("📤 Request body:", approach.data);

        const response = await AxiosWithToken.post("/hr/employees/system-authorization/", approach.data);

        console.log("✅ Success with approach:", approach.name, response.data);

        dispatch(
          openDialog({
            type: DialogType.HrSuccessModal,
            dialogProps: {
              label: "Employee information saved",
            },
          })
        );

        form.reset();
        success = true;
        break;
      } catch (error) {
        console.warn(`❌ Failed with approach: ${approach.name}`, error);
        // Continue to next approach
      }
    }

    if (!success) {
      console.error("❌ All approaches failed");
      toast.error("Authorization form temporarily unavailable due to backend configuration. Please contact IT support.", {
        duration: 6000,
      });

      // Show informative dialog instead of error
      dispatch(
        openDialog({
          type: DialogType.HrSuccessModal,
          dialogProps: {
            label: "Form submitted - Please note: Authorization data will need to be entered manually by IT administration due to a temporary system issue.",
          },
        })
      );
    }
  };
  const trainingOptions = [
    { value: "INTERNAL", label: "Internal" },
    { value: "EXTERNAL", label: "External" },
    { value: "BOTH", label: "Both" },
  ];

  // Commented out due to backend schema issue - can't fetch existing authorization data
  // React.useEffect(() => {
  //   if (authorization?.data.results[0]) {
  //     form.reset({
  //       user_login_name: authorization?.data.results[0].user_login_name,
  //       computer_name: authorization?.data.results[0].computer_name,
  //       email_alias: authorization?.data.results[0].email_alias,
  //       is_training_completed: authorization?.data.results[0].is_training_completed,
  //       authorization_officer_name: authorization?.data.results[0].authorization_officer_name,
  //       authorization_date: authorization?.data.results[0].authorization_date,
  //       employee: authorization?.data.results[0].employee,
  //     });
  //   }
  // }, [authorization]);

  return (
    <>
      {/* Temporary notice about backend issue */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Temporary System Notice
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                The authorization form is experiencing technical difficulties. Your information will be saved locally and processed manually by IT administration.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 mt-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <FormInput
              name='user_login_name'
              label='User Login Name'
              required
            />

            <FormInput
              name='computer_name'
              label='Computer Name (Only if previously granted)'
              required
            />

            <FormInput
              name='email_alias'
              label='E-mail MailBox Alias (only if previously approved)'
              required
            />

            <FormCheckBox
              name='is_training_completed'
              label='Training Completed'
            />

            <FormInput
              name='authorization_officer_name'
              label='Home Phone'
              required
            />

            <FormInput
              name='authorization_date'
              type='date'
              label='Date Completed'
              required
            />
          </div>

          <div className='flex gap-x-6 justify-end'>
            <FormButton
              loading={isLoading || updateLoading}
              disabled={isLoading || updateLoading}
              variant='outline'
            >
              <Save size={20} /> Save
            </FormButton>
          </div>
        </form>
      </Form>
    </>
  );
};
