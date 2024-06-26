import FormButton from "atoms/FormButton";
import FormTextArea from "atoms/FormTextArea";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { useAppDispatch } from "hooks/useStore";
import { X } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { closeDialog } from "store/ui";

interface InputValues {
  value: string;
}

const ProjectObjectiveModal = () => {
  const [inputValues, setInputValues] = useState<InputValues[]>([]);
  const dispatch = useAppDispatch();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof InputValues
  ) => {
    const newInputValues = [...inputValues];
    newInputValues[index][field] = e.target.value;
    setInputValues(newInputValues);
  };

  const handleAddInput = (e: React.FormEvent) => {
    e.preventDefault();
    const newInputValues = [...inputValues, { value: "" }];
    setInputValues(newInputValues);
  };

  const handleDeleteInput = (index: number) => {
    const newInputValues = inputValues.filter((_, i) => i !== index);
    setInputValues(newInputValues);
  };

  const form = useForm();

  const { handleSubmit } = form;

  const onSubmit = () => {};

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <h4 className="text-xl font-semibold">Add Objective</h4>

        <FormTextArea name="objective" label="Objective" />

        <div className="space-y-3">
          <h4 className="text-xl font-semibold">Add Sub-Objective</h4>

          {inputValues.map((value, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-[90%]">
                <FormTextArea
                  name="objective"
                  label="Objective"
                  onChange={(e) => handleInputChange(e, index, "value")}
                />
              </div>
              <div>
                <Button
                  onClick={() => handleDeleteInput(index)}
                  variant="ghost"
                  size="icon"
                  className="text-red-500"
                >
                  <X />
                </Button>
              </div>
            </div>
          ))}

          <Button
            onClick={handleAddInput}
            type="button"
            className="bg-[#FFF2F2] text-primary "
          >
            Add
          </Button>
        </div>

        <div className="flex justify-end gap-5 mt-16">
          <Button type="button" className="bg-[#FFF2F2] text-primary ">
            Cancel
          </Button>
          <Button onClick={() => dispatch(closeDialog())}>Done</Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectObjectiveModal;
