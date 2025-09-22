import { Icon } from "@iconify/react";
import { ColumnDef } from "@tanstack/react-table";
import IconButton from "components/IconButton";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import logoPng from "@/assets/svgs/logo-bg.svg";

type Data = {
  ref: { name: string; desc: string };
  amount: number;
  date: string;
  status: string;
};

export const dashboardColumns: ColumnDef<Data>[] = [
  {
    header: "Project",
    accessorKey: "project",
    size: 250,
    cell: ({ row }) => <ProjectAction data={row.original} />,
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ getValue }) => <h6>${getValue() as string}</h6>,
  },
  {
    header: "Date Received",
    accessorKey: "date",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "p-1 rounded-lg",
            getValue() === "Approved" && "bg-green-500 text-green-600",
            getValue() === "Reject" && "bg-red-500 text-red-600",
            getValue() === "Pending" && "bg-yellow-500 text-yellow-600",
            getValue() === "In Progress" && "bg-purple-500 text-purple-600"
          )}
        >
          {getValue() as string}
        </Badge>
      );
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }: any) => {
      return <ActionListAction data={row.original} />;
    },
  },
];

export const dasboardData: Data[] = [
  {
    ref: { name: "AHNI Health Project", desc: "Targeting rural areas" },
    amount: 25000,
    date: "11th Oct 2023",
    status: "Pending",
  },
  {
    ref: {
      name: "AHNI Education Initiative",
      desc: "Promoting digital education",
    },
    amount: 48000,
    date: "15th Oct 2023",
    status: "Comfirmed",
  },
  {
    ref: { name: "AHNI Health Project", desc: "Targeting rural areas" },
    amount: 25000,
    date: "11th Oct 2023",
    status: "Delayed",
  },
  {
    ref: {
      name: "AHNI Education Initiative",
      desc: "Promoting digital education",
    },
    amount: 48000,
    date: "15th Oct 2023",
    status: "In Progress",
  },
];

const ActionListAction = ({ data }: any) => {
  // console.log(data);
  return (
    <div className="flex items-center gap-2">
      <IconButton className="bg-[#F9F9F9] hover:text-primary">
        <Icon icon="solar:pen-bold-duotone" fontSize={15} />
      </IconButton>
      <IconButton className="bg-[#F9F9F9] hover:text-primary">
        <Icon icon="ant-design:delete-twotone" fontSize={15} />
      </IconButton>
    </div>
  );
};

const ProjectAction = ({ data }: any) => {
  return (
    <div className="flex gap-3 items-center">
      <div>
        <img src={logoPng.src} alt="logo" width={50} />
      </div>
      <div>
        <h4 className="font-bold">{data.ref.name}</h4>
        <h6>{data.ref.desc}</h6>
      </div>
    </div>
  );
};
