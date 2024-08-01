import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import Card from "components/shared/Card";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useAddFacilitiesMutation,
  useStatesQuery,
} from "services/module-programs";
import { TFacilities, facilitiesSchema } from "definations/module-programs";
import { toast } from "sonner";

const AddFacility = () => {
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
      name: "",
      state: "",
      local_govt: "",
    },
  });

  const [facilities, { isLoading }] = useAddFacilitiesMutation();

  const onSubmit: SubmitHandler<TFacilities> = async (data) => {
    try {
      await facilities(data).unwrap();
      toast.success("Facility Added Succesfully");
      form.reset();
    } catch (error: any) {
      toast.error(error.data.message || "Something went wrong");
    }
  };

  return (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white rounded-[2rem] flex flex-col gap-y-10"
          >
            <Card className="pt-4">
              <CardContent className="w-100% flex flex-col gap-y-10 p-0">
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
                  <FormButton loading={isLoading}>Save</FormButton>
                  <FormButton>Save and Add New</FormButton>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
  );
};

export default AddFacility;
