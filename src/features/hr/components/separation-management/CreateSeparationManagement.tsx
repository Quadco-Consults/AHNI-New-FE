"use client";

import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import Card from "components/Card";
import GoBack from "components/GoBack";
import { Button } from "components/ui/button";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Form } from "components/ui/form";
import { LoadingSpinner } from "components/Loading";
import { SelectContent, SelectItem } from "components/ui/select";

import { EmployeeOnboarding } from "definations/hr-types/employee-onboarding";
import { useGetEmployeeOnboardings } from "@/features/hr/controllers/employeeOnboardingController";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";

const CreateSeparationManagement = () => {
  const { data: employeeData, isLoading: fetchingEmployeeData } =
    useGetEmployeeOnboardings({ page: 1, size: 20 });
  const { data: projectData, isLoading: fetchingProjectData } =
    useGetAllProjects({ page: 1, size: 1000 });
  const router = useRouter();
  const form = useForm();

  console.log("=== SEPARATION MANAGEMENT - PROJECTS DEBUG ===");
  console.log("Project data:", projectData);
  console.log("Projects results:", projectData?.data?.results);
  console.log("Projects count:", projectData?.data?.results?.length);
  console.log("Is loading projects:", fetchingProjectData);

  const options = ["Voluntary Separation", "End Of Project", "Dismissal"].map(
    (option) => ({
      label: option,
      value: option,
    })
  );

  return (
    <div className='space-y-4'>
      <GoBack />
      <Card>
        <Form {...form}>
          <form className='space-y-8'>
            <h4 className='font-semibold text-xl'>New Exit Submission</h4>

            <div className='grid grid-cols-2 gap-5'>
              <div className='col-span-1'>
                <FormSelect label='Employee Name' name='employee' required>
                  <SelectContent>
                    {fetchingEmployeeData ? (
                      <LoadingSpinner />
                    ) : (
                      employeeData?.data?.results.map(
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
                <FormSelect label='Exit Method' name='exit' required>
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
                  required
                >
                  <SelectContent>
                    {fetchingProjectData ? (
                      <LoadingSpinner />
                    ) : (
                      projectData?.data?.results?.map((project) => (
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
                  name='date'
                  label='Date'
                  type='date'
                  className='max-w-sm'
                  required
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
              // loading={isLoading}
              // disabled={isLoading}
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
