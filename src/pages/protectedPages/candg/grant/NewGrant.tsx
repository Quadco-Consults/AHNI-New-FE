import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import { Form } from "components/ui/form";
import { CangGAddGrantsSchema } from "definations/candg-validator";
import React, { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdOutlineNavigateNext } from "react-icons/md";
import { grantsApi } from "services/cAndGApi/grants";
import DepartmentsAPI from "services/configs/departments";
import beneficiariesAPi from "services/projectsApi/beneficiariesApi";
import FundingSourceAPi from "services/projectsApi/funding-sourceApi";
import { useGetPartnersQuery } from "services/projectsApi/partnersApi";
import { useGetProjectsQuery } from "services/projectsApi/projectsApi";
import { toast } from "sonner";
import { z } from "zod";

const NewGrant: React.FC = () => {
    const [adNewGrantMutation, adNewGrantMutationResults] =
        grantsApi.useAddNewGrantMutation();
    const form = useForm<z.infer<typeof CangGAddGrantsSchema>>({
        resolver: zodResolver(CangGAddGrantsSchema),
    });
    const onSubmit: SubmitHandler<
        z.infer<typeof CangGAddGrantsSchema>
    > = async (data) => {
        // console.log(data);
        try {
            const result = await adNewGrantMutation({
                ...data,
                reference_number: "AGIF-0023",
            }).unwrap();
            if (result) {
                toast.success("Grant added");
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } catch (error: any) {
            toast.error(error?.data?.errors?.[0]?.attr + " is required");
            // console.log(error);
        }
    };
    return (
        <section className="w-full flex flex-col gap-y-[2rem] bg-[#FCFCFC]">
            <div>
                <BackNavigation extraText="New Grant" />
            </div>
            <div className="w-full flex flex-col p-[1rem]">
                <Form {...form}>
                    <form
                        className="w-full space-y-[3.25rem]"
                        action=""
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="w-full flex flex-wrap justify-start gap-x-[1%] items-start gap-y-[3.25rem]">
                            <div className="w-[32%]">
                                <FormSelect
                                    name="project"
                                    label="Project Name"
                                    // options={projects}
                                    required={true}
                                    placeholder="Select Project"
                                />
                            </div>
                            <div className="w-[32%]">
                                <FormSelect
                                    name="grantor"
                                    label="Grantor"
                                    required={true}
                                    // options={normalizedSelectFundingSources}
                                    placeholder="Select funding source"
                                />
                            </div>
                            <div className="w-[32%]">
                                <FormSelect
                                    name="intervention_area"
                                    label="Intervention Area"
                                    required={true}
                                    placeholder="Select Intervention Area"
                                    // options={normalizedSelectsBeneficiary}
                                />
                            </div>
                            <div className="w-[32%]">
                                <FormSelect
                                    name="location"
                                    label="Project Location"
                                    // options={partners}
                                    required={true}
                                    placeholder="Select Project Location"
                                />
                            </div>{" "}
                            <div className="w-[32%]">
                                <FormSelect
                                    name="department"
                                    label="Departments"
                                    // options={departments}
                                    required={true}
                                    placeholder="Select departmetn"
                                />
                            </div>{" "}
                            <div className="w-[32%]">
                                <FormInput
                                    name="award_type"
                                    label="Award Type"
                                    required={true}
                                    placeholder="Award type"
                                />
                            </div>{" "}
                            <div className="w-[32%]">
                                <FormInput
                                    name="obligations"
                                    label="Obligations"
                                    required={true}
                                    type="number"
                                    placeholder="Obligation"
                                />
                            </div>{" "}
                            <div className="w-[32%]">
                                <FormInput
                                    name="award_amount"
                                    label="Award Amount"
                                    required={true}
                                    type="number"
                                    placeholder="400,000"
                                />
                            </div>{" "}
                            <div className="w-[32%]">
                                <FormInput
                                    name="monthly_spend"
                                    label="Monthly Spend"
                                    type="number"
                                    placeholder="200,000"
                                />
                            </div>
                        </div>
                        <FormButton
                            loading={adNewGrantMutationResults.isLoading}
                        >
                            <p>Add Grant</p>
                            <MdOutlineNavigateNext className="text-xl" />
                        </FormButton>
                    </form>
                </Form>
            </div>
        </section>
    );
};

export default NewGrant;
