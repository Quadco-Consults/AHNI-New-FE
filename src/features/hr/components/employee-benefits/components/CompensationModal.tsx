"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Modal from "react-modal";
import { SmileIcon } from "lucide-react";

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
  startYear: z.string().min(1, "Please select a start year"),
  endYear: z.string().min(1, "Please select an end year"),
  file: z.string().min(1, "Please select a file to upload"),
});

const PayGroupModal = (props: PropsType) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      startYear: "1",
      endYear: "1",
      file: "1",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = () => {
    console.log("hello");
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onCancel}
      style={customStyles}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='min-w-[400px]'>
          <h2 className='font-bold text-[18px] text-center'>
            Approval for CBA submission{" "}
          </h2>
          <div className='flex w-full gap-3 mt-5'>
            <Button className='bg-transparent w-full border border-green-500 flex flex-col h-[60px] text-green-500'>
              <SmileIcon className='' />
              Approve
            </Button>
            <Button className='bg-transparent w-full border border-primary flex flex-col h-[60px] text-primary'>
              <SmileIcon className='' />
              Approve
            </Button>
          </div>

          <div className='mt-5 flex flex-col gap-5'>
            <div className='flex flex-col gap-2 w-full'>
              <FormSelect label='Approved by' name='approved_by' required />
              <FormInput
                label='Reviewed by'
                name='reviewed_by'
                required
                className='w-full'
              />
            </div>

            <div className='flex items-center justify-center'>
              <FormButton className='bg-primary text-white border-none'>
                Submit
              </FormButton>
            </div>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default PayGroupModal;
