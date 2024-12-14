import { Button } from "components/ui/button";
import { ChangeEvent, useState } from "react";

import { Input } from "components/ui/input";
import { Upload as UploadFile } from "lucide-react";

import FormButton from "atoms/FormButton";
import { closeDialog } from "store/ui";
import { z } from "zod";
import FormSelect from "atoms/FormSelect";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "hooks/useStore";
import { useGetProjectsQuery } from "services/projectsApi/projectsApi";
import { toast } from "sonner";
import { useUploadWorkPlanMutation } from "services/programsApi/work-plan";
import { useGetAllFinancialYearsQuery } from "services/modules/config/financial-year";

const FormSchema = z.object({
    project: z.string().min(1, "This field is required"),
    financial_year: z.string().min(1, "This field is required"),
    // file: z.instanceof(File, { message: "A valid file is required" }),
    // .refine(
    //     (file) =>
    //         [
    //             "application/vnd.ms-excel",
    //             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //             "text/csv",
    //         ].includes(file.type),
    //     { message: "Only spreadsheet files (xls, xlsx, csv) are allowed" }
    // ),
});

export type TFormValues = z.infer<typeof FormSchema>;

const WorkPlanUploadModal = () => {
    const dispatch = useAppDispatch();

    const { data, isLoading: isProjectLoading } = useGetProjectsQuery({
        no_paginate: false,
    });

    const { data: financialYear } = useGetAllFinancialYearsQuery({
        page: 1,
        size: 2000000,
    });

    const financialYearOptions = financialYear?.data.results.map(
        ({ year, id }) => ({
            label: year,
            value: id,
        })
    );

    const [uploadWorkPlan, { isLoading: isUploadLoading }] =
        useUploadWorkPlanMutation();

    const [file, setFile] = useState<File>();

    const projectOptions = data?.data.results.map(({ title, id }) => ({
        label: title,
        value: id,
    }));

    const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const form = useForm<TFormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            project: "",
        },
    });

    const { handleSubmit } = form;

    const onSubmit: SubmitHandler<TFormValues> = async ({
        project,
        financial_year,
    }) => {
        if (!file) {
            toast.error("Please choose a file to upload");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("project", project);
            formData.append("financial_year", financial_year);
            formData.append("file", file);

            await uploadWorkPlan(formData as any).unwrap();

            toast.success("Work Plan Uploaded");

            dispatch(closeDialog());
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
        }
    };

    return (
        <div className="w-full">
            <FormProvider {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                >
                    <FormSelect
                        label="Project"
                        name="project"
                        required
                        multiple={false}
                        placeholder="Select Project"
                        options={projectOptions}
                    />

                    <FormSelect
                        label="Financial Year"
                        name="financial_year"
                        required
                        placeholder="Select Financial Year"
                        options={financialYearOptions}
                    />

                    <div className="w-full relative gap-x-3 h-[52px] rounded-[16.2px] border flex justify-center items-center">
                        <UploadFile size={20} />
                        <div>
                            <Input
                                type="file"
                                onChange={handleChangeFile}
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
                            loading={isUploadLoading}
                            type="submit"
                            disabled={isUploadLoading}
                        >
                            Done
                        </FormButton>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default WorkPlanUploadModal;
