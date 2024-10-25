import { useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import { Separator } from "components/ui/separator";
import { Save } from "lucide-react";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import FormInput from "atoms/FormInput";
import FileUpload from "atoms/FileUpload";
import {
  WorkforceQualificationFormValues,
  workforceQualificationSchema,
} from "definations/hr-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import WorkforceAPI from "services/hrApi/workforce";
import { toast } from "sonner";
import FormButton from "atoms/FormButton";

const Qualification = () => {
  const dispatch = useAppDispatch();
  const workforceID = localStorage.getItem("workforceID");

  const [createWorkforceQualificationMutation, { isLoading }] =
    WorkforceAPI.useCreateWorkforceQualificationMutation();

  const form = useForm<WorkforceQualificationFormValues>({
    resolver: zodResolver(workforceQualificationSchema),
    defaultValues: {
      name: "",
      institution: "",
      year: "",
      document: FileList,
    },
  });
  const { handleSubmit } = form;

  const onSubmit = async (data: WorkforceQualificationFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("institution", data.institution);
    formData.append("year", data.year.substring(0, data.year.indexOf("-")));
    formData.append("document", data.document[0]);

    if (workforceID === undefined) {
      toast.error("Basic information is required");
      return;
    }

    try {
      await createWorkforceQualificationMutation({
        path: { id: workforceID as string },
        body: formData,
      }).unwrap();
      dispatch(
        openDialog({
          type: DialogType.HrSuccessModal,
          dialogProps: {
            label: "Employee information saved",
          },
        })
      );
      form.reset();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h4 className="text-red-500 text-lg font-medium">Qualification</h4>
        <Separator />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput name="name" label="Certificate Name" required />
          <FormInput
            name="institution"
            label="Institution (Optional)"
            required
          />
          <FormInput type="date" name="year" label="Year (Optional)" required />
          <FileUpload name="document" label="Document" />
        </div>
        {/* <Button variant="ghost">
          <AddIcon /> Add Qualification
        </Button> */}

        <div className="flex gap-x-6 justify-end">
          <FormButton
            loading={isLoading}
            disabled={isLoading}
            variant="outline"
          >
            <Save size={20} /> Save
          </FormButton>
        </div>
      </form>
    </Form>
  );
};

export default Qualification;
