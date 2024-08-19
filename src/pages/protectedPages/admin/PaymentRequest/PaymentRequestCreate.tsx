// import { zodResolver } from "@hookform/resolvers/zod";

import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { Form } from "components/ui/form";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  TPaymentRequestPayload,
  useCreatePaymentRequestMutation,
} from "services/adminApi/paymentRequest";
import { useGetUserQuery } from "services/users";

import * as z from "zod";
import { toast } from "sonner";
import StepHeader from "pages/protectedPages/procurement-management/procurement-plan/create-procurement/StepHeader";
import { Card, CardContent } from "components/ui/card";
import { useNavigate } from "react-router-dom";
import { AdminRoutes } from "constants/RouterConstants";
import sessionStorage from "redux-persist/es/storage/session";

const steps = [
  { step: 1, stepName: "Payment Request" },
  { step: 2, stepName: "File Uploads" },
];

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
  const [currentStep, setCurrentStep] = useState(1);
  const form = useForm<TPaymentRequestPayload>({
    defaultValues: {},
    // resolver: zodResolver(paymentRequestSchema),
  });

  const navigate = useNavigate();

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

  const onSubmit = async (data: TPaymentRequestPayload) => {
    try {
      const resp = await createPaymentRequest(data).unwrap();
      toast.success("Payment request created successfully");
      setCurrentStep(2);
      navigate(AdminRoutes.PaymentRequestUpload);
      sessionStorage.setItem("paymentId", resp.id);
    } catch (error) {
      toast.error("Error creating payment request");
    }
  };
  return (
    <div>
      {/* <BackNavigation extraText="Payment Request Form" /> */}
      <StepHeader steps={steps} currentStep={currentStep} />
      <Card>
        <CardContent>
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

              <div className="flex justify-end">
                <FormButton loading={isLoading} className="mt-10">
                  Next
                </FormButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentRequestCreate;
