import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import { Form } from "components/ui/form";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const ExpenditureModal: React.FC = () => {
  const form = useForm();
  const onSubmit: SubmitHandler<any> = (data) => console.log(data);
  return (
    <div className="w-full">
      <Form {...form}>
        <form action="" onSubmit={onSubmit} className="flex flex-col w-full items-center  gap-y-[1.875rem]">
          <div className="w-full">
            <FormSelect className="w-full" name="Project" label="Project" />
          </div>
          <div className="w-full">
            <FormInput className="w-full" name="Amount" label="Amount"></FormInput>
          </div>
          <div className="flex items-end w-fit">
            <FormInput name="Amount" label="Month/Year"></FormInput>
            <FormInput name="Amount" label=""></FormInput>
          </div>
          <FormButton className="w-fit">
            <p>Add</p>
          </FormButton>
        </form>
      </Form>
    </div>
  );
};

export default ExpenditureModal;
