"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import BackNavigation from "components/atoms/BackNavigation";
import BreadcrumbCard from "components/Breadcrumb";
import Card from "components/Card";
import FilePreview from "components/FilePreview";
import { LoadingSpinner } from "components/Loading";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Separator } from "components/ui/separator";
import { Textarea } from "components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetAllSupervisionPlanReviews,
  useGetSingleSupervisionPlanReview,
} from "@/features/programs/controllers/supervisionPlanReviewController";

const breadcrumbs = [
  { name: "Programs", icon: true },
  { name: "Plans", icon: true },
  { name: "Supportive Supervision Plan", icon: true },
  { name: "Evaluation", icon: true },
  { name: "Details", icon: false },
];

const documentConstants = [
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
];

export default function EvaluationDetails() {
  const { id: planId } = useParams();
  const router = useRouter();

  const [page, setPage] = useState<number | null>(1);

  const handlePrev = () => {
    if (page !== null && page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page === totalPages) router.back();
    if (page !== null && page < totalPages) {
      setPage(page + 1);
    }
  };

  const shouldFetchReviews = Boolean(planId);

  const { data: planReviewsData, isLoading: isPlanReviewsDataLoading } =
    useGetAllSupervisionPlanReviews(
      shouldFetchReviews ? { planId: planId as string } : skipToken
    );

  const reviewId = planReviewsData?.data.results[0].id;

  const { data: supervisionPlanReview } = useGetSingleSupervisionPlanReview(
    planId,
    reviewId
  );

  const reviews = supervisionPlanReview?.data.reviews ?? [];
  const documents = supervisionPlanReview?.data.documents ?? [];
  const remediationPlan = supervisionPlanReview?.data.remediation_plan;
  const isAgreeOnVisitPlan = supervisionPlanReview?.data.is_agree_on_visit_plan;

  const evaluationTimeStamp = supervisionPlanReview?.data.submission_datetime;
  const groupedByCategory = reviews?.reduce<Record<string, typeof reviews>>(
    (acc, review) => {
      const category = review.objective?.evaluation_category?.name;

      if (!acc[category]) acc[category] = [];

      acc[category].push(review);

      return acc;
    },
    {}
  );

  const categoryEntries = Object.entries(groupedByCategory || []);
  const totalPages = categoryEntries.length + 1;

  const isUploadPage = page === totalPages;

  useEffect(() => {
    if (page === null && categoryEntries.length > 0) {
      setPage(1);
    }
  }, [categoryEntries, page]);

  if (isPlanReviewsDataLoading) {
    return <LoadingSpinner />;
  }

  if (page !== null) {
    return (
      <section className='space-y-3'>
        <div className='space-y-5'>
          <BreadcrumbCard list={breadcrumbs} />

          <div className='flex items-center justify-between'>
            <BackNavigation />

            <div className='py-2 px-4 rounded-lg border text-green-500 border-green-500 bg-green-50'>
              Page {page}/{totalPages}
            </div>
          </div>

          {!isUploadPage ? (
            <>
              {[categoryEntries[page - 1]].map(
                ([categoryId, categoryReviews]) => {
                  return (
                    <Card className='space-y-3'>
                      <h4 className='font-semibold text-red-600'>
                        {categoryId}
                      </h4>

                      <h6 className='font-light text-gray-500'>
                        Verify the following
                      </h6>

                      {categoryReviews.map(
                        (
                          {
                            id,
                            objective: { name, description },
                            is_selected,
                            comment,
                          },
                          index
                        ) => {
                          return (
                            <Card
                              key={id}
                              className='space-y-3 border-yellow-600'
                            >
                              <h4 className='text-semibold text-yellow-600'>
                                {name}
                              </h4>

                              <div className='flex justify-between pb-3 gap-5'>
                                <h2>{description}</h2>

                                <Badge
                                  variant={`${
                                    is_selected ? "success" : "destructive"
                                  }`}
                                >
                                  {is_selected ? "Yes" : "No"}
                                </Badge>
                              </div>

                              <Input
                                disabled
                                value={comment}
                                className='flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-100 dark:bg-background'
                                type='text'
                                placeholder='Comment...'
                              />

                              <hr />
                            </Card>
                          );
                        }
                      )}
                    </Card>
                  );
                }
              )}
            </>
          ) : (
            <>
              {documents?.map(({ id, is_selected, document }, index) => {
                return (
                  <>
                    <Card key={id} className='space-y-3'>
                      <h4 className='text-semibold font-light'>
                        {documentConstants[index]?.label ||
                          `Document ${index + 1}`}
                      </h4>

                      <div className='flex justify-between pb-3 gap-5'>
                        <h3 className='font-bold'>Upload Attachment</h3>

                        <Badge
                          variant={`${is_selected ? "success" : "destructive"}`}
                        >
                          {is_selected ? "Yes" : "No"}
                        </Badge>
                      </div>

                      {evaluationTimeStamp && (
                        <div className='w-1/3'>
                          <FilePreview
                            name={documentConstants[index]?.title}
                            timestamp={evaluationTimeStamp}
                            file={document}
                            showDeleteIcon={false}
                          />
                        </div>
                      )}

                      <hr />
                    </Card>
                  </>
                );
              })}
            </>
          )}

          {isUploadPage && (
            <>
              <Separator className='my-12' />

              <div className='mt-12'>
                <Label>Remediation plan and follow up actions</Label>
                <Textarea value={remediationPlan} disabled />
              </div>

              <Separator className='my-12' />

              <div className='flex justify-between pb-3 gap-5'>
                <h4 className='text-semibold font-light'>
                  Agree on visit date
                </h4>

                <Badge
                  variant={`${isAgreeOnVisitPlan ? "success" : "destructive"}`}
                >
                  {isAgreeOnVisitPlan ? "Yes" : "No"}
                </Badge>
              </div>
            </>
          )}
        </div>

        <div className='flex justify-between'>
          <Button
            variant='outline'
            className='flex gap-4 items-center text-primary border-primary hover:bg-red-50 hover:text-red-500'
            onClick={handlePrev}
            disabled={page === 1}
          >
            <ArrowLeft size={15} /> Back
          </Button>

          <Button
            type='button'
            className='px-8'
            onClick={handleNext}
            // disabled={page === totalPages}
          >
            {page === totalPages ? "Finish" : "Next"}
          </Button>
        </div>
      </section>
    );
  }
}
