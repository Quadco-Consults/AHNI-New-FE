import { Link, generatePath } from "react-router-dom";
import Card from "components/shared/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { RouteEnum } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import PurchaseRequestAPI from "services/procurementApi/purchase-request";
import { PurchaseRequestResultsData } from "definations/procurement-types/purchase-request";
import { toast } from "sonner";
import BreadcrumbCard from "components/shared/Breadcrumb";

function PurchaseRequest() {
  const { data, isLoading } = PurchaseRequestAPI.useGetPurchaseRequestsQuery(
    {}
  );

  const columns: ColumnDef<PurchaseRequestResultsData>[] = [
    {
      header: "Purchase Request Number",
      accessorKey: "ref_number",
      size: 250,
    },
    {
      header: "Requesting dept",
      accessorKey: "requesting_department",
      size: 250,
      cell: ({ row }) => (
        <div className=''>
          <p>{row.original.requesting_department_detail.name}</p>
        </div>
      ),
    },
    {
      header: "Date of Request",
      accessorKey: "date_of_request",
      size: 150,
    },
    {
      header: "Required Date",
      accessorKey: "date_required",
      size: 150,
    },
    {
      header: "Deliver to",
      accessorKey: "deliver_to",
      size: 250,
      cell: ({ row }) => (
        <div className=''>
          <p>{row.original.deliver_to_detail.name}</p>
        </div>
      ),
    },
    {
      header: "Total Amount",
      accessorKey: "total_cost",
      size: 150,
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => <ActionListAction data={row.original} />,
    },
  ];

  const ActionListAction = ({ data }: any) => {
    const [deletePurchaseRequestMutation] =
      PurchaseRequestAPI.useDeletePurchaseRequestMutation();

    const deletePurchaseRequestHandler = async () => {
      try {
        await deletePurchaseRequestMutation({ path: { id: data?.id } }).unwrap;
        toast.success("Document successfully deleted.");
      } catch (error) {
        toast.error("Something went wrong");
        console.log(error);
      }
    };

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
                  // to={generatePath(RouteEnum.PURCHASE_REQUEST_DETAILS, {
                  //   id: data?.id,
                  // })}
                  to={{
                    pathname: RouteEnum.PREVIEW_LETTER,
                    search: `?id=${data?.request_memo}&request=${data?.id}`,
                  }}
                >
                  <Button
                    className='flex w-full items-center justify-start gap-2'
                    variant='ghost'
                  >
                    <EyeIcon />
                    View
                  </Button>
                </Link>
                <Button
                  className='flex w-full items-center justify-start gap-2'
                  variant='ghost'
                  onClick={deletePurchaseRequestHandler}
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

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Purchase Request", icon: false },
  ];

  return (
    <section className='min-h-screen space-y-8'>
      <BreadcrumbCard list={breadcrumbs} />
      <div className='flex w-full items-center justify-end gap-4'>
        <Link className='w-fit' to={generatePath(RouteEnum.CREATE_SAMPLE_MEMO)}>
          <Button className='flex gap-2 py-6'>
            <AddSquareIcon />
            Activity Memo
          </Button>
        </Link>
      </div>
      <Card className='space-y-5'>
        <div className='flex items-center justify-start gap-2'>
          <span className='flex w-1/3 items-center rounded-lg border px-2 py-2'>
            <SearchIcon />
            <input
              placeholder='Search'
              type='text'
              className='ml-2 h-6 border-none bg-none outline-none focus:outline-none'
            />
          </span>
          <Button className='shadow-sm' variant='ghost'>
            <FilterIcon />
          </Button>
        </div>
        <DataTable
          // @ts-ignore
          data={data?.data?.results || []}
          columns={columns}
          isLoading={isLoading}
        />
      </Card>
    </section>
  );
}

export default PurchaseRequest;
