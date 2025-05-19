import FormInput from "atoms/FormInput";
import FormTextArea from "atoms/FormTextArea";
import UploadIcon from "components/icons/UploadIcon";
import Upload from "components/shared/Upload";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function DocumentUploadModal() {
    const [file, setFile] = useState<File>();
    const [error, setError] = useState("");

    const form = useForm();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <Form {...form}>
            <form className="flex flex-col gap-5">
                <FormInput
                    label="Document Name"
                    name="_"
                    placeholder="Enter Name"
                    required
                />

                <FormTextArea
                    label="Document Description"
                    name="_"
                    placeholder="Enter Description"
                />

                <Upload onChange={handleChange} multiple={true}>
                    <Button variant="outline" className="w-full" size="lg">
                        <UploadIcon />
                        Select Document
                    </Button>
                </Upload>
            </form>
        </Form>
    );
}
