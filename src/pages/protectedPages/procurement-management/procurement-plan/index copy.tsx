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
import { Column, ColumnDef, Row } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import BreadcrumbCard from "components/shared/Breadcrumb";
import ProcurementPlanAPI from "services/procurementApi/procurement-plan";
import { ProcurementPlanResultsData } from "definations/procurement-types/procurementPlan";
import UploadIcon from "components/icons/UploadIcon";
import { useAppDispatch } from "hooks/useStore";
import { DialogType } from "constants/dailogs";
import { useState } from "react";
import { Textarea } from "components/ui/textarea";
import ProcurementPlanUploadModal from "./components/ProcurementPlanUploadModal";
import { MdDownload } from "react-icons/md";
import * as XLSX from "xlsx";

export default function ProcurementPlan() {
  const dispatch = useAppDispatch();

  const { data, isLoading } = ProcurementPlanAPI.useGetProcurementPlansQuery(
    {}
  );

  const [isModalOpen, setModalOpen] = useState(false);

  const [dataSource, setDataSource] = useState<ProcurementPlanTableType[]>();

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
    const data = [
      { Name: "Alice", Age: 25, City: "New York" },
      { Name: "Bob", Age: 30, City: "Los Angeles" },
      { Name: "Charlie", Age: 35, City: "Chicago" },
    ];

    if (dataSource) {
      // Convert the data to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(dataSource);

      // Apply styles to the header row
      const headerRow = (worksheet["A1"].s = {
        font: {
          bold: true,
          sz: 14,
          color: { rgb: "FFFFFF" },
        },
        fill: {
          fgColor: { rgb: "4F81BD" },
        },
        alignment: {
          horizontal: "center",
        },
      });

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
              <Link
                className='w-full'
                to={generatePath(RouteEnum.CREATE_PROCUREMENT)}
              >
                <Button
                  className='w-full flex items-center gap-2 justify-start'
                  variant='ghost'
                >
                  <AddSquareIcon fillColor='#FF0000' /> Create from scratch
                </Button>
              </Link>
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
        <div className='flex items-center justify-start gap-2'>
          <div className='flex items-center w-1/3 px-2 py-2 border rounded-lg'>
            <SearchIcon />
            <input
              placeholder='Search'
              type='text'
              className='ml-2 h-full w-full border-none bg-none focus:outline-none outline-none'
            />
          </div>
          <Button className='shadow-sm' variant='ghost'>
            <FilterIcon />
          </Button>
        </div>

        <DataTable
          data={dataSource || []}
          columns={tableColumns(editCell)}
          isLoading={isLoading}
        />

        <ProcurementPlanUploadModal
          isOpen={isModalOpen}
          onCancel={() => setModalOpen(false)}
          onOk={(data: any) => formatRawData(data)}
        />
      </Card>
    </section>
  );
}

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

const tableColumns = (
  editCell: (id: number, fieldName: string, value: string) => void
): ColumnDef<ProcurementPlanTableType>[] => [
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
    header: "Budget Line",
    accessorKey: "budgetLine",
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
    accessorKey: "owner",
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
    header: "Work Plan Activity Reference",
    accessorKey: "activityReference",
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
    header: "Description of Procurement Activities",
    accessorKey: "description",
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
    header: "Year 1 (2021) USD",
    accessorKey: "yearOne",
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
    header: "Year 2 (2021) USD",
    accessorKey: "yearTwo",
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
    header: "Year 3 (2021) USD",
    accessorKey: "yearThree",
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
    header: "Approved Budget Amount - USD",
    accessorKey: "approvedBudget",
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
    accessorKey: "nonPpm",
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
    header: "Year 1 Targets",
    accessorKey: "yearOneTargets",
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
    header: "Year 2 Targets",
    accessorKey: "yearTwoTargets",
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
    header: "Year 3 Targets",
    accessorKey: "yearThreeTargets",
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
    header: "Total Quantity (1-3 Years)",
    accessorKey: "totalQuantity",
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
    header: "Responsible PR Staff",
    accessorKey: "responsibleStaff",
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
    header: "Mode of Procurement",
    accessorKey: "modeOfProcurement",
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
    header: "Procurement Committee Review",
    accessorKey: "procurementReview",
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
    header: "PROCUREMENT PROCESS",
    accessorKey: "procumentProcess",
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
    header: "Start Date (at least week of the month)",
    accessorKey: "startDate",
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
    header: "Procurement Milestones",
    columns: [
      {
        header: "",
        accessorKey: "procurementMilestoneOne",
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
        header: "",
        accessorKey: "procurementMilestoneTwo",
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
        header: "",
        accessorKey: "procurementMilestoneThree",
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
        header: "",
        accessorKey: "procurementMilestoneFour",
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
        header: "",
        accessorKey: "procurementMilestoneFive",
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
    header: "Selected Supplier",
    accessorKey: "selectedSupplier",
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
    header: "Expected Delivery Date 1",
    accessorKey: "expectedDeliveryDateOne",
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
    header: "Expected Delivery Date 2",
    accessorKey: "expectedDeliveryDateTwo",
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
    header:
      "DELIVERY TO (Central warehouse, State warehouse, treatment site, SR)",
    accessorKey: "deliveryTo",
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
    header: "Donor Remarks",
    accessorKey: "donorRemarks",
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
    header: "Implementer Remarks",
    accessorKey: "implementerRemarks",
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
];

type PropsType = {
  value: string | number | unknown;
  row?: Row<ProcurementPlanTableType>;
  column?: Column<ProcurementPlanTableType>;
  onEditCell?: (id: number, fieldName: string, value: string) => void;
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

/* {
    header: "",
    size: 80,
    id: "actions",
    cell: ({ row }) => <ActionListAction data={row.original} />,
  }, */
const ActionListAction = ({ data }: any) => {
  return (
    <div className='flex items-center gap-2'>
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='ghost' className='flex gap-2 py-6'>
              <MoreOptionsHorizontalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className=' w-fit'>
            <div className='flex flex-col items-start justify-between gap-1'>
              <Link
                className='w-full'
                to={generatePath(RouteEnum.PROCUREMENT_DETAILS, {
                  id: data?.id,
                })}
              >
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                >
                  <EyeIcon />
                  View
                </Button>
              </Link>
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
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
