"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { Form } from "components/ui/form";
import { Separator } from "components/ui/separator";
import { Save } from "lucide-react";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import FormInput from "components/atoms/FormInput";
import FileUpload from "components/atoms/FileUpload";
import {
  WorkforceQualificationFormValues,
  workforceQualificationSchema,
} from "features/hr/types/hr-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import {
  useCreateEmployeeOnboardingQualifications,
  useUpdateEmployeeOnboardingQualifications,
} from "@/features/hr/controllers/hrEmployeeOnboardingQualificationsController";
import { EmployeeOnboardingQualifications } from "definations/hr-types/employee-onboarding";

import { createFileObjectFromUrl } from "utils/get-file-extension";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

const Qualification = ({
  qualifications,
}: {
  qualifications?: EmployeeOnboardingQualifications[];
}) => {
  // const { id } = useParams();
  const dispatch = useAppDispatch();
  const [file, setFile] = React.useState<any>({});
  const id = localStorage.getItem("workforceID") || "";

  const { createEmployeeOnboardingQualifications, isLoading: createLoading } =
    useCreateEmployeeOnboardingQualifications();

  const { updateEmployeeOnboardingQualifications, isLoading: updateLoading } =
    useUpdateEmployeeOnboardingQualifications();

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
    console.log("🚀 Qualifications form submission started:", data);

    const formData = new FormData();
    formData.append("certificate_name", data.certificate_name);
    formData.append("institution_name", data.institution_name);
    formData.append("date_of_qualification", data.date_of_qualification);
    formData.append("employee", id as string);

    // Handle certificate file upload properly
    console.log("📎 Certificate file data:", {
      certificate_file: data.certificate_file,
      certificate_file_type: typeof data.certificate_file,
      is_file_list: data.certificate_file instanceof FileList,
      is_file: data.certificate_file instanceof File,
      is_array: Array.isArray(data.certificate_file)
    });

    // Handle file upload correctly
    if (data.certificate_file) {
      if (data.certificate_file instanceof FileList && data.certificate_file.length > 0) {
        // From file input - FileList
        formData.append("certificate_file", data.certificate_file[0]);
        console.log("📎 Added file from FileList:", data.certificate_file[0].name);
      } else if (data.certificate_file instanceof File) {
        // Direct File object
        formData.append("certificate_file", data.certificate_file);
        console.log("📎 Added direct File:", data.certificate_file.name);
      } else if (typeof data.certificate_file === 'string' && file) {
        // Existing file scenario - use stored file
        formData.append("certificate_file", file);
        console.log("📎 Added stored file:", file);
      } else {
        console.warn("⚠️ Invalid certificate file format:", data.certificate_file);
        toast.error("Please select a valid certificate file");
        return;
      }
    } else {
      console.warn("⚠️ No certificate file provided");
      toast.error("Certificate file is required");
      return;
    }

    // Log FormData contents
    console.log("📤 FormData being sent:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    if (qualifications && qualifications.length) {
      try {
        // @ts-ignore
        await updateEmployeeOnboardingQualifications({
          id: id as string,
          body: formData,
        });
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
        // Direct Axios call for file upload instead of useApiManager
        console.log("📡 Making direct Axios call for file upload...");

        const response = await AxiosWithToken.post("hr/employees/qualifications/", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log("✅ Direct Axios call success:", response.data);
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
