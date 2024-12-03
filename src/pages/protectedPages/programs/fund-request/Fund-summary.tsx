import { useNavigate, useLocation } from "react-router-dom";
import FormButton from "atoms/FormButton";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "components/ui/button";
import FundRequstLayout from "./FundRequstLayout";
import React, { useState } from "react";
import { Input } from "components/ui/input";
import { useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "components/ui/table";
import { openDialog } from "store/ui";
import { DialogType, largeDailogScreen } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";

const FundSummary: React.FC = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const form = useForm();

    const dispatch = useAppDispatch();

    const { handleSubmit } = form;

    const onSubmit = async () => {
        const projectFundRequest = JSON.parse(
            localStorage.getItem("projectFundRequest") as any
        );

        // localStorage.setItem("projectFundRequest", JSON.stringify(formData));

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
                            <TableRow>
                                <TableCell>
                                    <Input
                                        id="description"
                                        name="description"
                                        placeholder=""
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        id="amount"
                                        name="amount"
                                        placeholder=""
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        id="unit_cost"
                                        name="unit_cost"
                                        placeholder=""
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
                        </TableBody>
                    </Table>

                    <Button
                        type="button"
                        variant="outline"
                        className="text-[#DEA004] w-[250px] mt-5"
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
