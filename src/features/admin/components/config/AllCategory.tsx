import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "components/TableAction";
import { LoadingSpinner } from "components/Loading";
import {
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
} from "@/features/modules/controllers/config/categoryController";
import { useState, useMemo } from "react";
import Pagination from "components/Pagination";
import { TCategoryData } from "@/features/admin/types/config/category";

export default function AllCategory() {
  const [page, setPage] = useState(1);

  const { data: category, isFetching } = useGetAllCategoriesQuery({
    page,
    size: 20,
  });

  const dispatch = useAppDispatch();

  const [deleteCategory, { isLoading: isDeleteLoading }] =
    useDeleteCategoryMutation();

  // Filter only parent categories (categories without a parent)
  const parentCategories = useMemo(() => {
    if (!category?.data?.results) return [];
    return category.data.results.filter((cat) => !cat.parent);
  }, [category]);

  const onSubmit = async (id: string) => {
    try {
      await deleteCategory(id);
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
        type: DialogType.AddCategories,
        dialogProps: {
          header: "Update Category",
          data: item,
          type: "update",
        },
      })
    );
  };
  return (
    <div>
      <div className='flex items-center justify-between py-6 mb-6'>
        <h1 className='text-[#D92D20] font-semibold text-sm'>Categories</h1>

        <Button
          onClick={() =>
            dispatch(
              openDialog({
                type: DialogType.AddCategories,
                dialogProps: {
                  header: "Add Category",
                },
              })
            )
          }
          variant='outline'
          className='gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-[#FFFFFF] text-[#DEA004] border-[1px] border-[#C7CBD5]'
          size='sm'
        >
          Click to add New
        </Button>
      </div>
      <div>
        <div className='flex justify-between text-[#756D6D] font-semibold text-sm border-b border-gray-300 pb-4'>
          <h1 className='flex-[1.5]'>Category Name</h1>
          <h1 className='flex-1'>Description</h1>
          <h1 className='flex-[0.7]'>Code</h1>
          <h1 className='flex-[0.7]'>Serial #</h1>
          <h1 className='flex-[0.8]'>Job Category</h1>
          <h1 className='flex-[0.5]'></h1>
        </div>

        {isFetching || isDeleteLoading ? (
          <LoadingSpinner />
        ) : parentCategories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">No categories found.</p>
            <p className="text-xs mt-2">Click "Click to add New" to create a category.</p>
          </div>
        ) : (
          <div>
            {parentCategories.map((item) => {
              return (
                <div
                  key={item.id}
                  className='flex justify-between mt-6 gap-5 text-[#756D6D] font-normal text-xs items-center'
                >
                  <div className='flex-[1.5]'>
                    <p className='font-semibold text-gray-800'>{item.name}</p>
                  </div>
                  <p className='flex-1'>{item.description ?? "N/A"}</p>
                  <p className='flex-[0.7]'>{item.code}</p>
                  <p className='flex-[0.7]'>{item.serial_number}</p>
                  <p className='flex-[0.8]'>
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

        <Pagination
          total={category?.data.pagination.count ?? 0}
          itemsPerPage={category?.data.pagination.page_size ?? 0}
          onChange={(page: number) => setPage(page)}
        />
      </div>
    </div>
  );
}
