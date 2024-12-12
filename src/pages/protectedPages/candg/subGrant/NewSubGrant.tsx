import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import { Form } from "components/ui/form";
import { Countries } from "constants/EnumConstants";
import { CangGAddSubGrantSchema } from "definations/candg-validator";
import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SubGrantApi } from "services/cAndGApi/subGrant";
import DepartmentsAPI from "services/configs/departments";
import FundingSourceAPi from "services/projectsApi/funding-sourceApi";
import { useGetProjectsQuery } from "services/projectsApi/projectsApi";
import usersAPI from "services/usersAPI";
import { toast } from "sonner";
import { z } from "zod";

const NewSubGrant = () => {
    const [addNewSubGrantMutation, addNewSubGrantMutationResults] =
        SubGrantApi.useAddSubGrantMutation();
    const [startDateDay, setStartDateDay] = useState<number>();
    const [startDateMonth, setStartDateMonth] = useState<number>();
    const [startDateYear, setStartDateYear] = useState<number>();

    const [endDateDay, setEndDateDay] = useState<number>();
    const [endDateMonth, setEndDateMonth] = useState<number>();
    const [endDateYear, setEndDateYear] = useState<number>();

    const form = useForm<z.infer<typeof CangGAddSubGrantSchema>>({
        resolver: zodResolver(CangGAddSubGrantSchema),
    });
    const onSubmit: SubmitHandler<
        z.infer<typeof CangGAddSubGrantSchema>
    > = async (data) => {
        console.log({
            ...data,
            start_date: `${startDateYear}/${startDateMonth}/${startDateDay}`,
            end_date: `${endDateYear}/${endDateMonth}/${endDateDay}`,
        });
        try {
            const result = await addNewSubGrantMutation({
                ...data,
                start_date: `${startDateYear}-${startDateMonth}-${startDateDay}`,
                end_date: `${endDateYear}-${endDateMonth}-${endDateDay}`,
            }).unwrap();
            toast.success(result?.message);
            form.reset();
        } catch (error: any) {
            toast.error(error?.data?.errors?.[0]?.attr + " is required");
            console.log(error);
        }
    };
    return (
        <main className="w-full flex flex-col gap-y-[2rem] bg-[#FCFCFC] text-[#1A0000]">
            <div>
                <BackNavigation extraText="New Sub Grant" />
            </div>
            <div className="w-full flex flex-col p-[1rem]">
                <Form {...form}>
                    <form
                        className="w-full space-y-[3.25rem]"
                        action=""
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="w-full flex flex-wrap justify-start gap-x-[1%] items-baseline gap-y-[3.25rem]">
                            <div className="w-[100%]">
                                <FormInput
                                    name="project_title"
                                    label="Project Title"
                                    required={true}
                                    placeholder="N-THRIP"
                                />
                            </div>{" "}
                            <div className="w-[49%]">
                                <FormSelect
                                    name="project_number"
                                    label="AHNI  Project Number"
                                    // options={projects}
                                    required={true}
                                    placeholder="Malaria Control Program"
                                />
                            </div>{" "}
                            <div className="w-[49%]">
                                <FormSelect
                                    name="grant_administrator"
                                    label="AHNI Grant Administrator"
                                    // options={users}
                                    required={true}
                                    placeholder="Veronica Daniels"
                                />
                            </div>
                            <div className="w-[49%]">
                                <FormSelect
                                    name="country"
                                    label="Country of Performance"
                                    required={true}
                                    // options={Countries}
                                    placeholder="Nigeria"
                                />
                            </div>
                            <div className="w-[49%]">
                                <FormSelect
                                    name="funding_source_id"
                                    label="AHNI Originating Funder / Funding Source"
                                    required={true}
                                    // options={normalizedSelectFundingSources}
                                    placeholder="Global Fund"
                                />
                            </div>
                            <div className="w-[49%]">
                                <FormInput
                                    name="award_type"
                                    label="AHNI Originating Award Type"
                                    required={true}
                                    placeholder="N-THRIP"
                                />
                            </div>{" "}
                            <div className="w-[49%]">
                                <FormInput
                                    name="sub_award_type"
                                    label="Subaward Type (Proposed)"
                                    required={true}
                                    placeholder="Cooperative Agreement"
                                />
                            </div>
                            <div className="w-[49%]">
                                <FormSelect
                                    name="technical_staff"
                                    label="AHNI Program/Technical Staff Contact"
                                    required={true}
                                    // options={users}
                                    placeholder="Tine Woji, 08034509662"
                                />
                            </div>
                            <div className="w-[49%]">
                                <FormSelect
                                    name="business_unit"
                                    label="Business Unit"
                                    required={true}
                                    // options={departments}
                                    placeholder="Nigeria"
                                />
                            </div>
                            <div className="w-[49%]">
                                <FormInput
                                    name="project_value_usd"
                                    label="Subaward Life of Project Value (USD)"
                                    required={true}
                                    type="number"
                                    placeholder="Estimated sub-grant amount in USD"
                                />
                            </div>
                            <div className="w-[49%]">
                                <FormInput
                                    name="project_value_local_currency"
                                    label="Subaward Life of Project Value (Local Currency)"
                                    required={true}
                                    type="number"
                                    placeholder="Estimated sub-grant amount in Local Currency"
                                />
                            </div>
                            <div className="w-[49%]">
                                <label
                                    htmlFor=""
                                    className="text-[#1A0000] text-sm font-semibold"
                                >
                                    Start Date
                                </label>
                                <div className="flex items-center gap-x-[1%] w-full">
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-100 dark:bg-background"
                                        placeholder="DD"
                                        required
                                        type="number"
                                        maxLength={2}
                                        max={31}
                                        value={startDateDay}
                                        minLength={2}
                                        onChange={(e) => {
                                            setStartDateDay(
                                                Number(e.target.value)
                                            );
                                        }}
                                    />
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-100 dark:bg-background"
                                        placeholder="MM"
                                        required
                                        type="number"
                                        maxLength={2}
                                        max={12}
                                        value={startDateMonth}
                                        minLength={2}
                                        onChange={(e) => {
                                            setStartDateMonth(
                                                Number(e.target.value)
                                            );
                                        }}
                                    />
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-100 dark:bg-background"
                                        placeholder="YYYY"
                                        required
                                        type="number"
                                        maxLength={4}
                                        max={2200}
                                        value={startDateYear}
                                        minLength={2}
                                        onChange={(e) => {
                                            setStartDateYear(
                                                Number(e.target.value)
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="w-[49%]">
                                <label
                                    htmlFor=""
                                    className="text-[#1A0000] text-sm font-semibold"
                                >
                                    End Date
                                </label>
                                <div className="flex items-center gap-x-[1%] w-full">
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-100 dark:bg-background"
                                        placeholder="DD"
                                        required
                                        type="number"
                                        maxLength={2}
                                        max={31}
                                        value={endDateDay}
                                        minLength={2}
                                        onChange={(e) => {
                                            setEndDateDay(
                                                Number(e.target.value)
                                            );
                                        }}
                                    />
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-100 dark:bg-background"
                                        placeholder="MM"
                                        required
                                        type="number"
                                        maxLength={2}
                                        max={12}
                                        value={endDateMonth}
                                        minLength={2}
                                        onChange={(e) => {
                                            setEndDateMonth(
                                                Number(e.target.value)
                                            );
                                        }}
                                    />
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-100 dark:bg-background"
                                        placeholder="YYYY"
                                        required
                                        type="number"
                                        maxLength={2}
                                        max={2200}
                                        value={endDateYear}
                                        minLength={2}
                                        onChange={(e) => {
                                            setEndDateYear(
                                                Number(e.target.value)
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <FormButton
                            loading={addNewSubGrantMutationResults.isLoading}
                        >
                            <p>Submit</p>
                        </FormButton>
                    </form>
                </Form>
            </div>
        </main>
    );
};

export default NewSubGrant;
