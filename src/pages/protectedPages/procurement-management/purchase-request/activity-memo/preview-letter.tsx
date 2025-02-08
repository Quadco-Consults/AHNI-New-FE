import LongArrowRight from "components/icons/LongArrowRight";
import { Button } from "components/ui/button";
import { RouteEnum } from "constants/RouterConstants";
import logoPng from "assets/svgs/logo-bg.svg";

import { generatePath, Link } from "react-router-dom";
import PurchaseRequestAPI from "services/procurementApi/purchase-sample-request ";
import { useMemo } from "react";
import { useGetSingleBudgetLineQuery } from "services/modules/finance/budget-line";

// import { useGetSingleFCONumberQuery } from "services/modules/finance/fco-number";
import { useGetSingleInterventionAreaQuery } from "services/modules/program/interventions";
import { useGetSingleCostCategoryQuery } from "services/modules/finance/cost-category";
import { useGetSingleCostInputQuery } from "services/modules/finance/cost-input";
import { useGetSingleFCONumberQuery } from "services/modules/finance/fco-number";
import useQuery from "hooks/useQuery";

const Preview = () => {
  const query = useQuery();
  const id = query.get("id");
  const created = query.get("created");
  const request = query.get("request");

  const { data: requestsDetails } = PurchaseRequestAPI.useGetActivityMemoQuery(
    useMemo(
      () => ({
        path: { id: id as string },
      }),
      [id]
    )
  );

  const { data: budgetLine } = useGetSingleBudgetLineQuery(
    requestsDetails?.budget_line[0]
  );

  const { data: interventionArea } =
    // @ts-ignore
    useGetSingleInterventionAreaQuery(requestsDetails?.intervention_areas[0]);

  const { data: costCategory } =
    // @ts-ignore
    useGetSingleCostCategoryQuery(requestsDetails?.cost_categories[0]);

  const { data: costInput } =
    // @ts-ignore
    useGetSingleCostInputQuery(requestsDetails?.cost_input[0]);

  const { data: fcoNumber } = useGetSingleFCONumberQuery(
    // @ts-ignore
    requestsDetails?.fconumber[0]
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
        <h2>To: {requestsDetails?.approved_by?.name}</h2>
        <h2 className='my-8'>THROUGH: {requestsDetails?.reviewed_by?.name}</h2>
        <h2>FROM: {requestsDetails?.created_by?.name}</h2>

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
            <strong>Subject:</strong>
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
              to={{
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
              to={{
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
