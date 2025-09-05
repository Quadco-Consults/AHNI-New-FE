"use client";

import FormButton from "@/components/FormButton";

import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";
import FormSelect from "components/atoms/FormSelect";

import VendorsAPI from "@/features/procurement/controllers/vendorsController";

const AddCBAVendor = () => {
  // const { data: categories } = useGetAllCategories({
  //   page: 1,
  //   size: 2000000,
  // });
  const { data: vendors } = VendorsAPI.useGetVendors({
    // @ts-ignore
    params: { status: "Approved" },
  });

  const vendorOptions = vendors?.data?.results?.map((cat) => ({
    label: cat.company_name,
    value: cat.id,
  }));

  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as any;
  const form = useForm({
    defaultValues: {
      vendor: data?.vendor ?? "",
    },
  });

  // const { items, isLoading } = useAddItem();
  // const { updateItems, isLoading: updateItemsLoading } =
  //   useUpdateItem();

  const dispatch = useAppDispatch();
  const onSubmit = async (data: { vendor: string }) => {
    console.log({ data });

    try {
      // if (dialogProps?.type === "update") {
      //   await updateItems({
      //     //@ts-ignore
      //     id: String(dialogProps?.data?.id),
      //     body: data,
      //   })();
      // } else {
      //   await items(data)();
      // }

      toast.success("Item Added Succesfully");
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? error.message ?? "Something went wrong");
    }
  };
  return (
    <CardContent>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-y-7'
        >
          <FormSelect
            label='Vendor'
            name='vendor'
            required
            placeholder='Select Vendor'
            options={vendorOptions}
          />

          <div className='flex justify-start gap-4'>
            <FormButton>Add</FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddCBAVendor;
