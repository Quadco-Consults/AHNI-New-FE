"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query";
import FadedButton from "components/atoms/FadedButton";
import FormButton from "@/components/FormButton";
import FormSelect from "components/atoms/FormSelectField";
import { Form } from "components/ui/form";
import { CG_ROUTES, ProgramRoutes } from "constants/RouterConstants";
import {
    ExistingApplicantSchema,
    TExistingApplicantFormData,
} from "@/features/contracts-grants/types/contract-management/consultancy-management/consultancy-application";
import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
    useCreateExistingApplicantStaff,
} from "@/features/contracts-grants/controllers/consultantManagementController";
import {
    useGetAllConsultancyStaffs,
    useGetSingleConsultancyStaff,
} from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { toast } from "sonner";
import ConsultancyStaffDetailsWrapper from "./SingleConsultancyStaffDetails";
import { LoadingSpinner } from "components/Loading";

export default function CreateExistingConsultancyStaff() {
    const params = useParams();
    const id = params?.id as string;

    const pathname = usePathname();

    const router = useRouter();

    const type = pathname?.includes("adhoc-management") ? "ADHOC" : "CONSULTANT";

    const path =
        type === "ADHOC"
            ? ProgramRoutes.ADHOC_DETAILS
            : CG_ROUTES.CONSULTANCY_DETAILS;

    const form = useForm<TExistingApplicantFormData>({
        resolver: zodResolver(ExistingApplicantSchema),
        defaultValues: {
            applicant: "",
            consultancy: "",
        },
    });

    const { data } = useGetAllConsultancyStaffs({
        page: 1,
        size: 2000000,
    });

    const existingApplicants = useMemo(
        () =>
            data?.data.results.map(({ name, id }) => ({
                label: name,
                value: id,
            })),
        [data]
    );

    const applicantId = form.watch("applicant");

    const {
        data: chosenConsultancyStaff,
        isFetching: isChosenConsultancyStaffLoading,
    } = useGetSingleConsultancyStaff(
        applicantId ? applicantId : skipToken
    );

    const { createExistingApplicant, isLoading: isCreateLoading } =
        useCreateExistingApplicantStaff();

    const onSubmit: SubmitHandler<TExistingApplicantFormData> = async ({
        applicant,
    }) => {
        try {
            await createExistingApplicant({
                applicant,
                consultancy: id || "",
            })();

            toast.success("Applicant created successfully");

            router.push(path.replace(':id', id));
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
        }
    };

    return (
        <Form {...form}>
            <form className="space-y-10" onSubmit={form.handleSubmit(onSubmit)}>
                <FormSelect
                    label="Consultant"
                    name="applicant"
                    placeholder="Select Consultant"
                    required
                    options={existingApplicants}
                />

                {isChosenConsultancyStaffLoading ? (
                    <LoadingSpinner />
                ) : (
                    chosenConsultancyStaff && (
                        <ConsultancyStaffDetailsWrapper
                            {...chosenConsultancyStaff.data}
                        />
                    )
                )}

                <div className="flex items-center justify-end gap-3">
                    <FadedButton
                        type="button"
                        size="lg"
                        className="text-primary"
                    >
                        Cancel
                    </FadedButton>

                    <FormButton size="lg" loading={isCreateLoading}>
                        Submit
                    </FormButton>
                </div>
            </form>
        </Form>
    );
}
