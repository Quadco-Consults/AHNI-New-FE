import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import projectsAPi from "services/projectsApi/projectsApi";

const CreateSeparationManagement = () => {
  const navigate = useNavigate();
  const form = useForm();

  const { data: projects } = projectsAPi.useGetProjectsParamsQuery({
    params: { no_paginate: true },
  });

  const projectData = useMemo(() => {
    return projects?.map((item) => ({
      label: item.title,
      value: item.id,
    }));
  }, [projects]);

  return (
    <div className="space-y-4">
      <GoBack />
      <Card>
        <Form {...form}>
          <form className="space-y-8">
            <h4 className="font-semibold text-xl">New Exit Submission</h4>

            <FormInput name="name" label="Employee Name" required />
            <FormSelect
              name="project"
              label="Project"
              options={projectData}
              required
            />
            <FormInput
              name="date"
              label="Date"
              type="date"
              className="max-w-sm"
              required
            />

            <div className="flex gap-x-6 justify-end">
              <Button
                onClick={() => navigate(-1)}
                type="button"
                variant="custom"
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
