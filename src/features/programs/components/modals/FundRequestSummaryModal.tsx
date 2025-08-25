"use client";

import FormInput from "components/atoms/FormInput";
import Card from "components/Card";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface InputValues {
  activity: string;
  description: string;
  quantity: string;
  cost: string;
  frq: string;
  amount: string;
  comment: string;
}

const FundRequestSummaryModal = () => {
  const [inputValues, setInputValues] = useState<InputValues[]>([
    {
      activity: "",
      description: "",
      quantity: "",
      cost: "",
      frq: "",
      amount: "",
      comment: "",
    },
  ]);
  console.log(inputValues);

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
    const newInputValues = [
      ...inputValues,
      {
        activity: "",
        description: "",
        quantity: "",
        cost: "",
        frq: "",
        amount: "",
        comment: "",
      },
    ];
    setInputValues(newInputValues);
  };

  const form = useForm();

  const { handleSubmit } = form;

  const onSubmit = () => {};

  return (
    <div className="p-10">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormInput label="Project Title" name="title" />

          <h4 className="text-red-500 font-semibold">
            Activities under this project
          </h4>

          {inputValues.map((value, index) => (
            <Card className="space-y-3" key={index}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormInput
                  label="Activity"
                  name="activity"
                  onChange={(e) => handleInputChange(e, index, "activity")}
                />
                <FormInput
                  label="Description"
                  name="description"
                  onChange={(e) => handleInputChange(e, index, "description")}
                />
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <FormInput
                  label="Quantity"
                  name="quantity"
                  onChange={(e) => handleInputChange(e, index, "quantity")}
                />
                <FormInput
                  label="Unit cost"
                  name="cost"
                  onChange={(e) => handleInputChange(e, index, "cost")}
                />
                <FormInput
                  label="FRQ"
                  name="frq"
                  onChange={(e) => handleInputChange(e, index, "frq")}
                />
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormInput
                  label="Request Amount"
                  name="amount"
                  onChange={(e) => handleInputChange(e, index, "amount")}
                />
                <FormInput
                  label="Comment"
                  name="comment"
                  onChange={(e) => handleInputChange(e, index, "comment")}
                />
              </div>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            className="text-[#DEA004] w-[250px] mt-5"
            onClick={handleAddInput}
          >
            Click to add another
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FundRequestSummaryModal;