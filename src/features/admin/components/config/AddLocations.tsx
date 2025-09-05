"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import FormTextArea from "components/atoms/FormTextArea";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";
import { nigerianStates } from "lib/index";
import {
  LocationSchema,
  TLocationData,
  TLocationFormValues,
} from "@/features/admin/types/config/location";
import {
  useAddLocationMutation,
  useUpdateLocationMutation,
} from "@/features/modules/controllers/config/locationController";

const AddLocations = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const result = dialogProps?.data as unknown as TLocationData;

  const stateOptions = nigerianStates?.map((state: string) => ({
    label: state,
    value: state,
  }));

  const form = useForm<TLocationFormValues>({
    resolver: zodResolver(LocationSchema),
    defaultValues: {
      name: result?.name ?? "",
      address: result?.address ?? "",
      city: result?.city ?? "",
      state: result?.state ?? "",
      email: result?.email ?? "",
      phone: result?.phone ?? "",
    },
  });

  const dispatch = useAppDispatch();
  const [locations, { isLoading }] = useAddLocationMutation();
  const [updateLocations, { isLoading: updateLocationsLoading }] =
    useUpdateLocationMutation();

  const onSubmit: SubmitHandler<TLocationFormValues> = async (data) => {
    try {
      if (dialogProps?.type === "update") {
        await updateLocations({
          //@ts-ignore
          id: String(dialogProps?.data?.id),
          body: data,
        });
      } else {
        await locations(data);
      }

      toast.success("Location Added Succesfully");
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? error.message ?? "Something went wrong"
      );
    }
  };

  return (
    <CardContent className='w-100% flex flex-col gap-y-10 p-0'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='bg-white rounded-[2rem] flex flex-col gap-y-7 pb-[2rem]'
        >
          <FormInput
            label='Name'
            name='name'
            required
            placeholder='Enter Name'
          />

          <FormTextArea
            name='address'
            label='Address'
            required
            placeholder='Enter Address'
          />

          <FormInput
            label='City'
            name='city'
            required
            placeholder='Enter City'
          />

          <FormSelect
            label='State'
            name='state'
            required
            options={stateOptions}
            placeholder='Select State'
          />

          <FormInput
            label='Phone'
            name='phone'
            type='number'
            required
            placeholder='Enter Phone'
          />

          <FormInput
            label='Email'
            name='email'
            type='email'
            required
            placeholder='Enter Email'
          />

          <div className='flex justify-start gap-4'>
            <FormButton loading={isLoading || updateLocationsLoading}>
              Save
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddLocations;
