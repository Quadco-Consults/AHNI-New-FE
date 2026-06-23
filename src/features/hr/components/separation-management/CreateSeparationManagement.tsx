"use client";

import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelectField";
import Card from "@/components/Card";
import GoBack from "@/components/GoBack";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/Loading";
import { SelectContent, SelectItem } from "@/components/ui/select";

import { EmployeeOnboarding } from "definitions/hr-types/employee-onboarding";
import { useGetEmployeeOnboardings } from "@/features/hr/controllers/employeeOnboardingController";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useCreateSeparationManagement } from "@/features/hr/controllers/separationManagementController";
import { SeparationManagementCreate } from "@/features/hr/types/separation-management";
import { toast } from "sonner";
import { HrRoutes } from "@/constants/RouterConstants";
import { useEffect } from "react";

const CreateSeparationManagement = () => {
  const { data: employeeData, isLoading: fetchingEmployeeData } =
    useGetEmployeeOnboardings({ page: 1, size: 20 });
  const { data: projectData, isLoading: fetchingProjectData } =
    useGetAllProjects({ page: 1, size: 1000 });
  const router = useRouter();
  const form = useForm<SeparationManagementCreate>();

  const { createSeparationManagement, isLoading, isSuccess } = useCreateSeparationManagement();

  const options = ["Voluntary Separation", "End Of Project", "Dismissal"].map(
    (option) => ({
      label: option,
      value: option,
    })
  );

  useEffect(() => {
    if (isSuccess) {
      toast.success("Separation record created successfully");
      router.push(HrRoutes.SEPARATION_MANAGEMENT);
    }
  }, [isSuccess, router]);

  const onSubmit = async (data: any) => {
    try {
      const payload: SeparationManagementCreate = {
        employee: data.employee,
        exit_method: data.exit_method,
        project: data.project || undefined,
        submit_date: data.submit_date,
        exit_date: data.exit_date,
        reason_for_leaving: data.reason_for_leaving,
        notice_period: data.notice_period ? parseInt(data.notice_period) : undefined,
      };

      await createSeparationManagement(payload);
    } catch (error) {
      toast.error("Failed to create separation record");
    }
  };

  return (
    <div className='space-y-4'>
      <GoBack />
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <h4 className='font-semibold text-xl'>New Exit Submission</h4>

            <div className='grid grid-cols-2 gap-5'>
              <div className='col-span-1'>
                <FormSelect label='Employee Name' name='employee' required>
                  <SelectContent>
                    {fetchingEmployeeData ? (
                      <LoadingSpinner />
                    ) : (
                      employeeData?.data?.results
                        .filter((data: EmployeeOnboarding) => data?.id && data.id.trim() !== '')
                        .map(
                          (data: EmployeeOnboarding) => (
                            <SelectItem key={data?.id} value={data?.id}>
                              {data?.legal_firstname} {data?.legal_lastname}
                            </SelectItem>
                          )
                        )
                    )}
                  </SelectContent>
                </FormSelect>
              </div>

              <div className='col-span-1'>
                <FormSelect label='Exit Method' name='exit_method' required>
                  <SelectContent>
                    {options?.map((method) => (
                      <SelectItem key={method.label} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </FormSelect>
              </div>

              <div className='col-span-1'>
                <FormSelect
                  name='project'
                  label='Project'
                >
                  <SelectContent>
                    {fetchingProjectData ? (
                      <LoadingSpinner />
                    ) : (
                      (projectData as any)?.data?.results
                        ?.filter((project: any) => project?.id && project.id.trim() !== '')
                        ?.map((project: any) => (
                          <SelectItem key={project?.id} value={project?.id}>
                            {project?.project_name || project?.title}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </FormSelect>
              </div>

              <div className='col-span-1'>
                <FormInput
                  name='submit_date'
                  label='Submit Date'
                  type='date'
                  className='max-w-sm'
                  required
                />
              </div>

              <div className='col-span-1'>
                <FormInput
                  name='exit_date'
                  label='Exit Date'
                  type='date'
                  className='max-w-sm'
                  required
                />
              </div>

              <div className='col-span-1'>
                <FormInput
                  name='notice_period'
                  label='Notice Period (days)'
                  type='number'
                  className='max-w-sm'
                />
              </div>

              <div className='col-span-2'>
                <FormInput
                  name='reason_for_leaving'
                  label='Reason for Leaving'
                  type='text'
                  className='w-full'
                />
              </div>
            </div>

            <div className='flex gap-x-6 justify-end'>
              <Button
                onClick={() => router.back()}
                type='button'
                variant='custom'
              >
                Cancel
              </Button>
              <FormButton
                loading={isLoading}
                disabled={isLoading}
              >
                Create
              </FormButton>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateSeparationManagement;
