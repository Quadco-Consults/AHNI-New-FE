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
import {
  CreateUserSchema,
  TCreateUserFormValues,
} from "features/auth/types/user";
import { useCreateUser } from "../../controllers/userController";
import { useGetAllRoles } from "../../controllers/roleController";
// Import specialized controllers
import { useCreateVendor } from "@/features/procurement/controllers/vendorsController";
import { useCreateConsultantManagement } from "@/features/contracts-grants/controllers/consultantManagementController";
import { useCreateFacilitator } from "@/features/contracts-grants/controllers/facilitatorManagementController";
import { useCreateEmployeeOnboarding } from "@/features/hr/controllers/employeeOnboardingController";
import FormMultiSelect from "components/atoms/FormMultiSelect";
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
  const { createVendor, isLoading: isVendorLoading } = useCreateVendor();
  const { createConsultantManagement, isLoading: isAdhocLoading } = useCreateConsultantManagement();
  const { createFacilitator, isLoading: isFacilitatorLoading } = useCreateFacilitator();
  const { createEmployeeOnboarding, isLoading: isEmployeeLoading } = useCreateEmployeeOnboarding();

  const router = useRouter();

  const onSubmit: SubmitHandler<TCreateUserFormValues> = async (data) => {
    try {
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
   * Creates user with bidirectional relationship: 
   * 1. Always creates in main users table (for authentication, roles, permissions)
   * 2. Also creates in specialized table (for module-specific data and onboarding flow)
   * 
   * Bidirectional Relationship Logic:
   * - ALL USERS → Main users table (for authentication/core data)
   * - ADHOC_STAFF → ALSO create in adhoc table (linked by user_id)
   * - FACILITATOR → ALSO create in facilitator table (linked by user_id) 
   * - CONSULTANT → ALSO create in consultant table (linked by user_id)
   * - VENDOR → ALSO create in vendor table (linked by user_id)
   * - AHNI_STAFF & ADMIN → Only in users table
   */
  const createUserByType = async (data: TCreateUserFormValues) => {
    const userType = data.user_type;
    
    // STEP 1: Always create in main users table first
    const createdUser = await createUser(data);
    const userId = createdUser?.data?.id; // Assuming API returns created user with ID
    
    if (!userId) {
      throw new Error("Failed to create user - no user ID returned");
    }
    
    // STEP 2: Also create in specialized table based on user type
    switch (userType) {
      case "ADHOC_STAFF":
        // Create in adhoc table with reference to main user
        await createAdhocUserRecord(userId, data);
        break;
      case "FACILITATOR":
        // Create in facilitator table with reference to main user
        await createFacilitatorUserRecord(userId, data);
        break;
      case "CONSULTANT":
        // Create in consultant table with reference to main user
        await createConsultantUserRecord(userId, data);
        break;
      case "VENDOR":
        // Create in vendor table with reference to main user
        await createVendorUserRecord(userId, data);
        break;
      case "AHNI_STAFF":
      case "ADMIN":
        // Create in employee onboarding table for workforce database
        await createWorkforceUserRecord(userId, data);
        break;
      default:
        // Only exists in main users table - no specialized table needed
        break;
    }
  };

  // Functions to create specialized table records (linked to main user)
  // These create additional records in specialized tables with user_id foreign key
  const createAdhocUserRecord = async (userId: string, data: TCreateUserFormValues) => {
    console.log("Creating adhoc record for user:", userId, data);
    
    // Create adhoc record in consultant management database with type "ADHOC"
    const adhocData = mapUserDataToAdhoc(userId, data);
    await createConsultantManagement(adhocData);
  };

  const createFacilitatorUserRecord = async (userId: string, data: TCreateUserFormValues) => {
    console.log("Creating facilitator record for user:", userId, data);
    
    // Create facilitator record in facilitator database
    const facilitatorData = mapUserDataToFacilitator(userId, data);
    await createFacilitator(facilitatorData);
  };

  const createConsultantUserRecord = async (userId: string, data: TCreateUserFormValues) => {
    console.log("Creating consultant record for user:", userId, data);
    
    // Create consultant record in consultant management database with type "CONSULTANT"
    const consultantData = mapUserDataToConsultant(userId, data);
    await createConsultantManagement(consultantData);
  };

  const createVendorUserRecord = async (userId: string, data: TCreateUserFormValues) => {
    console.log("Creating vendor record for user:", userId, data);
    
    // Create vendor record in procurement/suppliers database
    const vendorData = mapUserDataToVendor(userId, data);
    await createVendor(vendorData);
  };

  const createWorkforceUserRecord = async (userId: string, data: TCreateUserFormValues) => {
    console.log("Creating workforce record for user:", userId, data);
    
    // Create employee onboarding record for workforce database
    const workforceData = mapUserDataToWorkforce(userId, data);
    await createEmployeeOnboarding(workforceData);
  };

  // Helper function to map user data to vendor format for supplier database
  const mapUserDataToVendor = (userId: string, userData: TCreateUserFormValues) => {
    return {
      // Link to main user record
      user_id: userId,
      
      // Company information (use user name as company for individual vendors)
      company_name: `${userData.first_name} ${userData.last_name} [INCOMPLETE BUSINESS PROFILE]`,
      
      // Contact information
      email: userData.email,
      phone_number: userData.mobile_number,
      
      // Default values for required vendor fields with incomplete warnings
      company_address: "⚠️ TO BE COMPLETED - Business address required",
      state: "⚠️ TO BE COMPLETED - State/location required", 
      
      // Default vendor status indicating incomplete profile
      status: "INCOMPLETE - Requires Business Registration Completion", 
      
      // Business details (to be filled during vendor onboarding) - marked as incomplete
      company_registration_number: "⚠️ RC NUMBER REQUIRED",
      tin: "⚠️ TAX ID NUMBER REQUIRED",
      company_chairman: "⚠️ TO BE COMPLETED",
      year_or_incorperation: "⚠️ INCORPORATION YEAR REQUIRED",
      type_of_business: "⚠️ TO BE SPECIFIED",
      nature_of_business: "⚠️ INCOMPLETE - Products/services to be specified",
      area_of_specialization: "⚠️ INCOMPLETE - Specialization areas to be defined",
      
      // Financial and operational details - incomplete
      bank_name: "⚠️ BANK DETAILS REQUIRED",
      bank_address: "⚠️ BANK ADDRESS REQUIRED",
      number_of_permanent_staff: "⚠️ TO BE COMPLETED",
      website: "⚠️ TO BE COMPLETED",
      
      // Production and quality details - incomplete
      installed_capacity: "⚠️ TO BE COMPLETED",
      lagest_capacity_and_utilization: "⚠️ TO BE COMPLETED",
      number_of_operational_work_shift: 0,
      brief_of_quality_control: "⚠️ TO BE COMPLETED",
      brief_of_sampling: "⚠️ TO BE COMPLETED",
      
      // Document requirements
      passport: "⚠️ BUSINESS DOCUMENTS REQUIRED",
      
      // Mark as created from user management for tracking
      created_from: "USER_MANAGEMENT",
      profile_status: "INCOMPLETE",
      
      // Arrays that need completion
      branches: [], // Branch offices to be added
      share_holders: [], // Shareholders to be added
      key_staff: [
        {
          name: `${userData.first_name} ${userData.last_name}`,
          phone_number: userData.mobile_number,
          address: "⚠️ TO BE COMPLETED",
          qualification: "⚠️ TO BE COMPLETED"
        }
      ],
      associated_entities: [], // Associated entities to be added
      production_equipments: [], // Equipment details to be added
      key_clients: [], // Client references to be added
      questionairs: [], // Questionnaire responses to be completed
      submitted_categories: [], // Business categories to be submitted
      approved_categories: [], // To be approved after completion
      
      // Extra info for tracking incomplete status
      extra_info: `⚠️ INCOMPLETE BUSINESS PROFILE - Created from USER_MANAGEMENT for user_id: ${userId}. MISSING: RC number, TIN, business address, bank details, shareholders, production capacity, quality control procedures, business documents, client references, and category approvals. REQUIRES COMPLETION via vendor registration and prequalification process.`
    };
  };

  // Helper function to map user data to adhoc format for consultant database
  const mapUserDataToAdhoc = (userId: string, userData: TCreateUserFormValues) => {
    return {
      // Set type as ADHOC to identify this as adhoc staff
      type: "ADHOC" as const,
      
      // Basic adhoc staff information
      title: `Adhoc Staff - ${userData.first_name} ${userData.last_name} [INCOMPLETE PROFILE]`,
      
      // Use user's location data (ensure non-empty array)
      locations: userData.location ? [userData.location] : ["TBD"],
      
      // Default values for required fields
      grade_level: userData.position || "To be determined",
      commencement_date: new Date().toISOString().split('T')[0], // Today's date
      end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // One year from now
      consultants_number: "1",
      
      // Scope of work defaults
      description: `⚠️ INCOMPLETE PROFILE - Created from user management. Adhoc staff position for ${userData.first_name} ${userData.last_name}. Please complete onboarding process to add: education, experience, references, documents, and contract details.`,
      background: `Created from user management system for adhoc staff member ${userData.first_name} ${userData.last_name}. This profile is incomplete and requires completion through the proper onboarding process.`,
      objectives: "⚠️ TO BE COMPLETED: Professional objectives, skills, and specializations need to be added during proper onboarding process",
      advertisement_document: "https://placeholder.com/advertisement", // Placeholder URL
      
      // Mark as created from user management for tracking and completion
      extra_info: `INCOMPLETE PROFILE - Created from USER_MANAGEMENT for user_id: ${userId}. Missing: contract details, education, experience, references, documents. Requires completion via adhoc onboarding process.`,
      created_from: "USER_MANAGEMENT",
      profile_status: "INCOMPLETE"
    };
  };

  // Helper function to map user data to facilitator format for facilitator database
  const mapUserDataToFacilitator = (userId: string, userData: TCreateUserFormValues) => {
    return {
      // Basic facilitator information
      title: `Facilitator - ${userData.first_name} ${userData.last_name} [INCOMPLETE PROFILE]`,
      grade_level: userData.position || "To be determined",
      
      // Use user's location data (ensure non-empty array)
      locations: userData.location ? [userData.location] : ["TBD"],
      
      // Default values for required fields
      duration: "365", // One year in days
      commencement_date: new Date().toISOString().split('T')[0], // Today's date
      end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // One year from now
      facilitaor_number: "1", // Note: typo in schema (facilitaor instead of facilitator)
      
      // Required text fields with incomplete profile indicators
      extra_info: `INCOMPLETE PROFILE - Created from USER_MANAGEMENT for user_id: ${userId}. Missing: specialization areas, certification details, facilitation experience, training background, and supervisor assignment. Requires completion via facilitator onboarding process.`,
      background: `⚠️ INCOMPLETE PROFILE - Facilitator position created from user management system for ${userData.first_name} ${userData.last_name}. This profile lacks essential facilitation credentials and experience details that need to be added through proper onboarding.`,
      evaluation_comments: "⚠️ TO BE COMPLETED: Professional evaluation, certification status, and facilitation competencies need assessment during onboarding process",
      
      // Default document placeholder
      advertisement_document: "https://placeholder.com/advertisement", // Placeholder URL
      
      // Supervisor - would need to be set properly in real implementation
      supervisor: userData.department || "TBD - Requires supervisor assignment",
      
      // Scope of work fields with incomplete warnings
      description: `⚠️ INCOMPLETE PROFILE - Created from user management. Facilitator position for ${userData.first_name} ${userData.last_name}. Please complete onboarding process to add: specialization areas, certification details, facilitation experience, training methodologies, and competency assessments.`,
      objectives: "⚠️ TO BE COMPLETED: Professional objectives, facilitation specializations, target audience, and learning outcomes need to be defined during proper onboarding process",
      deliverables: [
        {
          deliverable: "⚠️ PLACEHOLDER - Actual deliverables to be defined during onboarding",
          number_of_days: "TBD"
        }
      ],
      scope_of_work_document: "https://placeholder.com/scope", // Placeholder URL
      
      // Mark as created from user management with incomplete status
      created_from: "USER_MANAGEMENT",
      profile_status: "INCOMPLETE"
    };
  };

  // Helper function to map user data to consultant format for consultant database
  const mapUserDataToConsultant = (userId: string, userData: TCreateUserFormValues) => {
    return {
      // Set type as CONSULTANT to identify this as consultant
      type: "CONSULTANT" as const,
      
      // Basic consultant information
      title: `Consultant - ${userData.first_name} ${userData.last_name} [INCOMPLETE PROFILE]`,
      
      // Use user's location data (ensure non-empty array)
      locations: userData.location ? [userData.location] : ["TBD"],
      
      // Default values for required fields
      grade_level: userData.position || "To be determined",
      commencement_date: new Date().toISOString().split('T')[0], // Today's date
      end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // One year from now
      consultants_number: "1",
      
      // Scope of work defaults
      description: `⚠️ INCOMPLETE PROFILE - Created from user management. Consultant position for ${userData.first_name} ${userData.last_name}. Please complete onboarding process to add: education, employment history, language proficiency, special consultant services, references, documents, and contract details.`,
      background: `Created from user management system for consultant ${userData.first_name} ${userData.last_name}. This profile is incomplete and requires completion through the proper consultant onboarding process.`,
      objectives: "⚠️ TO BE COMPLETED: Professional objectives, specializations, and expertise areas need to be added during proper onboarding process",
      advertisement_document: "https://placeholder.com/advertisement", // Placeholder URL
      
      // Mark as created from user management for tracking and completion
      extra_info: `INCOMPLETE PROFILE - Created from USER_MANAGEMENT for user_id: ${userId}. Missing: contract details, education, employment history, language proficiency, special consultant services, references, documents. Requires completion via consultant onboarding process.`,
      created_from: "USER_MANAGEMENT",
      profile_status: "INCOMPLETE"
    };
  };

  // Helper function to map user data to workforce format for employee onboarding database
  const mapUserDataToWorkforce = (userId: string, userData: TCreateUserFormValues) => {
    return {
      // Link to main user record
      user_id: userId,
      
      // Basic employee information (from user data)
      legal_firstname: userData.first_name,
      legal_lastname: userData.last_name,
      email: userData.email,
      phone_number: userData.mobile_number,
      
      // Employment details
      employment_type: userData.user_type === "ADMIN" ? "Admin" : "Staff",
      department: userData.department || "TBD - Department assignment required",
      
      // Generate staff ID
      serial_id_code: `AHNI-${userId.slice(0, 8)}`,
      
      // MISSING FIELDS - Mark for completion during HR onboarding
      legal_middlename: "⚠️ TO BE COMPLETED",
      other_number: "⚠️ TO BE COMPLETED",
      date_of_birth: "1900-01-01", // Placeholder date
      date_of_hire: new Date().toISOString().split('T')[0], // Today as default
      ssnumber: "⚠️ TO BE COMPLETED",
      marital_status: "⚠️ TO BE COMPLETED",
      
      // Default values for required boolean fields (as per schema requirements)
      own_computer: true, // Schema expects literal true
      require_email_access: true, // Schema expects literal true
      
      // Project assignment
      project: "⚠️ TO BE ASSIGNED",
      
      // Group membership (empty array as default)
      group_membership: [],
      
      // Documents - require upload during proper onboarding
      passport_url: "⚠️ PASSPORT UPLOAD REQUIRED",
      signature_url: "⚠️ SIGNATURE UPLOAD REQUIRED",
      
      // Mark as incomplete profile needing HR onboarding completion
      status: "INCOMPLETE - Requires HR Onboarding",
      created_from: "USER_MANAGEMENT",
      extra_info: `⚠️ INCOMPLETE HR PROFILE - Created from USER_MANAGEMENT for user_id: ${userId}. MISSING: Date of birth, SSN, marital status, bank account details, PFA information, beneficiaries, emergency contacts, qualifications, passport/signature uploads, system authorizations. REQUIRES COMPLETION via HR employee onboarding process.`,
      profile_status: "INCOMPLETE"
    };
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
                  <FormButton loading={isLoading || isVendorLoading || isAdhocLoading || isFacilitatorLoading || isEmployeeLoading}>Create</FormButton>
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
