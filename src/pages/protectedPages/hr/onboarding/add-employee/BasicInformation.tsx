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
import HrGradeAPI from "services/hrApi/hr-grade";
import HrPositionAPI from "services/hrApi/hr-position";
import { SelectContent, SelectItem } from "components/ui/select";
import { LoadingSpinner } from "components/shared/Loading";
import { HrGradeResults } from "definations/hr-types/hr-grades";
import FileUpload from "atoms/FileUpload";
import WorkforceAPI from "services/hrApi/workforce";
import { toast } from "sonner";
import LocationAPi from "services/configs/locationApi";
import DepartmentsAPI from "services/configs/departments";
import { LocationResultsData } from "definations/configs/location";
import { DepartmentsResultsData } from "definations/configs/departments";
import FormButton from "atoms/FormButton";

import { Button } from "components/ui/button";
import { HrRoutes } from "constants/RouterConstants";
import { updateStepCompletion } from "store/stepTracker";

const BasicInformation = () => {
  const dispatch = useAppDispatch();

  const { data: departments, isLoading: departmentIsLoading } =
    DepartmentsAPI.useGetDepartmentPaginateQuery({
      params: { no_paginate: true },
    });
  const { data: locations, isLoading: locationIsLoading } =
    LocationAPi.useGetLocationListQuery({
      params: { no_paginate: true },
    });
  const { data: grades, isLoading: gradeIsLoading } =
    HrGradeAPI.useGetHrGradeListQuery({
      params: { no_paginate: true },
    });
  const { data: positions, isLoading: positionIsLoading } =
    HrPositionAPI.useGetHrPositionListQuery({
      params: { no_paginate: true },
    });
  console.log({ positions, grades });

  const [createWorkforceMutation, { isLoading }] =
    WorkforceAPI.useCreateWorkforceMutation();

  const form = useForm<WorkforceFormValues>({
    resolver: zodResolver(workforceSchema),
    defaultValues: {
      user: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        gender: "",
        designation: "",
      },
      employee_number: "",
      employment_type: "",
      employment_status: "",
      date_of_hire: "",
      // date_of_leaving: "",
      signature: FileList,
      passport: FileList,
      location: "",
      department: "",
      position: "",
      grade: "",
    },
  });
  const { handleSubmit } = form;

  const onSubmit = async (data: WorkforceFormValues) => {
    const formData = new FormData();
    formData.append("user", JSON.stringify(data.user));
    formData.append("date_of_hire", data.date_of_hire);
    formData.append("department", data.department);
    formData.append("employee_number", data.employee_number);
    formData.append("employment_status", data.employment_status);
    formData.append("employment_type", data.employment_type);
    formData.append("grade", data.grade);
    formData.append("position", data.position);
    formData.append("location", data.location);
    formData.append("passport", data.passport[0]);
    formData.append("signature", data.signature[0]);

    try {
      const res = await createWorkforceMutation(formData).unwrap();
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
      localStorage.setItem("workforceID", res.data.id);

      form.reset();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div>
            <FormLabel className='font-semibold'>
              Employee Legal Name:
              <span className='text-red-500'>*</span>
            </FormLabel>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormInput name='user.first_name' placeholder='First name' />
              <FormInput name='user.last_name' placeholder='Last name' />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <FormSelect
              name='position'
              label='Position'
              placeholder='Select position'
              required
            >
              {/* <SelectContent>
              {positionIsLoading && <LoadingSpinner />}
              {positions?.map((position: HrGradeResults) => (
                <SelectItem key={position?.id} value={position?.id}>
                  {position?.name}
                </SelectItem>
              ))}
            </SelectContent> */}
            </FormSelect>
            <FormSelect
              name='grade'
              label='Grade'
              placeholder='Select grade'
              required
            >
              <SelectContent>
                {/* {gradeIsLoading && <LoadingSpinner />}
              {grades?.map((grade: HrGradeResults) => (
                <SelectItem key={grade?.id} value={String(grade?.id)}>
                  {grade?.name}
                </SelectItem>
              ))} */}
              </SelectContent>
            </FormSelect>
            <FormInput name='user.phone_number' label='Phone Number' required />
            <FormInput name='user.email' label='Email' required />
            <FormSelect
              name='user.gender'
              label='Gender'
              placeholder='Select gender'
              required
            >
              <SelectContent>
                {[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]?.map(({ label, value }, index) => (
                  <SelectItem key={index} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </FormSelect>
            <FormInput name='user.designation' label='Designation' required />
            <FormSelect
              name='location'
              label='Location'
              placeholder='Select location'
              required
            >
              <SelectContent>
                {/* {locationIsLoading && <LoadingSpinner />}
              {locations?.map((location: LocationResultsData) => (
                <SelectItem key={location?.id} value={String(location?.id)}>
                  {location?.state}
                </SelectItem>
              ))} */}
              </SelectContent>
            </FormSelect>
            <FormInput
              name='date_of_hire'
              type='date'
              label='Date of Hire'
              required
            />
            <FormInput
              name='employee_number'
              label='Employee Number'
              required
            />
            <FileUpload name='passport' label='Passport' />
            <FileUpload name='signature' label='Signature' />
            <FormSelect
              name='department'
              label='Department/Unit'
              placeholder='Select department'
              required
            >
              <SelectContent>
                {/* {departmentIsLoading && <LoadingSpinner />}
              {departments?.map((department: DepartmentsResultsData) => (
                <SelectItem key={department?.id} value={String(department?.id)}>
                  {department?.name}
                </SelectItem>
              ))} */}
              </SelectContent>
            </FormSelect>
            <FormSelect
              name='employment_type'
              label='Employment Type'
              placeholder='Select employment type'
              required
            >
              <SelectContent>
                {[{ label: "Internal", value: "internal" }]?.map(
                  ({ label, value }, index) => (
                    <SelectItem key={index} value={value}>
                      {label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </FormSelect>
            <FormSelect
              name='employment_status'
              label='Status'
              placeholder='Select status'
              required
            >
              <SelectContent>
                {[{ label: "Active", value: "active" }]?.map(
                  ({ label, value }, index) => (
                    <SelectItem key={index} value={value}>
                      {label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </FormSelect>
            {/* <FormSelect
            options={[]}
            name="computer"
            label="Do you have a Computer?"
            required
          />
          <FormSelect
            options={[]}
            name="email"
            label="Do you require Email access?"
            required
          /> */}
          </div>

          {/* <div className="card-wrapper space-y-6">
          <h4 className="text-red-500 text-lg font-medium">
            Group Membership & Location
          </h4>
          <Separator />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormSelect
              options={[]}
              name="group"
              label="Group Membership"
              placeholder="Select group"
              required
            />
            <FormSelect
              options={[]}
              name="location"
              label="Location"
              placeholder="Select location"
              required
            />
          </div>
        </div> */}

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
