import FormInput from "atoms/FormInput";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";

const FundRequestSummaryModal = () => {
  const form = useForm();

  const { handleSubmit } = form;

  const onSubmit = () => {};

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Project Title" name="title" />
        </form>
      </Form>
    </div>
  );
};

export default FundRequestSummaryModal;
