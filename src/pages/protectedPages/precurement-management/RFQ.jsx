import { Checkbox } from "components/ui/checkbox";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import useTable from "hooks/useTable";
import Table from "lib/react-table/Table";
import { Plus } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import IconButton from "components/shared/IconButton";
import { Icon } from "@iconify/react";

const RFQ = () => {
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
        <h4 className="text-lg font-bold">Request For Quotations</h4>
        <h6>
          Precurement -{" "}
          <span className="text-black font-medium">Request For Quotations</span>
        </h6>
      </div>

      <Card className="space-y-10">
        <div className="flex justify-between items-center">
          <h4 className="text-base font-bold">Active RFQs</h4>
          <div>
            <Dialog>
              <DialogTrigger>
                <Button>
                  <span>
                    <Plus size={20} />
                  </span>
                  New RFQ
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
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

export default RFQ;
const columns = [
  {
    id: "select",
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
    header: "EOI ID",
    accessorKey: "ref",
  },
  {
    header: "Requisition Name",
    accessorKey: "requisition",
  },
  {
    header: "Background",
    accessorKey: "background",
  },
  {
    header: "Submissions",
    accessorKey: "submission",
    cell: ({ getValue }) => <p className=" text-red-dark">{getValue()}</p>,
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <ActionListAction data={row.original} />,
  },
];

const ActionListAction = ({ data }) => {
  return (
    <div className="flex gap-2">
      <div>
        <IconButton className="bg-[#F9F9F9] hover:text-primary">
          <Icon icon="bi:toggles" fontSize={15} />
        </IconButton>
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

const data = [
  {
    ref: "AHNI-T-001",
    requisition: "Office Refurbishing",
    background:
      "As we embark on the enhancement of our office space, we are reaching out to eligible vendors like yourselves through this Request for Quotation (RFQ). Our goal is to find a capable partner who can collaborate with us to transform our workplace into a more functional, modern, and aesthetically pleasing environment. This RFQ serves as an invitation to submit competitive bids and detailed project proposals, taking into consideration our specific requirements, design preferences, budget constraints, and project timelines. We believe that your expertise in office refurbishing can contribute significantly to our objectives, and we look forward to reviewing your proposal as we embark on this exciting project to create an efficient and inspiring workspace that aligns perfectly with our business needs and vision.",
    submission: 3,
  },
  {
    ref: "AHNI-T-002",
    requisition: "Mobile Clinic Units",
    background:
      "As we endeavor to extend our healthcare services to underserved communities, we are actively seeking proposals from eligible vendors like yourselves to provide Mobile Clinic Units. This Request for Quotation (RFQ) represents our commitment to delivering quality healthcare solutions to remote and marginalized populations. We invite you to submit competitive bids and comprehensive proposals outlining your Mobile Clinic Units, which should be equipped to meet our specific healthcare needs, including medical equipment, diagnostic facilities, and patient outreach capabilities. Your expertise in the provision of mobile healthcare units is crucial in ensuring that we can effectively address the healthcare disparities in these communities. We look forward to reviewing your proposal and partnering with you to make a meaningful difference in the lives of those we aim to serve.",
    submission: 1,
  },
  {
    ref: "AHNI-T-003",
    requisition: "Data Management Systems",
    background:
      "In our pursuit of enhancing data management efficiency and effectiveness, we are reaching out to eligible vendors with expertise in Data Management Systems. This Request for Quotation (RFQ) marks our commitment to optimizing our data infrastructure to meet the growing demands of our organization. We invite you to submit proposals and competitive bids outlining your Data Management Systems solutions, which should encompass data collection, storage, security, analysis, and reporting capabilities tailored to our specific requirements and objectives. Your proficiency in providing robust data management solutions is integral to our goal of harnessing data-driven insights to drive organizational success. We eagerly anticipate reviewing your proposal and collaborating with you to achieve a more streamlined and data-savvy future.",
    submission: 0,
  },
];
