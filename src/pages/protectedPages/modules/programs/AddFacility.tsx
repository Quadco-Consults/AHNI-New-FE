import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useAddFacilitiesMutation,
  useStatesQuery,
  useUpdateFacilitiesMutation,
} from "services/module-programs";
import { TFacilities, facilitiesSchema } from "definations/module-programs";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";

const AddFacility = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const result = dialogProps?.data as unknown as TFacilities;

  const { data } = useStatesQuery({
    no_paginate: false,
  });

  const stateOptions = data?.map((state: string) => ({
    label: state,
    value: state,
  }));

  const form = useForm<TFacilities>({
    resolver: zodResolver(facilitiesSchema),
    defaultValues: {
      name: result?.name ?? "",
      state: result?.state ?? "",
      local_govt: result?.local_govt ?? "",
    },
  });

  const dispatch = useAppDispatch();
  const [facilities, { isLoading }] = useAddFacilitiesMutation();
  const [updateFacilities, { isLoading: updateFacilityLoading }] =
    useUpdateFacilitiesMutation();

  const onSubmit: SubmitHandler<TFacilities> = async (data) => {
    try {
      dialogProps?.type === "update"
        ? updateFacilities({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          }).unwrap()
        : await facilities(data).unwrap();
      toast.success("Facility Added Succesfully");
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      toast.error(error.data.message || "Something went wrong");
    }
  };

  return (
    <CardContent className="w-100% flex flex-col gap-y-10 p-0">
      <Form {...form}>
        <form
          action=""
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white rounded-[2rem] flex flex-col gap-y-10"
        >
          <div className="grid grid-cols-1">
            <FormInput label="Facility Name" name="name" required />
          </div>
          <div className="grid grid-cols-2 gap-x-7">
            <FormSelect
              label="State"
              name="state"
              required
              options={stateOptions}
            />
            <FormInput label="LGA" name="local_govt" required />
          </div>
          <div className="flex justify-start gap-4">
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
