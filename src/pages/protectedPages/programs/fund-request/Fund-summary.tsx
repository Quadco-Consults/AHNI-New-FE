import { useNavigate } from "react-router-dom";
import FormButton from "atoms/FormButton";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "components/ui/button";
import FundRequstLayout from "./FundRequstLayout";
import React, { useState } from "react";
import { Input } from "components/ui/input";
import { useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import { SelectContent, SelectItem } from "components/ui/select";
import FormSelect from "atoms/FormSelectField";
import {
  Table,
  TableBody,
  //   TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import FundRequestAPI from "services/programsApi/fund-request";
import { toast } from "sonner";
import { RouteEnum } from "constants/RouterConstants";

interface InputValues {
  description: string;
  amount: string;
  comments: string;
  unit_cost: string;
  frequency: string;
}

const data = [
  {
    id: "1",
    name: "Travel: International Travel",
    description:
      "Expenses related to international travel, including flights, accommodations, and meals.",
    code: "TRAVEL_INTL",
  },
  {
    id: "2",
    name: "Travel: Domestic Travel",
    description:
      "Expenses for domestic travel within the country, covering transportation, lodging, and per diem.",
    code: "TRAVEL_DOM",
  },
  {
    id: "3",
    name: "Equipment: Health Equipment",
    description:
      "Medical and health-related equipment used in healthcare settings, such as monitors and diagnostic tools.",
    code: "EQP_HEALTH",
  },
  {
    id: "4",
    name: "Equipment: Non-Health Equipment",
    description:
      "Non-medical equipment used for general purposes, including office supplies, furniture, and IT hardware.",
    code: "EQP_NONHEALTH",
  },
  {
    id: "5",
    name: "Fringe Benefits",
    description:
      "Employee benefits offered in addition to wages, such as insurance, retirement plans, and paid time off.",
    code: "FRINGE_BEN",
  },
];

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

  const [createFundRequestMutation, { isLoading }] =
    FundRequestAPI.useCreateFundRequestMutation();

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

  const onSubmit = async () => {
    const projectFundRequest = JSON.parse(
      localStorage.getItem("projectFundRequest") as any
    );

    const formData = {
      line_items: inputValues,
      ...projectFundRequest,
    };
    console.log(formData);

    try {
      await createFundRequestMutation(formData).unwrap();
      toast.success("Successfully created");
      sessionStorage.removeItem("fundRequestCompletedSteps");
      localStorage.removeItem("projectFundRequest");
      navigate(RouteEnum.PROGRAM_FUND_REQUEST);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
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
                <TableHead className="w-[300px]">Category</TableHead>
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
                      type="number"
                      onChange={(e) => handleInputChange(e, index, "frequency")}
                    />
                  </TableCell>
                  <TableCell>
                    <FormSelect
                      name="category"
                      placeholder="Select cost category"
                      required
                    >
                      <SelectContent>
                        {data.map((el, i) => (
                          <SelectItem key={i} value={el.id}>
                            {el.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </FormSelect>
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
              suffix={<ArrowRight size={14} />}
              type="submit"
              loading={isLoading}
              disabled={isLoading}
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
