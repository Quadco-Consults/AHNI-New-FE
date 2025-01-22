import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import Card from "components/shared/Card";
import { CardContent } from "components/ui/card";
import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import { Label } from "components/ui/label";
import MultiSelectFormField from "components/ui/multiselect";
import { useForm } from "react-hook-form";

const awardTypeOptions = [
    { label: "CO-OPERATIVE AGREEMENT", value: "Q" },
    { label: "CONTRACT", value: "D" },
    { label: "IDQ", value: "D" },
];

export default function CreateGrant() {
    const form = useForm();

    const onSubmit = async (data: any) => {};

    return (
        <Card>
            <BackNavigation extraText="New Grant" />
            <CardContent>
                <Form {...form}>
                    <form
                        className="space-y-5"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="grid grid-cols-2 gap-8">
                            <FormSelect
                                name="project"
                                label="Project Name"
                                // options={projects}
                                required={true}
                                placeholder="Select Project"
                            />

                            <FormSelect
                                name="award_type"
                                label="Award Type"
                                required={true}
                                options={awardTypeOptions}
                                placeholder="Award type"
                            />

                            <FormInput
                                name="award_amount"
                                label="Award Amount"
                                required={true}
                                type="number"
                                placeholder="400,000"
                            />

                            <FormInput
                                label="Agreement/Contract Reference Number"
                                name="obligations"
                                required={true}
                                type="number"
                                placeholder="Agreement Number"
                            />
                        </div>
                        <div className="flex justify-end">
                            <FormButton loading={false}>
                                Create Grant
                            </FormButton>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
