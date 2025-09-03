"use client";

import DescriptionCard from "components/DescriptionCard";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { useSearchParams } from "next/navigation";
import { LoadingSpinner } from "components/Loading";
import { 
  useGetSingleAssetRequestQuery,
  useReviewAssetRequestMutation,
  useAuthorizeAssetRequestMutation,
  useApproveAssetRequestMutation 
} from "@/features/admin/controllers/assetRequestController";
import { FormProvider, useForm } from "react-hook-form";
import FormTextArea from "components/atoms/FormTextArea";
import FormButton from "@/components/FormButton";
import { useGetSingleItem } from "@/features/modules/controllers";
import { toast } from "sonner";

export default function ManagementApproval() {
  const form = useForm<{ comment: string }>();

  const searchParams = useSearchParams();
  const id = searchParams!.get("id");

  const { data: assetRequest, isLoading: isAssetRequestLoading, refetch } =
    useGetSingleAssetRequestQuery(id || "", !!id);

  const { data: asset, isLoading: isAssetLoading } = useGetSingleItem(
    assetRequest?.data.asset.id || "",
    !!assetRequest?.data.asset.id
  );

  const { reviewAssetRequest, isLoading: isReviewLoading } = useReviewAssetRequestMutation(id || "");
  const { authorizeAssetRequest, isLoading: isAuthorizeLoading } = useAuthorizeAssetRequestMutation(id || "");
  const { approveAssetRequest, isLoading: isApproveLoading } = useApproveAssetRequestMutation(id || "");

  const handleApprovalAction = async (action: 'review' | 'authorize' | 'approve') => {
    const comment = form.getValues('comment');
    
    if (!comment?.trim()) {
      toast.error('Comment is required for approval actions');
      return;
    }

    try {
      switch (action) {
        case 'review':
          await reviewAssetRequest(comment);
          toast.success('Asset request reviewed successfully');
          break;
        case 'authorize':
          await authorizeAssetRequest(comment);
          toast.success('Asset request authorized successfully');
          break;
        case 'approve':
          await approveAssetRequest(comment);
          toast.success('Asset request approved successfully');
          break;
      }
      
      form.reset();
      await refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to process approval action');
    }
  };

  const getNextAction = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'review';
      case 'REVIEWED':
        return 'authorize';
      case 'AUTHORIZED':
        return 'approve';
      default:
        return null;
    }
  };

  const getActionLabel = (action: string | null) => {
    switch (action) {
      case 'review':
        return 'Review';
      case 'authorize':
        return 'Authorize';
      case 'approve':
        return 'Approve';
      default:
        return 'Completed';
    }
  };

  const nextAction = getNextAction(assetRequest?.data?.status || '');
  const isLoading = isReviewLoading || isAuthorizeLoading || isApproveLoading;

  return (
    <Card>
      <CardHeader className='font-bold'>
        Asset Details
        <Separator className='mt-4' />
      </CardHeader>

      {isAssetRequestLoading || isAssetLoading ? (
        <LoadingSpinner />
      ) : (
        asset && (
          <CardContent className='flex flex-col gap-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-5'>
              <DescriptionCard
                label='Asset'
                description={asset?.data.name}
                className='px-5 py-3 border rounded-md'
              />

              <DescriptionCard
                label='Asset Code'
                description={asset?.data.asset_code}
                className='px-5 py-3 border rounded-md'
              />

              <DescriptionCard
                label='Manufacturer'
                description={asset?.data?.asset_type?.manufacturer || "N/A"}
                className='px-5 py-3 border rounded-md'
              />

              <DescriptionCard
                label='Model'
                description={asset?.data.model || "N/A"}
                className='px-5 py-3 border rounded-md'
              />

              <DescriptionCard
                label='Serial Number'
                description={asset?.data.serial_number || "N/A"}
                className='px-5 py-3 border rounded-md'
              />
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <DescriptionCard
                label='Acquisition Date'
                description={asset?.data.acquisition_date}
              />

              <DescriptionCard
                label='Location'
                description={asset?.data.location?.name}
              />

              <DescriptionCard
                label='Implementer'
                description={`${asset?.data.implementer?.first_name || "N/A"} ${
                  asset?.data.implementer?.last_name || "N/A"
                }`}
              />

              <DescriptionCard
                label='Assignee'
                description={`${asset?.data.assignee?.full_name || "N/A"}`}
              />

              <DescriptionCard
                label='Life of Project'
                description={`${asset?.data.estimated_life_span || "N/A"}`}
              />

              <DescriptionCard
                label='USD Cost'
                description={`$${asset?.data.usd_cost || 0}`}
              />

              <DescriptionCard
                label='NGN Cost'
                description={`₦${asset?.data.ngn_cost || 0}`}
              />

              <DescriptionCard
                label='Unit'
                description={`${asset?.data.unit || 0}`}
              />
            </div>

            <div className='space-y-4'>
              <div className='p-4 bg-gray-50 rounded-lg'>
                <p className='text-sm font-medium text-gray-700'>
                  Current Status: <span className='text-blue-600'>{assetRequest?.data?.status || 'PENDING'}</span>
                </p>
                {nextAction && (
                  <p className='text-sm text-gray-600 mt-1'>
                    Next Action: {getActionLabel(nextAction)}
                  </p>
                )}
              </div>

              {nextAction ? (
                <FormProvider {...form}>
                  <form className='space-y-5' onSubmit={(e) => {
                    e.preventDefault();
                    handleApprovalAction(nextAction as 'review' | 'authorize' | 'approve');
                  }}>
                    <FormTextArea
                      label='Comment'
                      name='comment'
                      placeholder={`Enter comment for ${getActionLabel(nextAction).toLowerCase()}...`}
                      required
                    />

                    <FormButton 
                      size='lg' 
                      type='submit' 
                      className='bg-green-500'
                      loading={isLoading}
                    >
                      {getActionLabel(nextAction)}
                    </FormButton>
                  </form>
                </FormProvider>
              ) : (
                <div className='p-4 bg-green-50 rounded-lg text-center'>
                  <p className='text-green-700 font-medium'>
                    This asset request has been fully processed.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        )
      )}
    </Card>
  );
}
