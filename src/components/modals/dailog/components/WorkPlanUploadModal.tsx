import { Button } from "components/ui/button";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "components/ui/select";
import { Input } from "components/ui/input";
import { Upload as UploadFile } from "lucide-react";
import { LoadingSpinner } from "components/shared/Loading";
import WorkPlanAPi from "services/programsApi/work-plan";
import { Label } from "components/ui/label";
import { PartnerResultsData } from "definations/project-types/partners";
import { toast } from "sonner";
import FormButton from "atoms/FormButton";
import { useAppDispatch } from "hooks/useStore";
import { closeDialog } from "store/ui";
import FinancialAPI from "services/configs/financial-year";
import { FinancialYearResultsData } from "definations/configs/financial-year";
import { useGetProjectsParamsQuery } from "services/projectsApi/projectsApi";
import { useGetPartnersParamsQuery } from "services/projectsApi/partnersApi";

const WorkPlanUploadModal = () => {
    const [partnerValue, setPartnerValue] = useState("");
    const [projectValue, setProjectValue] = useState("");
    const [financialYearValue, setFinancialYearValue] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const dispatch = useAppDispatch();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handlePartnerValue = (value: string) => {
        setPartnerValue(value);
    };
    const handleProjectValue = (value: string) => {
        setProjectValue(value);
    };
    const handleFinancialYear = (value: string) => {
        setFinancialYearValue(value);
    };

    const projectsQueryResult = useGetProjectsParamsQuery(
        useMemo(
            () => ({
                params: {
                    no_paginate: true,
                },
            }),
            []
        )
    );
    const partnersQueryResult = useGetPartnersParamsQuery(
        useMemo(
            () => ({
                params: {
                    project: projectValue,
                    no_paginate: true,
                },
            }),
            [projectValue]
        )
    );
    const financialYearQueryResult = FinancialAPI.useGetFinancialYearsQuery(
        useMemo(
            () => ({
                params: {
                    no_paginate: true,
                },
            }),
            []
        )
    );

    const projects = projectsQueryResult?.data;
    const partners = partnersQueryResult?.data;
    const financialYear = financialYearQueryResult?.data;

    const [createWorkPlanMutation, { isLoading }] =
        WorkPlanAPi.useCreateWorkPlanDocumentMutation();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            toast.error("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append("partner_id", partnerValue);
        formData.append("project_id", projectValue);
        formData.append("financial_year_id", financialYearValue);
        formData.append("file", file);

        try {
            await createWorkPlanMutation(formData).unwrap();
            toast.success("Document upload successfully.");
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }

        setPartnerValue("");
        setProjectValue("");
        setFinancialYearValue("");
        setFile(null);
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="space-y-2">
                    <Label>
                        Name of Project <span className="text-red-500">*</span>
                    </Label>
                    <Select required onValueChange={handleProjectValue}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* {projectsQueryResult?.isLoading ? (
                <LoadingSpinner />
              ) : (
                projects?.map((doc: ProjectsResultsData) => (
                  <SelectItem key={doc?.id} value={doc.id}>
                    {doc.title}
                  </SelectItem>
                ))
              )} */}
                        </SelectContent>
                    </Select>
                </div>

                {projectValue && (
                    <div className="space-y-2">
                        <Label>
                            Name of Project Partner{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Select required onValueChange={handlePartnerValue}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select project partner" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* {partnersQueryResult?.isLoading ? (
                                    <LoadingSpinner />
                                ) : (
                                    partners?.map((doc: PartnerResultsData) => (
                                        <SelectItem
                                            key={doc?.id}
                                            value={doc.id}
                                        >
                                            {doc.name}
                                        </SelectItem>
                                    ))
                                )} */}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className="space-y-2">
                    <Label>
                        Financial Year <span className="text-red-500">*</span>
                    </Label>
                    <Select required onValueChange={handleFinancialYear}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* {financialYearQueryResult?.isLoading ? (
                                <LoadingSpinner />
                            ) : (
                                financialYear?.map(
                                    (year: FinancialYearResultsData) => (
                                        <SelectItem
                                            key={year?.id}
                                            value={year.id}
                                        >
                                            {year.year}
                                        </SelectItem>
                                    )
                                )
                            )} */}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full relative gap-x-3 h-[52px] rounded-[16.2px] border flex justify-center items-center">
                    <UploadFile size={20} />
                    <div>
                        <Input
                            type="file"
                            onChange={handleFileChange}
                            className="bg-inherit border-none cursor-pointer "
                        />
                    </div>
                </div>

                <div className="flex justify-between gap-5 mt-16">
                    <Button
                        onClick={() => dispatch(closeDialog())}
                        type="button"
                        className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                    >
                        Cancel
                    </Button>
                    <FormButton
                        loading={isLoading}
                        type="submit"
                        disabled={isLoading}
                    >
                        Done
                    </FormButton>
                </div>
            </form>
        </div>
    );
};

export default WorkPlanUploadModal;
