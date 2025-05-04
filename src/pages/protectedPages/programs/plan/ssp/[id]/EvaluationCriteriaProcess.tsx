import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "components/shared/Loading";
import { toast } from "sonner";
import { skipToken } from "@reduxjs/toolkit/query/react";
import BreadcrumbCard from "components/shared/Breadcrumb";
import BackNavigation from "atoms/BackNavigation";
import Upload from "components/shared/Upload";
import { Separator } from "components/ui/separator";
import {
    FormProvider,
    SubmitHandler,
    useFieldArray,
    useForm,
} from "react-hook-form";
import FormTextArea from "atoms/FormTextArea";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { IObjective } from "definations/program/plan/supervision-plan/supervision-plan";
import { useGetSingleSupervisionPlanQuery } from "services/program/plan/supervision-plan/supervision-plan";
import FormRadio from "atoms/FormRadio";
import FormInput from "atoms/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    SupervisionPlanReviewSchema,
    TSupervisionPlanReviewFormData,
} from "definations/program/plan/supervision-plan/supervision-plan-review";
import {
    useCreateSupervisionPlanReviewMutation,
    useGetAllSupervisionPlanReviewsQuery,
    useGetSingleSupervisionPlanReviewQuery,
    useModifySupervisionPlanReviewMutation,
} from "services/program/plan/supervision-plan/supervision-plan-review";
import { fileToBase64 } from "utils/fileToBase64";
import FormButton from "atoms/FormButton";
import { RouteEnum } from "constants/RouterConstants";

const breadcrumbs = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Supportive Supervision Plan", icon: true },
    { name: "Details", icon: true },
    { name: "Evaluation", icon: false },
];

type GroupedData = {
    [categoryName: string]: IObjective[];
};

const groupByCategoryName = (array: IObjective[]): GroupedData => {
    return array?.reduce((acc, item) => {
        // @ts-ignore
        const categoryName = item.evaluation_category.name;

        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }

        acc[categoryName].push(item);
        return acc;
    }, {} as GroupedData);
};

export default function EvaluationCriteriaProcess() {
    const { id: planId } = useParams();

    const navigate = useNavigate();

    const { data: planReview } = useGetAllSupervisionPlanReviewsQuery(
        planId ? { planId } : skipToken
    );

    const { data: currentPlan } = useGetSingleSupervisionPlanReviewQuery(
        planId && planReview?.data?.results[0]?.id
            ? { planId, reviewId: planReview?.data?.results[0]?.id }
            : skipToken
    );

    const form = useForm<TSupervisionPlanReviewFormData>({
        resolver: zodResolver(SupervisionPlanReviewSchema),
        defaultValues: {
            reviews: [],
            documents: [
                {
                    title: "VISIT_SUMMARY",
                    label: "CQI/TA form completed with summary of visit? (Attach copy for retirement)",
                },
                {
                    title: "POST_CLINIC_REVIEW",
                    label: "Observe post clinic review meeting? (Attach summary of visit, picture gallery)",
                },
                {
                    title: "ADHOC_STAFF_DEBRIEF",
                    label: "Debrief with facility/adhoc staff.",
                },
            ],
            remediation_plan: "",
            is_agree_on_visit_plan: "",
        },
    });

    const { fields: documentFields } = useFieldArray({
        name: "documents",
        control: form.control,
    });

    const [page, setPage] = useState(1);

    const { id } = useParams();

    const { data: supervisionPlan } = useGetSingleSupervisionPlanQuery(
        id ?? skipToken
    );

    const [groupedCriteria, setGroupedCriteria] = useState<GroupedData>();

    useEffect(() => {
        if (supervisionPlan) {
            setGroupedCriteria(
                groupByCategoryName(supervisionPlan?.data.objectives)
            );

            const reviews = supervisionPlan.data.objectives.map(({ id }) => ({
                is_selected: undefined,
                comment: "",
                objective: id,
            }));

            form.setValue("reviews", reviews as any);
        }
    }, [supervisionPlan]);

    useEffect(() => {
        if (currentPlan) {
            const {
                reviews,
                documents,
                remediation_plan,
                is_agree_on_visit_plan,
            } = currentPlan.data;

            const transformedReviews = reviews?.map(
                ({ objective, ...rest }) => ({
                    ...rest,
                    objective: objective?.id,
                })
            );

            const currentDocuments = form.getValues("documents");

            const transformedDocuments = currentDocuments?.map((currentDoc) => {
                const matchingDoc = documents?.find(
                    (doc) => doc.title === currentDoc.title
                );

                return matchingDoc
                    ? {
                          ...currentDoc,
                          ...matchingDoc,
                          name: matchingDoc?.document,
                          document: null,
                      }
                    : currentDoc;
            });

            form.reset({
                reviews: transformedReviews,
                documents: transformedDocuments,
                remediation_plan,
                is_agree_on_visit_plan: String(is_agree_on_visit_plan),
            });
        }
    }, [currentPlan]);

    const handlePrev = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNext = () => {
        setPage(page + 1);
    };

    const handleFileChange = async (id: string, file: FileList | null) => {
        const documents = form.getValues("documents");

        if (file) {
            const updatedDocuments = await Promise.all(
                documents.map(async (doc) => {
                    if (doc.title === id) {
                        return {
                            ...doc,
                            document: await fileToBase64(file[0]),
                            name: file[0].name,
                        };
                    }
                    return doc;
                })
            );

            form.setValue("documents", updatedDocuments);
        }
    };

    const documents = form.watch("documents");

    const [createSupervisionPlanReview, { isLoading: isCreateLoading }] =
        useCreateSupervisionPlanReviewMutation();

    const [modifySupervisionPlanReview, { isLoading: isModifyLoading }] =
        useModifySupervisionPlanReviewMutation();

    const onSubmit: SubmitHandler<TSupervisionPlanReviewFormData> = async (
        data
    ) => {
        try {
            if (planId && currentPlan) {
                await modifySupervisionPlanReview({
                    planId,
                    reviewId: currentPlan?.data.id,
                    body: data as any,
                });
            } else {
                await createSupervisionPlanReview({
                    id: planId ?? "",
                    body: data as any,
                });

                navigate(RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION);
            }
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    if (!groupedCriteria) {
        return <LoadingSpinner />;
    }

    const categoryEntries = Object.entries(groupedCriteria || []);

    // The page 4 is a special hardcoded upload page
    const isUploadPage = page === 4;

    // Only try to destructure if we're on a category page (1-3)
    let categoryName = "";
    let items: IObjective[] = [];

    if (!isUploadPage) {
        // If we're trying to access a category page beyond what we have,
        // default to the last available category
        const safeIndex = Math.min(page - 1, categoryEntries.length - 1);
        if (categoryEntries.length > 0) {
            [categoryName, items] = categoryEntries[safeIndex];
        }
    }

    const documentErrors = form?.formState?.errors?.documents;

    return (
        <FormProvider {...form}>
            <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-5">
                    <BreadcrumbCard list={breadcrumbs} />

                    <BackNavigation />

                    <div className="flex justify-end">
                        <div className="py-2 px-4 rounded-lg border text-green-500 border-green-500 bg-green-50">
                            Page {page}/4
                        </div>
                    </div>

                    <Card>
                        <h4 className="font-semibold">
                            Integrated Facility Visit Checklist for
                            Comprehensive Sites
                        </h4>

                        <hr />

                        {!isUploadPage ? (
                            <Card className="space-y-3">
                                <h4 className="font-semibold text-red-600">
                                    {categoryName}
                                </h4>

                                <h6 className="font-light text-gray-500">
                                    Verify the following
                                </h6>

                                {items.map((item, index) => {
                                    const globalIndex =
                                        supervisionPlan?.data.objectives.findIndex(
                                            (obj) => obj.id === item.id
                                        );

                                    return (
                                        <Card
                                            key={item.id}
                                            className="space-y-3 border-yellow-600"
                                        >
                                            <h4 className="text-semibold text-yellow-600">
                                                {item.name}
                                            </h4>

                                            <div className="flex justify-between pb-3 gap-5">
                                                <h2>{item.description}</h2>

                                                <FormRadio
                                                    name={`reviews.${globalIndex}.is_selected`}
                                                    options={[
                                                        {
                                                            label: "Yes",
                                                            value: true,
                                                        },
                                                        {
                                                            label: "No",
                                                            value: false,
                                                        },
                                                    ]}
                                                />
                                            </div>

                                            <FormInput
                                                name={`reviews.${globalIndex}.comment`}
                                                className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-100 dark:bg-background"
                                                type="text"
                                                placeholder="Comment..."
                                            />

                                            <hr />
                                        </Card>
                                    );
                                })}
                            </Card>
                        ) : (
                            documentFields.map((field, index) => {
                                const currentDocInfo = documents?.find(
                                    (doc) => doc.title === field.title
                                );

                                const name = currentDocInfo?.name;
                                const url = currentDocInfo?.document;

                                return (
                                    <Card key={field.id} className="space-y-3">
                                        <h4 className="text-semibold font-light">
                                            {field.label}
                                        </h4>

                                        <div className="flex justify-between pb-3 gap-5">
                                            <h3 className="font-bold">
                                                Upload Attachment
                                            </h3>
                                            <FormRadio
                                                name={`documents.${index}.is_selected`}
                                                options={[
                                                    {
                                                        label: "Yes",
                                                        value: true,
                                                    },
                                                    {
                                                        label: "No",
                                                        value: false,
                                                    },
                                                ]}
                                            />

                                            {documentErrors &&
                                                documentErrors[index]?.message}
                                        </div>

                                        <div>
                                            <Upload
                                                onChange={(e) =>
                                                    handleFileChange(
                                                        field.title,
                                                        e.target.files
                                                    )
                                                }
                                            >
                                                <Button
                                                    type="button"
                                                    className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                                                >
                                                    <AddSquareIcon />
                                                    Upload New Document
                                                </Button>
                                            </Upload>

                                            {name ? (
                                                <p className="mt-2">{name}</p>
                                            ) : url ? (
                                                <p className="mt-2">
                                                    <a
                                                        href={url}
                                                        target="_blank"
                                                        title="Click to view"
                                                    >
                                                        {url}
                                                    </a>
                                                </p>
                                            ) : null}
                                        </div>

                                        <hr />
                                    </Card>
                                );
                            })
                        )}

                        {isUploadPage && (
                            <>
                                <Separator className="my-12" />

                                <FormTextArea
                                    label="Remediation plan and follow up actions"
                                    name="remediation_plan"
                                />

                                <Separator className="my-12" />

                                <div className="flex justify-between pb-3 gap-5">
                                    <h4 className="text-semibold font-light">
                                        Agree on visit date
                                    </h4>

                                    <FormRadio
                                        name="is_agree_on_visit_plan"
                                        options={[
                                            {
                                                label: "Yes",
                                                value: "true",
                                            },
                                            {
                                                label: "No",
                                                value: "false",
                                            },
                                        ]}
                                    />
                                </div>
                            </>
                        )}
                    </Card>

                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            className="flex gap-4 items-center text-primary border-primary hover:bg-red-50 hover:text-red-500"
                            onClick={handlePrev}
                        >
                            <ArrowLeft size={15} /> Back
                        </Button>

                        {page === 4 ? (
                            <FormButton
                                type="submit"
                                className="px-8"
                                loading={isCreateLoading || isModifyLoading}
                            >
                                Finish
                            </FormButton>
                        ) : (
                            <Button
                                type="button"
                                className="px-8"
                                onClick={handleNext}
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}
