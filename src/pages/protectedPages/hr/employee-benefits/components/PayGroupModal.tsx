import { zodResolver } from "@hookform/resolvers/zod";

import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Modal from "react-modal";
import { useGetAllPositionsQuery } from "services/modules/config/position";
import { useCreatePayGroupMutation } from "services/hrApi/hr-pay-groups";
import { toast } from "sonner";

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
  position: z.string().min(1, "Please selec a Position"),
  grade: z.string().min(1, "Please add a group"),
});

const PayGroupModal = (props: PropsType) => {
  const { data: position } = useGetAllPositionsQuery({
    page: 1,
    size: 2000000,
  });

  const [createPayGroup, { isLoading: isCreatingLoading }] =
    useCreatePayGroupMutation();
  const positionOptions = position?.data.results.map(({ name, id }) => ({
    label: name,
    value: id,
  }));
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      position: "1",
      grade: "1",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: any) => {
    await createPayGroup(data).unwrap();
    toast.success("Pay Group created successfully");
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
              <FormSelect
                label='Position'
                name='position'
                required
                placeholder='Select Position'
                options={positionOptions}
              />
              <FormInput
                label='Grade'
                name='grade'
                required
                type='number'
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
              <FormButton
                loading={isCreatingLoading}
                disabled={isCreatingLoading}
              >
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
