"use client";

import React from "react";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import FormInput from "components/atoms/FormInput";
import { useParams } from "next/navigation";
import FormTextArea from "components/atoms/FormTextArea";

import { Separator } from "components/ui/separator";

import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";

import {
  hrEmergencySchema,
  HrEmergencyFormValues,
} from "features/hr/types/hr-validator";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import {
  useUpdateHrEmergency,
  useCreateHrEmergency,
} from "@/features/hr/controllers/hrEmployeeOnboardingAddInfoController";
import { HrEmergencyResults } from "definations/hr-types/employee-onboarding";
import { Save } from "lucide-react";

export const EmergencyContactForm = ({
  number,
  emergencyContact,
}: {
  number: number;
  emergencyContact?: HrEmergencyResults;
}) => {
  const id = localStorage.getItem("workforceID") || "";
  const dispatch = useAppDispatch();

  const { createHrEmergency, isLoading } =
    useCreateHrEmergency();

  const { updateHrEmergency, isLoading: updateLoading } =
    useUpdateHrEmergency(emergencyContact?.id || "");

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
    const formData = {
      name: data.name,
      relationship: data.relationship,
      home_phone: data.home_phone,
      mobile_phone: data.mobile_phone,
      email_address: data.email_address,
      address: data.address,
      employee: emergencyContact ? emergencyContact.employee : (id as string),
    };

    if (emergencyContact) {
      try {
        const res = await updateHrEmergency(formData);

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
        const res = await createHrEmergency(formData);

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
