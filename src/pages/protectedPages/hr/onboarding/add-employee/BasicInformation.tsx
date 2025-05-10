import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormLabel } from "components/ui/form";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { Save } from "lucide-react";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { WorkforceFormValues, workforceSchema } from "definations/hr-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetHrGradeListQuery } from "services/hrApi/hr-grade";
import { useGetHrPositionListQuery } from "services/hrApi/hr-position";
import { SelectContent, SelectItem } from "components/ui/select";
import { LoadingSpinner } from "components/shared/Loading";
import { HrGradeResults } from "definations/hr-types/hr-grades";
import FileUpload from "atoms/FileUpload";
import { useCreateWorkforceMutation } from "services/hrApi/workforce";
import { toast } from "sonner";
import { useGetLocationListQuery } from "services/configs/locationApi";
import { useGetDepartmentPaginateQuery } from "services/configs/departments";
import { LocationResultsData } from "definations/configs/location";
import { DepartmentsResultsData } from "definations/configs/departments";
import FormButton from "atoms/FormButton";

import { Button } from "components/ui/button";
import { HrRoutes } from "constants/RouterConstants";
import { updateStepCompletion } from "store/stepTracker";
import FormCheckBox from "atoms/FormCheckBox";
import { useGetAllProjectsQuery } from "services/project";
import { IProjectSingleData } from "definations/project";
import {
  useCreateEmployeeOnboardingMutation,
  usePatchEmployeeOnboardingMutation,
} from "services/hrApi/hr-employee-onboarding";
import { useGetPositionPaginateQuery } from "services/configs/positions";
import { PositionsResultsData } from "definations/configs/positions";

import { createFileObjectFromUrl } from "utils/get-file-extension";

const BasicInformation = ({ info }: { info: any }) => {
  const dispatch = useAppDispatch();
  const [passport, setPassport] = React.useState<any>({});
  const [signature, setSignature] = React.useState<any>({});

  const { data: departments, isLoading: departmentIsLoading } =
    useGetDepartmentPaginateQuery({});
  const { data: locations, isLoading: locationIsLoading } =
    useGetLocationListQuery({});
  const { data: projects, isLoading: projectsIsLoading } =
    useGetAllProjectsQuery({});
  const { data: positions, isLoading: positionIsLoading } =
    useGetPositionPaginateQuery({});

  const [createEmployeeOnboarding, { isLoading }] =
    useCreateEmployeeOnboardingMutation();

  const [updateEmployeeOnboarding, { isLoading: patchLoading }] =
    usePatchEmployeeOnboardingMutation();

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
  const { handleSubmit, watch, reset } = form;
  const values = watch();

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

    if (info) {
      if (typeof data.passport_file !== "string") {
        // Has been changed [Backend returns string]
        console.log(data.passport_file);
        formData.append("passport_file", data.passport_file);
        formData.append("signature_file", data.signature_file);
      } else {
        formData.append("passport_file", passport);
        formData.append("signature_file", signature);
      }
    } else {
      formData.append("passport_file", data.passport_file[0]);
      formData.append("signature_file", data.signature_file[0]);
    }
    console.log(formData);

    if (info) {
      // console.log("EDit");
      try {
        // @ts-ignore
        await updateEmployeeOnboarding({
          id: info.data.id,
          body: formData,
        }).unwrap();
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

        reset(formData);
      } catch (error) {
        toast.error("Something went wrong");
      }
    } else {
      try {
        // @ts-ignore
        const res = await createEmployeeOnboarding(formData).unwrap();
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

        reset();
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };

  React.useEffect(() => {
    // console.log(form.getValues());
    if (info) {
      const { data } = info;
      console.log("-->", data);

      form.reset({
        legal_firstname: data.legal_firstname,
        legal_middlename: data.legal_middlename,
        legal_lastname: data.legal_lastname,
        address: data.address,
        phone_number: data.phone_number,
        other_number: data.other_number,
        date_of_birth: data.date_of_birth,
        date_of_hire: data.date_of_hire,
        ss_number: data.ss_number,
        serial_id_code: data.serial_id_code,
        signature_file: data.signature_file,
        passport_file: data.passport_file,
        marital_status: data.marital_status,
        own_computer: data.own_computer,
        require_email_access: data.require_email_access,
        employment_type: data.employment_type,
        group: data.group,

        // designation: data.designation.id,
        // location: data.location.id,
        // department: data.department,
        // project: data.project,
      });

      createFileObjectFromUrl(data.passport_file).then((file) => {
        setPassport(file);
      });

      createFileObjectFromUrl(data.signature_file).then((file) => {
        setSignature(file);
      });
    }
  }, [info]);

  React.useEffect(() => {
    if (info) {
      const { data } = info;
      // console.log(">>>>", departments, locations, projects, positions);

      form.reset({
        ...form.getValues(),
        designation: data.designation.id,
        location: data.location.id,
        department: data.department,
        project: data.project,
      });
    }
  }, [departments, locations, projects, positions]);

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
              placeholder='Surname'
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
            <FormInput name='serial_id_code' label='Serial ID Code' required />

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
                    <SelectItem key={location?.id} value={String(location?.id)}>
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
                {projects?.data?.results?.map((project: IProjectSingleData) => (
                  <SelectItem key={project?.id} value={String(project?.id)}>
                    {project?.title}
                  </SelectItem>
                ))}
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
