import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import { Card, CardContent } from "components/ui/card";
import { FormProvider, useForm } from "react-hook-form";

export default function CreateAssetMaintenanceRequest() {
    const form = useForm();

    const onSubmit = async () => {};

    return (
        <div>
            <BackNavigation extraText="Create Asset Maintenance Ticket" />

            <Card>
                <CardContent>
                    <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormSelect
                                name="asset"
                                label="Asset"
                                options={[]}
                            />

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

                            <FormButton loading={false}>
                                Raise Request
                            </FormButton>
                        </form>
                    </FormProvider>
                </CardContent>
            </Card>
        </div>
    );
}
