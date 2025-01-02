import { useNavigate, useLocation } from "react-router-dom";
import FormButton from "atoms/FormButton";
import { Button } from "components/ui/button";
import FundRequstLayout from "./FundRequstLayout";
import React, { useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "components/ui/table";
import {
    FundRequestActivitySchema,
    TFundRequestActivityFormValues,
} from "definations/program-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import { useGetAllCostCategoriesQuery } from "services/modules/finance/cost-category";

const FundSummary: React.FC = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const form = useForm<TFundRequestActivityFormValues>({
        resolver: zodResolver(FundRequestActivitySchema),
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "activities",
    });

    const { data: costCategory } = useGetAllCostCategoriesQuery({
        page: 1,
        size: 2000000,
    });

    const costCategoryOptions = costCategory?.data.results.map(
        ({ name, id }) => ({
            label: name,
            value: id,
        })
    );

    const { handleSubmit } = form;

    const onSubmit: SubmitHandler<TFundRequestActivityFormValues> = async ({
        activities,
    }) => {
        const programFundRequest = JSON.parse(
            localStorage.getItem("programFundRequest") || "{}"
        );

        const payload = {
            ...programFundRequest,
            activities,
        };

        localStorage.setItem("programFundRequest", JSON.stringify(payload));

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
                                <TableHead>Quantity</TableHead>
                                <TableHead>Unit Cost</TableHead>

                                <TableHead>Frequency</TableHead>
                                <TableHead>Cost Category</TableHead>
                                <TableHead>Comment</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((field, index) => (
                                <TableRow key={field.id}>
                                    <TableCell>
                                        <FormInput
                                            id="activity_description"
                                            name={`activities.${index}.activity_description`}
                                            placeholder=""
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <FormInput
                                            id="unit_cost"
                                            name={`activities.${index}.unit_cost`}
                                            placeholder=""
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <FormInput
                                            id="frequency"
                                            name={`activities.${index}.frequency`}
                                            placeholder=""
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormInput
                                            id="quantity"
                                            name={`activities.${index}.quantity`}
                                            placeholder=""
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormSelect
                                            id="category"
                                            name={`activities.${index}.category`}
                                            placeholder="Select Cost Category"
                                            options={costCategoryOptions}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormInput
                                            id="comment"
                                            name={`activities.${index}.comment`}
                                            placeholder=""
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Button
                        type="button"
                        variant="outline"
                        className="text-[#DEA004] w-[250px] mt-5"
                        onClick={() =>
                            append({
                                activity_description: "",
                                quantity: "",
                                unit_cost: "",
                                frequency: "",
                                comment: "",
                                category: "",
                            })
                        }
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

                        <FormButton type="submit">Next</FormButton>
                    </div>
                </form>
            </Form>
        </FundRequstLayout>
    );
};

export default FundSummary;
