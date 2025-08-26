"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query";
import BackNavigation from "components/atoms/BackNavigation";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import Card from "components/Card";
import { CardContent } from "components/ui/card";
import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import { Label } from "components/ui/label";
import MultiSelectFormField from "components/ui/multiselect";
import { CG_ROUTES } from "constants/RouterConstants";
import {
    SubGrantSchema,
    TSubGrantFormData,
} from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "next/navigation";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import {
    useCreateSubGrant,
    useGetSingleSubGrant,
    useModifySubGrant,
} from "@/features/contracts-grants/controllers/subGrantController";
import { useGetAllDepartments } from "@/features/modules/controllers/config/departmentController";
import { useGetAllPartners } from "@/features/modules/controllers/project/partnerController";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { toast } from "sonner";

const subawardTypeOptions = [
    "STANDARD",
    "REIMBURSEMENT",
    "FIXED AMOUNT AWARD",
    "IN-KIND",
];

export default function CreateSubGrant() {
    const form = useForm<TSubGrantFormData>({
        resolver: zodResolver(SubGrantSchema),
        defaultValues: {
            grant: "",
            partners: [],
            title: "",
            sub_grant_administrator: "",
            award_type: "",
            technical_staff: "",
            business_unit: "",
            amount_usd: "",
            amount_ngn: "",
            start_date: "",
            end_date: "",
        },
    });

    const {
        formState: { errors },
    } = form;

    const router = useRouter();

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const { data } = useGetSingleSubGrant(id || "", { enabled: !!id });

    const { data: partner } = useGetAllPartners({
        page: 1,
        size: 20000000,
        partner_type: "SUBGRANTEE",
        search: "",
    });

    const partnerOptions = useMemo(
        () => partner?.data.results.map((partner) => partner),
        [partner]
    );

    const { data: department } = useGetAllDepartments({
        page: 1,
        size: 2000000,
        search: "",
    });

    const departmentOptions = useMemo(
        () =>
            department?.data.results.map(({ name, id }) => ({
                label: name,
                value: id,
            })),
        [department]
    );

    const { data: project } = useGetAllProjects({
        page: 1,
        size: 2000000,
        search: "",
    });

    const projectOptions = useMemo(
        () =>
            project?.data.results.map(({ title, id }) => ({
                label: title,
                value: id,
            })),
        [project]
    );

    const { data: user } = useGetAllUsers({ page: 1, size: 2000000, search: "" });

    const userOptions = useMemo(
        () =>
            user?.data.results.map(({ first_name, last_name, id }) => ({
                label: `${first_name} ${last_name}`,
                value: id,
            })),
        [user, data]
    );

    const { createSubGrant, isLoading: isCreateLoading } =
        useCreateSubGrant();

    const { modifySubGrant, isLoading: isModifyLoading } =
        useModifySubGrant();

    const onSubmit: SubmitHandler<TSubGrantFormData> = async (data) => {
        try {
            if (id) {
                await modifySubGrant({
                    id,
                    body: data,
                });
                toast.success("Sub Grant Award Updated");
            } else {
                await createSubGrant({
                    ...data,
                });
                toast.success("Sub Grant Award Created");
            }

            router.push(CG_ROUTES.SUBGRANT_ADVERT);
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Something went wrong");
        }
    };

    useEffect(() => {
        if (data) {
            form.reset({
                ...data.data,
                grant: data?.data.grant.id,
                partners: data.data.partners.map((partner) => partner.id),
                sub_grant_administrator: data.data.sub_grant_administrator.id,
                technical_staff: data.data.technical_staff.id,
            });
        }
    }, [data]);

    return (
        <Card>
            <BackNavigation />
            <CardContent>
                <Form {...form}>
                    <form
                        className="space-y-5"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormSelect
                            label="Project"
                            name="grant"
                            placeholder="Select Project"
                            required
                            options={projectOptions}
                        />

                        <div>
                            <Label className="font-semibold">Sub-Grantee</Label>
                            <FormField
                                control={form.control}
                                name="partners"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <MultiSelectFormField
                                                options={partnerOptions || []}
                                                defaultValue={field.value}
                                                onValueChange={field.onChange}
                                                placeholder="Select Partners"
                                                variant="inverted"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {errors.partners && (
                                <span className="text-sm text-red-500 font-medium">
                                    {errors.partners.message}
                                </span>
                            )}
                        </div>

                        <FormInput
                            label="Project Title"
                            name="title"
                            placeholder="Enter Subgrant Title"
                            required
                        />

                        <div className="grid grid-cols-2 gap-8">
                            <FormSelect
                                label="AHNI Grant Administrator"
                                name="sub_grant_administrator"
                                placeholder="Select Administrator"
                                required
                                options={userOptions}
                            />

                            <FormSelect
                                label="Subaward Type (Proposed)"
                                name="award_type"
                                placeholder="Select Subaward Type"
                                required
                                options={subawardTypeOptions.map((option) => ({
                                    label: option,
                                    value: option,
                                }))}
                            />

                            <FormSelect
                                label="AHNI Program/Technical Staff Contact"
                                name="technical_staff"
                                placeholder="Select Technical Staff"
                                required
                                options={userOptions}
                            />

                            <FormSelect
                                label="Business Unit"
                                name="business_unit"
                                placeholder="Select Business Unit"
                                required
                                options={departmentOptions}
                            />

                            <FormInput
                                type="number"
                                label="Subaward Life of Project Value (USD)"
                                name="amount_usd"
                                placeholder="Enter USD Amount"
                                required
                            />

                            <FormInput
                                label="Subaward Life of Project Value (Local Currency)"
                                type="number"
                                name="amount_ngn"
                                placeholder="Enter NGN Amount"
                                required
                            />

                            <FormInput
                                label="Start Date"
                                type="date"
                                name="start_date"
                                required
                            />

                            <FormInput
                                label="End Date"
                                type="date"
                                name="end_date"
                                required
                            />
                        </div>

                        {/* <section className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                {teamMembers?.map((team) => (
                                    <div className="grid grid-cols-2 gap-3 bg-gray-100 rounded-lg p-4">
                                        <h3 className="font-bold">Name</h3>
                                        <p>
                                            {team.first_name} {team.last_name}
                                        </p>

                                        <h3 className="font-bold">Email</h3>
                                        <p>{team.email}</p>

                                        <h3 className="font-bold">
                                            Phone Number
                                        </h3>

                                        <p>{team.mobile_number || "N/A"}</p>

                                        <h3 className="font-bold">
                                            Department
                                        </h3>
                                        <p>{team.department || "N/A"}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col gap-2 items-start">
                                <Button
                                    variant="ghost"
                                    type="button"
                                    className="text-[#DEA004] font-medium border shadow-sm py-2 px-5 rounded-lg text-sm"
                                    onClick={() =>
                                        dispatch(
                                            openDialog({
                                                type: DialogType.AddTeamMenbers,
                                                dialogProps: {
                                                    ...largeDailogScreen,
                                                },
                                            })
                                        )
                                    }
                                >
                                    Click to select committe members
                                </Button>
                                {errors.evaluation_applicants && (
                                    <span className="text-sm text-red-500 font-medium">
                                        {errors.evaluation_applicants.message}
                                    </span>
                                )}
                            </div>
                        </section> */}

                        <div className="flex justify-end">
                            <FormButton
                                loading={isCreateLoading || isModifyLoading}
                                size="lg"
                            >
                                Submit
                            </FormButton>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
