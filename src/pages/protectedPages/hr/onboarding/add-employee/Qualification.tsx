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
import { toast } from "sonner";
import FormButton from "atoms/FormButton";  
import { useCreateEmployeeOnboardingQualificationsMutation } from "services/hrApi/hr-emloyee-onboarding-qualifications";

const Qualification = ({id} : {id:string}) => {
  const dispatch = useAppDispatch();
  const workforceID = localStorage.getItem("workforceID");

  const [createEmployeeOnboardingQualifications, { isLoading }] =
  useCreateEmployeeOnboardingQualificationsMutation();

  const form = useForm<WorkforceQualificationFormValues>({
    resolver: zodResolver(workforceQualificationSchema),
    defaultValues: {
      certificate_name: "",
      institution_name: "",
      date_of_qualification: "",
      certificate_file: FileList,
      employee: workforceID as string
    },
  });
  const { handleSubmit } = form;

  const onSubmit = async (data: WorkforceQualificationFormValues) => {
    if (workforceID === undefined) {
      toast.error("Basic information is required");
      return;
    }
    const formData = new FormData();
    formData.append("certificate_name", data.certificate_name);
    formData.append("institution_name", data.institution_name);
    formData.append("date_of_qualification", data.date_of_qualification);
    formData.append("certificate_file", data.certificate_file[0]);
    formData.append("employee", workforceID as string);
    
    

    try {
      // @ts-ignore
      await createEmployeeOnboardingQualifications(formData).unwrap();
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
          <FormInput name="certificate_name" label="Certificate Name" required />
          <FormInput
            name="institution_name"
            label="Institution "
            required
          />
          <FormInput type="date" name="date_of_qualification" label="Year " required />
          <FileUpload name="certificate_file" label="Document" />
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
