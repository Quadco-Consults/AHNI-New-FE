import { Form } from "components/ui/form";
import VendorRegistationLayout from "./VendorRegistationLayout";
import { useFieldArray, useForm } from "react-hook-form";
import FormInput from "atoms/FormInput";
import { Separator } from "components/ui/separator";
import { ArrowLeft, ArrowRight, MinusCircle, PlusCircle } from "lucide-react";
import { Label } from "components/ui/label";
import FormButton from "atoms/FormButton";
import { useLocation, useNavigate } from "react-router-dom";

const Questionier = () => {
  const form = useForm({
    defaultValues: {
      vendor: [{ name: "", address: "", tel: "" }],
    },
  });

  const { control, handleSubmit } = form;

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vendor",
  });

  const onSubmit = () => {
    let path = pathname;

    path = path.substring(0, path.lastIndexOf("/"));

    path += "/attestation";
    navigate(path);
  };

  return (
    <VendorRegistationLayout>
      <div>
        <h2 className="text-lg font-bold">Questionnaire</h2>
        <div className="mt-8">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormInput
                required
                name=""
                label="Has any of the Company’s products failed to receive a NAFDAC certification in the last 5 years?"
              />
              <FormInput
                required
                name=""
                label="Does the Company engage in R&D to improve the company’s products and services?"
              />
              <FormInput
                required
                name=""
                label="How much was spent on R&D last year?"
              />
              <FormInput
                required
                name=""
                label="Are you ready to allow us to inspect your plant premises at any time upon receipt of 2 days’ notice?"
              />
              <FormInput
                required
                name=""
                label="Has any of your products been rejected by your customers in the last 3 years? If yes, provide details"
              />
              <FormInput
                required
                name=""
                label="Is there any pending legal action against your company? If yes, provide details."
              />
              <FormInput
                required
                name=""
                label="Is there any pending regulatory investigation, hearing or sanctions against your company? If yes, provide details."
              />
              <FormInput
                required
                name=""
                label="Has your company ever been sued for product liability? If yes, provide details."
              />
              <FormInput
                required
                name=""
                label="Name and address of key client who we can contact for references (if any)"
              />
              <FormInput
                required
                name=""
                label="Has any of the Company’s products failed to receive a NAFDAC certification in the last 5 years?"
              />

              <div className="space-y-8 ">
                <Separator />
                <div>
                  <Label className="text-red-500">
                    . Name and address of key client who we can contact for
                    references (if any)
                  </Label>
                  <div>
                    {fields.map((field, index) => {
                      const label = String.fromCharCode(
                        "a".charCodeAt(0) + index
                      );
                      return (
                        <div
                          className="flex items-center justify-between gap-x-3 "
                          key={index}
                        >
                          <div className="relative w-[97%] grid grid-cols-3 pl-8 mt-4 gap-x-4 ">
                            <p className="absolute top-0 left-0 font-semibold ">
                              ({label})
                            </p>
                            <FormInput
                              label="Name of Vendor "
                              name={`vendor.[${index}].name`}
                              defaultValue={field.name}
                              required
                            />
                            <FormInput
                              label="Address of Vendor "
                              name={`vendor.[${index}].address`}
                              defaultValue={field.name}
                              required
                            />
                            <FormInput
                              label="Active Mobile Number"
                              name={`vendor.[${index}].tel`}
                              defaultValue={field.tel}
                              required
                            />
                          </div>
                          <div className="flex items-center h-full ">
                            <MinusCircle
                              onClick={() => remove(index)}
                              className="cursor-pointer text-primary"
                            />
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex justify-end mt-2">
                      <PlusCircle
                        onClick={() =>
                          append({ name: "", address: "", tel: "" })
                        }
                        className="cursor-pointer text-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-10">
                <FormButton
                  onClick={() => navigate(-1)}
                  preffix={<ArrowLeft size={14} />}
                  type="button"
                  className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                >
                  Back
                </FormButton>

                <FormButton suffix={<ArrowRight size={14} />}>
                  Proceed
                </FormButton>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </VendorRegistationLayout>
  );
};

export default Questionier;
