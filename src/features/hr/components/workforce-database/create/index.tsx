"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Form, FormLabel } from "components/ui/form";
import FormInput from "components/atoms/FormInput";
import Card from "components/Card";
import FormSelect from "components/atoms/FormSelectField";
import GoBack from "components/GoBack";
import { Save } from "lucide-react";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { WorkforceFormValues, workforceSchema } from "features/hr/types/hr-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectContent, SelectItem } from "components/ui/select";
import { LoadingSpinner } from "components/Loading";

import FileUpload from "components/atoms/FileUpload";
import { toast } from "sonner";
import { useGetLocationList } from "@/features/modules/controllers/config/locationController";
import { useGetDepartmentPaginate } from "@/features/modules/controllers/config/departmentController";
import { LocationResultsData } from "definations/configs/location";
import { DepartmentsResultsData } from "definations/configs/departments";
import FormButton from "@/components/FormButton";

import { HrRoutes } from "constants/RouterConstants";
import { updateStepCompletion } from "store/stepTracker";
import FormCheckBox from "components/atoms/FormCheckBox";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { IProjectSingleData } from "definations/project";
import { useCreateEmployeeOnboarding } from "@/features/hr/controllers/employeeOnboardingController";
import { useGetPositionPaginate } from "@/features/modules/controllers/config/positionController";
import { PositionsResultsData } from "definations/configs/positions";

const CreateEmployee = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data: departments, isLoading: departmentIsLoading } =
    useGetDepartmentPaginate({});
  const { data: locations, isLoading: locationIsLoading } =
    useGetLocationList({});
  const { data: projects, isLoading: projectsIsLoading } =
    useGetAllProjects({});
  const { data: positions, isLoading: positionIsLoading } =
    useGetPositionPaginate({});

  const { createEmployeeOnboarding, isLoading } =
    useCreateEmployeeOnboarding();

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
      ss_number: "",
      serial_id_code: "",
      signature_file: "",
      passport_file: "",
      marital_status: "single",
      own_computer: true,
      require_email_access: true,
      employment_type: "INTERNAL",
      group: "",
      location: "",
      department: "",
      project: "",
    },
  });
  const { handleSubmit, reset } = form;

  const onSubmit = async (data: WorkforceFormValues) => {
    const formData = new FormData();
    formData.append("legal_firstname", data.legal_firstname);
    formData.append("legal_lastname", data.legal_lastname);
    // @ts-ignore
    formData.append("legal_middlename", data.legal_middlename);
    formData.append("address", data.address);
    formData.append("designation", data.designation);
    formData.append("phone_number", data.phone_number);
    // @ts-ignore
    formData.append("other_number", data.other_number);
    formData.append("date_of_birth", data.date_of_birth);
    formData.append("date_of_hire", data.date_of_hire);
    formData.append("ss_number", data.ss_number);
    formData.append("serial_id_code", data.serial_id_code);

    formData.append("marital_status", data.marital_status);
    // @ts-ignore
    formData.append("own_computer", data.own_computer);
    // @ts-ignore
    formData.append("require_email_access", data.require_email_access);
    formData.append("employment_type", data.employment_type);
    formData.append("group", data.group);
    formData.append("location", data.location);
    formData.append("project", data.project);
    formData.append("department", data.department);

    formData.append("passport_file", data.passport_file[0]);
    formData.append("signature_file", data.signature_file[0]);

    try {
      // @ts-ignore
      const res = await createEmployeeOnboarding(formData)();
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

      reset();
      console.log("Success", res);
      router.push(HrRoutes.ONBOARDING);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

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
      <GoBack />

      <Card className='mt-6'>
        <h4 className='font-semibold text-lg text-center mb-8'>
          Add New Employee
        </h4>

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
                {positions?.data?.results?.map(
                  (position: PositionsResultsData) => (
                    <SelectItem key={position?.id} value={String(position?.id)}>
                      {position?.name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </FormSelect>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormInput name='phone_number' label='Phone Number' required />
              <FormInput name='other_number' label='Other Phone Number' />
              <FormInput
                name='address'
                placeholder='Address'
                label='Address'
                required
              />
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
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
                name='ss_number'
                label='SS #'
                placeholder='SS number'
                required
              />
            </div>

            <FileUpload name='passport_file' label='Passport' />
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
              <FormInput
                name='serial_id_code'
                label='Serial ID Code'
                required
              />

              <FormSelect
                name='marital_status'
                label='Marital Status'
                placeholder='Select employment ty'
                options={maritalTypeOptions}
              />

              <FormSelect
                name='employment_type'
                label='Employment Type'
                placeholder='Select employment ty'
                options={jobTypeOptions}
              />

              <FormInput name='group' label='Group' required />

              <FormSelect
                name='location'
                label='Location'
                placeholder='Select location'
                required
              >
                <SelectContent>
                  {locationIsLoading && <LoadingSpinner />}

                  {locations?.data?.results?.map(
                    (location: LocationResultsData) => (
                      <SelectItem
                        key={location?.id}
                        value={String(location?.id)}
                      >
                        {location?.state}
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
                  {projects?.data?.results?.map(
                    (project: IProjectSingleData) => (
                      <SelectItem key={project?.id} value={String(project?.id)}>
                        {project?.title}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </FormSelect>

              <FormCheckBox name='own_computer' label='Own a Computer' />
              <FormCheckBox
                name='require_email_access'
                label='Require Email Access'
              />
            </div>

            <div className='flex gap-x-6 justify-end'>
              <FormButton
                loading={isLoading}
                disabled={isLoading}
                variant='outline'
              >
                <Save size={20} /> Save
              </FormButton>
            </div>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default CreateEmployee;
