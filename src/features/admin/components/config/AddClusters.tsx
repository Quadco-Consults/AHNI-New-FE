"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import FormTextArea from "@/components/FormTextArea";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { closeDialog, dialogSelector } from "@/store/ui";
import { toast } from "sonner";
import {
  useAddClusterMutation,
  useUpdateClusterMutation,
  ClusterData,
  ClusterFormValues,
} from "@/features/modules/controllers/config/clusterController";
import { useGetAllLocationsManager } from "@/features/modules/controllers/config/locationController";
import { z } from "zod";
import { useMemo } from "react";

const ClusterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});

const AddClusters = () => {
  const { dialogProps } = useAppSelector(dialogSelector);
  const result = dialogProps?.data as unknown as ClusterData;

  // Fetch all locations for dropdown
  const { data: locationsData } = useGetAllLocationsManager({
    page: 1,
    size: 1000,
  });

  const locationOptions = useMemo(() => {
    return locationsData?.data?.results?.map((location: any) => ({
      label: location.name,
      value: location.id,
    })) || [];
  }, [locationsData]);

  const form = useForm<ClusterFormValues>({
    resolver: zodResolver(ClusterSchema),
    defaultValues: {
      name: result?.name ?? "",
      code: result?.code ?? "",
      location: typeof result?.location === 'object'
        ? result.location.id
        : result?.location ?? "",
      description: result?.description ?? "",
      is_active: result?.is_active ?? true,
    },
  });

  const dispatch = useAppDispatch();
  const [addCluster, { isLoading }] = useAddClusterMutation();
  const [updateCluster, { isLoading: updateLoading }] =
    useUpdateClusterMutation();

  const onSubmit: SubmitHandler<ClusterFormValues> = async (data) => {
    try {
      if (dialogProps?.type === "update") {
        await updateCluster({
          id: String(dialogProps?.data?.id),
          body: data,
        });
        toast.success("Cluster Updated Successfully");
      } else {
        await addCluster(data);
        toast.success("Cluster Added Successfully");
      }

      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? error.message ?? "Something went wrong"
      );
    }
  };

  return (
    <CardContent className='w-100% flex flex-col gap-y-10 p-0'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='bg-white rounded-[2rem] flex flex-col gap-y-7 pb-[2rem]'
        >
          <FormInput
            label='Name'
            name='name'
            required
            placeholder='Enter Cluster Name (e.g., Cluster A, North Zone)'
          />

          <FormInput
            label='Code'
            name='code'
            placeholder='Enter Cluster Code (e.g., AN-C1, AN-C2)'
          />

          <FormSelect
            label='Location (State Office)'
            name='location'
            required
            options={locationOptions}
            placeholder='Select Location'
          />

          <FormTextArea
            name='description'
            label='Description'
            placeholder='Enter Description'
            rows={3}
          />

          <div className='flex justify-start gap-4'>
            <FormButton loading={isLoading || updateLoading}>
              Save
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddClusters;
