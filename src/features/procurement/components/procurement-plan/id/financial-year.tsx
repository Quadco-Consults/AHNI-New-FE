import Card from "components/Card";
import SearchIcon from "components/icons/SearchIcon";
import { Column, ColumnDef, Row } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import BreadcrumbCard from "components/Breadcrumb";
import ProcurementPlanAPI from "@/features/procurement/controllers/procurementPlanController";
import { useState } from "react";
import { Textarea } from "components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import FinancialAPI from "@/features/modules/controllers/config/financial-yearController";
import { formatNumberCurrency } from "utils/utls";
import ProcurementPlanUploadModal from "../components/ProcurementPlanUploadModal";
import { Button } from "components/ui/button";
import { FileDown } from "lucide-react";

export default function ProcurementPlan() {
  const [selectedFinancialYear, setSelectedFinancialYear] = useState("");

  const { data: procurementData, isLoading } =
    ProcurementPlanAPI.useGetProcurementPlans({
      params: { financial_year: "2023/2024" },
    });

  const [isModalOpen, setModalOpen] = useState(false);

  const [dataSource, setDataSource] = useState<ProcurementPlanTableType[]>();
  const { data: financialYear } = FinancialAPI.useGetFinancialYears({
    params: { no_paginate: true },
  });

  // @ts-ignore
  const financialYearOptions = financialYear?.data.results.map(
    // @ts-ignore
    ({ year, id }) => ({
      label: year,
      value: id,
    })
  );

  console.log({ selectedFinancialYear });

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Procurement Plan", icon: false },
  ];

  const formatRawData = (data: []) => {
    const cellsToFormat = data?.slice(1);

    const tableCells = cellsToFormat?.map(
      (column): ProcurementPlanTableType => {
        // @ts-ignore
        return {
          id: column["__EMPTY"],
          sn: column["__EMPTY"],
          budgetLine: column["__EMPTY"],
          owner: column["__EMPTY_1"],
          activityReference: column["__EMPTY_2"],
          description: column["__EMPTY_3"],
          yearOne: column["__EMPTY_4"],
          yearTwo: column["__EMPTY_5"],
          yearThree: column["__EMPTY_6"],
          approvedBudget: column["__EMPTY_7"],
          ppm: column["__EMPTY_8"],
          nonPpm: column["__EMPTY_9"],
          yearOneTargets: column["__EMPTY_10"],
          yearTwoTargets: column["__EMPTY_11"],
          yearThreeTargets: column["__EMPTY_12"],
          totalQuantity: column["__EMPTY_13"],
          responsibleStaff: column["__EMPTY_14"],
          modeOfProcurement: column["__EMPTY_15"],
          procurementReview: column["__EMPTY_16"],
          procumentProcess: column["__EMPTY_17"],
          startDate: column["__EMPTY_18"],
          procurementMilestoneOne: column["__EMPTY_19"],
          procurementMilestoneTwo: column["__EMPTY_20"],
          procurementMilestoneThree: column["__EMPTY_21"],
          procurementMilestoneFour: column["__EMPTY_22"],
          procurementMilestoneFive: column["__EMPTY_23"],
          selectedSupplier: column["__EMPTY_24"],
          expectedDeliveryDateOne: column["__EMPTY_25"],
          expectedDeliveryDateTwo: column["__EMPTY_26"],
          deliveryTo: column["__EMPTY_27"],
          donorRemarks: column["__EMPTY_28"],
          implementerRemarks: column["__EMPTY_29"],
        };
      }
    );

    setDataSource(tableCells);
  };

  const editCell = (id: number, cellName: string, value: string) => {
    const updatedData = dataSource?.map((data) => {
      if (data.id === id) {
        return {
          ...data,
          [cellName]: value,
        };
      }

      return data;
    });

    setDataSource(updatedData);
  };
  return (
    <section className='min-h-screen space-y-10'>
      <BreadcrumbCard list={breadcrumbs} />

      <Card className='space-y-5'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center w-1/3 px-2 py-2 border rounded-lg'>
            <SearchIcon />
            <input
              placeholder='Search'
              type='text'
              className='ml-2 h-full w-full border-none bg-none focus:outline-none outline-none'
            />
          </div>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-x-3'>
              <Button variant='default'>
                <span>
                  <FileDown size={18} />
                </span>
                Download xlsx
              </Button>
            </div>
          </div>
        </div>

        <DataTable
          // @ts-ignore
          data={procurementData?.data?.results || []}
          // @ts-ignore
          columns={tableColumns(editCell)}
          isLoading={isLoading}
        />

        <ProcurementPlanUploadModal
          isOpen={isModalOpen}
          onCancel={() => setModalOpen(false)}
          // @ts-ignore
          onOk={(data: any) => formatRawData(data)}
        />
      </Card>
    </section>
  );
}

const tableColumns = (editCell: () => void): ColumnDef<any>[] => [
  {
    header: " ",
    columns: [
      {
        header: "SN",
        accessorKey: "sn",
        size: 120,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },

      {
        header: "Implementer (Owner)",
        accessorKey: "implementer",
        size: 200,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
      {
        header: "Implementation Location",
        accessorKey: "implementation_location",
        size: 200,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
      {
        header: "Work Plan Activity Reference",
        accessorKey: "workplan_activity_reference",
        size: 250,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
      {
        header: "Description of Procurement Activities",
        accessorKey: "description",
        size: 300,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
      {
        header: "Budget Reference Number",
        accessorKey: "budget_ref_num",
        size: 120,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
      {
        header: "Approved Budget ($)",
        accessorKey: "approved_budget_amount_usd",
        accessorFn: (data) =>
          formatNumberCurrency(data.approved_budget_amount_usd, "USD"),

        size: 200,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },

      {
        header: "Approved Budget (N)",
        accessorKey: "approved_budget_amount_ngn",
        accessorFn: (data) =>
          formatNumberCurrency(data.approved_budget_amount_ngn, "NGN"),

        size: 200,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
      {
        header: "PPM",
        accessorKey: "ppm",
        size: 120,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },

      {
        header: "Non-PPM",
        accessorKey: "non_ppm",
        size: 120,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
      {
        header: "FY Targets",
        accessorKey: "non_ppm",
        size: 120,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
      {
        header: "FY 1st Quarter",
        accessorKey: "non_ppm",
        size: 120,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
      {
        header: "FY 2nd Quarter",
        accessorKey: "non_ppm",
        size: 120,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
      {
        header: "FY 3rd Quarter",
        accessorKey: "non_ppm",
        size: 120,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
      {
        header: "FY 4th Quarter",
        accessorKey: "non_ppm",
        size: 120,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
      {
        header: "UOM",
        accessorKey: "total_quantity",
        size: 140,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
      {
        header: "Quantity",
        accessorKey: "total_quantity",
        size: 140,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
      {
        header: "Responsible PR Staff",
        accessorKey: "responsible_pr_staff",
        size: 200,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
      {
        header: "Mode of Procurement",
        accessorKey: "mode_of_procurement",
        size: 140,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
      {
        header: "Procurement Committee Review",
        accessorKey: "responsible_pr_staff",
        size: 200,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
      {
        header:
          "PROCUREMENT PROCESS (EOI, RFP, RFQ, Minimum Quotes, Open or Limited Bidding etc. as per organizational Procurement Policy, refer relevant section)",
        accessorKey: "applicable_solicitation_methods",
        size: 605,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
      {
        header: "Start Date (at least week of the month)",
        accessorKey: "start_date",
        size: 200,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
    ],
  },
  {
    header: "Procurement Milestones",
    columns: [
      {
        header:
          "Procurement Method (ICB, ILCB, NCB, NLCB, National Shopping, Local Shopping, Micro Purchase, Single Source, Sole Source)",
        accessorKey: "bid_document_finalization",
        // size: 0,
        size: 305,

        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },

      {
        header: "Start Date of RFQ",
        accessorKey: "advertise_bid",
        size: 300,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
      {
        header: "End Date of RFQ",
        accessorKey: "advertise_bid",
        size: 300,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },

      {
        header: "Evaluation Date",
        accessorKey: "evaluation_date",
        size: 120,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
      {
        header: "Date CBA and Report is finalized ",
        accessorKey: "evaluation_date",
        size: 120,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },

      {
        header: "Date Purchase Order/PC is Issued",
        accessorKey: "evaluation_date",
        size: 120,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
    ],
  },

  {
    header: " ",
    columns: [
      {
        header: "Selected Supplier",
        accessorKey: "selected_supplier",
        size: 280,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },

      {
        header: "Delivery Lead Time",
        accessorKey: "expected_delivery_date_1",
        size: 180,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },

      {
        header: "Expected Delivery Due Date",
        accessorKey: "expected_delivery_date_2",
        size: 180,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },

      {
        header:
          "DELIVERY TO (Central warehouse, State warehouse, treatment site, SR)",
        accessorKey: "delivery_to",
        size: 330,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },

      {
        header: "Procurement performance and Monitoring Remarks",
        accessorKey: "donor_remarks",
        size: 150,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },

      {
        header: "Procurement Performance Score",
        accessorKey: "implementer_remarks",
        size: 150,
        cell: (cell) => (
          <EditableCell
            value={cell.getValue()}
            row={cell.row}
            column={cell.column}
            onEditCell={editCell}
          />
        ),
      },
    ],
  },
];

interface ProcurementPlanTableType {
  id: number;
  sn: number;
  budgetLine: number;
  owner: string;
  activityReference: string;
  description: string;
  yearOne: string;
  yearTwo: string;
  yearThree: string;
  approvedBudget: number;
  ppm: string;
  nonPpm: string;
  yearOneTargets: number;
  yearTwoTargets: number;
  yearThreeTargets: number;
  totalQuantity: number;
  responsibleStaff: string;
  modeOfProcurement: string;
  procurementReview: string;
  procumentProcess: string;
  startDate: string;
  procurementMilestones: string;
  selectedSupplier: string;
  expectedDeliveryDateOne: string;
  expectedDeliveryDateTwo: string;
  deliveryTo: string;
  donorRemarks: string;
  implementerRemarks: string;
  /* -------------- */
  procurementMilestoneOne: string;
  procurementMilestoneTwo: string;
  procurementMilestoneThree: string;
  procurementMilestoneFour: string;
  procurementMilestoneFive: string;
}

type PropsType = {
  value: string | number | unknown;
  row?: Row<ProcurementPlanTableType>;
  column?: Column<ProcurementPlanTableType>;
  onEditCell?: () => void;
};

const EditableCell = (props: PropsType) => {
  const { value, row, column, onEditCell } = props;

  const formattedValue =
    typeof value === "number"
      ? value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : value;

  const [inputValue, setInputValue] = useState(formattedValue);

  const handleBlurCell = () => {
    if (row?.original && onEditCell && column) {
      // @ts-ignore
      onEditCell(row?.original.id, column?.id, inputValue as string);
    }
  };

  return (
    <Textarea
      className='w-fit h-fit border-none overflow-scroll bg-transparent shadow-none'
      value={inputValue as string}
      onChange={(e) => setInputValue(e.target.value)}
      style={{ scrollbarWidth: "none" }}
      onBlur={handleBlurCell}
      rows={5}
    />
  );
};
