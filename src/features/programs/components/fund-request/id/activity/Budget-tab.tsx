import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { useMemo } from "react";
import { TFundRequestResponseData } from "@/features/programs/types/fund-request";

type BudgetData = {
  category: string;
  description: string;
  quantity: number;
  unitCost: string;
  frequency: number;
  amount: string;
  comment: string;
};

interface BudgetTabProps {
  fundRequest?: TFundRequestResponseData;
}

const BudgetTab = ({ fundRequest }: BudgetTabProps) => {
  const data = useMemo<BudgetData[]>(() => {
    if (!fundRequest?.activities || fundRequest.activities.length === 0) return [];

    return fundRequest.activities.map((activity) => ({
      category: activity.category?.name || "N/A",
      description: activity.activity_description || "N/A",
      quantity: activity.quantity || 0,
      unitCost: activity.unit_cost || "0",
      frequency: activity.frequency || 0,
      amount: activity.amount || "0",
      comment: activity.comment || "N/A",
    }));
  }, [fundRequest]);

  const columns = useMemo<ColumnDef<BudgetData>[]>(
    () => [
      {
        header: "Budget Category",
        accessorKey: "category",
        size: 200,
      },
      {
        header: "Activity Description",
        accessorKey: "description",
        size: 400,
      },
      {
        header: "Quantity",
        accessorKey: "quantity",
        size: 100,
        cell: ({ row }) => row.original.quantity.toLocaleString(),
      },
      {
        header: `Unit Cost (${fundRequest?.currency || 'USD'})`,
        accessorKey: "unitCost",
        size: 150,
        cell: ({ row }) => Number(row.original.unitCost).toLocaleString(),
      },
      {
        header: "Frequency",
        accessorKey: "frequency",
        size: 100,
      },
      {
        header: `Amount (${fundRequest?.currency || 'USD'})`,
        accessorKey: "amount",
        size: 150,
        cell: ({ row }) => Number(row.original.amount).toLocaleString(),
      },
      {
        header: "Comment",
        accessorKey: "comment",
        size: 300,
      },
    ],
    [fundRequest?.currency]
  );

  if (!fundRequest) {
    return (
      <div className="text-center text-gray-500 py-8">
        No fund request data available
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No budget activities found for this fund request
      </div>
    );
  }

  const totalAmount = data.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div>
      <DataTable data={data} columns={columns} />
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center font-bold text-lg">
          <span>Total Budget Amount:</span>
          <span className="text-[#DEA004]">
            {totalAmount.toLocaleString()} {fundRequest?.currency || 'USD'}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
          <span>Available Balance:</span>
          <span>
            {Number(fundRequest?.available_balance || 0).toLocaleString()} {fundRequest?.currency || 'USD'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetTab;
