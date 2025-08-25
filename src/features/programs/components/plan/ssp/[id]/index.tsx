"use client";

import Card from "components/Card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Loading } from "components/Loading";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetSingleSupervisionPlan } from "@/features/programs/controllers/supervisionPlanController";
import BreadcrumbCard from "components/Breadcrumb";
import { ProgramRoutes, RouteEnum } from "constants/RouterConstants";
import { useGetAllSupervisionPlanReviews } from "@/features/programs/controllers/supervisionPlanReviewController";
import FadedButton from "components/atoms/FadedButton";

const breadcrumbs = [
  { name: "Programs", icon: true },
  { name: "Plans", icon: true },
  { name: "Supportive Supervision Plan", icon: true },
  { name: "Details", icon: false },
];

const SspDetails = () => {
  const { id } = useParams();

  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const { data: supervisionPlan, isLoading } = useGetSingleSupervisionPlan(
    id ?? skipToken
  );

  const { data: planReview } = useGetAllSupervisionPlanReviews(
    id ? { planId: id } : skipToken
  );

  const doesReviewExist = planReview && planReview?.data.results.length > 0;
  console.log({ doesReviewExist, planReview });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='space-y-5'>
      <BreadcrumbCard list={breadcrumbs} />

      <div className='flex justify-between'>
        <Button
          onClick={goBack}
          variant='outline'
          className='flex gap-4 items-center text-primary border-primary hover:bg-red-50 hover:text-red-500'
        >
          <ArrowLeft size={15} /> Back
        </Button>

        <div className='space-x-3'>
          {doesReviewExist && (
            <Link
              href={`${ProgramRoutes.SUPERVISION_PLAN_EVALUATION_DETAILS.replace(
                ":supervisionPlanId",
                id as string
              )}`}
            >
              <FadedButton className='text-primary'>
                View Evaluation
              </FadedButton>
            </Link>
          )}
          <Link
            href={`${RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_MANAGEMENT.replace(
              ":id",
              id as string
            )}`}
          >
            <Button>
              {doesReviewExist ? "Update Evaluation" : "Start Evaluation"}
            </Button>
          </Link>
        </div>
      </div>

      <Card className='space-y-5'>
        <h2 className='text-lg font-bold'>Facility & Team Composition</h2>
        <hr />
        <Card className='border-yellow-600 space-y-3'>
          <div className='flex items-center gap-5'>
            <h4 className='w-1/6 font-medium'>Facility :</h4>
            <h4>{supervisionPlan?.data.facility.name}</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-1/6 font-medium'>State :</h4>
            <h4>{supervisionPlan?.data.facility.state}</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-1/6 font-medium'>LGA :</h4>
            <h4>{supervisionPlan?.data.facility.lga}</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-1/6 font-medium'>Month/Year :</h4>
            <h4>
              {supervisionPlan?.data.month} {supervisionPlan?.data.year}
            </h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-1/6 font-medium'>Date of visit :</h4>
            <h4>{supervisionPlan?.data.visit_date}</h4>
          </div>
        </Card>

        <div className='space-y-2'>
          <Label className='font-semibold'>Facility Contact Person</Label>

          <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
            <Card className='border-yellow-600 space-y-3'>
              <div className='flex items-center gap-5'>
                <h4 className='w-1/3 font-medium'>Contact Person :</h4>
                <h4>{supervisionPlan?.data.facility.contact_person}</h4>
              </div>
              <div className='flex items-center gap-5'>
                <h4 className='w-1/3 font-medium'>Position :</h4>
                <h4>{supervisionPlan?.data.facility.postion}</h4>
              </div>
              <div className='flex items-center gap-5'>
                <h4 className='w-1/3 font-medium'>Email:</h4>
                <h4>{supervisionPlan?.data.facility.email}</h4>
              </div>
            </Card>
          </div>
        </div>

        <div className='space-y-2'>
          <Label className='font-semibold'>Team Members</Label>

          <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
            {supervisionPlan?.data.team_members.map((member) => (
              <Card className='border-yellow-600 space-y-3'>
                <div className='flex items-center gap-5'>
                  <h4 className='w-1/3 font-medium'>Full Name</h4>
                  <h4>
                    {member.first_name} {member.last_name}
                  </h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-1/3 font-medium'>Email:</h4>
                  <h4>{member.email}</h4>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SspDetails;
