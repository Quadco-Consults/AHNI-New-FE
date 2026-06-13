"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormLabel } from "@/components/ui/form";
import FormInput from "@/components/atoms/FormInput";
import FormSelect from "@/components/atoms/FormSelectField";
import { Save } from "lucide-react";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dialogs";
import { useAppDispatch } from "@/hooks/useStore";
import { WorkforceFormValues, workforceSchema } from "@/features/hr/types/hr-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectContent, SelectItem } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/Loading";

import FileUpload from "@/components/atoms/FileUpload";
import { toast } from "sonner";
import { useGetLocationList } from "@/features/modules/controllers/config/locationController";
import { useGetDepartmentPaginate } from "@/features/modules/controllers/config/departmentController";
import { LocationResultsData } from "@/features/admin/types/configs-types/location";
import { DepartmentsResultsData } from "definitions/configs/departments";
import FormButton from "@/components/FormButton";

import { HrRoutes } from "@/constants/RouterConstants";
import { updateStepCompletion } from "@/store/stepTracker";
import FormCheckBox from "@/components/atoms/FormCheckBox";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { IProjectSingleData } from "definitions/project";
import {
  useCreateEmployeeOnboarding,
  usePatchEmployeeOnboarding,
  useGetEmployeeOnboardingByApplication,
} from "@/features/hr/controllers/employeeOnboardingController";
import { useGetPositionPaginate } from "@/features/modules/controllers/config/positionController";
import { PositionsResultsData } from "definitions/configs/positions";

import { createFileObjectFromUrl } from "@/utils/get-file-extension";

const BasicInformation = ({
  info,
  advertisement,
  onNext,
}: {
  info: any;
  advertisement?: any;
  onNext: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [passport, setPassport] = React.useState<any>({});
  const [signature, setSignature] = React.useState<any>({});

  const { data: departments, isLoading: departmentIsLoading } =
    useGetDepartmentPaginate({});
  const { data: locations, isLoading: locationIsLoading, error: locationError } =
    useGetLocationList({});

  console.log("Location API Debug:", {
    locations,
    isLoading: locationIsLoading,
    error: locationError,
    results: locations?.data?.results,
    fullStructure: JSON.stringify(locations, null, 2)
  });

  const { data: projects, isLoading: projectsIsLoading, error: projectsError } =
    useGetAllProjects({
      page: 1,
      size: 1000,
      search: ""
    });
  const { data: positions, isLoading: positionIsLoading, error: positionsError } =
    useGetPositionPaginate({
      page: 1,
      size: 1000,
      search: ""
    });

  console.log("API Loading States:", {
    projects: {
      data: projects,
      loading: projectsIsLoading,
      error: projectsError,
      results: projects?.results,
      dataStructure: projects ? Object.keys(projects) : []
    },
    positions: {
      data: positions,
      loading: positionIsLoading,
      error: positionsError,
      results: positions?.results,
      dataStructure: positions ? Object.keys(positions) : []
    },
    departments: { data: departments, loading: departmentIsLoading },
    locations: { data: locations, loading: locationIsLoading, error: locationError }
  });

  const { createEmployeeOnboarding, isLoading } =
    useCreateEmployeeOnboarding();

  // Check if this is existing employee data (has legal_firstname) or job application data
  const isExistingEmployeeData = !!(info?.data?.legal_firstname || info?.data?.legal_lastname);

  // If we have existing employee data, use info.data.id directly as the employee ID
  // If it's job application data, query for existing employee onboarding by application ID
  const { data: existingEmployeeData, isLoading: existingEmployeeLoading } = useGetEmployeeOnboardingByApplication(
    info?.data?.application?.id || info?.data?.id,
    !isExistingEmployeeData && !!info?.data?.id  // Only query if it's job application data
  );

  // Get the existing employee ID for patch operations
  // If info.data is already employee data, use its ID directly
  const existingEmployeeId = isExistingEmployeeData
    ? info?.data?.id
    : existingEmployeeData?.data?.results?.[0]?.id;

  // Initialize patch hook with the existing employee ID (if available)
  const { patchEmployeeOnboarding, isLoading: updateLoading } = usePatchEmployeeOnboarding(
    existingEmployeeId || ""
  );

  const form = useForm<WorkforceFormValues>({
    resolver: zodResolver(workforceSchema),
    defaultValues: {
      legal_firstname: "",
      legal_middlename: "",
      legal_lastname: "",
      address: "",
      designation: "",
      phone_number: "",
      other_number: "",
      date_of_birth: "",
      date_of_hire: "",
      // ss_number: "",
      serial_id_code: "",
      signature_file: "",
      passport_file: "",
      marital_status: "single",
      own_computer: true,
      require_email_access: true,
      employment_type: "INTERNAL",
      // group: "",
      location: "",
      department: "",
      project: "",
    },
  });
  const { handleSubmit, reset, getValues } = form;

  const onSubmit = async (data: WorkforceFormValues) => {
    console.log("🚀 Form submission started with data:", data);
    console.log("📋 Job application info:", info?.data);

    // Prevent submission if we're still checking for existing employee
    if (existingEmployeeLoading) {
      console.log("⏳ Still checking for existing employee, please wait...");
      toast.error("Please wait while we check for existing records...");
      return;
    }

    const formData = new FormData();
    formData.append("legal_firstname", data.legal_firstname);
    formData.append("legal_lastname", data.legal_lastname);
    // @ts-ignore
    formData.append("legal_middlename", data.legal_middlename || "");
    formData.append("address", data.address);
    formData.append("designation", data.designation);
    formData.append("phone_number", data.phone_number);
    // @ts-ignore
    formData.append("other_number", data.other_number || "");
    formData.append("date_of_birth", data.date_of_birth);
    formData.append("date_of_hire", data.date_of_hire);
    // formData.append("ss_number", data.ss_number);
    formData.append("serial_id_code", data.serial_id_code);

    formData.append("marital_status", data.marital_status);
    // @ts-ignore
    formData.append("own_computer", String(data.own_computer));
    // @ts-ignore
    formData.append("require_email_access", String(data.require_email_access));
    formData.append("employment_type", data.employment_type);
    // formData.append("group", data.group);
    formData.append("location", data.location);
    formData.append("project", data.project);
    formData.append("department", data.department);

    // Determine if we're updating existing employee or creating new one
    // If info.data has employee fields (legal_firstname), we're updating
    // Otherwise, check if we found an existing employee onboarding via the query
    const existingEmployee = isExistingEmployeeData
      ? info?.data  // Use info.data directly if it's employee data
      : existingEmployeeData?.data?.results?.[0];  // Otherwise use query result

    // Only add application field for new employees, not updates
    if (!existingEmployee) {
      formData.append("application", info?.data?.id);
    }

    // Log all FormData entries for debugging
    console.log("📤 FormData being sent:");
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    console.log("📝 Update vs Create decision:", {
      isExistingEmployeeData,
      hasExistingEmployee: !!existingEmployee,
      existingEmployeeId: existingEmployee?.id,
      willIncludeApplicationField: !existingEmployee,
      infoDataId: info?.data?.id,
      existingEmployeeData: existingEmployeeData?.data
    });

    // Validate required fields
    const requiredFields = [
      'legal_firstname', 'legal_lastname', 'address', 'designation',
      'phone_number', 'date_of_birth', 'date_of_hire', 'serial_id_code',
      'location', 'department', 'project'
    ];

    const missingFields = requiredFields.filter(field => !formData.get(field));
    if (missingFields.length > 0) {
      console.error("❌ Missing required fields:", missingFields);
      toast.error(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    // if (info.data) {
    //   if (typeof data.passport_file !== "string") {
    //     // Has been changed [Backend returns string]
    //     console.log(data.passport_file);
    //     formData.append("passport_file", data.passport_file);
    //     formData.append("signature_file", data.signature_file);
    //   } else {
    //     formData.append("passport_file", passport);
    //     formData.append("signature_file", signature);
    //   }
    // } else {
    //   // formData.append("passport_file", data.passport_file[0]);
    //   // formData.append("signature_file", data.signature_file[0]);
    // }


    if (existingEmployee) {
      // Update existing employee onboarding
      console.log("📝 Updating existing employee onboarding");
      try {
        // @ts-ignore
        await patchEmployeeOnboarding(formData);

        dispatch(
          updateStepCompletion({
            path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_INFO,
          })
        );
        dispatch(
          openDialog({
            type: DialogType.HrSuccessModal,
            dialogProps: {
              label: "Employee information updated successfully",
            },
          })
        );

        // @ts-ignore
        localStorage.setItem("workforceID", existingEmployee.id);
        onNext();
        reset();
      } catch (error: any) {
        console.error("❌ Update error:", error);
        console.error("❌ Error response:", error?.response?.data);
        console.error("❌ Error message:", error?.message);

        // Try to extract a meaningful error message
        let errorMessage = "Failed to update employee information";
        if (error?.response?.data) {
          const responseData = error.response.data;
          if (typeof responseData === 'string') {
            errorMessage = responseData;
          } else if (responseData.message) {
            errorMessage = responseData.message;
          } else if (responseData.error) {
            errorMessage = responseData.error;
          } else if (responseData.serial_id_code) {
            errorMessage = `Serial ID: ${responseData.serial_id_code}`;
          } else {
            // Get first error from response
            const firstKey = Object.keys(responseData)[0];
            if (firstKey && responseData[firstKey]) {
              errorMessage = `${firstKey}: ${JSON.stringify(responseData[firstKey])}`;
            }
          }
        }

        toast.error(errorMessage);
      }
    } else {
      // Create new employee onboarding
      console.log("✨ Creating new employee onboarding");
      console.log("📤 Sending FormData to API...");

      try {
        // @ts-ignore
        const res = await createEmployeeOnboarding(formData);
        console.log("✅ API Response:", res);

        dispatch(
          updateStepCompletion({
            path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_INFO,
          })
        );
        dispatch(
          openDialog({
            type: DialogType.HrSuccessModal,
            dialogProps: {
              label: "Employee information saved",
            },
          })
        );
        // @ts-ignore
        localStorage.setItem("workforceID", res.data.id);
        onNext();
        reset();
      } catch (error) {
        console.error("❌ Create error details:", error);
        console.error("❌ Error message:", error?.message);
        console.error("❌ Error response:", error?.response?.data);

        // Show more specific error message
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to save employee information";
        toast.error(errorMessage);
      }
    }
  };

  React.useEffect(() => {
    console.log("BasicInformation useEffect triggered:", { info, hasData: !!info?.data });

    if (info?.data) {
      const { data } = info;

      // Check if this is existing employee data or job application data
      const isExistingEmployee = !!(data.legal_firstname || data.legal_lastname);
      console.log("Data type detected:", {
        isExistingEmployee,
        hasApplicantFields: !!(data.applicant_first_name),
        hasEmployeeFields: !!(data.legal_firstname),
        allFields: Object.keys(data),
        fullDataStructure: JSON.stringify(data, null, 2)
      });

      if (isExistingEmployee) {
        // This is existing employee onboarding data
        console.log("Populating form with existing employee data:", {
          data,
          dataKeys: Object.keys(data),
          employment_type: data.employment_type,
          location: data.location,
          advertisement: data.advertisement
        });

        form.reset({
          // Employee name fields
          legal_firstname: data.legal_firstname || '',
          legal_middlename: data.legal_middlename || '',
          legal_lastname: data.legal_lastname || '',

          // Employee data fields
          address: data.address || '',
          phone_number: data.phone_number || '',
          other_number: data.other_number || '',
          date_of_birth: data.date_of_birth || '',
          date_of_hire: data.date_of_hire || '',
          serial_id_code: data.serial_id_code || '',

          // File fields
          signature_file: data.signature_file || '',
          passport_file: data.passport_file || '',

          // Employee status fields
          marital_status: data.marital_status || 'single',
          own_computer: data.own_computer ?? true,
          require_email_access: data.require_email_access ?? true,
          employment_type: data.employment_type || 'INTERNAL',

          // Reference fields - will be populated from IDs after dropdown data loads
          designation: data.designation || '',
          location: data.location || '',
          department: data.department || '',
          project: data.project || '',
        });
      } else {
        // This is job application data - use existing logic
        console.log("Job application data loaded:", {
          info,
          dataKeys: Object.keys(data),
          advertisement: data.advertisement,
          employment_type: data.employment_type,
          fullData: data
        });
        console.log("Available application fields:", {
          applicant_first_name: data.applicant_first_name,
          applicant_middle_name: data.applicant_middle_name,
          applicant_last_name: data.applicant_last_name,
          applicant_email: data.applicant_email,
          position_applied: data.position_applied,
          employment_type: data.employment_type,
          application_notes: data.application_notes,
          status: data.status,
          advertisement: data.advertisement
        });

        // Use individual name fields from job application
        const firstName = data.applicant_first_name || '';
        const middleName = data.applicant_middle_name || '';
        const lastName = data.applicant_last_name || '';

        form.reset({
          // Populate from job application name fields
          legal_firstname: firstName,
          legal_middlename: middleName,
          legal_lastname: lastName,

          // Basic fields that may or may not exist in job application
          address: data.address || '',
          phone_number: data.phone_number || '',
          other_number: data.other_number || '',
          date_of_birth: data.date_of_birth || '',
          date_of_hire: data.date_of_hire || new Date().toISOString().split('T')[0], // Default to today
          serial_id_code: data.serial_id_code || '',

          // File fields - usually empty for new onboarding
          signature_file: data.signature_file || '',
          passport_file: data.passport_file || '',

          // Default values for fields not in job application
          marital_status: data.marital_status || 'single',
          own_computer: data.own_computer ?? true,
          require_email_access: data.require_email_access ?? true,

          // Employment type from application
          employment_type: data.employment_type || 'INTERNAL',

          // Designation will be populated after positions data loads (we need to map UUID to position name)
          designation: '',

          // These will be populated after dropdown data loads
          location: '',
          department: '',
          project: '',
        });
      }

      console.log("Form values after reset:", form.getValues());

      // Handle file uploads if URLs are provided
      if (data.passport_file) {
        createFileObjectFromUrl(data.passport_file).then((file) => {
          console.log("Passport file loaded:", file);
          setPassport(file);
        }).catch((error) => {
          console.error("Failed to load passport file:", error);
        });
      }

      if (data.signature_file) {
        createFileObjectFromUrl(data.signature_file).then((file) => {
          console.log("Signature file loaded:", file);
          setSignature(file);
        }).catch((error) => {
          console.error("Failed to load signature file:", error);
        });
      }
    }
  }, [info, form]);

  // Dedicated useEffect for designation population - runs as soon as positions data is available
  React.useEffect(() => {
    if (positions) {
      const positionsArray = positions?.results || positions?.data?.results || [];

      console.log("🎯 DESIGNATION TEST - POSITIONS LOADED:", {
        positionsCount: positionsArray.length,
        positions: positionsArray?.slice(0, 3).map(p => ({ id: p.id, name: p.name })),
        currentDesignation: form.getValues('designation'),
        hasJobData: !!info?.data,
        position_applied: info?.data?.position_applied
      });


      // ACTUAL LOGIC: Try to match position_applied
      if (info?.data?.position_applied && positionsArray.length > 0) {
        const { position_applied } = info.data;
        const matchedPosition = positionsArray.find(pos => String(pos.id) === String(position_applied));

        if (matchedPosition) {
          // Use setTimeout to ensure UI updates after React renders
          setTimeout(() => {
            form.setValue('designation', String(matchedPosition.id), { shouldValidate: true });
            console.log("🚀 DESIGNATION AUTO-SELECTED:", {
              id: matchedPosition.id,
              name: matchedPosition.name,
              formValue: form.getValues('designation')
            });
          }, 100);
        } else {
          console.warn("⚠️ Position not found in dropdown:", {
            seeking: position_applied,
            available: positionsArray.map(p => ({ id: p.id, name: p.name }))
          });
        }
      }
    }
  }, [positions, info?.data?.position_applied, form, info?.data]);


  React.useEffect(() => {
    if (info?.data && positions && departments && locations && projects) {
      const { data } = info;
      const isExistingEmployee = !!(data.legal_firstname || data.legal_lastname);

      // Helper function to find matching dropdown option
      const findMatchingOption = (options: any[], searchValue: string | number, searchField = 'name') => {
        if (!searchValue || !options?.length) {
          return '';
        }

        // If searchValue is a UUID or numeric ID, try to find exact match first
        if (typeof searchValue === 'string' && (searchValue.length === 36 || /^\d+$/.test(searchValue))) {
          const match = options.find(opt => opt.id === searchValue || String(opt.id) === searchValue);
          if (match) {
            return String(match.id);
          }
        }

        // If numeric, convert and match
        if (typeof searchValue === 'number' || /^\d+$/.test(searchValue)) {
          const match = options.find(opt => opt.id === Number(searchValue) || String(opt.id) === String(searchValue));
          if (match) {
            return String(match.id);
          }
        }

        // Otherwise, search by name/title
        const match = options.find(opt => {
          const fieldValue = opt[searchField]?.toLowerCase();
          const searchLower = String(searchValue).toLowerCase();
          return fieldValue === searchLower || fieldValue?.includes(searchLower);
        });

        return match ? String(match.id) : '';
      };

      const positionsArray = positions?.results || positions?.data?.results || [];
      const locationsArray = locations?.data?.results || [];
      const departmentsArray = departments?.data?.results || [];
      const projectsArray = projects?.results || projects?.data?.results || [];

      console.log("🚀 Starting dropdown field population:", {
        isExistingEmployee,
        hasPositions: !!positions,
        designation: data?.designation,
        position_applied: data?.position_applied,
        advertisement: advertisement?.data,
        advertisementLocations: advertisement?.data?.locations,
        advertisementJobType: advertisement?.data?.job_type,
        hasAdvertisement: !!advertisement?.data,
        infoData: data,
        availableLocations: locationsArray.map(l => ({ id: l.id, name: l.name })),
        jobTypeOptions: [
          { value: "INTERNAL", label: "Internal" },
          { value: "EXTERNAL", label: "External" },
          { value: "BOTH", label: "Both" },
        ]
      });

      let designationValue = '';
      let locationValue = '';
      let departmentValue = '';
      let projectValue = '';
      let employmentTypeValue = '';

      if (isExistingEmployee) {
        // For existing employees, the fields likely contain IDs already
        console.log("Mapping existing employee dropdown fields");

        designationValue = findMatchingOption(positionsArray, data?.designation);
        locationValue = findMatchingOption(locationsArray, data?.location);
        departmentValue = findMatchingOption(departmentsArray, data?.department);
        projectValue = findMatchingOption(projectsArray, data?.project, 'title');
        employmentTypeValue = data?.employment_type || '';
      } else {
        // For job application data, use advertisement data for location and employment type
        console.log("Mapping job application dropdown fields with advertisement data");

        designationValue = findMatchingOption(positionsArray, data?.position_applied);

        // Use advertisement data for location and employment type if available
        if (advertisement?.data) {
          console.log("🎯 Using advertisement data for auto-selection:", {
            advertisementLocations: advertisement.data.locations,
            advertisementJobType: advertisement.data.job_type
          });

          locationValue = findMatchingOption(locationsArray, advertisement.data.locations) ||
                         findMatchingOption(locationsArray, advertisement.data.locations, 'state');

          // Map job_type from advertisement to employment_type options
          if (advertisement.data.job_type) {
            const jobTypeMapping = {
              'INTERNAL': 'INTERNAL',
              'EXTERNAL': 'EXTERNAL',
              'BOTH': 'BOTH',
              'Full-time': 'INTERNAL',
              'Part-time': 'EXTERNAL',
              'Contract': 'EXTERNAL'
            };
            employmentTypeValue = jobTypeMapping[advertisement.data.job_type] || advertisement.data.job_type;
          }
        } else {
          // Fallback to job application data
          locationValue = findMatchingOption(locationsArray, data?.job?.locations) ||
                         findMatchingOption(locationsArray, data?.job?.locations, 'state');
          employmentTypeValue = data?.employment_type || 'INTERNAL';
        }

        departmentValue = findMatchingOption(departmentsArray, data?.department);
        projectValue = findMatchingOption(projectsArray, data?.project, 'title');
      }

      console.log("Dropdown mapping results:", {
        designationValue,
        locationValue,
        departmentValue,
        projectValue,
        employmentTypeValue
      });

      // Set the form values
      if (designationValue) form.setValue('designation', designationValue);
      if (locationValue) form.setValue('location', locationValue);
      if (departmentValue) form.setValue('department', departmentValue);
      if (projectValue) form.setValue('project', projectValue);
      if (employmentTypeValue) form.setValue('employment_type', employmentTypeValue);

      console.log("🔍 FINAL FORM STATE:", form.getValues());
    }
  }, [info, positions, departments, locations, projects, form, advertisement]);

  const jobTypeOptions = [
    { value: "INTERNAL", label: "Internal" },
    { value: "EXTERNAL", label: "External" },
    { value: "BOTH", label: "Both" },
  ];

  const maritalTypeOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
  ];

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div>
            <FormLabel className='font-semibold'>
              Employee Legal Name:
              <span className='text-red-500'>*</span>
            </FormLabel>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <FormInput name='legal_firstname' placeholder='First name' />
              <FormInput name='legal_middlename' placeholder='Middle name' />
              <FormInput name='legal_lastname' placeholder='Last name' />
            </div>
          </div>

          <FormSelect
            name='designation'
            label='Designation'
            placeholder='Select designation'
            required
          >
            <SelectContent>
              {positionIsLoading && <LoadingSpinner />}
              {(positions?.results || positions?.data?.results || [])?.map(
                (position: PositionsResultsData) => (
                  <SelectItem key={position?.id} value={String(position?.id)}>
                    {position?.name}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </FormSelect>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-1'>
            <FormInput name='phone_number' label='Phone Number' required />
            <FormInput name='other_number' label='Other Phone Number' />
            <FormInput
              name='address'
              placeholder='Address'
              label='Address'
              required
            />
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <FormInput
              name='date_of_birth'
              type='date'
              label='Date of Birth'
              required
            />
            <FormInput
              name='date_of_hire'
              type='date'
              label='Date of Hire'
              required
            />
            <FormInput
              name='serial_id_code'
              label='Serial ID Code'
              placeholder='Serial ID Code'
              required
            />
          </div>

          <FileUpload name='passport_file' label='Passport Photograph' />
          <FileUpload name='signature_file' label='Signature' />

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <FormSelect
              name='department'
              label='Department/Unit'
              placeholder='Select department'
              required
            >
              <SelectContent>
                {departmentIsLoading && <LoadingSpinner />}
                {departments?.data?.results?.map(
                  (department: DepartmentsResultsData) => (
                    <SelectItem
                      key={department?.id}
                      value={String(department?.id)}
                    >
                      {department?.name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </FormSelect>
            {/* <FormInput name='serial_id_code' label='Serial ID Code' required /> */}

            <FormSelect
              name='marital_status'
              label='Marital Status'
              placeholder='Select Marital Status'
              options={maritalTypeOptions}
            />

            <FormSelect
              name='employment_type'
              label='Employment Type'
              placeholder='Select Employment Type'
              options={jobTypeOptions}
            />

            {/* <FormInput name='group' label='Group' required /> */}

            <FormSelect
              name='location'
              label='Location'
              placeholder='Select location'
              required
            >
              <SelectContent>
                {locationIsLoading && <LoadingSpinner />}
                {locationError && (
                  <div className="p-2 text-red-500 text-sm">
                    Error loading locations: {locationError.message}
                  </div>
                )}
                {!locationIsLoading && !locationError && (!locations?.data?.results || locations?.data?.results?.length === 0) && (
                  <div className="p-2 text-gray-500 text-sm">
                    No locations found
                  </div>
                )}

                {locations?.data?.results?.map(
                  (location: LocationResultsData) => (
                    <SelectItem key={location?.id} value={String(location?.id)}>
                      {location?.name || location?.state || 'Unknown Location'}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </FormSelect>

            <FormSelect
              name='project'
              label='Project'
              placeholder='Select project'
              required
            >
              <SelectContent>
                {projectsIsLoading && <LoadingSpinner />}
                {(projects?.results || projects?.data?.results || [])?.map((project: IProjectSingleData) => (
                  <SelectItem key={project?.id} value={String(project?.id)}>
                    {project?.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </FormSelect>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <FormCheckBox name='own_computer' label='Own a Computer' />
            <FormCheckBox
              name='require_email_access'
              label='Require Email Access'
            />
          </div>

          <div className='flex gap-x-6 justify-end'>
            <FormButton
              loading={isLoading || updateLoading}
              disabled={isLoading || updateLoading}
              variant='outline'
              type='submit'
            >
              <Save size={20} /> Save
            </FormButton>
          </div>
        </form>
      </Form>

      {/* <Button
        onClick={() =>
          dispatch(
            updateStepCompletion({
              path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_INFO,
            })
          )
        }
      >
        Hello
      </Button> */}
    </>
  );
};

export default BasicInformation;
