import LongArrowLeft from "components/icons/LongArrowLeft";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import ProjectLayout from "./ProjectLayout";
import { Form } from "components/ui/form";
import Card from "components/shared/Card";
import FormInput from "atoms/FormInput";
import FormTextArea from "atoms/FormTextArea";
import { Button } from "components/ui/button";
import FormButton from "atoms/FormButton";
import { ChevronRight } from "lucide-react";

const Performance = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    const form = useForm();

    const { pathname } = useLocation();

    const { handleSubmit } = form;

    const onSubmit = () => {
        let path = pathname;

        path = path.substring(0, path.lastIndexOf("/"));

        path += "/uploads";
        navigate(path);
    };

    return (
        <div className="space-y-6 min-h-screen">
            <button
                onClick={goBack}
                className="w-[3rem] h-[3rem] rounded-full drop-shadow-md bg-white flex items-center justify-center"
            >
                <LongArrowLeft />
            </button>

            <ProjectLayout>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Card className="space-y-6 py-5">
                            <h4 className="text-lg font-semibold">
                                Project Performance
                            </h4>
                            <FormInput
                                name="target"
                                label="Achievement against the target"
                            />

                            <FormTextArea name="narrative" label="Narrative" />

                            <FormInput
                                name="target"
                                label="Budget performance"
                            />
                        </Card>
                        <div className="flex justify-between gap-5 mt-10">
                            <Button
                                type="button"
                                className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                            >
                                Cancel
                            </Button>
                            <FormButton suffix={<ChevronRight size={14} />}>
                                Next
                            </FormButton>
                        </div>
                    </form>
                </Form>
            </ProjectLayout>
        </div>
    );
};

export default Performance;
