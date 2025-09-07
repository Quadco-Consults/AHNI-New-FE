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
  { label: "AHNi Staff", value: "AHNI_STAFF" },
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
      user_type: "",
      roles: [],
      is_active: true,
    },
  });

  // Reset form when dialog data changes
  useEffect(() => {
    if (dialogProps?.data) {
      const userData = dialogProps.data;
      form.reset({
        first_name: userData.first_name ?? "",
        last_name: userData.last_name ?? "",
        email: userData.email ?? "",
        mobile_number: userData.mobile_number ?? "",
        gender: userData.gender ?? "",
        location: userData.location?.id ?? userData.location ?? "",
        department: userData.department?.id ?? userData.department ?? "",
        position: userData.position?.id ?? userData.position ?? "",
        user_type: userData.user_type ?? "",
        roles: userData.roles?.map((role: any) => 
          typeof role === 'string' ? role : role.id
        ) ?? [],
        is_active: userData.is_active ?? true,
      });
    }
  }, [dialogProps?.data, form]);

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
  
  // For workforce updates - we'd need the employee ID
  // For now, using userId as a placeholder until we implement proper ID lookup
  const { updateEmployeeOnboarding, isLoading: isEmployeeUpdateLoading } = useUpdateEmployeeOnboarding();

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
    const userType = data.user_type || dialogProps?.data?.user_type;
    const userId = dialogProps?.data?.id;
    
    if (!userId) {
      throw new Error("No user ID available for update");
    }
    
    // STEP 1: Always update main users table first
    await updateUser(data);
    
    // STEP 2: Also update specialized table based on user type
    switch (userType) {
      case "ADHOC_STAFF":
        // Update adhoc table record linked to this user
        await updateAdhocUserRecord(userId, data);
        break;
      case "FACILITATOR":
        // Update facilitator table record linked to this user
        await updateFacilitatorUserRecord(userId, data);
        break;
      case "CONSULTANT":
        // Update consultant table record linked to this user
        await updateConsultantUserRecord(userId, data);
        break;
      case "VENDOR":
        // Update vendor table record linked to this user
        await updateVendorUserRecord(userId, data);
        break;
      case "AHNI_STAFF":
      case "ADMIN":
        // Update workforce record in employee onboarding table
        await updateWorkforceUserRecord(userId, data);
        break;
      default:
        // Only exists in main users table - no specialized table to update
        break;
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
    const workforceUpdateData = mapUserUpdateToWorkforce(data);
    await updateEmployeeOnboarding(workforceUpdateData);
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
  const mapUserUpdateToWorkforce = (userData: TUpdateUserFormValues) => {
    return {
      // Update basic employee information
      legal_firstname: userData.first_name,
      legal_lastname: userData.last_name,
      email: userData.email,
      phone_number: userData.mobile_number,
      
      // Update employment details
      employment_type: userData.user_type === "ADMIN" ? "Admin" : "Staff",
      department: userData.department || "TBD - Department assignment required",
      
      // Update status to indicate possible incomplete profile
      status: "⚠️ UPDATED FROM USER MANAGEMENT - May require HR onboarding completion",
      
      // Mark as updated from user management with incomplete warning
      last_updated_from: "USER_MANAGEMENT",
      extra_info: `⚠️ UPDATED FROM USER MANAGEMENT - If HR profile is incomplete (missing: date of birth, SSN, marital status, bank account details, PFA information, beneficiaries, emergency contacts, qualifications, passport/signature uploads, system authorizations), complete via HR employee onboarding process.`
    };
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

            <div className='flex justify-end'>
              <FormButton loading={isUpdateLoading || isVendorUpdateLoading || isAdhocUpdateLoading || isFacilitatorUpdateLoading || isEmployeeUpdateLoading}>Update User</FormButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
