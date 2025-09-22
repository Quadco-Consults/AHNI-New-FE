"use client";

import LongArrowRight from "components/icons/LongArrowRight";
import { Button } from "components/ui/button";
import { RouteEnum } from "constants/RouterConstants";
import logoPng from "@/assets/svgs/logo-bg.svg";

import Link from "next/link";
import { useGetActivityMemo } from "@/features/procurement/controllers/activityMemoController";
import { useMemo } from "react";
import { useGetSingleBudgetLine } from "@/features/modules/controllers/finance/budgetLineController";

// import { useGetSingleFCONumber } from "@/features/modules/controllers/finance/fcoNumberController";
import { useGetSingleInterventionArea } from "@/features/modules/controllers/program/interventionAreaController";
import { useGetSingleCostCategory } from "@/features/modules/controllers/finance/costCategoryController";
import { useGetSingleCostInput } from "@/features/modules/controllers/finance/costInputController";
import { useGetSingleFCONumber } from "@/features/modules/controllers/finance/fcoNumberController";
import { useSearchParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";

const Preview = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const created = searchParams.get("created");
  const request = searchParams.get("request");

  const { data: requestsDetails } = useGetActivityMemo(id as string, !!id);

  // Extract data from nested structure - try both direct and data property
  const apiData = requestsDetails?.data || requestsDetails;

  const { data: budgetLine } = useGetSingleBudgetLine(
    apiData?.budget_line?.[0] ?? skipToken
  );

  const { data: interventionArea } = useGetSingleInterventionArea(
    apiData?.intervention_areas?.[0] ?? skipToken
  );

  const { data: costCategory } = useGetSingleCostCategory(
    apiData?.cost_categories?.[0] ?? skipToken
  );

  const { data: costInput } = useGetSingleCostInput(
    apiData?.cost_input?.[0] ?? skipToken
  );

  const { data: fcoNumber } = useGetSingleFCONumber(
    apiData?.fconumber?.[0] ?? skipToken
  );
  console.log({ requestsDetails, fcoNumber });

  return (
    <div className='bg-white p-8'>
      <div className='flex justify-center items-center flex-col'>
        <img src={logoPng} alt='logo' width={200} />
        <h1>Achieving Health Nigeria Initiative (AHNI)</h1>
        <p>INTERNAL MEMO</p>
      </div>

      <div>
        <h2>To: {requestsDetails?.approved_by_details?.name}</h2>
        <h2 className='my-8'>
          THROUGH:{"  "}
          {requestsDetails?.reviewed_by_details?.map(({ name }, idx) => {
            return (
              <span key={idx} className='mr-1'>
                {name}
                {idx + 1 < requestsDetails?.reviewed_by_details.length
                  ? ","
                  : ""}
              </span>
            );
          })}
        </h2>
        <h2>FROM: {requestsDetails?.created_by_details?.name}</h2>

        <div className='mt-8'>
          <div className='flex gap-8'>
            <p>
              <strong>Budget Line #: </strong>
              {budgetLine && budgetLine?.data?.name}
            </p>
            <p>
              <strong>FCO#: </strong>
              {fcoNumber && fcoNumber?.data?.name}
            </p>
          </div>

          <p>
            <strong>Intervention: </strong>
            {interventionArea && interventionArea?.data?.code}{" "}
          </p>
          <div className='flex gap-4'>
            <p>
              <strong>Cost Category#: </strong>
              {costCategory && costCategory?.data?.code}{" "}
            </p>
            <p>
              <strong>Cost Input #:</strong>
              {costCategory && costInput?.data?.name}{" "}
            </p>
          </div>
          {/* @ts-ignore */}
          <p className='mt-8'>Date: {requestsDetails?.requested_date}</p>
          <p className='my-8'>
            <strong>Subject: </strong>
            {requestsDetails?.subject}
          </p>
        </div>

        <div className=''>
          {/* @ts-ignore */}
          <p>{requestsDetails?.comment}</p>
          <p className='mt-8'>Thank you</p>
        </div>
        <div className='w-full px-4 justify-end flex'>
          {created === "true" && (
            <Link
              className='w-fit'
              href={{
                pathname: RouteEnum.FINAL_PREVIEW,
                search: `?id=${id}&created=${"true"}`,
              }}
            >
              <Button
                type='submit'
                className='mt-4 px-4 py-2 bg-primary text-white rounded'
              >
                <LongArrowRight />
                Next
              </Button>
            </Link>
          )}
          {created !== "true" && (
            <Link
              className='w-fit'
              href={{
                pathname: RouteEnum.SAMPLE_PREVIEW,
                search: `?id=${id}&request=${request}`,
              }}
            >
              <Button
                type='submit'
                className='mt-4 px-4 py-2 bg-primary text-white rounded'
              >
                <LongArrowRight />
                Next
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
