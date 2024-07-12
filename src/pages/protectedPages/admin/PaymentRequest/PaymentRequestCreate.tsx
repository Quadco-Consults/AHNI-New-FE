import BackNavigation from "atoms/BackNavigation";
import FileUpload from "atoms/FileUpload";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { Form } from "components/ui/form";
import { Minus, Plus } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

const PaymentRequestCreate = () => {
  const form = useForm({
    defaultValues: {
      upload: [
        {
          upload: "",
        },
      ],
    },
  });

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "upload",
  });
  return (
    <div>
      <BackNavigation extraText="Payment Request Form" />
      <div>
        <Form {...form}>
          <form>
            <div className="grid grid-cols-3 mt-6 gap-x-10">
              <FormSelect label="Date" name="date" />
              <FormSelect label="Payment To" name="date" />
              <FormSelect label="Tax Identification Number" name="date" />
            </div>
            <div className="grid grid-cols-3 mt-6 gap-x-10">
              <FormInput label="Amount In Figures" name="date" required />
              <div className="col-span-2 ">
                <FormInput label="Amount In Words" name="amout" required />
              </div>
            </div>
            <div className="grid grid-cols-3 mt-6 gap-x-10">
              <FormInput label="Account Number" name="amout" required />
              <FormSelect label="Bank" name="date" />
              <FormInput label="Requested By" name="amout" required />
            </div>
            <div className="mt-6">
              {fields.map((feild, index) => {
                return (
                  <div
                    className="flex items-center justify-between"
                    key={index}
                  >
                    <div className="grid grid-cols-3 w-[90%] gap-x-10">
                      <FileUpload extraClass="gap-x-4" />
                      <FileUpload extraClass="gap-x-4" />
                      <FileUpload extraClass="gap-x-4" />
                    </div>
                    <div className="flex items-center mt-3 text-black gap-x-3">
                      <Minus
                        onClick={() => remove(index)}
                        size={22}
                        className="rounded p-1 font-semibold cursor-pointer text-white bg-[#FF0000]/40"
                      />
                      <Plus
                        onClick={() =>
                          append({
                            upload: "",
                          })
                        }
                        size={22}
                        className="rounded p-1 font-semibold cursor-pointer text-black bg-[#141B34]/40"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <FormButton className="mt-10">Raise Request</FormButton>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PaymentRequestCreate;
