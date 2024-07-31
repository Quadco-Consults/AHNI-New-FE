import BackNavigation from "atoms/BackNavigation";
import FadedButton from "atoms/FadedButton";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import AddSquareIconFaded from "components/icons/AddSquareIconFaded";
import { Form } from "components/ui/form";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const NewCloseOutPlan: React.FC = () => {
  const form = useForm();
  const onSubmit: SubmitHandler<any> = (data) => console.log(data);

  return (
    <main className="w-full flex flex-col items-center justify-center gap-y-[1.875rem]">
      <section className="w-full">
        <div className="w-full flex ">
          <BackNavigation />
        </div>
      </section>
      <section className="w-full">
        <div className="w-full bg-white p-5 space-y-[1.25rem]">
          <p className="text-[#1A0000] text-[1.25rem] font-semibold py-5">Create Close Out Plan</p>
          <Form {...form}>
            <form className="flex flex-col gap-y-[1.25rem]" action="" onSubmit={onSubmit}>
              <FormSelect label="Project Title" name="" required />
              <FormSelect label="Select Department" name="" required />
              <div className="flex flex-col gap-y-[1.25rem]">
                <FormInput label="Kay Task" name="" required />
                <div className="w-fit">
                  <FadedButton
                    onClick={() => {
                      //   alert("Lois My Baby");
                      prompt("What is baby name?");
                    }}
                  >
                    <div className="flex p-2 gap-x-[.625rem] text-primary font-semibold text-sm w-fit">
                      <AddSquareIconFaded />
                      <p>Click to Add More Task</p>
                    </div>
                  </FadedButton>
                </div>
              </div>
              <div>
                <FormInput name="" label="Designation" required />
              </div>
            </form>
            <div className="flex justify-end items-center gap-x-[1rem]">
              <div>
                <FadedButton>
                  <p className="text-primary">Cancel</p>
                </FadedButton>
              </div>
              <div>
                <FormButton>
                  <p>Finish</p>
                </FormButton>
              </div>
            </div>
          </Form>
        </div>
      </section>
    </main>
  );
};

export default NewCloseOutPlan;
