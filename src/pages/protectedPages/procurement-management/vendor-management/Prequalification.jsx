/* eslint-disable react/prop-types */
import { Icon } from "@iconify/react";
import Card from "components/shared/Card";
import IconButton from "components/shared/IconButton";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import useTable from "hooks/useTable";
import Table from "lib/react-table/Table";
import { cn } from "lib/utils";
import avatarPng from "assets/imgs/avartar.png";
import ReactStars from "react-rating-stars-component";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import iconSvg from "assets/svgs/svg.svg";
import iconSvg1 from "assets/svgs/I [ki-duotone](5).svg";
import iconSvg2 from "assets/svgs/I [ki-duotone](6).svg";
import { Progress } from "components/ui/progress";
import { Button } from "components/ui/button";
import { Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";

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
        <div>
          <h4 className="text-lg font-bold">Prequalification</h4>

          <div className="flex mt-1 justify-between items-center">
            <Button>
              <span>
                <Plus size={20} />
              </span>
              Add New Vendor
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="filter">
                  <span>
                    <svg
                      width="19"
                      height="16"
                      viewBox="0 0 19 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.39409 5.77515L3.39282 6.81348L6.38513 2.13904H3.31121C2.95499 2.13904 2.65187 2.26413 2.40187 2.51432C2.15186 2.7645 2.02686 3.06783 2.02686 3.42432V4.87293C2.02686 4.87293 2.02686 4.87746 2.02686 4.88654C2.02686 5.06024 2.05859 5.22422 2.12207 5.37848C2.18554 5.53404 2.27621 5.66626 2.39409 5.77515Z"
                        fill="#99A1B7"
                      />
                      <g opacity="0.3">
                        <path
                          d="M10.7432 2.13904H7.42255L4.02026 7.42987L4.60707 8.01709C4.80785 8.21802 4.96524 8.45265 5.07923 8.72098C5.19322 8.99061 5.25022 9.28033 5.25022 9.59015V12.639C5.25022 12.6481 5.25022 12.6572 5.25022 12.6663C5.25022 12.6753 5.25022 12.6844 5.25022 12.6935C5.25022 13.0124 5.36421 13.2859 5.5922 13.514C5.82018 13.7409 6.09804 13.8543 6.42577 13.8543C6.55271 13.8543 6.67772 13.8342 6.80078 13.794C6.92384 13.7526 7.03524 13.691 7.13498 13.6093V13.6229L7.92775 13.0357C8.07412 12.9346 8.19006 12.8043 8.27556 12.6449C8.36235 12.4854 8.40574 12.3098 8.40574 12.1179V9.67182C8.40574 9.66274 8.40574 9.65561 8.40574 9.65043C8.40574 9.64654 8.40574 9.64006 8.40574 9.63098C8.40574 9.30302 8.46986 8.99774 8.5981 8.71515C8.72505 8.43256 8.90251 8.18626 9.1305 7.97626L11.6021 5.77515C11.7303 5.65719 11.8333 5.51589 11.911 5.35126C11.9874 5.18663 12.0257 5.00904 12.0257 4.81848C12.0257 4.81848 12.0257 4.81395 12.0257 4.80487V3.42432C12.0257 3.06783 11.9006 2.7645 11.6506 2.51432C11.4006 2.26413 11.0982 2.13904 10.7432 2.13904Z"
                          fill="#99A1B7"
                        />
                      </g>
                    </svg>
                  </span>
                  Filter
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
    header: "Vendor",
    accessorKey: "vendor",
    size: 250,
    cell: ({ row }) => <VendorAction data={row.original} />,
  },
  {
    header: "Phone Number",
    accessorKey: "number",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Products/Services",
    accessorKey: "products",
    size: 250,
  },
  {
    header: "Rating",
    accessorKey: "rating",
    cell: ({ row }) => <RatingAction data={row.original} />,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "p-1 rounded-lg",
            getValue() === "Active" && "bg-green-light text-green-dark",
            getValue() === "Inactive" && "bg-red-light text-red-dark",
            getValue() === "Under Review" && "bg-yellow-light text-yellow-dark"
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
      <div>
        <Dialog>
          <DialogTrigger>
            <div className="rounded-lg px-2 py-2 bg-[#F9F9F9] hover:text-primary dark:text-black dark:hover:text-primary">
              <Icon icon="fluent:notepad-28-regular" fontSize={15} />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[700px]">
            <div className="pb-5 space-y-5">
              <DialogTitle className="py-2 ">Vendor Profile</DialogTitle>

              <hr />

              <Card className="flex gap-10 items-center">
                <div className="flex gap-4">
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={avatarPng} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="absolute -right-2 top-2/3 h-5 border-4 border-white rounded-full bg-green-400 w-5" />
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold">Max Smith</h2>
                    <div className="flex items-center gap-4">
                      <h4 className="flex items-center gap-1">
                        <span>
                          <Icon
                            icon="icon-park-twotone:avatar"
                            color="#4E4E4E"
                          />
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
              </Card>

              <div className="bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
                <div>
                  <div className="p-5 flex justify-between items-center">
                    <h4 className="font-bold text-lg">Profile Details</h4>
                    <Button>Edit Profile</Button>
                  </div>
                  <hr />

                  <div className="p-5 space-y-5">
                    <div className="grid grid-cols-2 items-center">
                      <h4 className=" text-grey-light font-medium">
                        Full Name
                      </h4>
                      <h4 className="font-bold">Max Smith</h4>
                    </div>
                    <div className="grid grid-cols-2 items-center">
                      <h4 className=" text-grey-light font-medium">Company</h4>
                      <h4 className="font-bold">Keenthemes</h4>
                    </div>
                    <div className="grid grid-cols-2 items-center">
                      <h4 className=" text-grey-light font-medium">
                        Contact Phone
                      </h4>
                      <h4 className="font-bold">
                        044 3276 454 935{" "}
                        <Badge className="bg-green-dark">Verified</Badge>
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 items-center">
                      <h4 className=" text-grey-light font-medium">
                        Company Site
                      </h4>
                      <h4 className="font-bold">
                        <a href="keenthemes.com">keenthemes.com</a>
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 items-center">
                      <h4 className=" text-grey-light font-medium">Country</h4>
                      <h4 className="font-bold">Germany</h4>
                    </div>
                    <div className="grid grid-cols-2 items-center">
                      <h4 className=" text-grey-light font-medium">
                        Communication
                      </h4>
                      <h4 className="font-bold">Email, Phone</h4>
                    </div>
                    <div className="grid grid-cols-2 items-center">
                      <h4 className=" text-grey-light font-medium">
                        Allow Changes
                      </h4>
                      <h4 className="font-bold">Yes</h4>
                    </div>

                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex gap-2 flex-col">
        <IconButton className="bg-[#F9F9F9] hover:text-primary">
          <Icon icon="solar:pen-bold-duotone" fontSize={15} />
        </IconButton>
        <IconButton className="bg-[#F9F9F9] hover:text-primary">
          <Icon icon="ant-design:delete-twotone" fontSize={15} />
        </IconButton>
      </div>
    </div>
  );
};

const RatingAction = () => {
  return (
    <ReactStars
      count={5}
      // onChange={ratingChanged}
      size={15}
      value={3}
      activeColor="#ffd700"
    />
  );
};
const VendorAction = ({ data }) => {
  return (
    <div className="flex gap-3">
      <div>
        <Avatar>
          <AvatarImage src={data.vendor.png} />
          <AvatarFallback>{data.vendor.name}</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <h4 className="font-bold">{data.vendor.name}</h4>
        <h6>{data.vendor.desc}</h6>
      </div>
    </div>
  );
};

const data = [
  {
    vendor: { png: avatarPng, name: "Medical Supplies Ltd.", desc: "AHNI001" },
    number: +2348071234567,
    email: "contact@medsupplies.com.ng",
    products: "MEDICAL EQUIPMENT, SURGICAL TOOLS",
    status: "Active",
  },
  {
    vendor: { png: avatarPng, name: "Naija Labs & Co.", desc: "AHNI002" },
    number: +2348092345678,
    email: "info@naijalabs.com.ng",
    products: "Diagnostic kits, laboratory equipment",
    status: "Under Review",
  },
  {
    vendor: { png: avatarPng, name: "HealthTech Nigeria", desc: "AHNI002" },
    number: +2348063456789,
    email: "support@healthtechnigeria.com.ng",
    products: "Healthcare software, patient management systems",
    status: "Inactive",
  },
  {
    vendor: { png: avatarPng, name: "Medical Supplies Ltd.", desc: "AHNI001" },
    number: +2348071234567,
    email: "contact@medsupplies.com.ng",
    products: "MEDICAL EQUIPMENT, SURGICAL TOOLS",
    status: "Active",
  },
  {
    vendor: { png: avatarPng, name: "Naija Labs & Co.", desc: "AHNI002" },
    number: +2348092345678,
    email: "info@naijalabs.com.ng",
    products: "Diagnostic kits, laboratory equipment",
    status: "Under Review",
  },
  {
    vendor: { png: avatarPng, name: "HealthTech Nigeria", desc: "AHNI002" },
    number: +2348063456789,
    email: "support@healthtechnigeria.com.ng",
    products: "Healthcare software, patient management systems",
    status: "Inactive",
  },
];
