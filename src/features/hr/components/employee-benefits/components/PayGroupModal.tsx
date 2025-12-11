"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import FormButton from "@/components/FormButton";
import FormSelect from "components/FormSelectField";
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
  const { data: position, isLoading: positionsLoading, error: positionsError } = useGetAllPositionsManager({
    page: 1,
    size: 2000000,
  });

  const { data: levels, isLoading: levelsLoading, error: levelsError } = useGetAllLevelsManager({
    page: 1,
    size: 2000000,
  });

  const { data: grades, isLoading: gradesLoading, error: gradesError } = useGetAllGradesManager({
    page: 1,
    size: 2000000,
  });

  const { createPayGroup, isLoading: isCreatingLoading } =
    useCreatePayGroup();

  // Debug: Log the raw data to see structure
  console.log('Position data:', position);
  console.log('Levels data:', levels);
  console.log('Grades data:', grades);
  console.log('Loading states:', { positionsLoading, levelsLoading, gradesLoading });
  console.log('Errors:', { positionsError, levelsError, gradesError });

  const positionOptions = position?.data?.results?.map(({ name, id }: any) => ({
    label: name,
    value: String(id), // Ensure value is a string
  })) || [];

  const levelOptions = levels?.data?.results?.map(({ name, id }: any) => ({
    label: name,
    value: String(id), // Ensure value is a string
  })) || [];

  const gradeOptions = grades?.data?.results?.map(({ name, id }: any) => ({
    label: name,
    value: String(id), // Ensure value is a string
  })) || [];

  // Test with hardcoded options to see if FormSelect works
  const testOptions = [
    { label: "Test Option 1", value: "test1" },
    { label: "Test Option 2", value: "test2" },
    { label: "Test Option 3", value: "test3" }
  ];

  // Debug: Log the mapped options
  console.log('Position options:', positionOptions);
  console.log('Level options:', levelOptions);
  console.log('Grade options:', gradeOptions);
  console.log('Position options length:', positionOptions.length);
  console.log('Level options length:', levelOptions.length);
  console.log('Grade options length:', gradeOptions.length);
  console.log('Test options:', testOptions);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      position: "",
      grade: "",
      level: "",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: any) => {
    try {
      await createPayGroup(data);
      toast.success("Pay Group created successfully");
      props.onCancel();
    } catch (error) {
      toast.error("Failed to create pay group");
      console.error("Pay group creation error:", error);
    }
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onCancel}
      style={customStyles}
      ariaHideApp={false}
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
                options={positionOptions.length > 0 ? positionOptions : testOptions}
              />
              {console.log('Rendering Position FormSelect with options:', positionOptions.length > 0 ? positionOptions : testOptions)}

              <FormSelect
                label='Grade'
                name='grade'
                required
                placeholder='Select Grade'
                options={gradeOptions.length > 0 ? gradeOptions : testOptions}
              />
              {console.log('Rendering Grade FormSelect with options:', gradeOptions.length > 0 ? gradeOptions : testOptions)}

              <FormSelect
                label='Level'
                name='level'
                required
                placeholder='Select Level'
                options={levelOptions.length > 0 ? levelOptions : testOptions}
              />
              {console.log('Rendering Level FormSelect with options:', levelOptions.length > 0 ? levelOptions : testOptions)}
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
