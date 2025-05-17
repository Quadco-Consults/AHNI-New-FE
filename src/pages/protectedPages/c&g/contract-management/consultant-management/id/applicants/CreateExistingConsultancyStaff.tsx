import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query";
import FadedButton from "atoms/FadedButton";
import FormButton from "atoms/FormButton";
import FormSelect from "atoms/FormSelectField";
import { Form } from "components/ui/form";
import { CG_ROUTES, ProgramRoutes } from "constants/RouterConstants";
import {
    ExistingApplicantSchema,
    TExistingApplicantFormData,
} from "definations/c&g/contract-management/consultancy-management/consultancy-application";
import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    generatePath,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";
import {
    useCreateExistingApplicantStaffMutation,
    useGetAllConsultancyStaffsQuery,
    useGetSingleConsultancyStaffQuery,
} from "services/c&g/contract-management/consultancy-management/consultancy-applicants";
import { toast } from "sonner";
import ConsultancyStaffDetailsWrapper from "./SingleConsultancyStaffDetails";
import { LoadingSpinner } from "components/shared/Loading";

export default function CreateExistingConsultancyStaff() {
    const { id } = useParams();

    const { pathname } = useLocation();

    const navigate = useNavigate();

    const type = pathname.includes("adhoc-management") ? "ADHOC" : "CONSULTANT";

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

    const { data } = useGetAllConsultancyStaffsQuery({
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
    } = useGetSingleConsultancyStaffQuery(
        applicantId ? applicantId : skipToken
    );

    const [createExistingApplicant, { isLoading: isCreateLoading }] =
        useCreateExistingApplicantStaffMutation();

    const onSubmit: SubmitHandler<TExistingApplicantFormData> = async ({
        applicant,
    }) => {
        try {
            await createExistingApplicant({
                applicant,
                consultancy: id || "",
            }).unwrap();

            toast.success("Applicant created successfully");

            navigate(generatePath(path, { id }));
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
