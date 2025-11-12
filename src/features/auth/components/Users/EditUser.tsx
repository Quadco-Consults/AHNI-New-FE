"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import { Switch } from "components/ui/switch";
import { Form } from "components/ui/form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { useMemo, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useGetAllDepartments } from "@/features/modules/controllers/config/departmentController";
import { useGetAllPositions } from "@/features/modules/controllers/config/positionController";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useUpdateUser } from "../../controllers/userController";
// Import specialized controllers for different user types
import { useUpdateFacilitator } from "@/features/contracts-grants/controllers/facilitatorManagementController";
import { useUpdateConsultantManagement } from "@/features/contracts-grants/controllers/consultantManagementController";
import { useUpdateVendor } from "@/features/procurement/controllers/vendorsController";
import { useUpdateEmployeeOnboarding } from "@/features/hr/controllers/employeeOnboardingController";
import { useCreateEmployeeOnboardingBankAcct, useUpdateEmployeeOnboardingBankAcct } from "@/features/hr/controllers/hrEmployeeOnboardingBankAccountController";
import { toast } from "sonner";
import { closeDialog, dailogSelector } from "store/ui";
import { TUpdateUserFormValues, UpdateUserSchema } from "features/auth/types/user";
import { useGetAllRoles } from "../../controllers/roleController";
import FormMultiSelect from "components/atoms/FormMultiSelect";

const genderOptions = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "Other" },
];

const userTypeOptions = [
  { label: "AHNI Staff", value: "AHNI_STAFF" },
  { label: "Adhoc Staff", value: "ADHOC_STAFF" },
  { label: "Consultant", value: "CONSULTANT" },
  { label: "Facilitator", value: "FACILITATOR" },
  { label: "Vendor", value: "VENDOR" },
  { label: "Admin", value: "ADMIN" },
];

export default function EditUserModal() {
  const { dialogProps } = useAppSelector(dailogSelector) as {
    dialogProps: {
      data: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        mobile_number: string;
        gender: string;
        location: any; // Can be string (id) or object with id
        department: any; // Can be string (id) or object with id
        position: any; // Can be string (id) or object with id
        user_type: string;
        roles: any[]; // Can be string[] (ids) or object[] with id
        is_active: boolean;
      };
    };
  };

  const form = useForm<TUpdateUserFormValues>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      mobile_number: "",
      gender: "",
      location: "",
      department: "",
      position: "",
      designation: "",
      user_type: "",
      roles: [],
      is_active: true,
    },
  });

  // Move all data fetching hooks before useEffect
  const { data: department, isLoading: isDepartmentLoading, error: departmentError } = useGetAllDepartments({
    page: 1,
    size: 2000000,
  });

  const { data: role, isLoading: isRoleLoading, error: roleError } = useGetAllRoles({
    page: 1,
    size: 2000000,
  });

  const { data: position, isLoading: isPositionLoading, error: positionError } = useGetAllPositions({
    page: 1,
    size: 2000000,
  });

  const { data: location, isLoading: isLocationLoading, error: locationError } = useGetAllLocations({
    page: 1,
    size: 2000000,
  });

  // Reset form when dialog data changes
  useEffect(() => {
    if (dialogProps?.data) {
      const userData = dialogProps.data;

      // Debug the user data structure
      console.log("Full user data structure:", userData);
      console.log("Location data:", userData.location);
      console.log("Department data:", userData.department);
      console.log("Position data:", userData.position);
      console.log("Gender data:", userData.gender);
      console.log("User type data:", userData.user_type);
      console.log("Roles data:", userData.roles);

      // Helper function to find location ID by name
      const findLocationIdByName = (locationName: string) => {
        if (!locationName || !location?.data?.results) {
          console.log("Location lookup failed - missing data:", { locationName, hasLocationData: !!location?.data?.results });
          return "";
        }
        console.log("Looking for location:", locationName, "in", location.data.results);
        const foundLocation = location.data.results.find((loc: any) =>
          loc.name === locationName
        );
        console.log("Found location:", foundLocation);
        return foundLocation?.id ?? "";
      };

      const formData = {
        first_name: userData.first_name ?? "",
        last_name: userData.last_name ?? "",
        email: userData.email ?? "",
        mobile_number: userData.mobile_number ?? "",
        gender: userData.gender ?? "",
        location: userData.location?.id ?? findLocationIdByName(userData.location) ?? "",
        department: userData.department?.id ?? userData.department ?? "",
        position: userData.position?.id ?? userData.position ?? "",
        designation: userData.position?.id ?? userData.position ?? "", // Same as position
        user_type: userData.user_type ?? "",
        roles: userData.roles?.map((role: any) =>
          typeof role === 'string' ? role : role.id
        ) ?? [],
        is_active: userData.is_active ?? true,
      };

      console.log("Form data being set:", formData);
      form.reset(formData);
    }
  }, [dialogProps?.data, form, location]);

  const departmentOptions = useMemo(
    () =>
      department?.data?.results?.map(({ name, id }) => ({
        label: name,
        value: id,
      })) || [],
    [department]
  );

  const positionOptions = useMemo(
    () =>
      position?.data?.results?.map(({ name, id }) => ({
        label: name,
        value: id,
      })) || [],
    [position]
  );

  const roleOptions = useMemo(
    () =>
      role?.data?.results?.map(({ name, id }) => ({
        label: name,
        value: id,
      })) || [],
    [role]
  );

  const locationOptions = useMemo(
    () =>
      location?.data?.results?.map(({ name, id }) => ({
        label: name,
        value: id,
      })) || [],
    [location]
  );

  // Debug logs to see what data is being loaded
  useEffect(() => {
    console.log("Dialog Props Data:", dialogProps?.data);
    console.log("Department data:", department);
    console.log("Position data:", position);
    console.log("Role data:", role);
    console.log("Location data:", location);
    
    if (departmentError) console.error("Department error:", departmentError);
    if (positionError) console.error("Position error:", positionError);  
    if (roleError) console.error("Role error:", roleError);
    if (locationError) console.error("Location error:", locationError);
  }, [dialogProps?.data, department, position, role, location, departmentError, positionError, roleError, locationError]);

  const dispatch = useAppDispatch();

  const userId = dialogProps?.data?.id;
  const { updateUser, isLoading: isUpdateLoading } = useUpdateUser(userId || "");
  
  // We need to determine the vendor ID to update the vendor record
  // This would typically come from the user data or require a lookup
  const { updateVendor, isLoading: isVendorUpdateLoading } = useUpdateVendor(userId || ""); // Using userId as vendorId for now
  
  // For adhoc staff updates - we'd need the consultant management ID
  // For now, using userId as a placeholder until we implement proper ID lookup
  const { updateConsultantManagement, isLoading: isAdhocUpdateLoading } = useUpdateConsultantManagement(userId || "");
  
  // For facilitator updates - we'd need the facilitator ID
  // For now, using userId as a placeholder until we implement proper ID lookup
  const { updateFacilitator, isLoading: isFacilitatorUpdateLoading } = useUpdateFacilitator(userId || "");
  
  // For workforce updates - backend now handles User ID lookup automatically
  const { updateEmployeeOnboarding, isLoading: isEmployeeUpdateLoading } = useUpdateEmployeeOnboarding(userId);

  // Bank account management - for adhoc staff, consultants, etc.
  const { createEmployeeOnboardingBankAcct, isLoading: isBankCreateLoading } = useCreateEmployeeOnboardingBankAcct();
  const { updateEmployeeOnboardingBankAcct, isLoading: isBankUpdateLoading } = useUpdateEmployeeOnboardingBankAcct(userId || "");

  const onSubmit: SubmitHandler<TUpdateUserFormValues> = async (data) => {
    if (!userId) return;
    
    try {
      // Route to appropriate database based on user type
      await updateUserByType(data);
      toast.success("User updated successfully");
      dispatch(closeDialog());
    } catch (error: any) {
      toast.error(error?.message || "Failed to update user");
    }
  };

  /**
   * Updates user with bidirectional relationship:
   * 1. Always updates main users table (for authentication, roles, permissions)
   * 2. Also updates specialized table if user type has specialized data
   * 
   * Bidirectional Update Logic:
   * - ALL USERS → Update main users table
   * - ADHOC_STAFF → ALSO update adhoc table (linked by user_id)
   * - FACILITATOR → ALSO update facilitator table (linked by user_id)
   * - CONSULTANT → ALSO update consultant table (linked by user_id)
   * - VENDOR → ALSO update vendor table (linked by user_id)
   * - AHNI_STAFF & ADMIN → Only update users table
   */
  const updateUserByType = async (data: TUpdateUserFormValues) => {
    // Always use the form data user_type first (for conversions), fallback to existing only if undefined
    const userType = data.user_type ?? dialogProps?.data?.user_type;
    const userId = dialogProps?.data?.id;

    console.log("🔍 Debug updateUserByType:");
    console.log("  Form data user_type:", data.user_type);
    console.log("  Dialog data user_type:", dialogProps?.data?.user_type);
    console.log("  Final determined userType:", userType);
    console.log("  Full form data:", data);

    if (!userId) {
      throw new Error("No user ID available for update");
    }

    // STEP 1: Always update main users table first
    console.log("🚀 Updating main user table with data:", data);
    await updateUser(data);
    
    // STEP 2: Also update specialized table based on user type
    console.log("🎯 Routing to user type case:", userType);
    switch (userType) {
      case "ADHOC_STAFF":
        console.log("📝 Updating ADHOC_STAFF record");
        // Update adhoc table record linked to this user
        await updateAdhocUserRecord(userId, data);
        break;
      case "FACILITATOR":
        console.log("📝 Updating FACILITATOR record");
        // Update facilitator table record linked to this user
        await updateFacilitatorUserRecord(userId, data);
        break;
      case "CONSULTANT":
        console.log("📝 Updating CONSULTANT record");
        // Update consultant table record linked to this user
        await updateConsultantUserRecord(userId, data);
        break;
      case "VENDOR":
        console.log("📝 Updating VENDOR record");
        // Update vendor table record linked to this user
        await updateVendorUserRecord(userId, data);
        break;
      case "AHNI_STAFF":
      case "ADMIN":
        console.log("📝 Updating AHNI_STAFF/ADMIN workforce record");
        // Update workforce record in employee onboarding table
        await updateWorkforceUserRecord(userId, data);
        break;
      default:
        console.log("📝 No specialized table to update for user type:", userType);
        // Only exists in main users table - no specialized table to update
        break;
    }

    // STEP 3: Update bank account details for applicable user types
    if (data.bank_name || data.account_number || data.account_name) {
      await updateUserBankAccount(userId, data);
    }
  };

  // Functions to update specialized table records (linked to main user)
  // These update additional records in specialized tables with user_id foreign key
  const updateAdhocUserRecord = async (userId: string, data: TUpdateUserFormValues) => {
    console.log("Updating adhoc record for user:", userId, data);
    
    // Update adhoc record in consultant management database
    const adhocUpdateData = mapUserUpdateToAdhoc(data);
    await updateConsultantManagement(adhocUpdateData);
  };

  const updateFacilitatorUserRecord = async (userId: string, data: TUpdateUserFormValues) => {
    console.log("Updating facilitator record for user:", userId, data);
    
    // Update facilitator record in facilitator database
    const facilitatorUpdateData = mapUserUpdateToFacilitator(data);
    await updateFacilitator(facilitatorUpdateData);
  };

  const updateConsultantUserRecord = async (userId: string, data: TUpdateUserFormValues) => {
    console.log("Updating consultant record for user:", userId, data);
    
    // Update consultant record in consultant management database
    const consultantUpdateData = mapUserUpdateToConsultant(data);
    await updateConsultantManagement(consultantUpdateData);
  };

  const updateVendorUserRecord = async (userId: string, data: TUpdateUserFormValues) => {
    console.log("Updating vendor record for user:", userId, data);
    
    // Update vendor record in procurement/suppliers database
    const vendorUpdateData = mapUserUpdateToVendor(data);
    await updateVendor(vendorUpdateData);
  };

  const updateWorkforceUserRecord = async (userId: string, data: TUpdateUserFormValues) => {
    console.log("Updating workforce record for user:", userId, data);

    // Update employee onboarding record in workforce database
    // Backend now handles User ID lookup automatically
    const workforceUpdateData = mapUserUpdateToWorkforce(data);
    await updateEmployeeOnboarding(workforceUpdateData);
  };

  // Function to update bank account details
  const updateUserBankAccount = async (userId: string, data: TUpdateUserFormValues) => {
    console.log("Updating bank account details for user:", userId, data);

    // Create or update bank account record
    const bankAccountData = {
      bank_name: data.bank_name || "",
      branch_name: data.branch_name || "",
      account_name: data.account_name || "",
      account_number: data.account_number || "",
      sort_code: data.sort_code || "",
      employee: userId, // Link to the user
    };

    try {
      // Try to update first (in case bank account already exists)
      await updateEmployeeOnboardingBankAcct(bankAccountData);
    } catch (error) {
      // If update fails, try to create new bank account record
      console.log("Update failed, attempting to create new bank account record");
      await createEmployeeOnboardingBankAcct(bankAccountData);
    }
  };

  // Helper function to map user update data to vendor format
  const mapUserUpdateToVendor = (userData: TUpdateUserFormValues) => {
    return {
      // Update company information (preserve incomplete indicator if present)
      company_name: `${userData.first_name} ${userData.last_name} [BUSINESS PROFILE MAY BE INCOMPLETE]`,
      
      // Update contact information
      email: userData.email,
      phone_number: userData.mobile_number,
      
      // Update basic info with incomplete warnings
      company_address: "⚠️ UPDATED FROM USER MANAGEMENT - Business address may need completion",
      state: "⚠️ UPDATED FROM USER MANAGEMENT - State/location may need completion",
      
      // Update status to indicate possible incomplete profile
      status: "⚠️ UPDATED FROM USER MANAGEMENT - May require business registration completion",
      
      // Update key staff information with incomplete warning
      key_staff: [
        {
          name: `${userData.first_name} ${userData.last_name}`,
          phone_number: userData.mobile_number,
          address: "⚠️ TO BE COMPLETED",
          qualification: "⚠️ TO BE COMPLETED"
        }
      ],
      
      // Mark as last updated from user management with completion guidance
      last_updated_from: "USER_MANAGEMENT",
      extra_info: `⚠️ UPDATED FROM USER MANAGEMENT - If business profile is incomplete (missing: RC number, TIN, business address, bank details, shareholders, production capacity, quality control procedures, business documents, client references), complete via vendor registration and prequalification process.`
    };
  };

  // Helper function to map user update data to adhoc format
  const mapUserUpdateToAdhoc = (userData: TUpdateUserFormValues) => {
    return {
      // Update basic information (preserve incomplete indicator if present)
      title: `Adhoc Staff - ${userData.first_name} ${userData.last_name} [PROFILE MAY BE INCOMPLETE]`,
      
      // Update location if changed (ensure non-empty array)
      locations: userData.location ? [userData.location] : ["TBD"],
      
      // Update grade level from position
      grade_level: userData.position || "To be determined",
      
      // Update scope of work description (preserve incomplete warning)
      description: `⚠️ UPDATED FROM USER MANAGEMENT - Updated adhoc staff position for ${userData.first_name} ${userData.last_name}. If this profile is incomplete, please complete onboarding process to add: education, experience, references, documents, and contract details.`,
      background: `Updated from user management system for adhoc staff member ${userData.first_name} ${userData.last_name}. Profile may be incomplete if originally created from user management.`,
      
      // Mark as updated from user management
      extra_info: `Updated from USER_MANAGEMENT. If profile is incomplete (missing education, experience, references, documents), complete via adhoc onboarding process.`,
      last_updated_from: "USER_MANAGEMENT"
    };
  };

  // Helper function to map user update data to facilitator format
  const mapUserUpdateToFacilitator = (userData: TUpdateUserFormValues) => {
    return {
      // Update basic information (preserve incomplete indicator if present)
      title: `Facilitator - ${userData.first_name} ${userData.last_name} [PROFILE MAY BE INCOMPLETE]`,
      grade_level: userData.position || "To be determined",
      
      // Update location if changed (ensure non-empty array)
      locations: userData.location ? [userData.location] : ["TBD"],
      
      // Required fields for facilitator update
      duration: "365", // One year in days
      commencement_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      facilitaor_number: "1", // Note: typo in schema
      evaluation_comments: "⚠️ UPDATED FROM USER MANAGEMENT - Professional evaluation and competency assessment may be incomplete",
      advertisement_document: "https://placeholder.com/advertisement",
      supervisor: userData.department || "TBD - Requires supervisor assignment",
      
      // Update text fields with incomplete warnings
      background: `⚠️ UPDATED FROM USER MANAGEMENT - Updated facilitator position from user management system for ${userData.first_name} ${userData.last_name}. Profile may be incomplete if originally created from user management.`,
      extra_info: `Updated from USER_MANAGEMENT. If profile is incomplete (missing specialization areas, certification details, facilitation experience, training background), complete via facilitator onboarding process.`,
      
      // Scope of work fields with incomplete warnings
      description: `⚠️ UPDATED FROM USER MANAGEMENT - Updated facilitator position for ${userData.first_name} ${userData.last_name}. If this profile is incomplete, please complete onboarding process to add: specialization areas, certification details, facilitation experience, training methodologies, and competency assessments.`,
      objectives: "⚠️ UPDATED - Professional objectives and facilitation specializations may need completion during proper onboarding process",
      deliverables: [
        {
          deliverable: "⚠️ UPDATED - May need completion during onboarding",
          number_of_days: "TBD"
        }
      ],
      scope_of_work_document: "https://placeholder.com/scope",
      
      // Mark as updated from user management
      last_updated_from: "USER_MANAGEMENT"
    };
  };

  // Helper function to map user update data to consultant format
  const mapUserUpdateToConsultant = (userData: TUpdateUserFormValues) => {
    return {
      // Update basic information (preserve incomplete indicator if present)
      title: `Consultant - ${userData.first_name} ${userData.last_name} [PROFILE MAY BE INCOMPLETE]`,
      
      // Update location if changed (ensure non-empty array)
      locations: userData.location ? [userData.location] : ["TBD"],
      
      // Update grade level from position
      grade_level: userData.position || "To be determined",
      
      // Update scope of work description (preserve incomplete warning)
      description: `⚠️ UPDATED FROM USER MANAGEMENT - Updated consultant position for ${userData.first_name} ${userData.last_name}. If this profile is incomplete, please complete onboarding process to add: education, employment history, language proficiency, special consultant services, references, documents, and contract details.`,
      background: `Updated from user management system for consultant ${userData.first_name} ${userData.last_name}. Profile may be incomplete if originally created from user management.`,
      
      // Mark as updated from user management
      extra_info: `Updated from USER_MANAGEMENT. If profile is incomplete (missing education, employment history, language proficiency, special consultant services, references, documents), complete via consultant onboarding process.`,
      last_updated_from: "USER_MANAGEMENT"
    };
  };

  // Helper function to map user update data to workforce format
  // Only sends fields that are available from the user form to avoid required field errors
  const mapUserUpdateToWorkforce = (userData: TUpdateUserFormValues) => {
    const updateData: any = {};

    // Only update basic employee information that we have from user form
    if (userData.first_name) {
      updateData.legal_firstname = userData.first_name;
    }
    if (userData.last_name) {
      updateData.legal_lastname = userData.last_name;
    }
    if (userData.email) {
      updateData.email = userData.email;
    }
    if (userData.mobile_number) {
      updateData.phone_number = userData.mobile_number;
    }

    // Only update employment details if we have the data
    if (userData.user_type) {
      updateData.employment_type = userData.user_type === "ADMIN" ? "Admin" : "Staff";
    }
    if (userData.department) {
      updateData.department = userData.department;
    }

    // Add metadata about the update source (optional fields)
    updateData.last_updated_from = "USER_MANAGEMENT";
    updateData.extra_info = `⚠️ UPDATED FROM USER MANAGEMENT on ${new Date().toISOString().split('T')[0]} - Basic employee information updated from user management. Complete HR onboarding process if additional details are needed (date of birth, SSN, marital status, bank account details, PFA information, beneficiaries, emergency contacts, qualifications, passport/signature uploads, system authorizations).`;

    return updateData;
  };


  return (
    <div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-y-10'
          >
            <div className='grid grid-cols-2 gap-x-7 gap-y-7'>
              <FormInput label='First Name' name='first_name' required />
              <FormInput label='Last Name' name='last_name' required />

              <FormInput label='Email' name='email' required disabled />

              <FormInput
                label='Phone Number'
                name='mobile_number'
                required
                type='tel'
              />

              <FormSelect
                label='Gender'
                name='gender'
                placeholder='Select Gender'
                required
                options={genderOptions}
              />

              <FormSelect
                label='Location'
                name='location'
                placeholder={isLocationLoading ? 'Loading locations...' : 'Select Location'}
                options={locationOptions}
                disabled={isLocationLoading}
              />

              <FormSelect
                label='Department'
                name='department'
                required
                placeholder={isDepartmentLoading ? 'Loading departments...' : 'Select Department'}
                options={departmentOptions}
                disabled={isDepartmentLoading}
              />

              <FormSelect
                label='Position'
                name='position'
                required
                placeholder={isPositionLoading ? 'Loading positions...' : 'Select Position'}
                options={positionOptions}
                disabled={isPositionLoading}
              />

              <FormMultiSelect
                label='User Roles'
                name='roles'
                required
                placeholder={isRoleLoading ? 'Loading roles...' : 'Select roles'}
                options={roleOptions}
                disabled={isRoleLoading}
              />

              <FormSelect
                label='User Type'
                name='user_type'
                placeholder='Select User Type'
                options={userTypeOptions}
              />

              <div className='flex items-center space-x-2'>
                <label htmlFor='is_active' className='text-sm font-medium'>
                  Status (Active)
                </label>
                <Switch
                  id='is_active'
                  checked={form.watch('is_active')}
                  onCheckedChange={(checked) => form.setValue('is_active', checked)}
                />
              </div>
            </div>

            {/* Financial Details Section - Show for Adhoc Staff, Consultants, and Vendors */}
            {(form.watch('user_type') === 'ADHOC_STAFF' || form.watch('user_type') === 'CONSULTANT' || form.watch('user_type') === 'VENDOR') && (
              <div className='space-y-4'>
                <div className='border-t pt-6'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                    Financial & Payment Details
                  </h3>

                  <div className='grid grid-cols-2 gap-x-7 gap-y-7'>
                    {/* Bank Account Details */}
                    <FormInput
                      label='Bank Name'
                      name='bank_name'
                      placeholder='Enter bank name'
                    />
                    <FormInput
                      label='Branch Name'
                      name='branch_name'
                      placeholder='Enter branch name'
                    />
                    <FormInput
                      label='Account Name'
                      name='account_name'
                      placeholder='Enter account holder name'
                    />
                    <FormInput
                      label='Account Number'
                      name='account_number'
                      placeholder='Enter account number'
                      type='text'
                    />
                    <FormInput
                      label='Sort Code'
                      name='sort_code'
                      placeholder='Enter sort code'
                      type='text'
                    />

                    {/* Additional Financial Fields */}
                    {(form.watch('user_type') === 'ADHOC_STAFF' || form.watch('user_type') === 'CONSULTANT') && (
                      <>
                        <FormInput
                          label='Proposed Salary/Rate'
                          name='proposed_salary'
                          placeholder='Enter proposed salary or daily rate'
                          type='text'
                        />
                        <FormSelect
                          label='Payment Frequency'
                          name='payment_frequency'
                          placeholder='Select payment frequency'
                          options={[
                            { label: 'Daily', value: 'DAILY' },
                            { label: 'Weekly', value: 'WEEKLY' },
                            { label: 'Monthly', value: 'MONTHLY' },
                            { label: 'Per Project', value: 'PROJECT' },
                          ]}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className='flex justify-end'>
              <FormButton loading={isUpdateLoading || isVendorUpdateLoading || isAdhocUpdateLoading || isFacilitatorUpdateLoading || isEmployeeUpdateLoading || isBankCreateLoading || isBankUpdateLoading}>Update User</FormButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
