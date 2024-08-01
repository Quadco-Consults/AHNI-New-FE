import React from "react";
import RfqLayout from "./RfqLayout";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { SelectContent, SelectItem } from "components/ui/select";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Form } from "components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import FormButton from "atoms/FormButton";
import { useNavigate } from "react-router-dom";
import { RouteEnum } from "constants/RouterConstants";
import { z } from "zod";
import { SolicitationItemsSchema } from "definations/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { MinusCircle } from "lucide-react";

const Items = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof SolicitationItemsSchema>>({
    resolver: zodResolver(SolicitationItemsSchema),
    defaultValues: {
      items: [
        {
          quantity: 0,
          item: "",
          lot: 0,
        },
      ],
      criteria: [{ criteria: "" }],
    },
  });
  const { control, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  const {
    fields: criteria,
    append: appendCriteria,
    remove: removeCriteria,
  } = useFieldArray({
    control,
    name: "criteria",
  });

  const onSubmit = (data: any) => {
    sessionStorage.removeItem("completedSteps");
    localStorage.removeItem("vendorID");
    navigate(RouteEnum.RFQ);
  };

  return (
    <RfqLayout>
      <Form {...form}>
        <form className="space-y-8 p-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <h6 className="text-yellow-600">Items</h6>

            {fields.map((field, index) => (
              <div key={index} className="flex items-center gap-5 w-full">
                <div className="grid grid-cols-1 gap-4 w-full md:grid-cols-3">
                  <FormSelect name="type_of_business" label="Item" required>
                    <SelectContent>
                      {[
                        "Limited Liability",
                        "Public Limited Company",
                        "Registered Business Enterprise",
                      ].map((value: string, index: number) => (
                        <SelectItem key={index} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </FormSelect>
                  <FormInput name="title" label="Quantity" required />
                  <FormSelect name="type_of_business" label="Lot" required>
                    <SelectContent>
                      {[
                        "Limited Liability",
                        "Public Limited Company",
                        "Registered Business Enterprise",
                      ].map((value: string, index: number) => (
                        <SelectItem key={index} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </FormSelect>
                </div>
                <div className="flex items-center h-full ">
                  <MinusCircle
                    onClick={() => remove(index)}
                    className="cursor-pointer text-primary"
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <Button
                type="button"
                className="text-primary bg-[#FFF2F2] mt-2 flex gap-2 items-center justify-center"
                onClick={() =>
                  append({
                    quantity: 0,
                    item: "",
                    lot: 0,
                  })
                }
              >
                <AddSquareIcon />
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-5">
            <h6 className="text-yellow-600">Evaluation Criteria</h6>
            {criteria.map((value, index) => (
              <div key={index} className="flex items-center gap-5 w-full">
                <div className="grid grid-cols-1 gap-4 w-full md:grid-cols-3">
                  <FormSelect name="type_of_business" label="Category" required>
                    <SelectContent>
                      {[
                        "Limited Liability",
                        "Public Limited Company",
                        "Registered Business Enterprise",
                      ].map((value: string, index: number) => (
                        <SelectItem key={index} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </FormSelect>
                  <FormInput name="title" label="Title" required />
                  <FormSelect
                    name="type_of_business"
                    label="Description"
                    required
                  >
                    <SelectContent>
                      {[
                        "Limited Liability",
                        "Public Limited Company",
                        "Registered Business Enterprise",
                      ].map((value: string, index: number) => (
                        <SelectItem key={index} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </FormSelect>
                </div>
                <div className="flex items-center h-full ">
                  <MinusCircle
                    onClick={() => removeCriteria(index)}
                    className="cursor-pointer text-primary"
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <Button
                type="button"
                className="text-primary bg-[#FFF2F2] mt-2 flex gap-2 items-center justify-center"
                onClick={() =>
                  appendCriteria({
                    criteria: "",
                  })
                }
              >
                <AddSquareIcon />
                Add
              </Button>
            </div>
          </div>

          <div className="flex justify-between mt-16">
            <Button
              onClick={() => navigate(-1)}
              type="button"
              className="bg-[#FFF2F2] text-primary dark:text-gray-500"
            >
              Cancel
            </Button>
            <FormButton type="submit">Save Changes</FormButton>
          </div>
        </form>
      </Form>
    </RfqLayout>
  );
};

export default Items;
