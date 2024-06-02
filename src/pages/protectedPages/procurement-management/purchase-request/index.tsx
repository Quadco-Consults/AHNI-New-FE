import { Link, generatePath } from "react-router-dom";
import Card from "components/shared/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import ArrowDownIcon from "components/icons/ArrowDownIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { RouteEnum } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";

type Data = {
  requestingDept: string;
  dor: string;
  requiredDate: string;
  deliverTo: string;
  totalAmount: string;
};

function PurchaseRequest() {
  const columns: ColumnDef<Data>[] = [
    {
      header: "Requesting dept",
      accessorKey: "requestingDept",
      size: 250,
    },
    {
      header: "Date of Request",
      accessorKey: "dor",
      size: 150,
    },
    {
      header: "Required Date",
      accessorKey: "requiredDate",
      size: 150,
    },
    {
      header: "Deliver to",
      accessorKey: "deliverTo",
      size: 250,
    },
    {
      header: "Total Amount",
      accessorKey: "totalAmount",
      size: 150,
    },
    {
      header: "",
      id: "actions",
      cell: ({ row }) => <ActionListAction data={row.original} />,
    },
  ];

  const ActionListAction = ({ data }: any) => {
    console.log(data);
    return (
      <div className="flex items-center gap-2">
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="flex gap-2 py-6">
                <MoreOptionsHorizontalIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className=" w-fit">
              <div className="flex flex-col items-start justify-between gap-1">
                <Link
                  className="w-full"
                  to={generatePath(RouteEnum.PURCHASE_REQUEST_DETAILS, {
                    id: "1",
                  })}
                >
                  <Button
                    className="flex w-full items-center justify-start gap-2"
                    variant="ghost"
                  >
                    <EyeIcon />
                    View
                  </Button>
                </Link>
                <Button
                  className="flex w-full items-center justify-start gap-2"
                  variant="ghost"
                >
                  <DeleteIcon />
                  delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </>
      </div>
    );
  };

  const data: Data[] = [
    {
      requestingDept: "Admin",
      dor: "10/04/2023",
      requiredDate: "10/04/2023",
      deliverTo: "AHNi HQ-Abuja",
      totalAmount: "₦2,922,500.00",
    },
    {
      requestingDept: "Admin",
      dor: "10/04/2023",
      requiredDate: "10/04/2023",
      deliverTo: "AHNi HQ-Abuja",
      totalAmount: "₦2,922,500.00",
    },
    {
      requestingDept: "Admin",
      dor: "10/04/2023",
      requiredDate: "10/04/2023",
      deliverTo: "AHNi HQ-Abuja",
      totalAmount: "₦2,922,500.00",
    },
    {
      requestingDept: "Admin",
      dor: "10/04/2023",
      requiredDate: "10/04/2023",
      deliverTo: "AHNi HQ-Abuja",
      totalAmount: "₦2,922,500.00",
    },
    {
      requestingDept: "Admin",
      dor: "10/04/2023",
      requiredDate: "10/04/2023",
      deliverTo: "AHNi HQ-Abuja",
      totalAmount: "₦2,922,500.00",
    },
    {
      requestingDept: "Admin",
      dor: "10/04/2023",
      requiredDate: "10/04/2023",
      deliverTo: "AHNi HQ-Abuja",
      totalAmount: "₦2,922,500.00",
    },
  ];

  return (
    <section className="min-h-screen space-y-8">
      <div className="flex w-full items-center justify-end gap-4">
        <Link
          className="w-fit"
          to={generatePath(RouteEnum.CREATE_PURCHASE_REQUEST)}
        >
          <Button className="flex gap-2 py-6">
            <AddSquareIcon />
            New Purchase Request
            <ArrowDownIcon />
          </Button>
        </Link>
      </div>
      <Card className="space-y-5">
        <div className="flex items-center justify-start gap-2">
          <span className="flex w-1/3 items-center rounded-lg border px-2 py-2">
            <SearchIcon />
            <input
              placeholder="Search"
              type="text"
              className="ml-2 h-6 border-none bg-none outline-none focus:outline-none"
            />
          </span>
          <Button className="shadow-sm" variant="ghost">
            <FilterIcon />
          </Button>
        </div>
        <DataTable data={data} columns={columns} />
      </Card>
    </section>
  );
}

export default PurchaseRequest;
