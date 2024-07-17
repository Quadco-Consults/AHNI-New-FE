import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import Card from "components/shared/Card";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const stateOptions = [
  { label: "Abia", value: "Abia" },
  { label: "Adamawa", value: "Adamawa" },
  { label: "Akwa Ibom", value: "Akwa Ibom" },
];

const formSchema = z.object({
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  phone: z.string(),
  email: z.string(),
  website: z.string(),
  contactName: z.string(),
  position: z.string(),
  contactPhone: z.string(),
});

const AddRiskCategory = () => {
  const [addMore, setAddMore] = useState(false);
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      phone: "",
      email: "",
      website: "",
      contactName: "",
      position: "",
      contactPhone: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    if(addMore) {
        form.reset()
    }
    else {
        navigate("/modules-projects")
    }
    toast.success("Project Added Succesfully");
  };
  return (
    <div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white rounded-[2rem] flex flex-col gap-y-10 pb-[5rem]"
          >
            <Card className="p-0 pt-4">
              <CardContent className="w-100% flex flex-col gap-y-10 p-0">
                <div className="grid grid-cols-1">
                  <FormInput label="Name" name="name" required />
                </div>
                <div className="grid grid-cols-1">
                  <FormTextArea name="address" label="Address" required />
                </div>
                <div className="grid grid-cols-2 gap-x-7">
                  <FormInput label="City" name="city" required />
                  <FormSelect
                    label="State"
                    name="state"
                    required
                    options={stateOptions}
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-7">
                  <FormInput
                    label="phone"
                    name="phone"
                    required
                    type="number"
                  />
                  <FormInput label="Email" name="email" required type="email" />
                </div>
                <div className="grid grid-cols-1">
                  <FormInput label="Website" name="website" required />
                </div>
              </CardContent>
            </Card>
            <p className="text-[#FF0000] font-semibold text-sm">Contact Info</p>
            <div className="grid grid-cols-1">
              <FormInput label="Name" name="contactName" required />
            </div>
            <div className="grid grid-cols-2 gap-x-7">
              <FormInput label="Position" name="position" required />
              <FormInput
                label="Phone"
                name="contactPhone"
                required
                type="number"
              />
            </div>
            <div className="flex justify-start gap-4">
              <FormButton onClick={() => setAddMore(false)}>Save</FormButton>
              <FormButton onClick={() => setAddMore(true)}>Save and Add New</FormButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddRiskCategory;
