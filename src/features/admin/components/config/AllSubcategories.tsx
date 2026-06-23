import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dialogs";
import TableAction from "@/components/TableAction";
import { LoadingSpinner } from "@/components/Loading";
import {
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
} from "@/features/modules/controllers/config/categoryController";
import { useState, useMemo } from "react";
import Pagination from "@/components/Pagination";
import { TCategoryData } from "@/features/admin/types/config/category";
import { Search, Upload } from "lucide-react";
import BulkUploadDialog from "@/components/BulkUpload/BulkUploadDialog";

export default function AllSubcategories() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  const { data: category, isFetching, refetch } = useGetAllCategoriesQuery({
    page,
    size: 100, // Get more to show all subcategories
    search,
  });

  const dispatch = useAppDispatch();

  const [deleteCategory, { isLoading: isDeleteLoading }] =
    useDeleteCategoryMutation();

  // Filter only subcategories (categories with a parent)
  const subcategories = useMemo(() => {
    if (!category?.results) return [];
    return category.results.filter((cat) => cat.parent);
  }, [category]);

  // Helper to get parent category name
  const getParentName = (parentId: string | TCategoryData | null | undefined): string => {
    if (!parentId || !category?.results) return "N/A";

    const id = typeof parentId === 'string' ? parentId : parentId.id;
    const parent = category.results.find((cat) => cat.id === id);
    return parent?.name || "Unknown";
  };

  const onSubmit = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success("Subcategory Deleted Successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? error.message ?? "Something went wrong"
      );
    }
  };

  const onUpdate = (item: any) => {
    dispatch(
      openDialog({
        type: DialogType.AddSubcategories,
        dialogProps: {
          header: "Update Subcategory",
          data: item,
          type: "update",
        },
      })
    );
  };

  return (
    <div>
      <div className='flex items-center justify-between py-6 mb-6'>
        <div>
          <h1 className='text-error font-semibold text-sm'>Subcategories</h1>
          <p className='text-xs text-gray-500 mt-1'>
            Manage subcategories that are assigned to parent categories
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-stretch gap-2 border border-gray-300 rounded-md shadow-sm px-4 py-2 w-[350px]">
            <Search size={20} className="text-gray-500" />
            <input
              className="w-full text-sm outline-none rounded-none border-none text-md h-[20px]"
              placeholder="Search subcategories..."
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
                  type: DialogType.AddSubcategories,
                  dialogProps: {
                    header: "Add Subcategory",
                  },
                })
              )
            }
            variant='outline'
            className='gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-white text-yellow-darker border-[1px] border-gray-border'
            size='sm'
          >
            Click to add New Subcategory
          </Button>
        </div>
      </div>

      <BulkUploadDialog
        open={bulkUploadOpen}
        onClose={() => setBulkUploadOpen(false)}
        apiEndpoint="/config/category"
        title="Subcategories"
        onUploadComplete={() => {
          refetch();
          setBulkUploadOpen(false);
        }}
      />

      <div>
        <div className='flex justify-between text-gray-text font-semibold text-sm border-b border-gray-300 pb-4'>
          <h1 className='flex-[1.5]'>Subcategory Name</h1>
          <h1 className='flex-[1.5]'>Parent Category</h1>
          <h1 className='flex-[1.5]'>Description</h1>
          <h1 className='flex-1'>Job Category</h1>
          <h1 className='flex-[0.5]'></h1>
        </div>

        {isFetching || isDeleteLoading ? (
          <LoadingSpinner />
        ) : subcategories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">No subcategories found.</p>
            <p className="text-xs mt-2">Click "Add New Subcategory" to create one.</p>
          </div>
        ) : (
          <div>
            {subcategories.map((item) => {
              const parentName = getParentName(item.parent);

              return (
                <div
                  key={item.id}
                  className='flex justify-between mt-6 gap-5 text-gray-text font-normal text-xs items-center'
                >
                  <div className='flex-[1.5]'>
                    <p className='font-medium text-blue-700'>{item.name}</p>
                  </div>
                  <div className='flex-[1.5]'>
                    <p className='font-medium text-gray-700'>{parentName}</p>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full mt-1 inline-block">
                      Parent
                    </span>
                  </div>
                  <p className='flex-[1.5]'>{item.description ?? "N/A"}</p>
                  <p className='flex-1'>
                    <span className={`text-[10px] px-2 py-1 rounded ${
                      item.job_category === 'GOODS' ? 'bg-green-100 text-green-700' :
                      item.job_category === 'SERVICE' ? 'bg-purple-100 text-purple-700' :
                      item.job_category === 'WORK' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.job_category}
                    </span>
                  </p>
                  <div className='flex-[0.5]'>
                    <TableAction
                      update
                      removeView
                      action={() => onSubmit(item.id)}
                      updateAction={() => onUpdate(item)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {subcategories.length > 0 && (
          <div className="mt-6 text-sm text-gray-600 bg-blue-50 border border-blue-200 p-3 rounded-md">
            <strong>Total Subcategories:</strong> {subcategories.length}
          </div>
        )}
      </div>
    </div>
  );
}
