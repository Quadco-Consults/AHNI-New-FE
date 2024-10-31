import FormButton from "atoms/FormButton";
import FormTextArea from "atoms/FormTextArea";
import { Button } from "components/ui/button";
import { DialogTitle } from "components/ui/dialog";
import { Form } from "components/ui/form";
import { useAppDispatch } from "hooks/useStore";
import { useForm } from "react-hook-form";
import { closeDialog } from "store/ui";

const FeedbackModal = () => {
  const dispatch = useAppDispatch();
  const form = useForm();

  return (
    <div className="space-y-8">
      <DialogTitle>Feedback Form</DialogTitle>

      <Form {...form}>
        <form className="space-y-6">
          <FormTextArea
            name="feedback"
            label="Write your Feedback"
            rows={8}
            required
          />

          <div className="flex gap-x-6 justify-end">
            <Button
              onClick={() => dispatch(closeDialog())}
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
    </div>
  );
};

export default FeedbackModal;
