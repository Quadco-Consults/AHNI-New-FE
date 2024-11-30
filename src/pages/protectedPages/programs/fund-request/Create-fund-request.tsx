import { useLocation, useNavigate } from "react-router-dom";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import FormSelect from "atoms/FormSelectField";
import { ChevronRight } from "lucide-react";
import FormButton from "atoms/FormButton";
import { Button } from "components/ui/button";
import Card from "components/shared/Card";
import { Label } from "components/ui/label";
import FundRequstLayout from "./FundRequstLayout";
import { SelectContent, SelectItem } from "components/ui/select";

import { LoadingSpinner } from "components/shared/Loading";
import { ProjectsResultsData } from "definations/project-types/projects";
import { PartnerResultsData } from "definations/project-types/partners";
import { z } from "zod";
import { FundRequestDetailSchema } from "definations/program-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FinancialYearResultsData } from "definations/configs/financial-year";
import { useLocationQuery } from "services/moduleProjects";
import _ from "lodash";
import { useGetUserQuery } from "services/users";
import { useFinancialYearQuery } from "services/moduleConfig";
import { nigerianStates } from "lib/index";
import { Separator } from "components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "components/ui/dialog";
import { useDispatch } from "react-redux";
import { openDialog } from "store/ui";
import { DialogType, largeDailogScreen } from "constants/dailogs";
import { useGetProjectsQuery } from "services/projectsApi/projectsApi";

const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 2012;
    return new Array(currentYear - startYear + 1).fill(_).map((_, i) => {
        const value = currentYear - i;
        return `${value}`;
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
    const form = useForm<z.infer<typeof FundRequestDetailSchema>>({
        resolver: zodResolver(FundRequestDetailSchema),
        defaultValues: {
            project: "",
            partner: "",
            year: "",
            month: "",
            currency: "",
            type: "",
            financial_year: "",
        },
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { pathname } = useLocation();

    const { data: projects, isLoading: projectIsLoading } =
        useGetProjectsQuery({});

    const stateOptions = nigerianStates.map((state) => ({
        label: state,
        value: state,
    }));

    const { handleSubmit } = form;

    const handleOpenStateDialog = () => {
        dispatch(
            openDialog({
                type: DialogType.StateModal,
                dialogProps: {
                    ...largeDailogScreen,
                },
            })
        );
    };

    const onSubmit = (data: z.infer<typeof FundRequestDetailSchema>) => {
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
                        >
                            <SelectContent>
                                {projectIsLoading ? <LoadingSpinner /> : <></>}
                            </SelectContent>
                        </FormSelect>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="-mt-2">
                                <Label>Financial Month</Label>
                                <div className="grid grid-cols-2 gap-3 items-center">
                                    <FormSelect
                                        name="month"
                                        placeholder="Select month"
                                    >
                                        <SelectContent>
                                            {getMonthOptions().map(
                                                ({ label, value }) => (
                                                    <SelectItem
                                                        key={value}
                                                        value={value}
                                                    >
                                                        {label}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </FormSelect>
                                    <FormSelect
                                        name="year"
                                        placeholder="Select year"
                                    >
                                        <SelectContent>
                                            {getYearOptions().map((year) => (
                                                <SelectItem
                                                    key={year}
                                                    value={year}
                                                >
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </FormSelect>
                                </div>
                            </div>

                            <FormSelect
                                name="state"
                                label="State"
                                placeholder="Select State"
                                required
                                options={stateOptions}
                            />
                        </div>

                        <Separator />

                        <div>
                            <Label>State Offices Involved</Label>
                            <Button
                                variant="ghost"
                                className="text-[#DEA004] block mt-1 font-medium border shadow-sm py-2 px-5 rounded-lg text-sm"
                                onClick={handleOpenStateDialog}
                            >
                                Click to select states involved
                            </Button>
                        </div>
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
