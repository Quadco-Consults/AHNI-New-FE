"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/Card";
import GoBack from "components/GoBack";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import {
  ItemRequisitionSchema,
  TItemRequisitionFormValues,
} from "features/admin/types/inventory-management/item-requisition";
import { Minus } from "lucide-react";
import { useEffect, useMemo } from "react";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useGetAllConsumablesQuery } from "@/features/admin/controllers/consumableController";
import {
  useCreateItemRequisitionMutation,
  useEditItemRequisitionMutation,
  useGetSingleItemRequisitionQuery,
} from "@/features/admin/controllers/itemRequisitionController";
import { useGetAllDepartmentsQuery } from "@/features/modules/controllers/config/departmentController";
import { useGetAllUsersQuery } from "@/features/auth/controllers/userController";
import { toast } from "sonner";
import { useGetAllItemsQuery } from "@/features/modules/controllers/config/itemController";

export default function CreateItemRequisition() {
  const { data: items } = useGetAllItemsQuery({
    page: 1,
    size: 2000000,
    category: "fadb6228-23de-4b04-9eac-b75940cf622f",
  });

  const { data: user } = useGetAllUsersQuery({
    page: 1,
    size: 2000000,
  });

  const { data: department } = useGetAllDepartmentsQuery({
    page: 1,
    size: 2000000,
  });

  const userOptions = useMemo(
    () =>
      user?.data.results.map(({ first_name, last_name, id }) => ({
        label: `${first_name} ${last_name}`,
        value: id,
      })),
    [user]
  );

  const { createItemRequisition, isLoading: isCreateLoading } =
    useCreateItemRequisitionMutation();

  const consumableOptions = useMemo(
    () =>
      items?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [items]
  );

  const departmentOptions = useMemo(
    () =>
      department?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [department]
  );

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: itemRequisition } = useGetSingleItemRequisitionQuery(
    id || "",
    !!id
  );

  const { editItemRequisition, isLoading: isEditLoading } =
    useEditItemRequisitionMutation(id || "");

  const router = useRouter();

  const form = useForm<TItemRequisitionFormValues>({
    resolver: zodResolver(ItemRequisitionSchema),
    defaultValues: {
      department: "",
      consummables: [{ consummable: "", quantity: "0" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "consummables",
  });

  const onSubmit: SubmitHandler<TItemRequisitionFormValues> = async ({
    consummables,
    ...rest
  }) => {
    try {
      const payload = {
        consummables,
        ...rest,
      };

      console.log({ payload, rest, consummables });

      if (id) {
        await editItemRequisition(payload);
        toast.success("Item Requisition Updated");
      } else {
        await createItemRequisition(payload);
        toast.success("Item Requisition Created");
      }

      router.push(AdminRoutes.ITEM_REQUISITION);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  useEffect(() => {
    if (itemRequisition) {
      console.log({ itemRequisition });

      form.reset({
        department: itemRequisition?.data.department.id,
        consummables: itemRequisition?.data.consummables.map(
          ({ quantity, consummable }) => ({
            consummable: consummable?.id,
            quantity: String(quantity),
          })
        ),
      });
    }
  }, [itemRequisition]);

  return (
    <div className='space-y-8'>
      <div className='flex items-center gap-x-5'>
        <GoBack />
        <h4 className='text-xl font-bold'>Item Requisition</h4>
      </div>
      <Card>
        <FormProvider {...form}>
          <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className='grid grid-cols-3 items-center gap-5'
              >
                <FormSelect
                  label='Item Requested'
                  name={`consummables.${index}.consummable`}
                  placeholder='Select Item'
                  options={consumableOptions}
                  required
                />

                <FormInput
                  label='Quantity Requested'
                  name={`consummables.${index}.quantity`}
                  placeholder='Enter Quantity'
                  required
                />

                <Button
                  type='button'
                  variant='link'
                  onClick={() => {
                    remove(index);
                  }}
                >
                  <Minus />
                </Button>
              </div>
            ))}

            <Button
              type='button'
              onClick={() => {
                append({ consummable: "", quantity: "0" });
              }}
            >
              <AddSquareIcon />
              Add Item
            </Button>
            <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
              <FormSelect
                label='Department/Unit'
                name='department'
                placeholder='Select Department'
                options={departmentOptions}
                required
              />

              <FormSelect
                label='Reviewer'
                name='reviewer'
                required
                placeholder='Select Reviewer'
                options={userOptions}
              />

              <FormSelect
                label='Authorizer'
                name='authorizer'
                required
                placeholder='Select Authorizer'
                options={userOptions}
              />

              <FormSelect
                label='Approver'
                name='approver'
                required
                placeholder='Select Approver'
                options={userOptions}
              />
            </div>
            <div className='flex justify-end'>
              <FormButton
                type='submit'
                loading={isCreateLoading || isEditLoading}
              >
                {id ? "Update Item Requisition" : "Create Item Requisition"}
              </FormButton>
            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
