"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import FormButton from "@/components/FormButton";
import FormSelect from "components/atoms/FormSelectField";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Modal from "react-modal";
import { useGetAllPositionsManager } from "@/features/modules/controllers/config/positionController";
import { useCreatePayGroup } from "@/features/hr/controllers/payGroupController";
import { toast } from "sonner";
import { useGetAllGradesManager } from "@/features/modules/controllers/config/gradeController";
import { useGetAllLevelsManager } from "@/features/modules/controllers/config/levelController";

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
  grade: z.string().min(1, "Please add a Group"),

  level: z.string().min(1, "Please add a Level"),
});

const PayGroupModal = (props: PropsType) => {
  const { data: position } = useGetAllPositionsManager({
    page: 1,
    size: 2000000,
  });

  const { data: levels } = useGetAllLevelsManager({
    page: 1,
    size: 2000000,
  });

  const { data: grades } = useGetAllGradesManager({
    page: 1,
    size: 2000000,
  });

  const { createPayGroup, isLoading: isCreatingLoading } =
    useCreatePayGroup();

  const positionOptions = position?.results?.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  const levelOptions = levels?.results?.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  const gradeOptions = grades?.results?.map(({ name, id }) => ({
    label: name,
    value: id,
  }));
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      position: "1",
      grade: "1",
      level: "",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: any) => {
    await createPayGroup(data)();
    toast.success("Pay Group created successfully");
    props.onCancel();
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

              <FormSelect
                label='Grade'
                name='grade'
                required
                placeholder='Select Position'
                options={gradeOptions}
              />

              <FormSelect
                label='Level'
                name='level'
                required
                placeholder='Select level'
                options={levelOptions}
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
