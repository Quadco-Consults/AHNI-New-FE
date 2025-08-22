import DescriptionCard from "components/DescriptionCard";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { useSearchParams } 
import { useGetSingleAssetQuery } from "@/features/admin/controllers/assetController";
import { LoadingSpinner } from "components/Loading";
import { useGetSingleAssetRequestQuery } from "@/features/admin/controllers/assetRequestController";
import { FormProvider, useForm } from "react-hook-form";
import FormTextArea from "components/atoms/FormTextArea";
import FormButton from "components/atoms/FormButton";

export default function ManagementApproval() {
    const form = useForm();

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const { data: assetRequest, isLoading: isAssetRequestLoading } =
        useGetSingleAssetRequestQuery(id || "", !!id);

    const { data: asset, isLoading: isAssetLoading } = useGetSingleAssetQuery(
        assetRequest?.data.asset.id || "", !!assetRequest?.data.asset.id
    );

    return (
        <Card>
            <CardHeader className="font-bold">
                Asset Details
                <Separator className="mt-4" />
            </CardHeader>

            {isAssetRequestLoading || isAssetLoading ? (
                <LoadingSpinner />
            ) : (
                asset && (
                    <CardContent className="flex flex-col gap-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                            <DescriptionCard
                                label="Asset"
                                description={asset?.data.name}
                                className="px-5 py-3 border rounded-md"
                            />

                            <DescriptionCard
                                label="Asset Code"
                                description={asset?.data.asset_code}
                                className="px-5 py-3 border rounded-md"
                            />

                            <DescriptionCard
                                label="Manufacturer"
                                description={
                                    asset?.data?.asset_type?.manufacturer ||
                                    "N/A"
                                }
                                className="px-5 py-3 border rounded-md"
                            />

                            <DescriptionCard
                                label="Model"
                                description={
                                    asset?.data.asset_type.model || "N/A"
                                }
                                className="px-5 py-3 border rounded-md"
                            />

                            <DescriptionCard
                                label="Serial Number"
                                description={
                                    asset?.data.asset_type.serial_number ||
                                    "N/A"
                                }
                                className="px-5 py-3 border rounded-md"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <DescriptionCard
                                label="Acquisition Date"
                                description={asset?.data.acquisition_date}
                            />

                            <DescriptionCard
                                label="State"
                                description={asset?.data.state}
                            />

                            <DescriptionCard
                                label="Location"
                                description={asset?.data.location.name}
                            />

                            <DescriptionCard
                                label="Implementer"
                                description={`${asset?.data.implementer.first_name} ${asset?.data.implementer.last_name}`}
                            />

                            <DescriptionCard
                                label="Assignee"
                                description={`${asset?.data.assignee}`}
                            />

                            <DescriptionCard
                                label="Life of Project"
                                description={`${asset?.data.estimated_life_span}`}
                            />

                            <DescriptionCard
                                label="USD Cost"
                                description={`$${asset?.data.usd_cost}`}
                            />

                            <DescriptionCard
                                label="NGN Cost"
                                description={`₦${asset?.data.ngn_cost}`}
                            />

                            <DescriptionCard
                                label="Unit"
                                description={`${asset?.data.unit}`}
                            />
                        </div>

                        <FormProvider {...form}>
                            <form className="space-y-5">
                                <FormTextArea
                                    label="Comment"
                                    name="comment"
                                    placeholder="Enter Comment"
                                    required
                                />

                                <FormButton
                                    size="lg"
                                    type="submit"
                                    className="bg-green-500"
                                >
                                    Approve
                                </FormButton>
                            </form>
                        </FormProvider>
                    </CardContent>
                )
            )}
        </Card>
    );
}
