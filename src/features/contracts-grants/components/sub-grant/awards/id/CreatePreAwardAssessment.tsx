"use client";

import BackNavigation from "components/atoms/BackNavigation";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import Card from "components/Card";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";

export default function CreatePreAwardAssessment() {
    const form = useForm();

    return (
        <section>
            <BackNavigation />

            <Card>
                <Form {...form}>
                    <form className="space-y-10">
                        <FormInput
                            label="Sub-Grant Title"
                            name="_"
                            placeholder="Enter title"
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
