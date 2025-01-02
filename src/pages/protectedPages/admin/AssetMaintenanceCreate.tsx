import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { Card, CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import {
    CreateAssetMaintenanceRequestPayload,
    useCreateAssetMaintenanceRequestMutation,
} from "services/admin/assetMaintenance";
import { useGetAssetsQuery } from "services/admin/assetsApi";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
    asset: z.string(),
    description_of_problem: z.string(),
    maintenance_type: z.string(),
});

const AssetMaintenanceCreate = () => {
    const form = useForm<CreateAssetMaintenanceRequestPayload>({
        resolver: zodResolver(schema),
    });

    const [assetMaintenacce, { isLoading }] =
        useCreateAssetMaintenanceRequestMutation();

    const { data } = useGetAssetsQuery({});

    const drivedData = useMemo(() => {
        return data?.results.map((item) => {
            return {
                label: item.asset_type.name,
                value: item.id,
            };
        });
    }, [data?.results]);

    const onSubmit = async (data: CreateAssetMaintenanceRequestPayload) => {
        try {
            await assetMaintenacce({
                ...data,
                classification: "Vehicle",
            }).unwrap();
            toast.success("Maintenace ticket created successfully");
            form.reset();
        } catch (error) {
            toast.error("Failed to create");
        }
    };
    return (
        <div>
            <BackNavigation extraText="Asset Maintenance" />
            <Card>
                <CardContent className="p-5">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-y-8"
                        >
                            <div>
                                <FormSelect
                                    name="asset"
                                    label="Asset"
                                    options={drivedData}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-x-8 ">
                                <FormInput
                                    name="maintenance_type"
                                    label="Maintenance Type"
                                />
                                <FormInput
                                    name="description_of_problem"
                                    label="Description of Problem"
                                />
                            </div>

                            <FormButton loading={isLoading} className="w-32">
                                Raise Request
                            </FormButton>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AssetMaintenanceCreate;
