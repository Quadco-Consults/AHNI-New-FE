"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { nigerianStates } from "lib/index";
import {
  FacilitySchema,
  TFacilityData,
  TFacilityFormValues,
} from "@/features/programs/types/program/facility";
import {
  useAddFacility,
  useUpdateFacility,
} from "@/features/modules/controllers/program/facilityController";

const AddFacility = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const result = dialogProps?.data as unknown as TFacilityData;

  const stateOptions = nigerianStates?.map((state: string) => ({
    label: state,
    value: state,
  }));

  const form = useForm<TFacilityFormValues>({
    resolver: zodResolver(FacilitySchema),
    defaultValues: {
      name: result?.name ?? "",
      phone: result?.phone ?? "",
      postion: result?.postion ?? "",
      contact_person: result?.contact_person ?? "",
      email: result?.email ?? "",
      state: result?.state ?? "",
      lga: result?.lga ?? "",
    },
  });

  const dispatch = useAppDispatch();
  const [facilities, { isLoading }] = useAddFacility();
  const [updateFacilities, { isLoading: updateFacilityLoading }] =
    useUpdateFacility();

  const onSubmit: SubmitHandler<TFacilityFormValues> = async (data) => {
    try {
      dialogProps?.type === "update"
        ? await updateFacilities({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          })
        : await facilities(data);
      toast.success("Facility Added Succesfully");
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
          action=''
          onSubmit={form.handleSubmit(onSubmit)}
          className='bg-white rounded-[2rem] flex flex-col gap-y-7'
        >
          <FormInput
            label='Facility Name'
            name='name'
            required
            placeholder='Enter Facility Name'
          />

          <FormInput
            label='Phone Number'
            name='phone'
            required
            placeholder='Enter Phone Number'
          />
          <FormInput
            label='Email'
            name='email'
            required
            placeholder='Enter Email'
          />

          <FormInput
            label='Contact Person'
            name='contact_person'
            placeholder='Enter Contact Person'
            required
          />
          <FormInput
            label='Position'
            name='postion'
            required
            placeholder='Enter Position'
          />

          <FormSelect
            label='State'
            name='state'
            required
            options={stateOptions}
            placeholder='Select State'
          />

          <FormInput label='LGA' name='lga' required placeholder='Enter LGA' />
          <div className='flex justify-start gap-4'>
            <FormButton loading={isLoading || updateFacilityLoading}>
              Save
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddFacility;
