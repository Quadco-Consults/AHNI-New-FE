import FormButton from "atoms/FormButton";
import FormTextArea from "atoms/FormTextArea";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { Label } from "components/ui/label";
import { useAppDispatch } from "hooks/useStore";
import { useForm } from "react-hook-form";
import { closeDialog } from "store/ui";

export default function PreferredConsultantModal() {
    const dispatch = useAppDispatch();

    const form = useForm();

    return (
        <Form {...form}>
            <Label className="text-[#DEA004] font-semibold">
                Justification for Selection/Other Comments (narrative)
            </Label>

            <FormTextArea label="Comments" name="_" />

            <div className="flex items-center justify-end gap-x-5">
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                        dispatch(closeDialog());
                    }}
                >
                    Cancel
                </Button>
                <FormButton type="submit">Submit</FormButton>
            </div>
        </Form>
    );
}
