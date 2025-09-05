"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import FormTextArea from "components/atoms/FormTextArea";
import Card from "components/Card";
import GoBack from "components/GoBack";
import { Form } from "components/ui/form";
import { AdminRoutes } from "constants/RouterConstants";
import {
  AssetRequestSchema,
  TAssetRequestFormValues,
} from "features/admin/types/inventory-management/asset-request";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  useCreateAssetRequestMutation,
  useEditAssetRequestMutation,
  useGetSingleAssetRequestQuery,
} from "@/features/admin/controllers/assetRequestController";
import { useGetAllUsersQuery } from "@/features/auth/controllers/userController";
import { toast } from "sonner";
import AssetRequestLayout from "./Layout";
import { useGetAllLocationsQuery } from "@/features/modules/controllers/config/locationController";
import { useGetAllItemsQuery } from "@/features/modules/controllers";

export default function CreateAssetRequestDetails() {
  const { data: asset } = useGetAllItemsQuery({
    page: 1,
    size: 20000000,
    search: "",
    category: "17ca9ee7-603a-43a9-91e8-979652a8231c",
  });

  const { data: user } = useGetAllUsersQuery({
    page: 1,
    size: 2000000,
  });

  const assetOptions = useMemo(
    () =>
      // @ts-ignore
      asset?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [asset]
  );

  const userOptions = useMemo(
    () =>
      // @ts-ignore
      user?.data.results.map(({ first_name, last_name, id }) => ({
        label: `${first_name} ${last_name}`,
        value: id,
      })),
    [user]
  );

  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<TAssetRequestFormValues>({
    resolver: zodResolver(AssetRequestSchema),
    defaultValues: {
      asset: "",
      reviewer: "",
      authorizer: "",
      approver: "",
      type: "",
      recommendation: "",
      description: "",
    },
  });

  const searchParams = useSearchParams();
  // @ts-ignore
  const id = searchParams.get("id");

  const { data: assetRequest } = useGetSingleAssetRequestQuery(id || "", !!id);

  const { data: location } = useGetAllLocationsQuery({
    page: 1,
    size: 2000000,
  });

  const locationOptions = useMemo(
    () =>
      // @ts-ignore
      location?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [location]
  );

  const { editAssetRequest, isLoading: isEditLoading } =
    useEditAssetRequestMutation(id!);

  const { createAssetRequest, isLoading: isCreateLoading } =
    useCreateAssetRequestMutation();

  const onSubmit: SubmitHandler<TAssetRequestFormValues> = async (data) => {
    let newAssetRequestId;

    try {
      if (id) {
        await editAssetRequest(data);
        toast.success("Asset Request Updated");
      } else {
        let response = await createAssetRequest(data);

        // @ts-ignore
        newAssetRequestId = response.data.id;
        toast.success("Asset Request Created");
      }

      // Always redirect to uploads page after creating/updating asset request
      let path = pathname;
      // @ts-ignore
      path = path.substring(0, path.lastIndexOf("/"));

      path += `/create/uploads?id=${id ?? newAssetRequestId}`;

      router.push(path);
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? error.message ?? "Something went wrong");
    }
  };

  useEffect(() => {
    if (assetRequest) {
      form.reset({
        asset: assetRequest?.data.asset.id,
        type: assetRequest?.data.type,
        recommendation: assetRequest?.data.recommendation,
        description: assetRequest?.data.description,
        disposal_justification: assetRequest?.data.disposal_justification,
        from_location: assetRequest?.data.from_location?.id || "",
        to_location: assetRequest?.data.to_location?.id || "",
      });
    }
  }, [assetRequest, form]);

  const requestType = form.watch("type");

  return (
    <AssetRequestLayout>
      <div className='space-y-6'>
        <div className='flex items-center gap-x-5'>
          <GoBack />
          <h4 className='text-xl font-bold'>Asset Request</h4>
        </div>
        <Card>
          <Form {...form}>
            <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid grid-cols-2 gap-10'>
                <FormSelect
                  label='Asset'
                  name='asset'
                  required
                  placeholder='Select Asset'
                  options={assetOptions}
                />

                <FormSelect
                  label='Request Type'
                  name='type'
                  placeholder='Select Request Type'
                  required
                  options={[
                    {
                      label: "Movement",
                      value: "MOVEMENT",
                    },
                    {
                      label: "Disposal",
                      value: "DISPOSAL",
                    },
                  ]}
                />
              </div>

              {requestType === "MOVEMENT" && (
                <div className='grid grid-cols-2 gap-10'>
                  <FormSelect
                    label='From'
                    name='from_location'
                    id='from_location'
                    placeholder='Select Location'
                    required
                    options={locationOptions}
                  />

                  <FormSelect
                    label='To'
                    name='to_location'
                    id='to_location'
                    placeholder='Select Location'
                    required
                    options={locationOptions}
                  />
                </div>
              )}

              <FormInput
                label='Recommendation'
                name='recommendation'
                placeholder='Enter Recommendation'
                required
              />

              <FormTextArea
                label='Description'
                name='description'
                placeholder='Enter Description'
                required
              />

              <div className='grid grid-cols-2 gap-10'>
                <FormInput
                  label='Justification'
                  name='disposal_justification'
                  placeholder='Enter Justification'
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
                  size='lg'
                  loading={isCreateLoading || isEditLoading}
                >
                  Submit
                </FormButton>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </AssetRequestLayout>
  );
}
