"use client";

import Card from "components/Card";
import { Button } from "components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import IconButton from "components/IconButton";

type ActivityMemoData = {
  id: string;
  memo_title: string;
  project: string;
  total_amount: number;
  status: string;
  created_date: string;
};

interface ActivityMemoListProps {
  status: 'pending' | 'approved';
}

const ActivityMemoList = ({ status }: ActivityMemoListProps) => {
  const router = useRouter();

  // Mock data - replace with actual API call
  const mockData: ActivityMemoData[] = [
    {
      id: "1",
      memo_title: "Field Visit to Kano State",
      project: "Project LifeGuard: HIV/AIDS Intervention",
      total_amount: 2500000,
      status: status === 'pending' ? "Pending" : "Approved",
      created_date: "2024-01-15",
    },
    {
      id: "2",
      memo_title: "Training Workshop Materials",
      project: "BeatTheBite: Malaria Eradication",
      total_amount: 1800000,
      status: status === 'pending' ? "Pending" : "Approved",
      created_date: "2024-01-20",
    },
    {
      id: "3",
      memo_title: "Community Outreach Program",
      project: "VitalVision: Child Nutrition Study",
      total_amount: 3200000,
      status: status === 'pending' ? "Pending" : "Approved",
      created_date: "2024-01-25",
    },
  ];

  const columns: ColumnDef<ActivityMemoData>[] = [
    {
      header: "Memo Title",
      accessorKey: "memo_title",
      size: 300,
    },
    {
      header: "Project",
      accessorKey: "project",
      size: 300,
    },
    {
      header: "Total Amount",
      accessorKey: "total_amount",
      cell: ({ getValue }) => {
        const amount = getValue() as number;
        return `₦${amount.toLocaleString()}`;
      },
    },
    {
      header: "Created Date",
      accessorKey: "created_date",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const statusValue = getValue() as string;
        return (
          <Badge
            className={
              statusValue === "Approved"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }
          >
            {statusValue}
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              router.push(`/dashboard/procurement/activity-memo/${row.original.id}`)
            }
            className="rounded-lg px-2 py-2 bg-[#F9F9F9] hover:text-primary dark:text-black dark:hover:text-primary"
          >
            <Icon icon="solar:eye-bold-duotone" fontSize={15} />
          </button>
          <button
            onClick={() =>
              router.push(`/dashboard/procurement/activity-memo/${row.original.id}/edit`)
            }
            className="rounded-lg px-2 py-2 bg-[#F9F9F9] hover:text-primary dark:text-black dark:hover:text-primary"
          >
            <Icon icon="solar:pen-bold-duotone" fontSize={15} />
          </button>
          <IconButton className="bg-[#F9F9F9] hover:text-primary">
            <Icon icon="ant-design:delete-twotone" fontSize={15} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold">
            {status === 'pending' ? 'Created Activity Memos' : 'Approved Activity Memos'}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            {status === 'pending'
              ? 'View and manage activity memos pending approval'
              : 'View all approved activity memos'}
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/procurement/activity-memo/create")}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Create Activity Memo
        </Button>
      </div>

      <Card>
        <DataTable data={mockData} columns={columns} isLoading={false} />
      </Card>
    </div>
  );
};

export default ActivityMemoList;