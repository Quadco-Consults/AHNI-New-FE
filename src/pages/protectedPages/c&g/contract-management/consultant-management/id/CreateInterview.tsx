import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";

export default function CreateInterview() {
    const form = useForm();

    return (
        <section>
            <BackNavigation />

            <Card>
                <Form {...form}>
                    <form className="space-y-10">
                        <FormInput
                            label="Consultancy"
                            name="_"
                            placeholder="Select Consultancy"
                            required
                        />

                        <div className="grid grid-cols-2 gap-10">
                            <FormSelect
                                label="Pre-Award Assessment Type"
                                name="_"
                                placeholder="Select type"
                                required
                                options={[
                                    { label: "COMMITTEE", value: "COMMITTEE" },
                                    {
                                        label: "Non-COMMITTEE",
                                        value: "NON-COMMITTEE",
                                    },
                                ]}
                            />

                            <FormInput
                                type="date"
                                label="Pre-Award Assessment Date"
                                name="_"
                                required
                            />
                        </div>

                        <Button
                            variant="outline"
                            size="lg"
                            className="text-[#DEA004] border-[#DEA004] border-solid "
                        >
                            Select Committes
                        </Button>

                        <div className="flex items-center justify-between">
                            <Button variant="outline" size="lg">
                                Cancel
                            </Button>

                            <FormButton size="lg">Submit</FormButton>
                        </div>
                    </form>
                </Form>
            </Card>
        </section>
    );
}
