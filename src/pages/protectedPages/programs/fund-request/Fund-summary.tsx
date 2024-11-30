import { useNavigate, useLocation } from "react-router-dom";
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
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "components/ui/dialog";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import {
    DialogType,
    largeDailogScreen,
    mediumDailogScreen,
} from "constants/dailogs";

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

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();

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

        localStorage.setItem("projectFundRequest", JSON.stringify(formData));

        let path = pathname;

        path = path.substring(0, path.lastIndexOf("/"));

        path += "/fund-request-preview";
        navigate(path);
    };

    return (
        <FundRequstLayout>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Table className="border rounded-xl">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">
                                    Description of Activity
                                </TableHead>
                                <TableHead>
                                    Fund Request for this period
                                </TableHead>
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
                                                handleInputChange(
                                                    e,
                                                    index,
                                                    "description"
                                                )
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            id="amount"
                                            name="amount"
                                            placeholder=""
                                            value={value.amount}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    e,
                                                    index,
                                                    "amount"
                                                )
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            id="unit_cost"
                                            name="unit_cost"
                                            placeholder=""
                                            value={value.unit_cost}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    e,
                                                    index,
                                                    "unit_cost"
                                                )
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            className="text-[#DEA004] w-full"
                                            type="button"
                                            onClick={() => {
                                                dispatch(
                                                    openDialog({
                                                        type: DialogType.FundRequestBreakdown,
                                                        dialogProps: {
                                                            ...largeDailogScreen,
                                                        },
                                                    })
                                                );
                                            }}
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
                            type="button"
                            className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                        >
                            Back
                        </FormButton>

                        <FormButton type="submit">Submit Request</FormButton>
                    </div>
                </form>
            </Form>
        </FundRequstLayout>
    );
};

export default FundSummary;
