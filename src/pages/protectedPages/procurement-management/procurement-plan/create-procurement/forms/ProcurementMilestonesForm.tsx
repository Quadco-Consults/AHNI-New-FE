import React from "react";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input-2";
import { useForm } from "react-hook-form";

type Props = {
  handlePrev: () => void;
  handleNext: () => void;
};

const ProcurementMilestonesForm = ({ handleNext, handlePrev }: Props) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<any>();
  return (
    <section className="w-full space-y-8">
      <h3 className="text-lg font-bold">Procurement Milestones</h3>
      <form className="space-y-6 " onSubmit={(e): void => e.preventDefault()}>
        <fieldset className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-5">
            <Input
              name="description"
              label="Description"
              placeholder=""
              register={register}
              required
              error={errors.description}
              type="text"
            />
            <Input
              name="date"
              label="Date"
              placeholder=""
              register={register}
              required
              error={errors.date}
              type="text"
            />
          </div>
        </fieldset>
        <span className="w-full flex items-center justify-end gap-5">
          <Button
            type="button"
            className="bg-[#FFF2F2] text-primary dark:text-gray-500"
            onClick={handlePrev}
          >
            Back
          </Button>
          <Button onClick={handleNext}>Finish</Button>
        </span>
      </form>
    </section>
  );
};

export default ProcurementMilestonesForm;
