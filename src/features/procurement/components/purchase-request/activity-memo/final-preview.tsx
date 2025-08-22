import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/Card";
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
import Link from "next/link";
import logoPng from "assets/svgs/logo-bg.svg";
import PurchaseRequestAPI from "@/features/procurement/controllers/purchase-sample-request Controller";
import { useGetSingleBudgetLine } from "@/features/modules/controllers/finance/budget-lineController";
import { useGetSingleCostCategory } from "@/features/modules/controllers/finance/cost-categoryController";
import { useGetSingleCostInput } from "@/features/modules/controllers/finance/cost-inputController";
import { useGetSingleActivityPlan } from "@/features/programs/controllers/activity-planController";
import useQuery from "hooks/use";
import { useGetSingleFCONumber } from "@/features/modules/controllers/finance/fco-numberController";
import { useGetSingleInterventionArea } from "@/features/modules/controllers/program/interventionsController";
import { skipToken } from "@reduxjs/toolkit/query";

const Preview = () => {
  const query = useQuery();
  const id = query.get("id");
  const request = query.get("request");
  const created = query.get("created");

  const { data: requestsDetails } = PurchaseRequestAPI.useGetActivityMemo(
    useMemo(
      () => ({
        path: { id: id as string },
      }),
      [id]
    )
  );

  const { data: budgetLine } = useGetSingleBudgetLine(
    requestsDetails?.budget_line[0] ?? skipToken
  );

  const { data: costCategory } =
    // @ts-ignore
    useGetSingleCostCategory(
      // @ts-ignore
      requestsDetails?.cost_categories[0] ?? skipToken
    );

  const { data: costInput } =
    // @ts-ignore
    useGetSingleCostInput(requestsDetails?.cost_input[0] ?? skipToken);

  const { data: activityPlan } = useGetSingleActivityPlan(
    // @ts-ignore
    requestsDetails?.activity ?? skipToken
  );

  const { data: fcoNumber } = useGetSingleFCONumber(
    // @ts-ignore
    requestsDetails?.fconumber[0] ?? skipToken
  );
  const { data: interventionArea } =
    // @ts-ignore
    useGetSingleInterventionArea(
      requestsDetails?.intervention_areas[0] ?? skipToken
    );

  // @ts-ignore
  const grandTotal = requestsDetails?.expenses.reduce(
    // @ts-ignore
    (sum, row) => sum + Number(row.total_cost),
    0
  );

  console.log({ expense: requestsDetails?.expenses });

  return (
    <div className='bg-white p-8'>
      <section className='min-h-screen space-y-8'>
        <div className='flex w-full items-center justify-end gap-4'>
          {created === "true" && (
            <Link
              className='w-fit'
              href={{
                pathname: RouteEnum.CREATE_PURCHASE_REQUEST,
                search: `?request=${id}`,
              }}
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
              href={generatePath(RouteEnum.PURCHASE_REQUEST_DETAILS, {
                id: request,
              })}
            >
              <Button className='flex gap-2 py-6'>View Purchase Request</Button>
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
              <strong>Request Date:</strong>
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
              <strong>FCO</strong>
            </div>
            <div className='w-full max-w-[490px] p-3'>
              {/* {fcoNumber && fcoNumber?.data?.name} */}
              {requestsDetails?.fconumber_details[0]?.module_code}
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
              <strong>Cost Input #: </strong>
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
                <TableCell># Frequency</TableCell>
                <TableCell>Unit Cost</TableCell>
                <TableCell>Total Cost</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requestsDetails?.expenses.map((row, index) => (
                <TableRow key={index}>
                  {/* expenses item name */}
                  <TableCell>{row?.item_detail?.name}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.num_of_days}</TableCell>
                  <TableCell>{row.frequency}</TableCell>
                  <TableCell>
                    ₦ {Number(row.unit_cost).toLocaleString()}.00
                  </TableCell>
                  <TableCell>
                    ₦ {Number(row.total_cost).toLocaleString()}.00
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className='flex items-center justify-center w-fit gap-20 px-5 py-3 border rounded-lg border-primary text-primary ml-auto mt-6'>
          <h4>Total:</h4>
          <span>₦ {grandTotal?.toLocaleString()}.00</span>
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
