import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import Card from "components/shared/Card";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";

export default function CreateSubGrant() {
    const form = useForm();

    const onSubmit = async (data: any) => {};
    
    return (
        <Card>
            <BackNavigation />
            <CardContent>
                <Form {...form}>
                    <form
                        className="space-y-5"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormSelect
                            label="Grant"
                            name="grant"
                            placeholder="Select Grant"
                            required
                            options={[]}
                        />

                        <FormSelect
                            label="Partner"
                            name="grant"
                            placeholder="Select Partner"
                            required
                            options={[]}
                        />

                        <div className="grid grid-cols-3 gap-8">
                            <FormInput
                                name="project_title"
                                label="Project Title"
                                required={true}
                                placeholder="Enter Subgrant Title"
                            />

                            <FormSelect
                                name="grant_administrator"
                                label="AHNI Grant Administrator"
                                required={true}
                                placeholder="Veronica Daniels"
                            />
                            <FormSelect
                                name="sub_award_type"
                                label="Subaward Type (Proposed)"
                                required={true}
                                placeholder="Cooperative Agreement"
                            />
                            <FormSelect
                                name="technical_staff"
                                label="AHNI Program/Technical Staff Contact"
                                required={true}
                                placeholder="Tine Woji, 08034509662"
                            />
                            <FormSelect
                                name="business_unit"
                                label="Business Unit"
                                required={true}
                                // options={departments}
                                placeholder="Nigeria"
                            />
                            <FormInput
                                name="project_value_usd"
                                label="Subaward Life of Project Value (USD)"
                                required={true}
                                type="number"
                                placeholder="Estimated sub-grant amount in USD"
                            />
                            <FormInput
                                name="project_value_local_currency"
                                label="Subaward Life of Project Value (Local Currency)"
                                required={true}
                                type="number"
                                placeholder="Estimated sub-grant amount in Local Currency"
                            />

                            <FormInput
                                label="Start Date"
                                name="start_date"
                                type="date"
                                required
                            />

                            <FormInput
                                label="End Date"
                                name="end_date"
                                type="date"
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <FormButton loading={false}>Submit</FormButton>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
