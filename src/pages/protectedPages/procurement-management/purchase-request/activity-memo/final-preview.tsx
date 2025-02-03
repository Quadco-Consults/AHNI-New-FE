import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { RouteEnum } from "constants/RouterConstants";
import { useMemo } from "react";
import { generatePath, Link } from "react-router-dom";
import logoPng from "assets/svgs/logo-bg.svg";
import PurchaseRequestAPI from "services/procurementApi/purchase-sample-request ";
import { useGetSingleBudgetLineQuery } from "services/modules/finance/budget-line";
import { useGetSingleCostCategoryQuery } from "services/modules/finance/cost-category";
import { useGetSingleCostInputQuery } from "services/modules/finance/cost-input";
import { useGetSingleActivityPlanQuery } from "services/programsApi/activity-plan";
import useQuery from "hooks/useQuery";
import { useGetSingleFCONumberQuery } from "services/modules/finance/fco-number";
import { useGetSingleInterventionAreaQuery } from "services/modules/program/interventions";

const Preview = () => {
  const query = useQuery();
  const id = query.get("id");
  const request = query.get("request");
  const created = query.get("created");

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

  const { data: costCategory } =
    // @ts-ignore
    useGetSingleCostCategoryQuery(requestsDetails?.cost_categories[0]);

  const { data: costInput } =
    // @ts-ignore
    useGetSingleCostInputQuery(requestsDetails?.cost_input[0]);

  const { data: activityPlan } = useGetSingleActivityPlanQuery(
    // @ts-ignore
    requestsDetails?.activity
  );

  const { data: fcoNumber } = useGetSingleFCONumberQuery(
    // @ts-ignore
    requestsDetails?.fconumber[0]
  );
  const { data: interventionArea } =
    // @ts-ignore
    useGetSingleInterventionAreaQuery(requestsDetails?.intervention_areas[0]);

  return (
    <div className='bg-white p-8'>
      <section className='min-h-screen space-y-8'>
        <div className='flex w-full items-center justify-end gap-4'>
          {created === "true" && (
            <Link
              className='w-fit'
              to={generatePath(RouteEnum.CREATE_PURCHASE_REQUEST)}
            >
              <Button className='flex gap-2 py-6'>
                <AddSquareIcon />
                New Purchase Request
              </Button>
            </Link>
          )}{" "}
          {created !== "true" && (
            <Link
              className='w-fit'
              to={generatePath(RouteEnum.PURCHASE_REQUEST_DETAILS, {
                id: request,
              })}
            >
              <Button className='flex gap-2 py-6'>
                <AddSquareIcon />
                View Purchase Request
              </Button>
            </Link>
          )}{" "}
        </div>

        <div className='flex justify-center items-center flex-col'>
          <img src={logoPng} alt='logo' width={200} />
          <h1>Achieving Health Nigeria Initiative (AHNI)</h1>
        </div>
        <div className='bg-alternate text-primary px-6 py-3 my-2'>
          Activity: {activityPlan?.data?.activity_code}
        </div>
        <div className=' my-3'>
          <div className='flex border-gray-200 border max-w-[800px] w-full'>
            <div className=' border-r border-gray-200 w-full max-w-[321px] p-3'>
              Request Date:
            </div>
            <div className='w-full max-w-[490px] p-3'>
              {requestsDetails?.requested_date}
            </div>
          </div>
          {/* <div className='flex border-gray-200 border max-w-[800px] w-full'>
            <div className=' border-r border-gray-200 w-full max-w-[321px] p-3'>
              Duration:
            </div>
            <div className='w-full max-w-[490px] p-3'>
              Q3 (July - September 2024)
            </div>
          </div>{" "} */}
          <div className='flex border-gray-200 border max-w-[800px] w-full'>
            <div className=' border-r border-gray-200 w-full max-w-[321px] p-3'>
              FCO #:{" "}
            </div>
            <div className='w-full max-w-[490px] p-3'>
              {fcoNumber && fcoNumber?.data?.name}
            </div>
          </div>
        </div>
        <div className=' my-3'>
          <div className='flex border-gray-200 border w-full'>
            <div className='w-full  p-3'>
              <strong>Intervention Areas: </strong>
              {interventionArea && interventionArea?.data?.code}{" "}
            </div>
          </div>
          <div className='flex border-gray-200 border max-w-[800px] w-full'>
            <div className=' border-r border-gray-200 w-full max-w-[321px] p-3'>
              <strong>Budget Line #: </strong>
              {budgetLine && budgetLine?.data?.name}
            </div>
            <div className='w-full max-w-[490px] p-3'>
              {" "}
              <strong>Cost Category#: </strong>
              {costCategory && costCategory?.data?.code}{" "}
            </div>
          </div>{" "}
          <div className='flex border-gray-200 border max-w-[800px] w-full'>
            <div className=' border-r border-gray-200 w-full max-w-[321px] p-3'>
              <strong>Cost Input #:</strong>
              {costCategory && costInput?.data?.name}{" "}
            </div>
          </div>{" "}
        </div>
        <div className='mt-8'>
          <Table>
            <TableHeader>
              <TableRow className='text-center'>
                <TableCell>Expense Item</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell># of Days</TableCell>
                <TableCell># of Facility</TableCell>
                <TableCell># Frequency</TableCell>
                <TableCell>Unit Cost</TableCell>
                <TableCell>Total Cost</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requestsDetails?.expenses.map((row, index) => (
                <TableRow key={index}>
                  {/* expenses item name */}
                  <TableCell>{row.item}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.num_of_days}</TableCell>
                  <TableCell>{row.num_of_facility}</TableCell>
                  <TableCell>{row.frequency}</TableCell>
                  <TableCell>{Number(row.unit_cost).toFixed(2)}</TableCell>
                  <TableCell>{Number(row.total_cost).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {/* <TableRow>
                <TableCell>
                  <strong>Totals</strong>
                </TableCell>
                <TableCell>
                  <strong>{totals.quantity}</strong>
                </TableCell>
                <TableCell>
                  <strong>{totals.days}</strong>
                </TableCell>
                <TableCell>
                  <strong>{totals.facility}</strong>
                </TableCell>
                <TableCell>
                  <strong>{totals.frequency}</strong>
                </TableCell>
                <TableCell>
                  <strong>{totals.unitCost.toFixed(2)}</strong>
                </TableCell>
                <TableCell>
                  <strong>{totals.totalCost.toFixed(2)}</strong>
                </TableCell>
              </TableRow> */}
            </TableBody>
          </Table>
        </div>
        <div>
          {" "}
          <Card className='border-primary space-y-3 mt-8 w-full mx-auto'>
            <div className='flex justify-between'>
              <div className='flex flex-col gap-3'>
                {" "}
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                    Signature:
                  </h4>
                  <h4 className='text-[14px] whitespace-nowrap'>
                    {requestsDetails?.created_by?.name}
                  </h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                    Prepared By:
                  </h4>
                  <h4 className='text-[14px] whitespace-nowrap'>
                    {requestsDetails?.created_by?.name}
                  </h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                    Date
                  </h4>
                  <h4 className='text-[14px] whitespace-nowrap'>
                    {requestsDetails?.requested_date}
                  </h4>
                </div>
              </div>{" "}
              <div className='flex flex-col gap-3'>
                {" "}
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                    Signature:
                  </h4>
                  <h4 className='text-[14px] whitespace-nowrap'>
                    {requestsDetails?.reviewed_by?.name}
                  </h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                    Reviewed By:
                  </h4>
                  <h4 className='text-[14px] whitespace-nowrap'>
                    {requestsDetails?.reviewed_by?.name}
                  </h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                    Date
                  </h4>
                  <h4 className='text-[14px] whitespace-nowrap'>
                    {requestsDetails?.reviewed_date}
                  </h4>
                </div>
              </div>
              <div className='flex flex-col gap-3'>
                {" "}
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                    Signature
                  </h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                    Approved By:
                  </h4>
                  <h4 className='text-[14px] whitespace-nowrap'>
                    {requestsDetails?.approved_by?.name}
                  </h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                    Date
                  </h4>
                  <h4 className='text-[14px] whitespace-nowrap'>
                    {requestsDetails?.approved_date}
                  </h4>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Preview;
