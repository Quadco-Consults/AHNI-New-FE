import { zodResolver } from "@hookform/resolvers/zod";

import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Modal from "react-modal";

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className='font-bold text-[18px] text-center'>
            Add new Compensation Category
          </h2>

          <div className='mt-5 flex flex-col gap-5'>
            <div className='flex flex-col gap-2 w-full'>
              <FormSelect label='Position' name='position' required />
              <FormInput
                label='Grade'
                name='grade'
                required
                className='w-full'
              />
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

export default PayGroupModal;
