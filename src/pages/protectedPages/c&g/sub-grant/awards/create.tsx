import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { CardContent } from "components/ui/card";
import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import { Label } from "components/ui/label";
import MultiSelectFormField from "components/ui/multiselect";
import { DialogType, largeDailogScreen } from "constants/dailogs";
import { CG_ROUTES } from "constants/RouterConstants";
import {
    SubGrantSchema,
    TSubGrantFormData,
} from "definations/c&g/contract-management/sub-grant/sub-grant";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetAllUsersQuery } from "services/auth/user";
import { useGetAllGrantsQuery } from "services/c&g/grant/grant";
import {
    useCreateSubGrantMutation,
    useGetSingleSubGrantQuery,
    useModifySubGrantMutation,
} from "services/c&g/subgrant/sub-grant";
import { useGetAllPartnersQuery } from "services/modules/project/partners";
import { toast } from "sonner";
import { addTeamMembers, clearTeamMembers } from "store/admin/team-members";
import { openDialog } from "store/ui";

const tenderTypeOptions = [
    { label: "CLOSED SOURCE", value: "CLOSED_SOURCE" },
    { label: "LIMITED SOLICITATION", value: "LIMITED_SOLICITATION" },
    { label: "NATIONAL OPEN TENDER", value: "NATIONAL_OPEN_TENDER" },
];

const subawardTypeOptions = ["STANDARD", "REIMBURSEMENT", "ADVANCE", "IN-KIND"];

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
            submission_start_date: "",
            submission_end_date: "",
            tender_type: "",
            assessment_date: "",
            evaluation_applicants: [],
        },
    });

    const {
        formState: { errors },
    } = form;

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const { data } = useGetSingleSubGrantQuery(id ?? skipToken);

    const { teamMembers } = useAppSelector((state) => state.teamMember);

    const dispatch = useAppDispatch();

    const { data: partner } = useGetAllPartnersQuery({
        page: 1,
        size: 20000000,
    });

    const partnerOptions = useMemo(
        () => partner?.data.results.map((partner) => partner),
        [partner]
    );

    const { data: grant } = useGetAllGrantsQuery({ page: 1, size: 2000000 });

    const grantOptions = useMemo(
        () =>
            grant?.data.results.map(({ reference_number, id }) => ({
                label: reference_number,
                value: id,
            })),
        [grant, data]
    );

    const { data: user } = useGetAllUsersQuery({ page: 1, size: 2000000 });

    const userOptions = useMemo(
        () =>
            user?.data.results.map(({ first_name, last_name, id }) => ({
                label: `${first_name} ${last_name}`,
                value: id,
            })),
        [user, data]
    );

    useEffect(() => {
        if (teamMembers.length > 0) {
            const memberIds = teamMembers.map((member) => member.id);
            form.setValue("evaluation_applicants", memberIds as unknown as any);
        }
    }, [teamMembers]);

    const [createSubGrant, { isLoading: isCreateLoading }] =
        useCreateSubGrantMutation();

    const [modifySubGrant, { isLoading: isModifyLoading }] =
        useModifySubGrantMutation();

    const onSubmit: SubmitHandler<TSubGrantFormData> = async (data) => {
        try {
            if (id) {
                await modifySubGrant({ id, body: data }).unwrap();
                toast.success("Sub Grant Award Updated");
            } else {
                await createSubGrant(data).unwrap();
                toast.success("Sub Grant Award Created");
            }

            dispatch(clearTeamMembers());
            navigate(CG_ROUTES.SUBGRANT);
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    useEffect(() => {
        if (data) {
            form.reset({
                ...data.data,
                grant: data.data.grant.id,
                partners: data.data.partners.map((partner) => partner.id),
                sub_grant_administrator: data.data.sub_grant_administrator.id,
                technical_staff: data.data.technical_staff.id,
                evaluation_applicants: data.data.evaluation_applicants.map(
                    (member) => member.id
                ),
            });

            dispatch(addTeamMembers(data.data.evaluation_applicants));
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
                            label="Grant"
                            name="grant"
                            placeholder="Select Grant"
                            required
                            options={grantOptions}
                        />

                        <div>
                            <Label className="font-semibold">
                                Consortium Partners
                            </Label>
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

                            <FormInput
                                label="Business Unit"
                                name="business_unit"
                                placeholder="Enter Business Unit"
                                required
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

                            <FormInput
                                label="Opening Date"
                                type="date"
                                name="submission_start_date"
                                required
                            />

                            <FormInput
                                label="Closing Date"
                                type="date"
                                name="submission_end_date"
                                required
                            />

                            <FormSelect
                                label="Tender Type"
                                options={tenderTypeOptions}
                                name="tender_type"
                                placeholder="Select Tender Type"
                                required
                            />

                            <FormInput
                                label="Assessment Date"
                                type="date"
                                name="assessment_date"
                                required
                            />
                        </div>

                        <section className="space-y-5">
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
                        </section>

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
