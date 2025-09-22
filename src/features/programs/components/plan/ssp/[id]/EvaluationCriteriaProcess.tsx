"use client";

import Card from "components/Card";
import { Button } from "components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "components/Loading";
import { toast } from "sonner";
import { skipToken } from "@reduxjs/toolkit/query/react";
import BreadcrumbCard from "components/Breadcrumb";
import BackNavigation from "components/atoms/BackNavigation";
import Upload from "components/Upload";
import { Separator } from "components/ui/separator";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import FormTextArea from "components/atoms/FormTextArea";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { IObjective } from "@/features/programs/types/program/plan/supervision-plan/supervision-plan";
import { useGetSingleSupervisionPlan } from "@/features/programs/controllers/supervisionPlanController";
import FormRadio from "components/atoms/FormRadio";
import FormInput from "components/atoms/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SupervisionPlanReviewSchema,
  TSupervisionPlanReviewFormData,
} from "@/features/programs/types/program/plan/supervision-plan/supervision-plan-review";
import {
  useCreateSupervisionPlanReview,
  useGetAllSupervisionPlanReviews,
  useGetSingleSupervisionPlanReview,
  useModifySupervisionPlanReview,
} from "@/features/programs/controllers/supervisionPlanReviewController";
import { fileToBase64 } from "utils/fileToBase64";
import FormButton from "@/components/FormButton";
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

  const router = useRouter();

  const { data: planReview } = useGetAllSupervisionPlanReviews(
    planId ? { planId } : skipToken
  );

  const { data: currentPlan } = useGetSingleSupervisionPlanReview(
    planId && planReview?.data?.results[0]?.id ? planId : skipToken,
    planReview?.data?.results[0]?.id
  );

  const form = useForm<TSupervisionPlanReviewFormData>({
    resolver: zodResolver(SupervisionPlanReviewSchema),
    defaultValues: {
      reviews: [],
      documents: [
        {
          title: "VISIT_SUMMARY",
          label:
            "CQI/TA form completed with summary of visit? (Attach copy for retirement)",
        },
        {
          title: "POST_CLINIC_REVIEW",
          label:
            "Observe post clinic review meeting? (Attach summary of visit, picture gallery)",
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

  const { data: supervisionPlan } = useGetSingleSupervisionPlan(
    id ?? skipToken
  );

  const [groupedCriteria, setGroupedCriteria] = useState<GroupedData>();

  useEffect(() => {
    if (supervisionPlan) {
      setGroupedCriteria(groupByCategoryName(supervisionPlan?.data.objectives));

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
      const { reviews, documents, remediation_plan, is_agree_on_visit_plan } =
        currentPlan.data;

      const transformedReviews = reviews?.map(({ objective, ...rest }) => ({
        ...rest,
        objective: objective?.id,
      }));

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

  // const handleNext = () => {
  //   if (page < totalPages) {
  //     setPage(page + 1);
  //   }
  // };

  const handleNext = () => {
    form.handleSubmit(async (data) => {
      try {
        // Save data before moving forward
        await onSubmit(data);

        setPage(page + 1);
      } catch (error) {
        console.error("Error saving data:", error);
        toast.error("Could not save progress. Please try again.");
      }
    })();
  };

  // const handleNext = () => {
  //   form.handleSubmit(async (data) => {
  //     await onSubmit(data); // submit current data
  //     if (page < totalPages) {
  //       setPage(page + 1);
  //     }
  //   })();
  // };
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

  const { createSupervisionPlanReview, isLoading: isCreateLoading } =
    useCreateSupervisionPlanReview(planId);

  const { modifySupervisionPlanReview, isLoading: isModifyLoading } =
    useModifySupervisionPlanReview(planId, currentPlan?.data.id);

  const onSubmit: SubmitHandler<TSupervisionPlanReviewFormData> = async (
    data
  ) => {
    // console.log({ clank: data, planId, currentPlan });

    try {
      if (planId && currentPlan) {
        await modifySupervisionPlanReview(data as any);
      } else {
        await createSupervisionPlanReview(data as any);

        // router.push(RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? error.message ?? "Something went wrong");
    }
  };

  if (!groupedCriteria) {
    return <LoadingSpinner />;
  }

  const categoryEntries = Object.entries(groupedCriteria || []);
  const totalPages = categoryEntries.length + 1;

  const isUploadPage = page === totalPages;

  let categoryName = "";
  let items: IObjective[] = [];

  if (!isUploadPage) {
    const safeIndex = Math.min(page - 1, categoryEntries.length - 1);
    if (categoryEntries.length > 0) {
      [categoryName, items] = categoryEntries[safeIndex];
    }
  }

  const documentErrors = form?.formState?.errors?.documents;

  return (
    <FormProvider {...form}>
      <form className='space-y-3'>
        {/* <form className='space-y-3' onSubmit={form.handleSubmit(onSubmit)}> */}
        <div className='space-y-5'>
          <BreadcrumbCard list={breadcrumbs} />

          <BackNavigation />

          <div className='flex justify-end'>
            <div className='py-2 px-4 rounded-lg border text-blue-500 border-blue-500 bg-blue-50'>
              All Categories Shown
            </div>
          </div>

          <Card>
            <h4 className='font-semibold'>
              Integrated Facility Visit Checklist for Comprehensive Sites
            </h4>

            <hr />

            {!isUploadPage ? (
              <div className='space-y-6'>
                {categoryEntries.map(([currentCategoryName, categoryItems]) => (
                  <Card key={currentCategoryName} className='space-y-3'>
                    <h4 className='font-semibold text-red-600'>
                      {currentCategoryName}
                    </h4>

                    <h6 className='font-light text-gray-500'>
                      Verify the following
                    </h6>

                    {categoryItems.map((item, itemIndex) => {
                      const globalIndex =
                        supervisionPlan?.data.objectives.findIndex(
                          (obj) => obj.id === item.id
                        );

                      return (
                        <Card
                          key={item.id}
                          className='space-y-3 border-yellow-600'
                        >
                          <h4 className='text-semibold text-yellow-600'>
                            {item.name}
                          </h4>

                          <div className='flex justify-between pb-3 gap-5'>
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
                            className='flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-100 dark:bg-background'
                            type='text'
                            placeholder='Comment...'
                          />

                          <hr />
                        </Card>
                      );
                    })}
                  </Card>
                ))}
              </div>
            ) : (
              documentFields.map((field, index) => {
                const currentDocInfo = documents?.find(
                  (doc) => doc.title === field.title
                );

                const name = currentDocInfo?.name;
                const url = currentDocInfo?.document;

                return (
                  <Card key={field.id} className='space-y-3'>
                    <h4 className='text-semibold font-light'>{field.label}</h4>

                    <div className='flex justify-between pb-3 gap-5'>
                      <h3 className='font-bold'>Upload Attachment</h3>
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

                      {documentErrors && documentErrors[index]?.message}
                    </div>

                    <div>
                      <Upload
                        onChange={(e) =>
                          handleFileChange(field.title, e.target.files)
                        }
                      >
                        <Button
                          type='button'
                          className='bg-[#FFF2F2] text-primary dark:text-gray-500'
                        >
                          <AddSquareIcon />
                          Upload New Document
                        </Button>
                      </Upload>

                      {name ? (
                        <p className='mt-2'>{name}</p>
                      ) : url ? (
                        <p className='mt-2'>
                          <a href={url} target='_blank' title='Click to view' rel="noreferrer">
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
                <Separator className='my-12' />

                <FormTextArea
                  label='Remediation plan and follow up actions'
                  name='remediation_plan'
                />

                <Separator className='my-12' />

                <div className='flex justify-between pb-3 gap-5'>
                  <h4 className='text-semibold font-light'>
                    Agree on visit date
                  </h4>

                  <FormRadio
                    name='is_agree_on_visit_plan'
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

          <div className='flex justify-between'>
            <Button
              variant='outline'
              className='flex gap-4 items-center text-primary border-primary hover:bg-red-50 hover:text-red-500'
              onClick={handlePrev}
            >
              <ArrowLeft size={15} /> Back
            </Button>

            {page === totalPages ? (
              <FormButton
                type='button'
                className='px-8'
                // loading={isCreateLoading || isModifyLoading}
                onClick={async () => {
                  await form.handleSubmit(async (data) => {
                    await onSubmit(data);
                    router.push(RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION); // ✅ only after final submit
                  })();
                }}
              >
                Finish
              </FormButton>
            ) : (
              <Button type='button' className='px-8' onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
