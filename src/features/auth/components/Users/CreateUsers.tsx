"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "@/components/atoms/BackNavigation";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/atoms/FormInput";
import FormSelect from "@/components/atoms/FormSelect";
import Card from "@/components/Card";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CreateUserSchema,
  TCreateUserFormValues,
} from "@/features/auth/types/user";
import { useCreateUser } from "../../controllers/userController";
import { useGetAllRoles } from "../../controllers/roleController";
import FormMultiSelect from "@/components/atoms/FormMultiSelect";
import { useMemo } from "react";
import {
  useGetAllDepartmentsQuery,
  useGetAllLocationsQuery,
  useGetAllPositions,
} from "@/features/modules/controllers";

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
  const { data: department } = useGetAllDepartmentsQuery({
    page: 1,
    size: 2000000,
  });
  const { data: position } = useGetAllPositions({
    page: 1,
    size: 2000000,
  });

  const { data: location } = useGetAllLocationsQuery({
    page: 1,
    size: 2000000,
  });

  const roleOptions = role?.data?.results?.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  // TODO: Add department, position, and location controllers when config services are converted
  const departmentOptions = useMemo(
    () =>
      department?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [department]
  );

  const locationOptions = useMemo(
    () =>
      // @ts-ignore
      location?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [location]
  );
  const positionOptions = position?.data.results.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

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
    try {
      // Debug logging for role assignment
      console.log("🔍 CREATE USER - Form data:", data);
      console.log("🔍 CREATE USER - Roles:", data.roles);
      console.log("🔍 CREATE USER - Roles type:", typeof data.roles);
      console.log("🔍 CREATE USER - Roles is array:", Array.isArray(data.roles));
      if (data.roles) {
        console.log("🔍 CREATE USER - Roles length:", data.roles.length);
        data.roles.forEach((role, index) => {
          console.log(`🔍 CREATE USER - Role[${index}]:`, role, "Type:", typeof role);
        });
      }

      // Route to appropriate database based on user type
      await createUserByType(data);
      toast.success("User created successfully");
      form.reset();
      router.push("/dashboard/users");
    } catch (error: any) {
      toast.error(error?.message || "Failed to create user");
    }
  };

  /**
   * Creates user account (backend handles everything).
   *
   * Backend automatically:
   * - Creates user in users_user table
   * - Auto-generates password (12 random characters)
   * - Sends welcome email with login credentials
   * - Auto-assigns staff ID for AHNI staff (AHNi0001, AHNi0002, etc.)
   * - Assigns roles from the form
   *
   * NO Secondary Records Created:
   * - Employee onboarding: Created through HR onboarding workflow
   * - Vendor records: Created after vendor prequalification
   * - Consultant records: Created after contract issue
   * - Adhoc/Facilitator records: Created after contract issue
   */
  const createUserByType = async (data: TCreateUserFormValues) => {
    // Create user - backend handles everything
    await createUser(data);
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
                    type='tel'
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
