import React from "react";
import RfqLayout from "./RfqLayout";
import { Form } from "components/ui/form";
import FormSelect from "atoms/FormSelectField";
import { SelectContent, SelectItem } from "components/ui/select";
import FormInput from "atoms/FormInput";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "components/ui/button";
import FormButton from "atoms/FormButton";
import { ChevronRight } from "lucide-react";
import FormTextArea from "atoms/FormTextArea";

const Quotation = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Initialize form state
  const form = useForm();

  const { handleSubmit } = form;

  const onSubmit = (data: any) => {
    console.log(data);
    let path = pathname;

    // Remove the last segment of the path
    path = path.substring(0, path.lastIndexOf("/"));

    // Append the new segment to the path
    path += "/items";
    navigate(path);
  };

  return (
    <RfqLayout>
      <div className="p-5">
        <h4 className="font-semibold text-lg">
          Initiate New Request for Quotation
        </h4>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-10">
            <FormInput name="title" label="RFQ Title/ID" required />
            <FormTextArea name="background" label="Background" required />

            <FormSelect name="type_of_business" label="Tender Type" required>
              <SelectContent>
                {[
                  "CLOSED SOURCE",
                  "LIMITED SOLICITATION",
                  "NATIONAL OPEN TENDER",
                ].map((value: string, index: number) => (
                  <SelectItem key={index} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </FormSelect>

            <div className="grid grid-cols-2 gap-6">
              <FormSelect name="type_of_business" label="Request type" required>
                <SelectContent>
                  {[
                    "INVITATION TO TENDER",
                    "REQUEST FOR PROPOSAL",
                    "REQUEST FOR QUOTATION",
                  ].map((value: string, index: number) => (
                    <SelectItem key={index} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </FormSelect>
              <FormSelect
                name="type_of_business"
                label="Procurement type"
                required
              >
                <SelectContent>
                  {[
                    "Limited Liability",
                    "Public Limited Company",
                    "Registered Business Enterprise",
                  ].map((value: string, index: number) => (
                    <SelectItem key={index} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </FormSelect>
            </div>

            <div className="flex justify-between mt-16">
              <Button
                onClick={() => navigate(-1)}
                type="button"
                className="bg-[#FFF2F2] text-primary dark:text-gray-500"
              >
                Cancel
              </Button>
              <FormButton type="submit">Next</FormButton>
            </div>
          </form>
        </Form>
      </div>
    </RfqLayout>
  );
};

export default Quotation;
