import { useLocation, useNavigate } from "react-router-dom";
import SupportiveSupervisionPlanLayout from "./SupportiveSupervisionPlanLayout";
import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import { useForm } from "react-hook-form";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { ChevronRight } from "lucide-react";
import FormButton from "atoms/FormButton";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { SelectContent, SelectItem } from "components/ui/select";
import { LoadingSpinner } from "components/shared/Loading";
import MultiSelectFormField from "components/ui/sspmultiselect";
import { useEffect } from "react";
import {
    useFacilitiesQuery,
    useLazyGetSingleFacilityQuery,
} from "services/module-programs";
import { SSPSchema, TSSSPFormValues } from "definations/program-types/ssp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetUserQuery } from "services/users";
import { toast } from "sonner";
import Card from "components/shared/Card";
import { useCreateSSPMutation } from "services/programsApi/ssp";

const Composition = () => {
    const { data: facility, isLoading: isFacilityLoading } = useFacilitiesQuery(
        { no_paginate: false }
    );

    const { data: user } = useGetUserQuery({ no_paginate: false });

    const [
        getSingleFacility,
        { data: facilityData, isFetching: isSingleFacilityLoading },
    ] = useLazyGetSingleFacilityQuery();

    const [createSSP, { isLoading: isCreateLoading }] = useCreateSSPMutation();

    const form = useForm<TSSSPFormValues>({
        resolver: zodResolver(SSPSchema),
        defaultValues: {
            facility: "",
            month: "",
            year: "",
            visit_date: "",
            status: "PENDING",
        },
    });

    const navigate = useNavigate();

    const { pathname } = useLocation();

    const { handleSubmit, watch } = form;

    const facilityId = watch("facility");

    const getFacilityData = async () => {
        try {
            const response = await getSingleFacility(facilityId).unwrap();
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
        }
    };

    let id = undefined;

    useEffect(() => {
        if (facilityId) {
            getFacilityData();
        }
    }, [facilityId]);

    const onSubmit = async (data: any) => {
        let response;

        try {
            if (id) {
                // edit ssp
                toast.success("Support Supervision Plan Updated");
            } else {
                const responseData = await createSSP(data).unwrap();
                response = responseData;
                toast.success("Support Supervision Plan Created");
            }

            localStorage.setItem("compositionData", JSON.stringify(response));

            let path = pathname;

            path = path.substring(0, path.lastIndexOf("/"));

            path += "/evolution-checklist";
            navigate(path);
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
        }
    };

    return (
        <SupportiveSupervisionPlanLayout>
            <div className="px-3">
                <h2 className="text-lg font-bold">
                    Facility & Team Composition
                </h2>
                <div className="mt-10">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-5">
                                <FormSelect
                                    name="facility"
                                    label="Facility"
                                    placeholder="Select facility"
                                    required
                                >
                                    <SelectContent>
                                        {isFacilityLoading ? (
                                            <LoadingSpinner />
                                        ) : (
                                            facility?.data.results.map(
                                                (value: any) => (
                                                    <SelectItem
                                                        key={value?.id}
                                                        value={value?.id}
                                                    >
                                                        {value?.name}
                                                    </SelectItem>
                                                )
                                            )
                                        )}
                                    </SelectContent>
                                </FormSelect>

                                {isSingleFacilityLoading ? (
                                    <LoadingSpinner />
                                ) : (
                                    facilityData && (
                                        <>
                                            <Card className="border-yellow-600 space-y-3">
                                                <div className="flex items-center gap-5">
                                                    <h4 className="w-1/6 font-medium">
                                                        State :
                                                    </h4>
                                                    <h4>
                                                        {facilityData?.state}
                                                    </h4>
                                                </div>
                                                <div className="flex items-center gap-5">
                                                    <h4 className="w-1/6 font-medium">
                                                        LGA :
                                                    </h4>
                                                    <h4>{facilityData?.lga}</h4>
                                                </div>
                                            </Card>
                                            <div className="space-y-1">
                                                <Label>
                                                    Facility Contact Person
                                                </Label>

                                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                                    <Card className="border-yellow-600 space-y-3">
                                                        <div className="flex items-center gap-5">
                                                            <h4 className="w-1/3 font-medium">
                                                                Name:
                                                            </h4>
                                                            <h4>
                                                                {
                                                                    facilityData?.name
                                                                }
                                                            </h4>
                                                        </div>
                                                        <div className="flex items-center gap-5">
                                                            <h4 className="w-1/3 font-medium">
                                                                Position:
                                                            </h4>
                                                            <h4>
                                                                {
                                                                    facilityData?.postion
                                                                }
                                                            </h4>
                                                        </div>
                                                        <div className="flex items-center gap-5">
                                                            <h4 className="w-1/3 font-medium">
                                                                Tel
                                                            </h4>
                                                            <h4>
                                                                {
                                                                    facilityData?.phone
                                                                }
                                                            </h4>
                                                        </div>
                                                    </Card>
                                                </div>
                                            </div>
                                        </>
                                    )
                                )}

                                <div className="space-y-1">
                                    <Label>Month/Year</Label>
                                    <div className="grid grid-cols-2 w-1/3 col-span-3 gap-x-6 ">
                                        <FormInput
                                            type="number"
                                            name="month"
                                            placeholder="MM"
                                        />
                                        <FormInput
                                            type="number"
                                            name="year"
                                            placeholder="YYYY"
                                        />
                                    </div>
                                </div>

                                <hr />

                                <h2 className="text-yellow-600">
                                    Team Members
                                </h2>

                                <FormField
                                    control={form.control}
                                    name="team_members"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <MultiSelectFormField
                                                    options={
                                                        user?.data.results || []
                                                    }
                                                    defaultValue={field.value}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    placeholder="Select team members"
                                                    variant="inverted"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <hr />

                                <div>
                                    <FormInput
                                        type="date"
                                        label="Visit Date"
                                        name="visit_date"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-5 mt-16">
                                <Button
                                    type="button"
                                    className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                                >
                                    Cancel
                                </Button>
                                <FormButton
                                    type="submit"
                                    loading={isCreateLoading}
                                    suffix={<ChevronRight size={14} />}
                                >
                                    Next
                                </FormButton>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </SupportiveSupervisionPlanLayout>
    );
};

export default Composition;
