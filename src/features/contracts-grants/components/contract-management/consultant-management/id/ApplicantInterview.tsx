"use client";

import BackNavigation from "components/atoms/BackNavigation";
import FormButton from "components/atoms/FormButton";
import Card from "components/Card";
import applicantInterviewColumns from "@/features/contracts-grants/components/table-columns/contract-management/consultant-management/consultant-interview";
import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";

const guide = [
    { main: "Unacceptable", sub: "(Did not meet any requirements)" },
    { main: "Marginal", sub: "(Meets some requirements, but not others)" },
    { main: "Acceptable", sub: "(Meets most but not all reuirements)" },
    { main: "Excellent", sub: "(Meets all exceeds all requirements)" },
];

export default function ApplicantInterviewPage() {
    const form = useForm();

    return (
        <section>
            <BackNavigation />

            <Card className="space-y-5">
                <h1 className="text-[#DEA004] font-bold text-lg">
                    Consultant Evaluation Metric
                </h1>

                <p className="text-sm">
                    Kindly use this matrix to comparatively evaluate consulting
                    candidates. For each consultant, next to each criteria enter
                    a ranking ranging between 1 and 4, where:
                </p>

                <ul className="text-sm list-disc pl-[15px] space-y-5">
                    {guide.map(({ main, sub }) => (
                        <li>
                            <span className="text-red-500 font-semibold">
                                {main}&nbsp;
                            </span>
                            {sub}
                        </li>
                    ))}
                </ul>

                <Form {...form}>
                    <DataTable
                        columns={applicantInterviewColumns}
                        data={[{} as any]}
                    />

                    <div className="flex justify-between">
                        <div className="flex items-center">
                            <h3 className="font-bold">Total Score:</h3>&nbsp;
                            <p>100</p>
                        </div>
                        <div className="flex items-center justify-end gap-x-5">
                            <Button variant="outline" size="lg" type="button">
                                Cancel
                            </Button>
                            <FormButton size="lg" type="submit">
                                Submit
                            </FormButton>
                        </div>
                    </div>
                </Form>
            </Card>
        </section>
    );
}
