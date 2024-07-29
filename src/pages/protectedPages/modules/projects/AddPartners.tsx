import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import Card from "components/shared/Card";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAddPartnersMutation, useStatesQuery } from "services/moduleProjects";
import { TPartners, parternersSchema } from "definations/module-projects";
import { toast } from "sonner";


const AddPartners = () => {
  const {data} = useStatesQuery({
    no_paginate: false
  })

  const stateOptions = data?.map((state: string) => (
    {
      label: state, value: state
    }
  ))

  const form = useForm<TPartners>({
    resolver: zodResolver(parternersSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      phone: "",
      email: "",
      website: "",
    },
  });
  const [partners, { isLoading }] = useAddPartnersMutation();

  const onSubmit: SubmitHandler<TPartners> = async (data) => {
    try {
      await partners(data).unwrap();
      toast.success("Partner Added Succesfully");
      form.reset();
    } catch (error: any) {
      toast.error(error.data.message || "Something went wrong");
    }
  };
  return (
    <Card className="pt-4">
      <CardContent className="w-100% flex flex-col gap-y-10 p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white rounded-[2rem] flex flex-col gap-y-10 pb-[2rem]"
          >
            <div className="grid grid-cols-1">
              <FormInput label="Name" name="name" required />
            </div>
            <div className="grid grid-cols-1">
              <FormTextArea name="address" label="Address" required />
            </div>
            <div className="grid grid-cols-2 gap-x-7">
              <FormInput label="City" name="city" />
              <FormSelect
                label="State"
                name="state"
                required
                options={stateOptions}
              />
            </div>
            <div className="grid grid-cols-2 gap-x-7">
              <FormInput label="phone" name="phone" type="number" />
              <FormInput label="Email" name="email" type="email" />
            </div>
            <div className="grid grid-cols-1">
              <FormInput label="Website" name="website" />
            </div>
            <div className="flex justify-start gap-4">
              <FormButton loading={isLoading}>Save</FormButton>
              <FormButton>Save and Add New</FormButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddPartners;
