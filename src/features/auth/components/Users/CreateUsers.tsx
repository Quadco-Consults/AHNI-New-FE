"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "components/atoms/BackNavigation";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import Card from "components/Card";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreateUserSchema, TCreateUserFormValues } from "features/auth/types/user";
import { useCreateUser } from "../../controllers/userController";
import { useGetAllRoles } from "../../controllers/roleController";
import FormMultiSelect from "components/atoms/FormMultiSelect";

const genderOptions = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "Other" },
];

const CreateUsers = () => {
  const form = useForm<TCreateUserFormValues>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      mobile_number: "",
      position: "",
      user_type: "",
      roles: [],
      location: "",
    },
  });
  const { data: role } = useGetAllRoles({
    page: 1,
    size: 2000000,
  });

  const roleOptions = role?.data?.results?.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  // TODO: Add department, position, and location controllers when config services are converted
  const departmentOptions: any[] = [];
  const positionOptions: any[] = [];
  const locationOptions: any[] = [];

  const userOptions = [
    { value: "VENDOR", label: "Vendor" },
    { value: "ADHOC_STAFF", label: "Adhoc Staff" },
    { value: "FACILITATOR", label: "Facilitator" },
    { value: "CONSULTANT", label: "Consultant" },

    { value: "AHNI_STAFF", label: "Ahni Staff" },
    { value: "ADMIN", label: "Admin" },
  ];

  const { createUser, isLoading } = useCreateUser();

  const router = useRouter();

  const onSubmit: SubmitHandler<TCreateUserFormValues> = async (data) => {
    await createUser(data);
    form.reset();
    router.push("/users");
  };
  return (
    <div>
      <div>
        <BackNavigation extraText='Add Users' />
      </div>
      <div>
        <Card>
          <CardContent className='p-6'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col gap-y-10'
              >
                <div className='grid grid-cols-2 gap-x-7'>
                  <FormInput label='First Name' name='first_name' required />
                  <FormInput label='Last Name' name='last_name' required />
                </div>
                <div className='grid grid-cols-2 gap-x-7'>
                  <FormInput label='Email' name='email' required />
                  <FormInput
                    label='Mobile Number'
                    name='mobile_number'
                    required
                    type='number'
                  />
                </div>
                <div className='grid grid-cols-2 gap-x-7'>
                  <FormSelect
                    label='Gender'
                    name='gender'
                    placeholder='Select Gender'
                    required
                    options={genderOptions}
                  />

                  <FormSelect
                    label='Department'
                    name='department'
                    required
                    options={departmentOptions}
                  />
                </div>

                <div className='grid grid-cols-2 gap-x-7'>
                  <FormSelect
                    label='Position'
                    name='position'
                    required
                    options={positionOptions}
                  />
                  <FormSelect
                    label='Location'
                    name='location'
                    required
                    options={locationOptions}
                  />
                </div>
                <div className='grid grid-cols-2 gap-x-7'>
                  <FormSelect
                    label='User Type'
                    name='user_type'
                    required
                    options={userOptions}
                  />

                  <FormMultiSelect
                    label='User Roles'
                    name='roles'
                    required
                    placeholder='Select roles'
                    options={roleOptions}
                  />
                </div>
                <div className='flex justify-end'>
                  <FormButton loading={isLoading}>Create</FormButton>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateUsers;
