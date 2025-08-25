// import Link from "next/link";
import Card from "components/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import ArrowDownIcon from "components/icons/ArrowDownIcon";
import SearchIcon from "components/icons/SearchIcon";
// import FilterIcon from "components/icons/FilterIcon";
// import { RouteEnum } from "constants/RouterConstants";
// import EyeIcon from "components/icons/EyeIcon";
// import DeleteIcon from "components/icons/DeleteIcon";
import { Column, ColumnDef, Row } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import BreadcrumbCard from "components/Breadcrumb";
import ProcurementPlanAPI from "@/features/procurement/controllers/procurementPlanController";
// import { ProcurementPlanResultsData } from "definations/procurement-types/procurementPlan";
import UploadIcon from "components/icons/UploadIcon";
// import { useAppDispatch } from "hooks/useStore";
// import { DialogType } from "constants/dailogs";
import { useState } from "react";
import { Textarea } from "components/ui/textarea";
import ProcurementPlanUploadModal from "./components/ProcurementPlanUploadModal";
import { MdDownload } from "react-icons/md";
import * as XLSX from "xlsx";
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

  const handleDownloadSheet = () => {
    // const data = [
    //   { Name: "Alice", Age: 25, City: "New York" },
    //   { Name: "Bob", Age: 30, City: "Los Angeles" },
    //   { Name: "Charlie", Age: 35, City: "Chicago" },
    // ];

    if (dataSource) {
      // Convert the data to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(dataSource);

      // Apply styles to the header row
      // const headerRow = (worksheet["A1"].s = {
      //   font: {
      //     bold: true,
      //     sz: 14,
      //     color: { rgb: "FFFFFF" },
      //   },
      //   fill: {
      //     fgColor: { rgb: "4F81BD" },
      //   },
      //   alignment: {
      //     horizontal: "center",
      //   },
      // });

      // Apply styles to the entire worksheet
      for (let cell in worksheet) {
        if (cell[0] === "!") continue; // Skip the metadata properties

        worksheet[cell].s = {
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }

      // Create a new workbook and add the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // Export the file
      XLSX.writeFile(workbook, "example.xlsx");
    }
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

      <div className='flex items-center justify-end gap-4'>
        <Popover>
          <PopoverTrigger asChild>
            <Button className='flex gap-2 py-6'>
              <AddSquareIcon />
              New Procurement Plan
              <ArrowDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className=' w-fit'>
            <div className='flex flex-col items-start justify-between gap-1'>
              {/* <Link
                className='w-full'
                href={generatePath(RouteEnum.CREATE_PROCUREMENT)}
              >
                <Button
                  className='w-full flex items-center gap-2 justify-start'
                  variant='ghost'
                >
                  <AddSquareIcon fillColor='#FF0000' /> Create from scratch
                </Button>
              </Link> */}
              <Button
                className='w-full flex items-center gap-2 justify-start'
                variant='ghost'
                onClick={() => setModalOpen(true)}
              >
                <UploadIcon /> Upload Procurement plan
              </Button>
              <Button
                className='w-full flex items-center gap-2 justify-start'
                variant='ghost'
                onClick={handleDownloadSheet}
              >
                <MdDownload size={20} className='text-blue-500' />
                &nbsp; Download Procurement Plan
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
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
            <h6>Financial year</h6>
            <div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Select Year' />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {/* @ts-ignore */}
                    {financialYearOptions?.map(({ label, value }, idx) => {
                      return (
                        <SelectItem
                          value={value}
                          key={idx}
                          //  @ts-ignore
                          onChange={(e) => setSelectedFinancialYear(e)}
                        >
                          {label}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
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

const tableColumns = (
  editCell: () => void
  // editCell: (id: number, fieldName: string, value: string) => void
): ColumnDef<any>[] => [
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
        accessorKey: "budget_line",
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
  // {
  //   header: "Budget allocation",
  //   columns: [
  //     {
  //       header: "Year 1 USD",
  //       accessorKey: "year1_usd",
  //       size: 150,
  //       accessorFn: (data) => formatNumberCurrency(data.year1_usd, "USD"),
  //       cell: (cell) => (
  //         <EditableCell
  //           value={cell.getValue()}
  //           row={cell.row}
  //           column={cell.column}
  //           onEditCell={editCell}
  //         />
  //       ),
  //     },
  //     {
  //       header: "Year 2 USD",
  //       accessorKey: "year2_usd",
  //       accessorFn: (data) => formatNumberCurrency(data.year2_usd, "USD"),
  //       size: 150,
  //       cell: (cell) => (
  //         <EditableCell
  //           value={cell.getValue()}
  //           row={cell.row}
  //           column={cell.column}
  //           onEditCell={editCell}
  //         />
  //       ),
  //     },

  //     {
  //       header: "Year 3 USD",
  //       accessorKey: "year3_usd",
  //       accessorFn: (data) => formatNumberCurrency(data.year3_usd, "USD"),
  //       size: 150,
  //       cell: (cell) => (
  //         <EditableCell
  //           value={cell.getValue()}
  //           row={cell.row}
  //           column={cell.column}
  //           onEditCell={editCell}
  //         />
  //       ),
  //     },
  //     {
  //       header: "Year 3 USD",
  //       accessorKey: "year3_usd",
  //       accessorFn: (data) => formatNumberCurrency(data.year3_usd, "USD"),
  //       size: 150,
  //       cell: (cell) => (
  //         <EditableCell
  //           value={cell.getValue()}
  //           row={cell.row}
  //           column={cell.column}
  //           onEditCell={editCell}
  //         />
  //       ),
  //     },
  //     {
  //       header: "Approved Budget Amount - USD",
  //       accessorKey: "approved_budget_amount_usd",
  //       accessorFn: (data) =>
  //         formatNumberCurrency(data.approved_budget_amount_usd, "USD"),
  //       size: 200,
  //       cell: (cell) => (
  //         <EditableCell
  //           value={cell.getValue()}
  //           row={cell.row}
  //           column={cell.column}
  //           onEditCell={editCell}
  //         />
  //       ),
  //     },
  //     {
  //       header: "Year 1 Targets",
  //       accessorKey: "year1_targets",
  //       accessorFn: (data) => formatNumberCurrency(data.year1_targets, "USD"),
  //       size: 140,
  //       cell: (cell) => (
  //         <EditableCell
  //           value={cell.getValue()}
  //           row={cell.row}
  //           column={cell.column}
  //           onEditCell={editCell}
  //         />
  //       ),
  //     },

  //     {
  //       header: "Year 2 Targets",
  //       accessorKey: "year2_targets",
  //       accessorFn: (data) => formatNumberCurrency(data.year2_targets, "USD"),

  //       size: 140,
  //       cell: (cell) => (
  //         <EditableCell
  //           value={cell.getValue()}
  //           row={cell.row}
  //           column={cell.column}
  //           onEditCell={editCell}
  //         />
  //       ),
  //     },

  //     {
  //       header: "Year 3 Targets",
  //       accessorKey: "year3_targets",
  //       accessorFn: (data) => formatNumberCurrency(data.year3_targets, "USD"),

  //       size: 140,
  //       cell: (cell) => (
  //         <EditableCell
  //           value={cell.getValue()}
  //           row={cell.row}
  //           column={cell.column}
  //           onEditCell={editCell}
  //         />
  //       ),
  //     },

  //     // {
  //     //   header: "Total Quantity (1-3 Years)",
  //     //   accessorKey: "total_quantity",
  //     //   size: 140,
  //     //   cell: (cell) => (
  //     //     <EditableCell
  //     //       value={cell.getValue()}
  //     //       row={cell.row}
  //     //       column={cell.column}
  //     //       onEditCell={editCell}
  //     //     />
  //     //   ),
  //     // },
  //   ],
  // },
  // {
  //   header: "Budget allocation",
  //   columns: [
  //     {
  //       header: "Year 1 USD",
  //       accessorKey: "year1_usd",
  //       size: 150,
  //       accessorFn: (data) => formatNumberCurrency(data.year1_usd, "USD"),
  //       cell: (cell) => (
  //         <EditableCell
  //           value={cell.getValue()}
  //           row={cell.row}
  //           column={cell.column}
  //           onEditCell={editCell}
  //         />
  //       ),
  //     },
  //     {
  //       header: "Year 2 USD",
  //       accessorKey: "year2_usd",
  //       accessorFn: (data) => formatNumberCurrency(data.year2_usd, "USD"),
  //       size: 150,
  //       cell: (cell) => (
  //         <EditableCell
  //           value={cell.getValue()}
  //           row={cell.row}
  //           column={cell.column}
  //           onEditCell={editCell}
  //         />
  //       ),
  //     },

  //     {
  //       header: "Year 3 USD",
  //       accessorKey: "year3_usd",
  //       accessorFn: (data) => formatNumberCurrency(data.year3_usd, "USD"),
  //       size: 150,
  //       cell: (cell) => (
  //         <EditableCell
  //           value={cell.getValue()}
  //           row={cell.row}
  //           column={cell.column}
  //           onEditCell={editCell}
  //         />
  //       ),
  //     },
  //     {
  //       header: "Year 3 USD",
  //       accessorKey: "year3_usd",
  //       accessorFn: (data) => formatNumberCurrency(data.year3_usd, "USD"),
  //       size: 150,
  //       cell: (cell) => (
  //         <EditableCell
  //           value={cell.getValue()}
  //           row={cell.row}
  //           column={cell.column}
  //           onEditCell={editCell}
  //         />
  //       ),
  //     },
  //     {
  //       header: "Approved Budget Amount - USD",
  //       accessorKey: "approved_budget_amount_usd",
  //       accessorFn: (data) =>
  //         formatNumberCurrency(data.approved_budget_amount_usd, "USD"),
  //       size: 200,
  //       cell: (cell) => (
  //         <EditableCell
  //           value={cell.getValue()}
  //           row={cell.row}
  //           column={cell.column}
  //           onEditCell={editCell}
  //         />
  //       ),
  //     },
  //     {
  //       header: "Year 1 Targets",
  //       accessorKey: "year1_targets",
  //       accessorFn: (data) => formatNumberCurrency(data.year1_targets, "USD"),
  //       size: 140,
  //       cell: (cell) => (
  //         <EditableCell
  //           value={cell.getValue()}
  //           row={cell.row}
  //           column={cell.column}
  //           onEditCell={editCell}
  //         />
  //       ),
  //     },

  //     {
  //       header: "Year 2 Targets",
  //       accessorKey: "year2_targets",
  //       accessorFn: (data) => formatNumberCurrency(data.year2_targets, "USD"),

  //       size: 140,
  //       cell: (cell) => (
  //         <EditableCell
  //           value={cell.getValue()}
  //           row={cell.row}
  //           column={cell.column}
  //           onEditCell={editCell}
  //         />
  //       ),
  //     },

  //     {
  //       header: "Year 3 Targets",
  //       accessorKey: "year3_targets",
  //       accessorFn: (data) => formatNumberCurrency(data.year3_targets, "USD"),

  //       size: 140,
  //       cell: (cell) => (
  //         <EditableCell
  //           value={cell.getValue()}
  //           row={cell.row}
  //           column={cell.column}
  //           onEditCell={editCell}
  //         />
  //       ),
  //     },

  //     // {
  //     //   header: "Total Quantity (1-3 Years)",
  //     //   accessorKey: "total_quantity",
  //     //   size: 140,
  //     //   cell: (cell) => (
  //     //     <EditableCell
  //     //       value={cell.getValue()}
  //     //       row={cell.row}
  //     //       column={cell.column}
  //     //       onEditCell={editCell}
  //     //     />
  //     //   ),
  //     // },
  //   ],
  // },

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

  // onEditCell?: (id: number, fieldName: string, value: string) => void;
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
