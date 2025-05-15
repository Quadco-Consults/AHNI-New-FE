import React from "react";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import FormInput from "atoms/FormInput";
import { useNavigate, useParams } from "react-router-dom";
import FormTextArea from "atoms/FormTextArea";
import FormSelect from "atoms/FormSelect";
import { Separator } from "components/ui/separator";
import { Button } from "components/ui/button";
import { ChevronRight, Save } from "lucide-react";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { HrRoutes } from "constants/RouterConstants";
import Card from "components/shared/Card";
import {
  hrEmergencySchema,
  HrEmergencyFormValues,
} from "definations/hr-validator";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import FormButton from "atoms/FormButton";
import {
  useUpdateHrEmergencyMutation,
  useCreateHrEmergencyMutation,
} from "services/hrApi/hr-employee-onboarding-add-info";
import { HrEmergencyResults } from "definations/hr-types/employee-onboarding";

export const EmergencyContactForm = ({
  number,
  emergencyContact,
}: {
  number: number;
  emergencyContact?: HrEmergencyResults;
}) => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const [createEmployeeEmergency, { isLoading }] =
    useCreateHrEmergencyMutation();

  const [updateEmployeeEmergency, { isLoading: updateLoading }] =
    useUpdateHrEmergencyMutation();

  const form = useForm<HrEmergencyFormValues>({
    resolver: zodResolver(hrEmergencySchema),
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

  const onSubmit = async (data: HrEmergencyFormValues) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("relationship", data.relationship);
    formData.append("home_phone", data.home_phone);
    formData.append("mobile_phone", data.mobile_phone);
    formData.append("email_address", data.email_address);
    formData.append("address", data.address);
    formData.append(
      "employee",
      emergencyContact ? emergencyContact.employee : (id as string)
    );

    if (emergencyContact) {
      try {
        const res = await updateEmployeeEmergency({
          id: id as string,
          body: formData,
        }).unwrap();

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
        const res = await createEmployeeEmergency(formData).unwrap();

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

  React.useEffect(() => {
    if (emergencyContact) {
      form.reset({
        name: emergencyContact.name,
        relationship: emergencyContact.relationship,
        home_phone: emergencyContact.home_phone,
        mobile_phone: emergencyContact.mobile_phone,
        email_address: emergencyContact.email_address,
        address: emergencyContact.address,
        employee: emergencyContact.employee,
      });
    }
  }, [emergencyContact]);

  return (
    <>
      <Separator className='my-6' />

      <h4 className='text-sm font-bold mb-6'>Contact {number}</h4>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='col-span-2'>
              <FormInput name='name' label='Name' required />
            </div>

            <FormInput name='relationship' label='Relationship' required />
            <FormInput name='email_address' label='Email Address' required />

            <div className='col-span-2'>
              <FormTextArea name='address' label='Address' required />
            </div>

            <FormInput name='home_phone' label='Home Phone' required />
            <FormInput name='mobile_phone' label='Mobile/Other' required />
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
