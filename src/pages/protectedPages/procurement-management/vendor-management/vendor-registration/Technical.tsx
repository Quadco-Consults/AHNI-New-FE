import { useLocation, useNavigate } from "react-router-dom";
import VendorRegistationLayout from "./VendorRegistationLayout";
import { useFieldArray, useForm } from "react-hook-form";
import FormInput from "atoms/FormInput";
import { ArrowLeft, ArrowRight, MinusCircle, PlusCircle } from "lucide-react";
import { Label } from "components/ui/label";
import { Form } from "components/ui/form";
import { Separator } from "components/ui/separator";
import FormButton from "atoms/FormButton";

const Technical = () => {
  const form = useForm({
    defaultValues: {
      equipment: [{ name: "", manufacture: "", year: "" }],
    },
  });

  const { control } = form;

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "equipment",
  });

  const { handleSubmit } = form;

  const onSubmit = () => {
    let path = pathname;

    // Remove the last segment of the path
    path = path.substring(0, path.lastIndexOf("/"));

    // Append the new segment to the path
    path += "/questionnaire";
    navigate(path);
  };
  return (
    <VendorRegistationLayout>
      <div>
        <h2 className="text-lg font-bold">Technical Capacity</h2>
        <Form {...form}>
          <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label className="text-red-500">
                Details of Production Equipment
              </Label>
              <div>
                {fields.map((field, index) => {
                  const label = String.fromCharCode("a".charCodeAt(0) + index);
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
                          label="Equipment Name"
                          name={`equipment[${index}].name`}
                          defaultValue={field.name}
                          required
                        />
                        <FormInput
                          label="Manufacturer"
                          name={`equipment[${index}].manufacture`}
                          defaultValue={field.manufacture}
                          required
                        />
                        <FormInput
                          label="Year"
                          name={`officeaddress[${index}].year`}
                          defaultValue={field.year}
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
                      append({ name: "", manufacture: "", year: "" })
                    }
                    className="cursor-pointer text-primary"
                  />
                </div>
              </div>
            </div>
            <Separator className="mt-8" />
            <div className="mt-10">
              <FormInput
                className=""
                name="capavity"
                label="Installed Capacity"
              />
            </div>
            <div className="grid grid-cols-2 gap-6 mt-10">
              <FormInput name="" label="Latest Capacity and Utilization" />
              <FormInput label="Number of operational work shifts" name="" />
              <FormInput
                label="Provide Brief Details of Quality Control Procedures"
                name=""
              />
              <FormInput
                label="Provide brief details of sampling procedures"
                name=""
              />
            </div>
            <div className="flex justify-between pt-24">
              <FormButton
                onClick={() => navigate(-1)}
                preffix={<ArrowLeft size={14} />}
                type="button"
                className="bg-[#FFF2F2] text-primary dark:text-gray-500"
              >
                Back
              </FormButton>

              <FormButton suffix={<ArrowRight size={14} />}>Proceed</FormButton>
            </div>
          </form>
        </Form>
      </div>
    </VendorRegistationLayout>
  );
};

export default Technical;
