import {
    Link,
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import SupportiveSupervisionPlanLayout from "./SupportiveSupervisionPlanLayout";
import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import FormButton from "atoms/FormButton";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { SelectContent, SelectItem } from "components/ui/select";
import { LoadingSpinner } from "components/shared/Loading";
import MultiSelectFormField from "components/ui/sspmultiselect";
import { useEffect } from "react";

import {
    SSPCompositionSchema,
    TSSPCompositionFormValues,
} from "definations/program/plan/supervision-plan";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Card from "components/shared/Card";
import {
    useGetAllFacilityQuery,
    useLazyGetSingleFacilityQuery,
} from "services/modules/program/facility";
import { useGetAllUsersQuery } from "services/auth/user";
import { RouteEnum } from "constants/RouterConstants";
import DateInput from "components/shared/DateInput";
import { useGetSingleSupervisionPlanQuery } from "services/program/plan/supervision-plan";
import { skipToken } from "@reduxjs/toolkit/query";

const Composition = () => {
    const { data: facility, isLoading: isFacilityLoading } =
        useGetAllFacilityQuery({ page: 1, size: 2000000 });

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const { data: user } = useGetAllUsersQuery({ page: 1, size: 2000000 });

    const [
        getSingleFacility,
        { data: facilityData, isFetching: isSingleFacilityLoading },
    ] = useLazyGetSingleFacilityQuery();

    const form = useForm<TSSPCompositionFormValues>({
        resolver: zodResolver(SSPCompositionSchema),
        defaultValues: {
            month: "",
            year: "",
            visit_date: "",
            facility: "",
            team_members: [],
        },
    });

    const navigate = useNavigate();

    const { pathname } = useLocation();

    const { handleSubmit, watch } = form;

    const facilityId = watch("facility");

    const getFacilityData = async () => {
        try {
            await getSingleFacility(facilityId).unwrap();
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
        }
    };

    useEffect(() => {
        if (facilityId) {
            getFacilityData();
        }
    }, [facilityId]);

    const onSubmit: SubmitHandler<TSSPCompositionFormValues> = async (
        data: any
    ) => {
        sessionStorage.setItem("compositionData", JSON.stringify(data));

        let path = pathname;

        path = path.substring(0, path.lastIndexOf("/"));

        path += `/evolution-checklist?id=${id ?? ""}`;

        navigate(path);
    };

    const { data: supervisionPlan } = useGetSingleSupervisionPlanQuery(
        id ?? skipToken
    );

    useEffect(() => {
        if (supervisionPlan) {
            form.reset({
                month: supervisionPlan?.data.month,
                year: supervisionPlan?.data.year,
                visit_date: supervisionPlan?.data.visit_date,
                facility: supervisionPlan?.data.facility.id,
                team_members: supervisionPlan.data.team_members.map(
                    (member) => member.id
                ),
            });
        }
    }, [supervisionPlan, facility]);

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
                                                        {
                                                            facilityData?.data
                                                                .state
                                                        }
                                                    </h4>
                                                </div>
                                                <div className="flex items-center gap-5">
                                                    <h4 className="w-1/6 font-medium">
                                                        LGA :
                                                    </h4>
                                                    <h4>
                                                        {facilityData?.data.lga}
                                                    </h4>
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
                                                                    facilityData
                                                                        ?.data
                                                                        .name
                                                                }
                                                            </h4>
                                                        </div>
                                                        <div className="flex items-center gap-5">
                                                            <h4 className="w-1/3 font-medium">
                                                                Position:
                                                            </h4>
                                                            <h4>
                                                                {
                                                                    facilityData
                                                                        ?.data
                                                                        .postion
                                                                }
                                                            </h4>
                                                        </div>
                                                        <div className="flex items-center gap-5">
                                                            <h4 className="w-1/3 font-medium">
                                                                Tel
                                                            </h4>
                                                            <h4>
                                                                {
                                                                    facilityData
                                                                        ?.data
                                                                        .phone
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

                                <DateInput
                                    name="visit_date"
                                    label="Visit Date"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-5 mt-16">
                                <Link
                                    to={
                                        RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION
                                    }
                                >
                                    <Button
                                        type="button"
                                        className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                                        size="lg"
                                    >
                                        Cancel
                                    </Button>
                                </Link>
                                <FormButton type="submit" size="lg">
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
