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
        <h4 className="text-lg font-bold">Vendor Management</h4>
        <h6>
          procurement -{" "}
          <span className="text-black font-medium">Vendor Management</span>
        </h6>
      </div>

      <Card className="space-y-10">
        <div>
          <h4 className="text-lg font-bold">Vendor Management</h4>
          <h6>
            NOTE: Vendors register on the platform by themselves on the url:
            <a
              href="https://ahni-frontend.vercel.app/vendor-registration"
              className="text-primary"
            >
              https://ahni-frontend.vercel.app/vendor-registration
            </a>
          </h6>
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
            <div className="rounded-lg px-2 py-2 bg-[#F9F9F9] hover:text-primary hover:bg-red-light">
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
                    <img src={avatarPng} alt="img" width={200} />
                    <div className="absolute -right-2 top-2/3 h-5 border-4 border-white rounded-full bg-green-400 w-5" />
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold">Max Smith</h2>
                    <div className="flex items-center gap-4">
                      <h4>Developer</h4>
                      <h4>SF, Bay Area</h4>
                      <h4>max@kt.com</h4>
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
        <img src={data.vendor.png} alt={data.vendor.name} />
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
