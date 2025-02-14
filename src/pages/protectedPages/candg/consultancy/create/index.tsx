import { SubmitHandler, useForm } from "react-hook-form";
import ConsultancyStepWrapper from "../ConsultancyStepWrapper";
import { z } from "zod";
import { ConsunltancyApplicationDetails } from "definations/candg-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "atoms/FormInput";
import { Form } from "components/ui/form";
import FadedButton from "atoms/FadedButton";
import FormButton from "atoms/FormButton";
import { useLocation, useNavigate } from "react-router-dom";
import { objectToFormData } from "utils/utls";
import { useState } from "react";
import { Label } from "components/ui/label";
import { consultancyAPIs } from "services/cAndGApi/consultancy";
import { UploadFileSvg } from "assets/svgs/CAndGSvgs";
import { toast } from "sonner";
import {
    ConsultancyManagementDetailSchema,
    TConsultancyManagementDetailsFormData,
} from "definations/c&g/contract-management/consultancy-management";
import { Button } from "components/ui/button";
import FormSelect from "atoms/FormSelect";

/*   const options = [
        { value: "Pending", label: "Pending" },
        { value: "Approved", label: "Approved" },
        { value: "Rejected", label: "Rejected" },
    ]; */

const CreateNewConsultancy = () => {
    const form = useForm<TConsultancyManagementDetailsFormData>({
        resolver: zodResolver(ConsultancyManagementDetailSchema),
        defaultValues: {
            title: "",
            grade_level: "",
            locations: [],
            duration: "",
            commencement_date: "",
            end_date: "",
            consultants_number: "",
            extra_info: "",
            background: "",
            evaluation_comments: "",
            advertisement_document: "",
            supervisor: "",
        },
    });

    const onSubmit: SubmitHandler<
        TConsultancyManagementDetailsFormData
    > = async () => {
        try {
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    return (
        <ConsultancyStepWrapper>
            <main className="w-full flex flex-col items-center justify-center gap-y-[2.5rem] bg-white p-[1.25rem] pt-[2rem]  rounded-2xl">
                <p className="font-semibold text-[1.25rem] w-full text-black">
                    Application Details
                </p>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-[1.25rem]"
                    >
                        <FormInput
                            label="Title"
                            name="title"
                            placeholder="Enter Title"
                            required
                        />

                        <FormInput
                            label="Grade Level"
                            name="grade_level"
                            placeholder="Enter Grade Level"
                            required
                        />

                        <FormSelect
                            label="Location"
                            name="locations"
                            placeholder="Select Locations"
                            required
                        />

                        <FormInput
                            label="Duration"
                            name="duration"
                            placeholder="Enter Duration"
                            type="number"
                            required
                        />

                        <FormInput
                            type="date"
                            label="Commencement Date"
                            name="commencement_date"
                            required
                        />
                        <FormInput
                            type="date"
                            label="Effective End Date"
                            name="end_date"
                            required
                        />

                        <FormInput
                            label="Number of Consultants"
                            name="number_of_consultants"
                            type="number"
                            placeholder=""
                            required
                        />

                        {/* <FormSelect
                            label="Supervisor"
                            name="supervisor"
                            // options={userData}
                            placeholder="Select supervisor"
                            required
                        />
                        <FormInput
                            label="Any other Info"
                            name="extra_info"
                            placeholder=""
                            required
                        />
                        <FormTextArea
                            label="Background"
                            name="background"
                            placeholder=""
                            required
                        />
                        <FormTextArea
                            label="Evaluation Comments"
                            name="evaluation_comments"
                            placeholder=""
                            required
                        /> */}
                        <div className="flex flex-col gap-y-[1rem]">
                            <Label className="font-semibold">
                                {" "}
                                Upload Complete Advertisement Document
                            </Label>
                            <div className="flex items-center w-full gap-x-[1rem]">
                                <label
                                    className="cursor-pointer shrink-0 border flex items-center gap-x-[1rem] w-fit rounded-lg border-[#DBDFE9] py-[.875rem] px-[1.125rem]"
                                    htmlFor="file"
                                >
                                    <UploadFileSvg />
                                    Select file
                                </label>
                                <input
                                    type="file"
                                    // name="file"
                                    hidden
                                    id="file"
                                />
                                <p className="border flex items-center w-full gap-x-[1rem] rounded-lg border-[#DBDFE9] px-[1.125rem] h-[3.5rem]">
                                    {/* {file?.name} */}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end items-center">
                            <Button type="button" variant="outline" size="lg">
                                Cancel
                            </Button>

                            <FormButton size="lg" loading={false}>
                                Next
                            </FormButton>
                        </div>
                    </form>
                </Form>
            </main>
        </ConsultancyStepWrapper>
    );
};

export default CreateNewConsultancy;
