import { SubmitHandler, useForm } from "react-hook-form";
import ConsultancyStepWrapper from "./ConsultancyStepWrapper";
import { z } from "zod";
import { ConsunltancyApplicationDetails } from "definations/candg-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "atoms/FormInput";
import { Form } from "components/ui/form";
import FormTextArea from "atoms/FormTextArea";
import FadedButton from "atoms/FadedButton";
import FormButton from "atoms/FormButton";
import { useLocation, useNavigate } from "react-router-dom";
import { objectToFormData } from "utils/utls";
import { useMemo, useState } from "react";
import { Label } from "components/ui/label";
import { consultancyAPIs } from "services/cAndGApi/consultancy";
import FormSelect from "atoms/FormSelect";
import { useGetUserQuery } from "services/auth/user";
import { UploadFileSvg } from "assets/svgs/CAndGSvgs";
import { toast } from "sonner";

const CreateNewConsultancy = () => {
    const [locations, setLocations] = useState<string>();
    const navigate = useNavigate();
    const [file, setFile] = useState<File | undefined>();
    const [
        addNewConsultanceApplicationDetails,
        addNewConsultanceApplicationDetailsResults,
    ] = consultancyAPIs.useAddConsultancyDetailsMutation();

    const form = useForm<z.infer<typeof ConsunltancyApplicationDetails>>({
        resolver: zodResolver(ConsunltancyApplicationDetails),
    });

    const { pathname } = useLocation();
    const onSubmit: SubmitHandler<
        z.infer<typeof ConsunltancyApplicationDetails>
    > = async (data) => {
        const formData = objectToFormData({
            ...data,
            locations: locations?.split(","),
            job_file: file,
        });
        try {
            const result = await addNewConsultanceApplicationDetails(
                formData
            ).unwrap();
            if (result) {
                localStorage.setItem(
                    "application-details",
                    JSON.stringify(result)
                );
                let path = pathname.substring(0, pathname.lastIndexOf("/"));
                path += "/scope-of-work";
                navigate(path);
            }
        } catch (error: any) {
            toast.error(error?.data?.errors?.[0]?.attr + " is required");
        }
    };

    const options = [
        { value: "Pending", label: "Pending" },
        { value: "Approved", label: "Approved" },
        { value: "Rejected", label: "Rejected" },
    ];

    return (
        <ConsultancyStepWrapper>
            <main className="w-full flex flex-col items-center justify-center gap-y-[2.5rem] bg-white p-[1.25rem] pt-[2rem]  rounded-2xl">
                <p className="font-semibold text-[1.25rem] w-full text-black">
                    Application Details
                </p>
                <Form {...form}>
                    <form
                        action=""
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-[1.25rem]"
                    >
                        <FormInput
                            label="Title"
                            name="title"
                            placeholder=""
                            required
                        />
                        <FormInput
                            label="Grade Level"
                            name="grade_level"
                            placeholder=""
                            required
                        />
                        <div>
                            <Label>Locations</Label>
                            <input
                                className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-100 dark:bg-background"
                                type="text"
                                placeholder="e.g:abuja,lagos,uyo"
                                onChange={(e) => {
                                    setLocations(e.target.value);
                                }}
                            />
                        </div>
                        {/* <FormInput label="Locations" name="locations" placeholder="" required /> */}
                        <FormInput
                            label="Duration"
                            name="duration"
                            placeholder=""
                            type="number"
                            required
                        />
                        <FormInput
                            label="Commencement Date"
                            name="commencement_date"
                            placeholder="2024-04-28"
                            required
                        />
                        <FormInput
                            label="Effective End Date"
                            name="effective_end_date"
                            placeholder="2024-04-28"
                            required
                        />
                        <FormInput
                            label="Number of Consultants"
                            name="number_of_consultants"
                            type="number"
                            placeholder=""
                            required
                        />
                        <FormSelect
                            name={`status`}
                            label="Status"
                            options={options}
                            required={true}
                            placeholder="Select status"
                        />
                        <FormSelect
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
                        />
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
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setFile(e.target.files?.[0]);
                                        }
                                    }}
                                />
                                <p className="border flex items-center w-full gap-x-[1rem] rounded-lg border-[#DBDFE9] px-[1.125rem] h-[3.5rem]">
                                    {file?.name}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end items-center gap-x-[1rem]">
                            <div>
                                <FadedButton type="button">
                                    <p className="text-primary">Cancel</p>
                                </FadedButton>
                            </div>
                            <div>
                                <FormButton
                                    loading={
                                        addNewConsultanceApplicationDetailsResults.isLoading
                                    }
                                >
                                    <p>Next</p>
                                </FormButton>
                            </div>
                        </div>
                    </form>
                </Form>
            </main>
        </ConsultancyStepWrapper>
    );
};

export default CreateNewConsultancy;
