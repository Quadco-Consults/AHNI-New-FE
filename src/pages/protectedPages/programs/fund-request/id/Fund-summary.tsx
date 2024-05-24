import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import useTable from "hooks/useTables";
import Table from "lib/react-table/Table";
import { openDialog } from "store/ui";

const FundSummary = () => {
  const tableInstance = useTable({
    columns,
    data,
    //  state: { pagination },
    //  pageCount: customersQueryResult?.data?.number_of_pages,
    //  manualPagination: true,
    //  onPaginationChange: setPagination,
  });

  return (
    <Card>
      <Table
        instance={tableInstance}
        // loading={customersQueryResult.isFetching}
        // error={customersQueryResult.isError}
        // onReload={customersQueryResult.refetch}
      />

      <div className="flex justify-end my-10">
        <h4 className="font-semibold">General Comment/Recommendation</h4>
      </div>
    </Card>
  );
};

export default FundSummary;

const data = Array(7).fill({
  description: "ACE Project Head Office Adamawa ",
  fund: "₦2,000,000",
  code: "1111.0004-01",
});

const columns = [
  {
    header: "S/N",
    id: "id",
    size: 50,
    cell: ({ row, table }: any) =>
      (table
        .getSortedRowModel()
        ?.flatRows?.findIndex((flatRow: any) => flatRow.id === row.id) || 0) +
      1,
  },
  {
    header: "Description of Activity",
    accessorKey: "description",
    size: 350,
    footer: "GRAND TOTAL",
  },
  {
    header: "Fund Request for this period",
    accessorKey: "fund",
    size: 300,
    id: "₦12,000,000",
    footer: (info: any) => info.column.id,
  },
  {
    header: "Unique Identifier Code	",
    accessorKey: "code",
    size: 250,
    id: "1111.0004-01",
    footer: (info: any) => info.column.id,
  },
  {
    header: "",
    id: "actions",
    cell: ({ row }: any) => <ActionListAction data={row.original} />,
  },
];

const ActionListAction = ({ data }: any) => {
  const dispatch = useAppDispatch();
  console.log(data);
  return (
    <Button
      className="flex gap-2 py-6"
      variant="ghost"
      type="button"
      onClick={() => {
        dispatch(
          openDialog({
            type: DialogType.FundRequestModal,
            dialogProps: {
              width: "max-w-2xl",
            },
          })
        );
      }}
    >
      View
    </Button>
  );
};
