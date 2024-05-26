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
  fund: string;
  code: string;
}

const FundSummary: React.FC = () => {
  const [inputValues, setInputValues] = useState<InputValues[]>([
    {
      description: "",
      fund: "",
      code: "",
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
        fund: "",
        code: "",
      },
    ];
    setInputValues(newInputValues);
  };
  const form = useForm();

  const { handleSubmit } = form;

  const onSubmit = () => {
    sessionStorage.removeItem("fundRequestCompletedSteps");
  };

  return (
    <FundRequstLayout>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Table className="border rounded-xl">
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">
                  Description of Activity
                </TableHead>
                <TableHead>Fund Request for this period</TableHead>
                <TableHead>Unique Identifier Code</TableHead>
                <TableHead>Detailed Breakdown</TableHead>
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
                      id="fund"
                      name="fund"
                      placeholder=""
                      value={value.fund}
                      onChange={(e) => handleInputChange(e, index, "fund")}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      id="code"
                      name="code"
                      placeholder=""
                      value={value.code}
                      onChange={(e) => handleInputChange(e, index, "code")}
                    />
                  </TableCell>
                  <TableCell className="flex justify-center">
                    <Button
                      onClick={() => {
                        dispatch(
                          openDialog({
                            type: DialogType.FundRequstSummaryModal,
                            dialogProps: {
                              width: "max-w-5xl",
                            },
                          })
                        );
                      }}
                      variant="ghost"
                      className="text-yellow-500"
                    >
                      Add
                    </Button>
                  </TableCell>
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
              className="bg-[#FFF2F2] text-primary "
            >
              Back
            </FormButton>

            <FormButton
              onClick={() => {
                onSubmit();
                dispatch(
                  openDialog({
                    type: DialogType.SuccessModal,
                    dialogProps: {
                      width: "max-w-lg",
                    },
                  })
                );
              }}
              suffix={<ArrowRight size={14} />}
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
