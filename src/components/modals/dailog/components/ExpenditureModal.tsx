import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { Form } from "components/ui/form";
import { CangGAddExpenditureSchema } from "definations/candg-validator";
import { useAppDispatch } from "hooks/useStore";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { expenditureAPIs } from "services/cAndGApi/expenditure";
import { toast } from "sonner";
import { closeDialog } from "store/ui";
import { z } from "zod";

const ExpenditureModal: React.FC = () => {
  const location = useLocation();
  const paths = location.pathname.split("/");
  const id = paths[paths.length - 1];

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const dispatch = useAppDispatch();

  const [addExpenditure, addExpenditureResults] = expenditureAPIs.useAddExpenditureMutation();

  const form = useForm<z.infer<typeof CangGAddExpenditureSchema>>({
    resolver: zodResolver(CangGAddExpenditureSchema),
  });
  const onSubmit: SubmitHandler<z.infer<typeof CangGAddExpenditureSchema>> = async (data) => {
    try {
      const result = await addExpenditure({ ...data, grant: id, month_year: `${month}/${year}` }).unwrap();
      if (result) {
        toast.success("Grant added");
        setTimeout(() => {
          dispatch(closeDialog());
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error?.data?.errors?.[0]?.attr + " is required");
    }
  };
  return (
    <div className="w-full">
      <Form {...form}>
        <form action="" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full items-start  gap-y-[1.875rem]">
          <div className="w-full">
            <FormInput className="w-full" name="amount" required type="number" label="Amount"></FormInput>
          </div>
          <div className="flex items-end w-[50%] gap-x-[1rem]">
            <input
              className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-100 dark:bg-background"
              placeholder="MM"
              required
              type="number"
              maxLength={2}
              max={12}
              value={month}
              minLength={2}
              onChange={(e) => {
                setMonth(e.target.value);
              }}
            />
            <input
              className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-100 dark:bg-background"
              placeholder="YYYY"
              required
              type="number"
              maxLength={4}
              value={year}
              minLength={4}
              max={2100}
              onChange={(e) => {
                setYear(e.target.value);
              }}
            />
          </div>
          <FormButton className="w-fit" loading={addExpenditureResults.isLoading}>
            <p>Add</p>
          </FormButton>
        </form>
      </Form>
    </div>
  );
};

export default ExpenditureModal;
