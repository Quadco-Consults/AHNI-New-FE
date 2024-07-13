/* eslint-disable react/prop-types */
import { Icon } from "@iconify/react";
import Card from "components/shared/Card";
import IconButton from "components/shared/IconButton";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import { cn } from "lib/utils";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Link, generatePath, useParams } from "react-router-dom";
import { RouteEnum } from "constants/RouterConstants";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";

type Data = {
  name: string;
  number: number;
  email: string;
  products: string;
  status: string;
  prequalification: string;
  isSelected: boolean;
};

const EOIVendorSubmission = () => {
  const { id } = useParams();
  return (
    <div className="space-y-10">
      <Card className="space-y-10">
        <div className="flex mt-1 justify-between items-center">
          <div className="border w-1/3 py-2 px-2 flex items-center rounded-lg">
            <Icon icon="iconamoon:search-light" fontSize={25} />
            <Input
              placeholder="Search Category"
              type="search"
              className="h-6 border-none bg-none"
            />
          </div>

          <Link to={generatePath(RouteEnum.VENDOR_REGISTRATION)}>
            <Button variant="ghost" className="bg-[#FFF2F2] gap-2 text-primary">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M12.0572 1.75C14.2479 1.74999 15.9686 1.74998 17.312 1.93059C18.6886 2.11568 19.7809 2.50272 20.6391 3.36091C21.4973 4.21911 21.8843 5.31137 22.0694 6.68802C22.25 8.03144 22.25 9.7521 22.25 11.9428V11.9428V12.0572V12.0572C22.25 14.2479 22.25 15.9686 22.0694 17.312C21.8843 18.6886 21.4973 19.7809 20.6391 20.6391C19.7809 21.4973 18.6886 21.8843 17.312 22.0694C15.9686 22.25 14.2479 22.25 12.0572 22.25H12.0572H11.9428H11.9428C9.7521 22.25 8.03144 22.25 6.68802 22.0694C5.31137 21.8843 4.21911 21.4973 3.36091 20.6391C2.50272 19.7809 2.11568 18.6886 1.93059 17.312C1.74998 15.9686 1.74999 14.2479 1.75 12.0572V11.9428C1.74999 9.75212 1.74998 8.03144 1.93059 6.68802C2.11568 5.31137 2.50272 4.21911 3.36091 3.36091C4.21911 2.50272 5.31137 2.11568 6.68802 1.93059C8.03144 1.74998 9.75212 1.74999 11.9428 1.75H12.0572Z"
                  fill="#FF0000"
                />
                <path
                  d="M8.73797 9.5C8.73797 7.70407 10.1956 6.25 11.9915 6.25C13.7874 6.25 15.2451 7.70407 15.2451 9.5C15.2451 11.2959 13.7874 12.75 11.9915 12.75C10.1956 12.75 8.73797 11.2959 8.73797 9.5Z"
                  fill="#FF0000"
                />
                <path
                  d="M6.98208 17.5425C6.68249 17.2564 6.67151 16.7817 6.95754 16.4821C9.57054 13.7453 14.3841 13.5975 17.0515 16.4917C17.3322 16.7963 17.3129 17.2708 17.0083 17.5515C16.8641 17.6844 16.6818 17.75 16.5 17.75H7.5C7.31383 17.75 7.12736 17.6812 6.98208 17.5425Z"
                  fill="#FF0000"
                />
              </svg>
              Manaual Bid Submission
            </Button>
          </Link>
        </div>

        <DataTable columns={columns} data={data} isLoading={false} />
      </Card>
    </div>
  );
};

export default EOIVendorSubmission;

const columns: ColumnDef<Data>[] = [
  {
    id: "select",
    size: 50,
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
        />
      );
    },
  },
  {
    header: "Vendor Name",
    accessorKey: "name",
    size: 250,
  },
  {
    header: "Type of Business",
    accessorKey: "email",
    size: 250,
  },
  {
    header: "Company Reg No",
    accessorKey: "number",
    size: 200,
  },
  {
    header: "Prequalification",
    accessorKey: "prequalification",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "px-3 py-2 rounded-lg",
            getValue() === "Pass" && "bg-green-50 text-green-500",
            getValue() === "Fail" && "bg-red-50 text-red-500",
            getValue() === "Unreviewed" && "bg-yellow-50 text-yellow-500"
          )}
        >
          {getValue() as string}
        </Badge>
      );
    },
  },
  {
    header: "Evaluation",
    accessorKey: "status",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "px-3 py-2 rounded-lg",
            getValue() === "Pass" && "bg-green-50 text-green-500",
            getValue() === "Fail" && "bg-red-50 text-red-500",
            getValue() === "Unreviewed" && "bg-yellow-50 text-yellow-500"
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
    cell: ({ row }) => <ActionListAction data={row.original} />,
  },
];

const ActionListAction = ({ data }: any) => {
  console.log(data);
  return (
    <div className="flex gap-2">
      <Link to={generatePath(RouteEnum.VENDOR_MANAGEMENT_DETAILS, { id: "1" })}>
        <IconButton className="bg-[#F9F9F9] hover:text-primary">
          <Icon icon="ph:eye-duotone" fontSize={15} />
        </IconButton>
      </Link>
      <IconButton className="bg-[#F9F9F9] hover:text-primary">
        <Icon icon="ant-design:delete-twotone" fontSize={15} />
      </IconButton>
    </div>
  );
};

// const VendorAction = ({ data }) => {
//   return (
//     <div className="flex gap-3">
//       <div>
//         <Avatar>
//           <AvatarImage src={data.vendor.png} />
//           <AvatarFallback>{data.vendor.name}</AvatarFallback>
//         </Avatar>
//       </div>
//       <div>
//         <h4 className="font-bold">{data.vendor.name}</h4>
//         <h6>{data.vendor.desc}</h6>
//       </div>
//     </div>
//   );
// };

const data: Data[] = [
  {
    name: "Medical Supplies Ltd.",
    number: +2348071234567,
    email: "contact@medsupplies.com.ng",
    products: "MEDICAL EQUIPMENT, SURGICAL TOOLS",
    status: "Pass",
    prequalification: "Pass",
    isSelected: false,
  },
  {
    name: "Naija Labs & Co.",
    number: +2348092345678,
    email: "info@naijalabs.com.ng",
    products: "Diagnostic kits, laboratory equipment",
    status: "Unreviewed",
    prequalification: "Pass",
    isSelected: false,
  },
  {
    name: "HealthTech Nigeria",
    number: +2348063456789,
    email: "support@healthtechnigeria.com.ng",
    products: "Healthcare software, patient management systems",
    status: "Pass",
    prequalification: "Pass",
    isSelected: false,
  },
  {
    name: "Medical Supplies Ltd.",
    number: +2348071234567,
    email: "contact@medsupplies.com.ng",
    products: "MEDICAL EQUIPMENT, SURGICAL TOOLS",
    status: "Fail",
    prequalification: "Pass",
    isSelected: false,
  },
  {
    name: "Naija Labs & Co.",
    number: +2348092345678,
    email: "info@naijalabs.com.ng",
    products: "Diagnostic kits, laboratory equipment",
    status: "Unreviewed",
    prequalification: "Pass",
    isSelected: false,
  },
  {
    name: "HealthTech Nigeria",
    number: +2348063456789,
    email: "support@healthtechnigeria.com.ng",
    products: "Healthcare software, patient management systems",
    status: "Pass",
    prequalification: "Pass",
    isSelected: false,
  },
];
