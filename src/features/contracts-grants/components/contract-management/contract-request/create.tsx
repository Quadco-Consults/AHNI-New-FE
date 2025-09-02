"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "components/atoms/BackNavigation";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import Card from "components/Card";
import {
  ContractRequestSchema,
  TContractRequestFormData,
} from "@/features/contracts-grants/types/contract-management/contract-request";
// import { UserCircle } from "lucide-react";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation"; 
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import {
  useCreateContractRequest,
  useModifyContractRequest,
  useUpdateContractRequest,
} from "@/features/contracts-grants/controllers/contractController";
import { useGetAllDepartments } from "@/features/modules/controllers/config/departmentController";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useGetAllFCONumbers } from "@/features/modules/controllers/finance/fcoNumberController";
import { toast } from "sonner";

export default function CreateContractRequest() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  //   const router = useRouter();
  const form = useForm<TContractRequestFormData>({
    resolver: zodResolver(ContractRequestSchema),
    defaultValues: {
      title: "",
      request_type: "",
      department: "",
      consultants_count: "",
      location: "",
      fco: "",
      technical_monitor: "",
      email: "",
      phone_number: "",
      current_reviewer: "",
      authorizer: "",
      approver: "",
    },
  });

  const { data: department } = useGetAllDepartments({
    page: 1,
    size: 2000000,
  });

  const departmentOptions = useMemo(
    () =>
      department?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [department]
  );

  const { data: location } = useGetAllLocations({
    page: 1,
    size: 2000000,
  });

  const locationOptions = useMemo(
    () =>
      location?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [location]
  );

  const { data: fco } = useGetAllFCONumbers({
    page: 1,
    size: 2000000,
  });

  const fcoOptions = useMemo(
    () =>
      fco?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [fco]
  );

  const { data: user } = useGetAllUsers({
    page: 1,
    size: 2000000,
  });

  const userOptions = useMemo(
    () =>
      user?.data.results.map(({ first_name, last_name, id }) => ({
        label: `${first_name} ${last_name}`,
        value: id,
      })),
    [user?.data.results]
  );
  console.log("User Options:", userOptions);
  const { createContractRequest, isLoading: isCreateLoading } =
    useCreateContractRequest();

  const { updateContractRequest: modifyContractRequest, isLoading: isModifyLoading } =
    useUpdateContractRequest(id || "");

  const onSubmit = async (data: any) => {
    console.log("Form submitted with data:", data);
    
    // Validate required fields before submission
    if (!data.location || data.location === "") {
      toast.error("Please select a location");
      return;
    }
    
    if (!data.current_reviewer || data.current_reviewer === "") {
      toast.error("Please select a current reviewer");
      return;
    }

    try {
      if (id) {
        await modifyContractRequest({ id, body: data });
        toast.success("Contract Updated Successfully");
      } else {
        await createContractRequest(data);
        toast.success("Contract Created Successfully");
      }

      //   router.push(CG_ROUTES.ContractRequest);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <section>
      <BackNavigation />

      <Card>
        <FormProvider {...form}>
          <form
            className='grid grid-cols-2 gap-10'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormInput
              label='Request Title'
              name='title'
              placeholder='Enter title'
              required
            />

            <FormSelect
              label='Request Type'
              name='request_type'
              placeholder='Select type'
              required
              options={[
                { label: "SERVICE", value: "SERVICE" },
                { label: "CONSULTANT", value: "CONSULTANT" },
                { label: "ADHOC", value: "ADHOC" },
                { label: "FACILITATOR", value: "FACILITATOR" },
              ]}
            />

            <FormSelect
              label='Requesting Department'
              name='department'
              placeholder='Select department'
              required
              options={departmentOptions}
            />

            <FormInput
              type='number'
              label='No of Consultants'
              name='consultants_count'
              placeholder='Enter consultants number'
              required
            />

            <FormSelect
              label='Location'
              name='location'
              placeholder='Select location'
              required
              options={locationOptions}
            />

            <FormSelect
              label='FCO'
              name='fco'
              placeholder='Select FCO'
              required
              options={fcoOptions}
            />

            <FormSelect
              label='Technical Monitor'
              name='technical_monitor'
              placeholder='Select technical monitor'
              required
              options={userOptions}
            />

            <FormInput
              type='email'
              label='Email'
              name='email'
              placeholder='Enter email'
              required
            />

            <FormInput
              type='number'
              label='Phone Number'
              name='phone_number'
              placeholder='Enter phone number'
              required
            />

            <FormSelect
              label='Reviewer'
              name='current_reviewer'
              placeholder='Select reviewer'
              required
              options={userOptions}
            />

            <FormSelect
              label='Authorizer'
              name='authorizer'
              placeholder='Select authorizer (optional)'
              options={userOptions}
            />

            <FormSelect
              label='Approver'
              name='approver'
              placeholder='Select approver (optional)'
              options={userOptions}
            />
            <div className=''>
              <FormButton
                size='lg'
                loading={isCreateLoading || isModifyLoading}
              >
                Submit
              </FormButton>
            </div>
          </form>
        </FormProvider>
      </Card>
    </section>
  );
}
