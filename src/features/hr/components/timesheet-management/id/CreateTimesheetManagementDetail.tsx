"use client";

import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import Card from "components/Card";
import GoBack from "components/GoBack";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { openDialog } from "store/ui";

const CreateTimesheetManagementDetail = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const form = useForm({
    defaultValues: {
      projects: [{ project: "", activity: "", duration: "" }],
    },
  });

  const { control, handleSubmit } = form;

  const { fields, append } = useFieldArray({
    control,
    name: "projects",
  });

  const onSubmit = () => {
    dispatch(
      openDialog({
        type: DialogType.HrSuccessModal,
        dialogProps: {
          label: "The timesheet have been created successfully",
        },
      })
    );
  };

  return (
    <div className="space-y-4">
      <GoBack />
      <Card className="space-y-10">
        <h4 className="text-lg font-semibold">Create Timesheet</h4>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <FormInput
              type="date"
              name="date"
              label="Date"
              className="max-w-sm"
            />
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 gap-5 md:grid-cols-3"
                >
                  <FormInput
                    name={`projects.${index}.project`}
                    label="Project Name"
                    required
                  />
                  <FormSelect
                    name={`projects.${index}.activity`}
                    label="Activity Name"
                    options={[]}
                    required
                  />
                  <FormSelect
                    name={`projects.${index}.duration`}
                    label="Duration"
                    options={[]}
                    required
                  />
                </div>
              ))}
              <Button
                onClick={() =>
                  append({ project: "", activity: "", duration: "" })
                }
                variant="custom"
                type="button"
              >
                Add another project
              </Button>
            </div>

            <div className="flex justify-between">
              <Button
                onClick={() => router.back()}
                variant="custom"
                type="button"
              >
                Cancel
              </Button>
              <FormButton>Save</FormButton>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateTimesheetManagementDetail;
