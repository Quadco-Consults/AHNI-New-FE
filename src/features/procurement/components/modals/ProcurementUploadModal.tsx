import { zodResolver } from "@hookform/resolvers/zod";
import { UploadFileSvg } from "assets/svgs/CAndGSvgs";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import Modal from "react-modal";
import { toast } from "sonner";
import { closeDialog } from "store/ui";
import { useDispatch } from "react-redux";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useGetAllFinancialYears } from "@/features/modules/controllers/config/financialYearController";

type PropsType = {
  isOpen: boolean;
  onCancel: () => void;
  onOk: () => void;
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const FormSchema = z.object({
  financial_year: z.string().min(1, "Please select a Financial Year"),
  file: z.string().min(1, "Please select a file to upload"),
  project: z.string().min(1, "Please select a Project"),
});

const ProcurementPlanUploadModal = (props: PropsType) => {
  const dispatch = useDispatch();

  const [file, setFile] = useState<File | Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: financialYear } = useGetAllFinancialYears({
    page: 1,
    size: 1000000,
  });

  const { data: project } = useGetAllProjects({
    page: 1,
    size: 1000000,
  });
  // @ts-ignore
  const financialYearOptions = financialYear?.data.results.map(
    // @ts-ignore
    ({ year, id }) => ({
      label: year,
      value: id,
    })
  );

  // @ts-ignore
  const projectOptions = project?.data.results.map(({ title, id }) => ({
    label: title,
    value: id,
  }));

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      financial_year: "",
      file: "1",
      project: "",
    },
  });

  const { handleSubmit } = form;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    setFile(file);
  };

  const onSubmit = async (data: { financial_year: string | Blob }) => {
    const formData = new FormData();

    formData.append("file", file as Blob);
    formData.append("financial_year", data?.financial_year);
    try {
      // TODO: Replace with TanStack Query controller
      // await createProcurementPlan(formData);
      setIsLoading(true);
      console.log('Procurement plan upload:', formData);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        toast.success('Procurement plan uploaded successfully');
        props.onCancel();
        // dispatch(closeDialog());
      }, 1000);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Upload failed');
      setIsLoading(false);
    }

    // const reader = new FileReader();

    // reader.onload = (e) => {
    //   // @ts-ignore
    //   const data = new Uint8Array(e.target.result);
    //   const workbook = XLSX.read(data, { type: "array" });
    //   const sheetName = workbook.SheetNames[0];
    //   const worksheet = workbook.Sheets[sheetName];
    //   const jsonData = XLSX.utils.sheet_to_json(worksheet);
    //   props.onOk(jsonData);
    //   props.onCancel();
    // };

    // reader.readAsArrayBuffer(file as Blob);
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onCancel}
      style={customStyles}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className='font-bold text-[18px] text-center'>
            Upload Procurement Plan
          </h2>

          <div className='mt-5 flex flex-col gap-5'>
            <div className='flex items-center gap-2'>
              <FormSelect
                label='Financial Year'
                name='financial_year'
                required
                options={financialYearOptions}
              />
            </div>
            <div className='flex items-center gap-2'>
              <FormSelect
                label='Project'
                name='project'
                required
                options={projectOptions}
              />
            </div>
            <div className='w-full relative gap-x-3 h-[52px] rounded-[16.2px] border flex justify-center items-center px-5'>
              <UploadFileSvg />
              <div>
                <Input
                  type='file'
                  className='bg-inherit border-none cursor-pointer'
                  multiple={false}
                  onChange={handleFileChange}
                  name=''
                />

                <FormInput type='hidden' label='' name='file' />
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <Button
                type='button'
                className='bg-[#FFF2F2] text-primary border-none'
                onClick={props.onCancel}
              >
                Cancel
              </Button>
              <FormButton className='bg-primary text-white border-none'>
                Done
              </FormButton>
            </div>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default ProcurementPlanUploadModal;
