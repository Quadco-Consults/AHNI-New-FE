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
import FormButton from "components/atoms/FormButton";
import {
  useUpdateSystemAuthorization,
  useCreateSystemAuthorization,
} from "@/features/hrApi/hr-employee-onboarding-add-authorizationController";
import { useGetSystemAuthorizationList } from "@/features/hrApi/hr-employee-onboarding-add-authorization";

export const AuthorizationForm = () => {
  const id = localStorage.getItem("workforceID") || "";
  const dispatch = useAppDispatch();

  const { data: authorization } = useGetSystemAuthorizationList({
    employee: id as string,
  });

  const { createSystemAuhorization, isLoading } =
    useCreateSystemAuthorization();

  const { updateSystemAuthorization, isLoading: updateLoading } =
    useUpdateSystemAuthorization();

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
    const formData = new FormData();

    formData.append("user_login_name", data.user_login_name);
    formData.append("computer_name", data.computer_name);
    formData.append("email_alias", data.email_alias);
    formData.append("is_training_completed", data.is_training_completed);
    formData.append(
      "authorization_officer_name",
      data.authorization_officer_name
    );
    formData.append("authorization_date", data.authorization_date);
    formData.append("employee", id as string);

    if (authorization?.data.results.length) {
      try {
        const res = await updateSystemAuthorization({
          id: id as string,
          body: formData,
        })();

        dispatch(
          openDialog({
            type: DialogType.HrSuccessModal,
            dialogProps: {
              label: "Employee information saved",
            },
          })
        );

        console.log(res);

        form.reset();
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    } else {
      try {
        const res = await createSystemAuhorization(formData)();

        dispatch(
          openDialog({
            type: DialogType.HrSuccessModal,
            dialogProps: {
              label: "Employee information saved",
            },
          })
        );

        console.log(res);

        form.reset();
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    }
  };
  const trainingOptions = [
    { value: "INTERNAL", label: "Internal" },
    { value: "EXTERNAL", label: "External" },
    { value: "BOTH", label: "Both" },
  ];

  React.useEffect(() => {
    if (authorization?.data.results[0]) {
      form.reset({
        user_login_name: authorization?.data.results[0].user_login_name,
        computer_name: authorization?.data.results[0].computer_name,
        email_alias: authorization?.data.results[0].email_alias,
        is_training_completed:
          authorization?.data.results[0].is_training_completed,
        authorization_officer_name:
          authorization?.data.results[0].authorization_officer_name, // Name & signature
        authorization_date: authorization?.data.results[0].authorization_date, // Date completed
        employee: authorization?.data.results[0].employee,
      });
    }
  }, [authorization]);

  return (
    <>
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
