import { useNavigate } from "react-router-dom";
import FormButton from "atoms/FormButton";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { Button } from "components/ui/button";
import FundRequstLayout from "./FundRequstLayout";
import React, { useState } from "react";
import { Input } from "components/ui/input";
import { useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import {
  Table,
  TableBody,
  //   TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";

interface InputValues {
  description: string;
  amount: string;
  comments: string;
  unit_cost: string;
  frequency: string;
}

const FundSummary: React.FC = () => {
  const [inputValues, setInputValues] = useState<InputValues[]>([
    {
      description: "",
      amount: "",
      comments: "",
      unit_cost: "",
      frequency: "",
    },
  ]);
  console.log(inputValues);
  const navigate = useNavigate();

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
    const newInputValues = [
      ...inputValues,
      {
        description: "",
        amount: "",
        comments: "",
        unit_cost: "",
        frequency: "",
      },
    ];
    setInputValues(newInputValues);
  };

  const form = useForm();

  const { handleSubmit } = form;

  const onSubmit = () => {
    const projectFundRequest = JSON.parse(
      localStorage.getItem("projectFundRequest") as any
    );

    const formData = {
      line_items: inputValues,
      ...projectFundRequest,
    };
    console.log(formData);

    // sessionStorage.removeItem("fundRequestCompletedSteps");
  };

  return (
    <FundRequstLayout>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Table className="border rounded-xl">
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  Description of Activity
                </TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead className="w-[300px]">Comment</TableHead>
                {/* <TableHead>Detailed Breakdown</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {inputValues.map((value, index) => (
                <TableRow key={index} className="">
                  <TableCell>
                    <Input
                      id="description"
                      name="description"
                      placeholder=""
                      value={value.description}
                      onChange={(e) =>
                        handleInputChange(e, index, "description")
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      id="amount"
                      name="amount"
                      placeholder=""
                      value={value.amount}
                      onChange={(e) => handleInputChange(e, index, "amount")}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      id="unit_cost"
                      name="unit_cost"
                      placeholder=""
                      value={value.unit_cost}
                      onChange={(e) => handleInputChange(e, index, "unit_cost")}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      id="frequency"
                      name="frequency"
                      placeholder=""
                      value={value.frequency}
                      onChange={(e) => handleInputChange(e, index, "frequency")}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      id="comments"
                      name="comments"
                      placeholder=""
                      value={value.comments}
                      onChange={(e) => handleInputChange(e, index, "comments")}
                    />
                  </TableCell>

                  {/* <TableCell className="flex justify-center max">
                    <Button
                      onClick={() => {
                        dispatch(
                          openDialog({
                            type: DialogType.FundRequstSummaryModal,
                            dialogProps: {
                              width: "max-w-4xl",
                              height: "max-h-[700px]",
                            },
                          })
                        );
                      }}
                      variant="ghost"
                      className="text-yellow-500"
                    >
                      Add
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button
            type="button"
            variant="outline"
            className="text-[#DEA004] w-[250px] mt-5"
            onClick={handleAddInput}
          >
            Click to add another
          </Button>

          <div className="flex justify-end gap-5 pt-24">
            <FormButton
              onClick={() => navigate(-1)}
              preffix={<ArrowLeft size={14} />}
              type="button"
              className="bg-[#FFF2F2] text-primary dark:text-gray-500"
            >
              Back
            </FormButton>

            <FormButton
              onClick={() => {
                onSubmit();
                dispatch(
                  openDialog({
                    type: DialogType.FundSuccessModal,
                    dialogProps: {
                      width: "max-w-lg",
                    },
                  })
                );
              }}
              suffix={<ArrowRight size={14} />}
              type="submit"
            >
              Submit Request
            </FormButton>
          </div>
        </form>
      </Form>
    </FundRequstLayout>
  );
};

export default FundSummary;
