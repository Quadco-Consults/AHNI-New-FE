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
import { useMemo, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import {
  useCreateContractRequest,
  useModifyContractRequest,
  useUpdateContractRequest,
  useGetSingleContractRequest,
} from "@/features/contracts-grants/controllers/contractController";
import { useGetAllDepartments } from "@/features/modules/controllers/config/departmentController";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useGetAllFCONumbers } from "@/features/modules/controllers/finance/fcoNumberController";
import { toast } from "sonner";
import { CG_ROUTES } from "constants/RouterConstants";
import { filterAhniStaffOnly } from "@/utils/userFilters";
import {
  getReviewerOptions,
  getAuthorizerOptions,
  getApproverOptions
} from "@/utils/approvalFilters";

export default function CreateContractRequest() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id");

  // Fetch existing contract request data for editing
  const { data: existingContractRequest, isLoading: isLoadingContractRequest } = useGetSingleContractRequest(
    id || "",
    !!id // Only fetch if there's an ID
  );

  // Debug console.log commented to prevent render loops
  // console.log('🔍 EDIT CONTRACT REQUEST DATA:', {
  //   id,
  //   isEdit: !!id,
  //   existingData: existingContractRequest?.data,
  //   isLoading: isLoadingContractRequest,
  //   context: 'contract_request_edit_mode'
  // });

  const form = useForm<TContractRequestFormData>({
    resolver: zodResolver(ContractRequestSchema),
    defaultValues: {
      title: "",
      request_type: "",
      department: "",
      consultants_count: "",
      service_type: "",
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

  // Debug FCO data loading - commented to prevent render loops
  // console.log('🔍 FCO DEBUG - Contract Request:', {
  //   fcoData: fco,
  //   fcoResults: fco?.data?.results,
  //   fcoCount: fco?.data?.results?.length || 0,
  //   context: 'contract_request_form'
  // });

  const fcoOptions = useMemo(
    () => {
      const options = fco?.data?.results?.map(({ name, id }) => ({
        label: name,
        value: id,
      })) || [];

      // Debug console.log commented to prevent render loops
      // console.log('📋 FCO OPTIONS CREATED:', {
      //   optionsCount: options.length,
      //   options: options.slice(0, 3), // Show first 3 options for debugging
      //   allOptions: options
      // });

      return options;
    },
    [fco]
  );

  const { data: user } = useGetAllUsers({
    page: 1,
    size: 2000000,
  });

  // Filter for AHNI staff only (exclude vendors, consultants, external users)
  const ahniStaff = useMemo(
    () => filterAhniStaffOnly(user?.data.results || []),
    [user?.data.results]
  );

  // User options for general fields (technical monitor)
  const userOptions = useMemo(
    () =>
      ahniStaff.map((userData) => ({
        label: userData.full_name ||
               [userData.first_name, userData.last_name]
                 .filter(name => name && name.trim())
                 .join(" ") ||
               userData.email || "User",
        value: userData.id,
      })),
    [ahniStaff]
  );

  // Filtered options for approval workflow - only users with appropriate permissions
  const reviewerOptions = useMemo(() => {
    const filtered = getReviewerOptions(ahniStaff);

    // TEMPORARY FIX: If no users with permissions found, show all AHNI staff
    if (filtered.length === 0) {
      // Debug console.warn commented to prevent render loops
      // console.warn('⚠️ No users with review permission found. Showing all AHNI staff as fallback.');
      return ahniStaff.map((userData) => ({
        label: userData.full_name ||
               [userData.first_name, userData.last_name]
                 .filter(name => name && name.trim())
                 .join(" ") ||
               userData.email || "User",
        value: userData.id,
      }));
    }

    return filtered;
  }, [ahniStaff]);

  const authorizerOptions = useMemo(() => {
    const filtered = getAuthorizerOptions(ahniStaff);

    // TEMPORARY FIX: If no users with permissions found, show all AHNI staff
    if (filtered.length === 0) {
      // Debug console.warn commented to prevent render loops
      // console.warn('⚠️ No users with authorize permission found. Showing all AHNI staff as fallback.');
      return ahniStaff.map((userData) => ({
        label: userData.full_name ||
               [userData.first_name, userData.last_name]
                 .filter(name => name && name.trim())
                 .join(" ") ||
               userData.email || "User",
        value: userData.id,
      }));
    }

    return filtered;
  }, [ahniStaff]);

  const approverOptions = useMemo(() => {
    const filtered = getApproverOptions(ahniStaff);

    // TEMPORARY FIX: If no users with permissions found, show all AHNI staff
    if (filtered.length === 0) {
      // Debug console.warn commented to prevent render loops
      // console.warn('⚠️ No users with approve permission found. Showing all AHNI staff as fallback.');
      return ahniStaff.map((userData) => ({
        label: userData.full_name ||
               [userData.first_name, userData.last_name]
                 .filter(name => name && name.trim())
                 .join(" ") ||
               userData.email || "User",
        value: userData.id,
      }));
    }

    return filtered;
  }, [ahniStaff]);

  // Watch technical_monitor field for auto-population
  const selectedTechnicalMonitor = form.watch('technical_monitor');

  // Auto-populate email and phone when technical monitor is selected
  useEffect(() => {
    if (selectedTechnicalMonitor && ahniStaff.length > 0) {
      const selectedUser = ahniStaff.find(user => user.id === selectedTechnicalMonitor);

      if (selectedUser) {
        // Debug console.logs commented to prevent render loops
        // console.log('🔄 AUTO-POPULATING Technical Monitor Details:', {
        //   selectedUserId: selectedTechnicalMonitor,
        //   selectedUserName: selectedUser.first_name + ' ' + selectedUser.last_name,
        //   email: selectedUser.email,
        //   rawUserData: selectedUser,
        //   mobile_number: selectedUser.mobile_number,
        //   phone_number: selectedUser.phone_number,
        //   phone: selectedUser.phone,
        //   mobile: selectedUser.mobile,
        //   context: 'contract_request_technical_monitor'
        // });

        // Auto-populate email
        if (selectedUser.email) {
          const currentEmail = form.getValues('email');
          if (currentEmail !== selectedUser.email) {
            // console.log('📧 Setting email:', selectedUser.email);
            form.setValue('email', selectedUser.email, { shouldValidate: false });
          }
        }

        // Auto-populate mobile number (prioritize mobile_number field, then fallback to other variations)
        const mobileNumber = selectedUser.mobile_number || selectedUser.phone_number || selectedUser.phone || selectedUser.mobile;
        // console.log('📱 Mobile number analysis:', {
        //   mobile_number: selectedUser.mobile_number,
        //   phone_number: selectedUser.phone_number,
        //   phone: selectedUser.phone,
        //   mobile: selectedUser.mobile,
        //   finalValue: mobileNumber
        // });

        if (mobileNumber) {
          const currentPhoneNumber = form.getValues('phone_number');
          const mobileNumberString = mobileNumber.toString();
          if (currentPhoneNumber !== mobileNumberString) {
            // console.log('📱 Setting mobile number:', mobileNumber);
            form.setValue('phone_number', mobileNumberString, { shouldValidate: false });
          }
        } else {
          // console.warn('⚠️ No mobile number found for user');
        }
      }
    }
  }, [selectedTechnicalMonitor, ahniStaff]);

  // Populate form with existing data when editing
  useEffect(() => {
    if (existingContractRequest?.data && !isLoadingContractRequest) {
      const contractData = existingContractRequest.data;

      // Debug console.log commented to prevent render loops
      // console.log('🔄 POPULATING FORM WITH EXISTING DATA:', {
      //   contractData,
      //   context: 'contract_request_edit_populate'
      // });

      // Populate form fields with existing data
      form.setValue("title", contractData.title || "");
      form.setValue("request_type", contractData.request_type || "");
      form.setValue("department", contractData.department || "");
      form.setValue("consultants_count", contractData.consultants_count?.toString() || "");
      form.setValue("service_type", contractData.service_type || "");
      form.setValue("location", contractData.location || "");
      form.setValue("fco", contractData.fco || "");
      form.setValue("technical_monitor", contractData.technical_monitor || "");
      form.setValue("email", contractData.email || "");
      form.setValue("phone_number", contractData.phone_number || "");
      form.setValue("current_reviewer", contractData.current_reviewer || contractData.reviewer || "");
      form.setValue("authorizer", contractData.authorizer || "");
      form.setValue("approver", contractData.approver || "");
    }
  }, [existingContractRequest, isLoadingContractRequest]);

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

    // Transform data for backend
    const payload = {
      ...data,
      // Convert consultants_count to integer if it exists, otherwise send null or undefined
      consultants_count: data.consultants_count ? parseInt(data.consultants_count, 10) : undefined,
    };

    // Remove consultants_count if it's not required (for SERVICE type)
    if (data.request_type === 'SERVICE') {
      delete payload.consultants_count;
    }

    try {
      if (id) {
        console.log("Updating contract with payload:", payload);
        await modifyContractRequest(payload);
        toast.success("Contract Updated Successfully");
      } else {
        console.log("Creating contract with payload:", payload);
        await createContractRequest(payload);
        toast.success("Contract Created Successfully");
      }

      router.push(CG_ROUTES.CONTRACT_REQUEST);
    } catch (error: any) {
      console.error("Contract request submission error:", error);
      toast.error(error?.message || error?.data?.message || "Something went wrong");
    }
  };

  // Show loading state while fetching existing data for edit
  if (id && isLoadingContractRequest) {
    return (
      <section>
        <BackNavigation />
        <Card>
          <div className="p-6 text-center">
            <p>Loading contract request data...</p>
          </div>
        </Card>
      </section>
    );
  }

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

            {/* Conditionally show consultants count only for ADHOC, CONSULTANT, or FACILITATOR */}
            {(form.watch('request_type') === 'ADHOC' ||
              form.watch('request_type') === 'CONSULTANT' ||
              form.watch('request_type') === 'FACILITATOR') && (
              <FormInput
                type='number'
                label='No of Consultants'
                name='consultants_count'
                placeholder='Enter consultants number'
                required
              />
            )}

            {/* Conditionally show service type dropdown only for SERVICE */}
            {form.watch('request_type') === 'SERVICE' && (
              <FormSelect
                label='Service Type'
                name='service_type'
                placeholder='Select service type'
                required
                options={[
                  { label: "Catering Services", value: "CATERING" },
                  { label: "Cleaning Services", value: "CLEANING" },
                  { label: "Security Services", value: "SECURITY" },
                  { label: "Transportation Services", value: "TRANSPORTATION" },
                  { label: "IT Services", value: "IT_SERVICES" },
                  { label: "Maintenance Services", value: "MAINTENANCE" },
                  { label: "Printing Services", value: "PRINTING" },
                  { label: "Photography/Videography", value: "PHOTOGRAPHY" },
                  { label: "Event Management", value: "EVENT_MANAGEMENT" },
                  { label: "Training Services", value: "TRAINING" },
                  { label: "Legal Services", value: "LEGAL" },
                  { label: "Financial Services", value: "FINANCIAL" },
                  { label: "Other Services", value: "OTHER" },
                ]}
              />
            )}

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
              type='tel'
              label='Mobile Number'
              name='phone_number'
              placeholder='Enter mobile number'
              required
            />

            <FormSelect
              label='Reviewer'
              name='current_reviewer'
              placeholder='Select reviewer'
              required
              options={reviewerOptions}
            />

            <FormSelect
              label='Authorizer'
              name='authorizer'
              placeholder='Select authorizer (optional)'
              options={authorizerOptions}
            />

            <FormSelect
              label='Approver'
              name='approver'
              placeholder='Select approver (optional)'
              options={approverOptions}
            />
            <div className=''>
              <FormButton
                size='lg'
                loading={isCreateLoading || isModifyLoading}
              >
                {id ? "Update Contract Request" : "Submit"}
              </FormButton>
            </div>
          </form>
        </FormProvider>
      </Card>
    </section>
  );
}
