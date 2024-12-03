import { useLocation, useNavigate } from "react-router-dom";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import FormSelect from "atoms/FormSelectField";
import FormButton from "atoms/FormButton";
import { Button } from "components/ui/button";
import Card from "components/shared/Card";
import FundRequstLayout from "./FundRequstLayout";
import { FundRequestSchema, TFundRequest } from "definations/program-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import { Separator } from "components/ui/separator";
import { useGetProjectsQuery } from "services/projectsApi/projectsApi";
import { useLocationQuery, usePartnersQuery } from "services/moduleProjects";
import {
    useFinancialYearQuery,
    useLocationsQuery,
} from "services/moduleConfig";
import { useGetUserQuery } from "services/users";

const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 2000;
    return new Array(currentYear - startYear + 1).fill(_).map((_, i) => {
        const value = String(currentYear - i);
        return {
            label: value,
            value: value,
        };
    });
};

const getMonthOptions = () => {
    const monthsArr = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const months = monthsArr.map((month, index) => ({
        label: month,
        value: index < 9 ? `0${index + 1}` : `${index + 1}`,
    }));

    return months;
};

const CreateFundRequest = () => {
    const form = useForm<TFundRequest>({
        resolver: zodResolver(FundRequestSchema),
        defaultValues: {
            project: "",
            month: "",
            year: "",
            partner: "",
            currency: "",
            financial_year: "",
            type: "",
            location: "",
            reviewer: "",
        },
    });

    const navigate = useNavigate();

    const { pathname } = useLocation();

    const { data: project, isLoading: projectIsLoading } = useGetProjectsQuery({
        no_paginate: false,
    });

    const projectOptions = project?.data.results.map(({ title, id }) => ({
        label: title,
        value: id,
    }));

    const { data: partner } = usePartnersQuery({ no_paginate: false });

    const partnerOptions = partner?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
    }));

    const { data: financialYear } = useFinancialYearQuery({
        no_paginate: false,
    });

    const financialYearOptions = financialYear?.data.results.map(
        ({ year, id }) => ({
            label: year,
            value: id,
        })
    );

    const { data: location } = useLocationsQuery({ no_paginate: false });

    const locationOptions = location?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
    }));

    const { data: user } = useGetUserQuery({ no_paginate: false });

    const reviewerOptions = user?.data.results.map(
        ({ first_name, last_name, id }) => ({
            label: `${first_name} ${last_name}`,
            value: id,
        })
    );

    const { handleSubmit } = form;

    const onSubmit: SubmitHandler<TFundRequest> = (data) => {
        const formData = {
            project: data.project,
            partner: data.partner,
            month_year: `${data.month}/${data.year}`,
            currency: data.currency,
            type: data.type,
            financial_year: data.financial_year,
        };

        localStorage.setItem("projectFundRequest", JSON.stringify(formData));

        let path = pathname;

        path = path.substring(0, path.lastIndexOf("/"));

        path += "/fund-request-summary";
        navigate(path);
    };

    return (
        <FundRequstLayout>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card className="space-y-10 py-5">
                        <FormSelect
                            name="project"
                            label="Project Name"
                            placeholder="Select Project"
                            required
                            options={projectOptions}
                        />

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="-mt-2">
                                <div className="grid grid-cols-2 gap-3 items-center">
                                    <FormSelect
                                        label="Month"
                                        name="month"
                                        placeholder="Select month"
                                        required
                                        options={getMonthOptions()}
                                    />
                                    <FormSelect
                                        label="Year"
                                        name="year"
                                        placeholder="Select Financial Year"
                                        required
                                        options={getYearOptions()}
                                    />
                                </div>
                            </div>

                            <FormSelect
                                label="Partner"
                                name="partner"
                                placeholder="Select Partner"
                                required
                                options={partnerOptions}
                            />
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <FormSelect
                                label="Currency"
                                name="currency"
                                required
                                options={[
                                    { label: "NGN", value: "NGN" },
                                    { label: "USD", value: "USD" },
                                ]}
                                placeholder="Select Currency"
                            />

                            <FormSelect
                                label="Type"
                                name="type"
                                required
                                options={[
                                    { label: "Main", value: "main" },
                                    {
                                        label: "Supplementary",
                                        value: "supplementary",
                                    },
                                ]}
                                placeholder="Select Type"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <FormSelect
                                label="Financial Year"
                                name="financial_year"
                                required
                                options={financialYearOptions}
                                placeholder="Select Financial Year"
                            />

                            <FormSelect
                                label="Location"
                                name="location"
                                required
                                options={locationOptions}
                                placeholder="Select Location"
                            />
                        </div>

                        <FormSelect
                            label="Reviewer"
                            name="reviewer"
                            required
                            options={reviewerOptions}
                            placeholder="Select Reviewer"
                        />
                    </Card>

                    <div className="flex justify-end gap-5 mt-16">
                        <Button
                            type="button"
                            className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                        >
                            Cancel
                        </Button>
                        <FormButton type="submit">Next</FormButton>
                    </div>
                </form>
            </Form>
        </FundRequstLayout>
    );
};

export default CreateFundRequest;
