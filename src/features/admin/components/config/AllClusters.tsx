import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dialogs";
import TableAction from "@/components/TableAction";
import { LoadingSpinner } from "@/components/Loading";
import { useState } from "react";
import {
  useDeleteClusterMutation,
  useGetAllClustersQuery,
} from "@/features/modules/controllers/config/clusterController";
import Pagination from "@/components/Pagination";
import { Search, Upload } from "lucide-react";
import BulkUploadDialog from "@/components/BulkUpload/BulkUploadDialog";

export default function AllClusters() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  const { data: cluster, isFetching, refetch } = useGetAllClustersQuery({
    page,
    size: 20,
    search,
  });

  const dispatch = useAppDispatch();

  const [deleteCluster, { isLoading: isDeleteLoading }] =
    useDeleteClusterMutation();

  const onSubmit = async (id: string) => {
    try {
      await deleteCluster(id);
      toast.success("Deleted Successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? error.message ?? "Something went wrong"
      );
    }
  };

  const onUpdate = (item: any) => {
    dispatch(
      openDialog({
        type: DialogType.AddClusters,
        dialogProps: {
          header: "Update Cluster",
          data: item,
          type: "update",
        },
      })
    );
  };

  return (
    <div>
      <div className='flex justify-between items-center py-6 mb-6'>
        <h1 className='text-error font-semibold text-sm'>Clusters</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-stretch gap-2 border border-gray-300 rounded-md shadow-sm px-4 py-2 w-[350px]">
            <Search size={20} className="text-gray-500" />
            <input
              className="w-full text-sm outline-none rounded-none border-none text-md h-[20px]"
              placeholder="Search clusters..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button
            onClick={() => setBulkUploadOpen(true)}
            variant='outline'
            className='gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-white text-success border-[1px] border-gray-border'
            size='sm'
          >
            <Upload size={16} />
            Bulk Upload
          </Button>
          <Button
            onClick={() =>
              dispatch(
                openDialog({
                  type: DialogType.AddClusters,
                  dialogProps: {
                    header: "Add Cluster",
                  },
                })
              )
            }
            variant='outline'
            className='gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-white text-yellow-darker border-[1px] border-gray-border'
            size='sm'
          >
            Click to add New
          </Button>
        </div>
      </div>

      <BulkUploadDialog
        open={bulkUploadOpen}
        onClose={() => setBulkUploadOpen(false)}
        apiEndpoint="/config/clusters"
        title="Clusters"
        onUploadComplete={() => {
          refetch();
          setBulkUploadOpen(false);
        }}
      />
      <div>
        <div className='flex text-gray-text font-semibold text-sm border-b border-gray-300 pb-4'>
          <h1 className='flex-1'>Name</h1>
          <h1 className='flex-1'>Code</h1>
          <h1 className='flex-1'>Location</h1>
          <h1 className='flex-1'>Description</h1>
          <h1 className='flex-1'>Status</h1>
          <h1 className='flex-1'></h1>
        </div>

        {isFetching || isDeleteLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            {cluster?.data?.results?.map((item) => (
              <div
                key={item.id}
                className='flex justify-between mt-6 text-gray-text font-normal text-xs'
              >
                <p className='flex-1'>{item.name}</p>
                <p className='flex-1 font-mono text-blue-600'>{item.code || 'N/A'}</p>
                <p className='flex-1'>
                  {typeof item.location === 'object' && item.location !== null
                    ? item.location.name
                    : item.location_name || 'N/A'}
                </p>
                <p className='flex-1'>{item.description || 'N/A'}</p>
                <p className='flex-1'>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded ${
                      item.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
                </p>
                <div className='flex-1'>
                  <TableAction
                    update
                    removeView
                    action={() => onSubmit(item.id)}
                    updateAction={() => onUpdate(item)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination
          total={cluster?.data.pagination.count ?? 0}
          itemsPerPage={cluster?.data.pagination.page_size ?? 0}
          onChange={(page: number) => setPage(page)}
        />
      </div>
    </div>
  );
}
