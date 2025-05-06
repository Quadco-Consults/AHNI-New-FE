import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import Card from "components/shared/Card";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { CG_ROUTES } from "constants/RouterConstants";
import { GrantSchema, TGrantFormData } from "definations/c&g/grants";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    useCreateGrantMutation,
    useGetSingleGrantQuery,
    useModifyGrantMutation,
} from "services/c&g/grant/grant";
import { useGetAllProjectsQuery } from "services/project";
import { toast } from "sonner";

const awardTypeOptions = [
    { label: "CO_OPERATIVE_AGREEMENT", value: "CO_OPERATIVE_AGREEMENT" },
    { label: "CONTRACT", value: "CONTRACT" },
    { label: "IDQ", value: "IDQ" },
];

export default function CreateGrant() {
    const form = useForm<TGrantFormData>({
        resolver: zodResolver(GrantSchema),
        defaultValues: {
            name: "",
            grant_id: "",
            award_type: "",
            award_amount: "",
            reference_number: "",
        },
    });

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const navigate = useNavigate();

    const { data: project } = useGetAllProjectsQuery({
        page: 1,
        size: 2000000,
    });

    const projectOptions = useMemo(
        () =>
            project?.data.results.map(({ title, id }) => ({
                label: title,
                value: id,
            })),
        [project]
    );

    const [createGrant, { isLoading: isCreateLoading }] =
        useCreateGrantMutation();

    const [modifyGrant, { isLoading: isModifyLoading }] =
        useModifyGrantMutation();

    const onSubmit: SubmitHandler<TGrantFormData> = async (data) => {
        try {
            if (id) {
                await modifyGrant({ id, body: data }).unwrap();
                toast.success("Grant Updated Successfully");
            } else {
                await createGrant(data).unwrap();
                toast.success("Grant Created Successfully");
            }

            navigate(CG_ROUTES.GRANT);
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    const { data: grant } = useGetSingleGrantQuery(id ?? skipToken);

    useEffect(() => {
        if (grant) {
            form.reset({
                project: grant?.data.project.id,
                award_type: grant?.data.award_type,
                award_amount: grant?.data.award_amount,
                reference_number: grant?.data.reference_number,
            });
        }
    }, [grant, project]);

    return (
        <Card>
            <BackNavigation extraText="New Grant" />
            <CardContent>
                <Form {...form}>
                    <form
                        className="space-y-5"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="grid grid-cols-2 gap-8">
                            <FormInput
                                name="name"
                                label="Grant Name"
                                placeholder="Enter Grant Name"
                                required
                            />

                            <FormInput
                                name="grant_id"
                                label="Grant ID"
                                placeholder="Enter Grant ID"
                                required
                            />

                            <FormSelect
                                name="award_type"
                                label="Award Type"
                                required={true}
                                options={awardTypeOptions}
                                placeholder="Select Award type"
                            />

                            <FormInput
                                name="award_amount"
                                label="Award Amount"
                                type="number"
                                required={true}
                                placeholder="Enter Award Amount"
                            />

                            <FormInput
                                label="Agreement/Contract Reference Number"
                                name="reference_number"
                                type="number"
                                placeholder="Enter Reference Number"
                                required={true}
                            />
                        </div>
                        <div className="flex justify-end">
                            <FormButton
                                size="lg"
                                loading={isCreateLoading || isModifyLoading}
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
