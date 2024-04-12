/* eslint-disable react/prop-types */
import { Icon } from "@iconify/react";
import Card from "components/shared/Card";
import IconButton from "components/shared/IconButton";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import useTable from "hooks/useTable";
import Table from "lib/react-table/Table";
import { cn } from "lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { Button } from "components/ui/button";
import { Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import Overview from "./Overview";
import Settings from "./Settings";
import Uploads from "./Uploads";
import { Input } from "components/ui/input";
import Questionnaire from "./Questionnaire";

const VendorManagement = () => {
  const tableInstance = useTable({
    columns,
    data,
    //  state: { pagination },
    //  pageCount: customersQueryResult?.data?.number_of_pages,
    //  manualPagination: true,
    //  onPaginationChange: setPagination,
  });
  return (
    <div className="space-y-10">
      <div>
        <h4 className="text-lg font-bold">Prequalification</h4>
        <h6>
          Procurement -{" "}
          <span className="text-black font-medium dark:text-grey-dark">
            Vendor Management
          </span>
        </h6>
      </div>

      <Card className="space-y-10">
        <div className="space-y-5">
          <h4 className="text-lg font-bold">Prequalification</h4>

          <div className="flex justify-end">
            <Button>
              <span>
                <Plus size={20} />
              </span>
              Add Vendor
            </Button>
          </div>

          <div className="flex mt-1 justify-between items-center">
            <div className="border w-1/3 py-2 px-2 flex items-center rounded-lg">
              <Icon icon="iconamoon:search-light" fontSize={25} />
              <Input
                placeholder="Search Category"
                type="search"
                className="h-6 border-none bg-none"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="filter" className="bg-[#FFF2F2] text-primary">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.4"
                      d="M18.593 8.19486C19.0376 8.52237 19.1326 9.14837 18.8051 9.59306C18.5507 9.93847 18.2963 10.2668 18.0731 10.5528C17.6276 11.1236 17.0143 11.8882 16.3479 12.6556C15.6859 13.4181 14.9518 14.2064 14.2666 14.8119C13.9251 15.1136 13.5721 15.3911 13.2279 15.5986C12.9112 15.7895 12.476 16 11.9999 16C11.5238 16 11.0885 15.7895 10.7718 15.5986C10.4276 15.3911 10.0747 15.1136 9.7332 14.8119C9.04791 14.2064 8.31387 13.4181 7.65183 12.6556C6.98548 11.8882 6.37216 11.1236 5.92664 10.5528C5.70347 10.2668 5.44902 9.93847 5.19463 9.59307C4.86712 9.14837 4.96211 8.52237 5.4068 8.19486C5.58556 8.0632 5.79362 7.99983 5.99982 8L11.9999 8L17.9999 8C18.2061 7.99983 18.4142 8.0632 18.593 8.19486Z"
                      fill="#FF0000"
                    />
                    <path
                      d="M18.593 8.19486C19.0376 8.52237 19.1326 9.14837 18.8051 9.59306C18.5507 9.93847 18.2963 10.2668 18.0731 10.5528C17.6276 11.1236 17.0143 11.8882 16.3479 12.6556C15.6859 13.4181 14.9518 14.2064 14.2666 14.8119C13.9251 15.1136 13.5721 15.3911 13.2279 15.5986C12.9112 15.7895 12.476 16 11.9999 16C11.5238 16 11.0885 15.7895 10.7718 15.5986C10.4276 15.3911 10.0747 15.1136 9.7332 14.8119C9.15076 14.2973 8.53312 13.6506 7.95439 13L13 8L17.9999 8C18.2061 7.99983 18.4142 8.0632 18.593 8.19486Z"
                      fill="#FF0000"
                    />
                  </svg>
                  Actions
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <h4 className="font-medium p-5 text-base">Filter Options</h4>
                <hr />

                <div className="p-5 space-y-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-5">
                      <Checkbox checked />
                      <h6>Approved</h6>
                    </div>
                    <div className="flex items-center gap-5">
                      <Checkbox />
                      <h6>Pending</h6>
                    </div>
                    <div className="flex items-center gap-5">
                      <Checkbox />
                      <h6>In Progress</h6>
                    </div>
                    <div className="flex items-center gap-5">
                      <Checkbox />
                      <h6>Rejected</h6>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button variant="ghost">Reset</Button>
                    <Button>Apply</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          {/* <h6>
            NOTE: Vendors register on the platform by themselves on the url:
            <a
              href="https://ahni-frontend.vercel.app/vendor-registration"
              className="text-primary"
            >
              https://ahni-frontend.vercel.app/vendor-registration
            </a>
          </h6> */}
        </div>

        <Table
          instance={tableInstance}
          // loading={customersQueryResult.isFetching}
          // error={customersQueryResult.isError}
          // onReload={customersQueryResult.refetch}
        />
      </Card>
    </div>
  );
};

export default VendorManagement;

const columns = [
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
    header: "Evaluation Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "px-3 py-2 rounded-lg",
            getValue() === "Pass" && "bg-green-light text-green-dark",
            getValue() === "Fail" && "bg-red-light text-red-dark",
            getValue() === "Unreviewed" && "bg-yellow-light text-yellow-dark"
          )}
        >
          {getValue()}
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

const ActionListAction = () => {
  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger>
          <div className="rounded-lg px-2 py-2 bg-[#F9F9F9] hover:text-primary dark:text-black dark:hover:text-primary">
            <Icon icon="ph:eye-duotone" fontSize={15} />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-6xl max-h-[700px]">
          <div className="pb-5 space-y-5">
            <DialogTitle className="py-2 ">Vendor Profile</DialogTitle>

            <hr />

            {/* <Card className="flex gap-10 items-center">
              <div className="flex gap-4">
                <div className="relative">
                  <Avatar className="w-36 h-36">
                    <AvatarImage src={avatarPng} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="absolute -right-2 top-2/3 h-5 border-4 border-white rounded-full bg-green-400 w-5" />
                </div>
              </div>
              <div className="space-y-5">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold">Max Smith</h2>
                      <img src={verifySvg} alt="verify" width={20} />
                      <Badge className="bg-green-dark">Upgrade to Pro</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="filter">Follow</Button>
                      <Button>Hire</Button>
                      <Button variant="filter">
                        <Icon icon="solar:pen-bold-duotone" fontSize={15} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <h4 className="flex items-center gap-1">
                      <span>
                        <Icon icon="icon-park-twotone:avatar" color="#4E4E4E" />
                      </span>
                      Developer
                    </h4>
                    <h4 className="flex items-center gap-1">
                      <span>
                        <Icon icon="ic:twotone-location-on" color="#4E4E4E" />
                      </span>
                      SF, Bay Area
                    </h4>
                    <h4 className="flex items-center gap-1">
                      <span>
                        <Icon icon="ic:twotone-mail" color="#4E4E4E" />
                      </span>
                      max@kt.com
                    </h4>
                  </div>
                </div>

                <div className="flex justify-between gap-10 items-center">
                  <div className="flex items-center gap-2">
                    {[
                      {
                        name: "Earnings",
                        amount: "5M",
                        sign: "$",
                        icon: iconSvg1,
                      },
                      {
                        name: "Projects",
                        amount: "15",
                        sign: "",
                        icon: iconSvg2,
                      },
                      {
                        name: "Success Rate",
                        amount: "90",
                        sign: "%",
                        icon: iconSvg,
                      },
                    ].map(({ name, amount, sign, icon }) => (
                      <div
                        key={name}
                        className="py-2 px-8 border-2 border-dashed rounded-2xl"
                      >
                        <div className="flex items-center">
                          <div>
                            <img src={icon} alt={name} />
                          </div>
                          <h4 className="text-lg font-bold">
                            {amount}
                            <span>{sign}</span>
                          </h4>
                        </div>
                        <h4>{name}</h4>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-10 justify-between">
                      <h4>Processes Completion</h4>
                      <h4 className="font-bold">33%</h4>
                    </div>
                    <Progress value={33} />
                  </div>
                </div>
              </div>
            </Card> */}

            <div className="flex justify-end">
              <Button>Start Prequalification</Button>
            </div>

            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="uploads">Uploads</TabsTrigger>
                <TabsTrigger value="questionnaire">Questionnaire</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <Overview />
              </TabsContent>
              <TabsContent value="uploads">
                <Uploads />
              </TabsContent>
              <TabsContent value="questionnaire">
                <Questionnaire />
              </TabsContent>
              <TabsContent value="settings">
                <Settings />
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

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

const data = [
  {
    name: "Medical Supplies Ltd.",
    number: +2348071234567,
    email: "contact@medsupplies.com.ng",
    products: "MEDICAL EQUIPMENT, SURGICAL TOOLS",
    status: "Pass",
  },
  {
    name: "Naija Labs & Co.",
    number: +2348092345678,
    email: "info@naijalabs.com.ng",
    products: "Diagnostic kits, laboratory equipment",
    status: "Unreviewed",
  },
  {
    name: "HealthTech Nigeria",
    number: +2348063456789,
    email: "support@healthtechnigeria.com.ng",
    products: "Healthcare software, patient management systems",
    status: "Pass",
  },
  {
    name: "Medical Supplies Ltd.",
    number: +2348071234567,
    email: "contact@medsupplies.com.ng",
    products: "MEDICAL EQUIPMENT, SURGICAL TOOLS",
    status: "Fail",
  },
  {
    name: "Naija Labs & Co.",
    number: +2348092345678,
    email: "info@naijalabs.com.ng",
    products: "Diagnostic kits, laboratory equipment",
    status: "Unreviewed",
  },
  {
    name: "HealthTech Nigeria",
    number: +2348063456789,
    email: "support@healthtechnigeria.com.ng",
    products: "Healthcare software, patient management systems",
    status: "Pass",
  },
];
