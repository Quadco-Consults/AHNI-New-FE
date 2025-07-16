import React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
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
import {
  useCreateEmployeeOnboardingQualificationsMutation,
  useUpdateEmployeeOnboardingQualificationsMutation,
} from "services/hrApi/hr-employee-onboarding-qualifications";
import { EmployeeOnboardingQualifications } from "definations/hr-types/employee-onboarding";

import { createFileObjectFromUrl } from "utils/get-file-extension";

const Qualification = ({
  qualifications,
}: {
  qualifications?: EmployeeOnboardingQualifications[];
}) => {
  // const { id } = useParams();
  const dispatch = useAppDispatch();
  const [file, setFile] = React.useState<any>({});
  const id = localStorage.getItem("workforceID") || "";

  const [createEmployeeOnboardingQualifications, { isLoading: createLoading }] =
    useCreateEmployeeOnboardingQualificationsMutation();

  const [updateEmployeeOnboardingQualifications, { isLoading: updateLoading }] =
    useUpdateEmployeeOnboardingQualificationsMutation();

  const form = useForm<WorkforceQualificationFormValues>({
    resolver: zodResolver(workforceQualificationSchema),
    defaultValues: {
      certificate_name: "",
      institution_name: "",
      date_of_qualification: "",
      certificate_file: "",
      employee: id,
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: WorkforceQualificationFormValues) => {
    const formData = new FormData();
    formData.append("certificate_name", data.certificate_name);
    formData.append("institution_name", data.institution_name);
    formData.append("date_of_qualification", data.date_of_qualification);
    formData.append("employee", id as string);

    if (qualifications && qualifications.length) {
      if (typeof data.certificate_file !== "string") {
        // Has been changed [Backend returns string]
        console.log(data.certificate_file);
        formData.append("certificate_file", data.certificate_file);
      } else {
        formData.append("certificate_file", file);
      }
    } else {
      formData.append("certificate_file", data.certificate_file[0]);
    }

    if (qualifications && qualifications.length) {
      try {
        // @ts-ignore
        await updateEmployeeOnboardingQualifications({
          id: id as string,
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

        form.reset(formData);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    } else {
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
        form.reset(formData);
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };

  React.useEffect(() => {
    if (qualifications && qualifications.length) {
      // console.log(qualifications);

      form.reset({
        certificate_name: qualifications[0].certificate_name,
        institution_name: qualifications[0].institution_name,
        date_of_qualification: qualifications[0].date_of_qualification,
        certificate_file: qualifications[0].certificate_file,
        employee: id,
      });

      createFileObjectFromUrl(qualifications[0].certificate_file).then(
        (file) => {
          setFile(file);
        }
      );
    }
  }, [qualifications]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <h4 className='text-red-500 text-lg font-medium'>Qualification</h4>
        <Separator />
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <FormInput
            name='certificate_name'
            label='Certificate Name'
            required
          />
          <FormInput name='institution_name' label='Institution ' required />
          <FormInput
            type='date'
            name='date_of_qualification'
            label='Year '
            required
          />
          <FileUpload name='certificate_file' label='Document' />
        </div>
        {/* <Button variant="ghost">
          <AddIcon /> Add Qualification
        </Button> */}

        <div className='flex gap-x-6 justify-end'>
          <FormButton
            loading={createLoading || updateLoading}
            disabled={createLoading || updateLoading}
            variant='outline'
            type='submit'
          >
            <Save size={20} /> Save
          </FormButton>
        </div>
      </form>
    </Form>
  );
};

export default Qualification;
