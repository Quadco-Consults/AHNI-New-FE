import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const CreateSeparationManagement = () => {
    const navigate = useNavigate();
    const form = useForm();

    return (
        <div className="space-y-4">
            <GoBack />
            <Card>
                <Form {...form}>
                    <form className="space-y-8">
                        <h4 className="font-semibold text-xl">
                            New Exit Submission
                        </h4>

                        <FormInput name="name" label="Employee Name" required />
                        <FormSelect
                            name="project"
                            label="Project"
                            options={[]}
                            required
                        />
                        <FormInput
                            name="date"
                            label="Date"
                            type="date"
                            className="max-w-sm"
                            required
                        />

                        <div className="flex gap-x-6 justify-end">
                            <Button
                                onClick={() => navigate(-1)}
                                type="button"
                                variant="custom"
                            >
                                Cancel
                            </Button>
                            <FormButton
                            // loading={isLoading}
                            // disabled={isLoading}
                            >
                                Create
                            </FormButton>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default CreateSeparationManagement;
