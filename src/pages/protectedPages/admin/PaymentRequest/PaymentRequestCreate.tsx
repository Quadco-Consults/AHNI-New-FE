// import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "atoms/BackNavigation";
import FileUpload from "atoms/FileUpload";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { Form } from "components/ui/form";
import { Minus, Plus } from "lucide-react";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  CreatePaymentRequestPayload,
  useCreatePaymentRequestMutation,
} from "services/adminApi/paymentRequest";
import { useGetUserQuery } from "services/users";
import { isEmpty, omit } from "lodash";

import * as z from "zod";
import { toast } from "sonner";

const paymentRequestSchema = z.object({
  date: z.string().min(1, "Date is required"),
  payment_to: z.string().min(1, "Payment To is required"),
  tax_identification_number: z.string().optional(),
  amount_in_figures: z.string().min(1, "Amount in Figures is required"),
  amount_in_words: z.string().min(1, "Amount in Words is required"),
  account_number: z.string().min(1, "Account Number is required"),
  bank: z.string().min(1, "Bank is required"),
  requested_by: z.string().uuid("Requested By is required"),
  upload: z.array(z.string().optional()).optional(),
});

export type PaymentRequestFormData = z.infer<typeof paymentRequestSchema>;

const PaymentRequestCreate = () => {
  const form = useForm<CreatePaymentRequestPayload>({
    defaultValues: {
      upload: [
        {
          upload: "",
        },
      ],
    },
    // resolver: zodResolver(paymentRequestSchema),
  });

  const { control } = form;

  const [createPaymentRequest, { isLoading }] =
    useCreatePaymentRequestMutation();

  const { data } = useGetUserQuery({});

  const drivedData = useMemo(() => {
    return data?.results.map((item) => {
      return {
        label: `${item.first_name} ${item.last_name}`,
        value: item.id,
      };
    }, []);
  }, [data?.results]);

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "upload",
  });

  const onSubmit = async (data: CreatePaymentRequestPayload) => {
    if (isEmpty(data.upload)) {
      toast.error("Please upload a file");
    }

    const payload: CreatePaymentRequestPayload = {
      ...omit(data, "upload"),
      supporting_documents: data.upload
        .flatMap((item: any) =>
          Object.values(item).flatMap((files: any) => Object.values(files)[0])
        )
        .filter(Boolean) as File[],
    };

    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await createPaymentRequest(formData).unwrap();
      toast.success("Payment request created successfully");
    } catch (error) {
      toast.error("Error creating payment request");
    }
  };
  return (
    <div>
      <BackNavigation extraText="Payment Request Form" />
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-3 mt-6 gap-x-10">
              <FormInput type="date" label="Date" name="date" />
              <FormInput label="Payment To" name="payment_to" />
              <FormInput
                label="Tax Identification Number"
                name="tax_identification_number"
              />
            </div>
            <div className="grid grid-cols-3 mt-6 gap-x-10">
              <FormInput
                label="Amount In Figures"
                name="amount_in_figures"
                required
                type="number"
              />
              <div className="col-span-2 ">
                <FormInput
                  label="Amount In Words"
                  name="amount_in_words"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 mt-6 gap-x-10">
              <FormInput
                label="Account Number"
                name="account_number"
                required
                type="number"
              />
              <FormInput label="Bank" name="bank" />
              <FormSelect
                options={drivedData}
                label="Requested By"
                name="requested_by"
                required
              />
            </div>
            <div className="mt-6">
              {fields.map((feild, index) => {
                return (
                  <div
                    className="flex items-center justify-between"
                    key={feild.id}
                  >
                    <div className="grid grid-cols-3 w-[90%] gap-x-10">
                      <FileUpload
                        name={`upload.${index}.file1`}
                        extraClass="gap-x-4"
                      />
                      <FileUpload
                        name={`upload.${index}.file2`}
                        extraClass="gap-x-4"
                      />
                      <FileUpload
                        name={`upload.${index}.file3`}
                        extraClass="gap-x-4"
                      />
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
            <FormButton loading={isLoading} className="mt-10">
              Raise Request
            </FormButton>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PaymentRequestCreate;
