import { Form } from "components/ui/form";
// import VendorRegistationLayout from "./VendorRegistationLayout";
import { useForm } from "react-hook-form";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FormButton from "atoms/FormButton";
import { Button } from "components/ui/button";

// import { VendorsRegistrationSchema } from "definations/procurement-validator";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { vendorsActions } from "store/formData/procurement-vendors";
// import { useDispatch } from "react-redux";
import { SelectContent, SelectItem } from "components/ui/select";
import { useState } from "react";
import PayGroupModal from "./components/CompensationModal";

const NewCompensation = () => {
  // @ts-ignore

  const form = useForm({
    // resolver: zodResolver(VendorsRegistrationSchema),
    defaultValues: {},
  });

  const [isModalOpen, setModalOpen] = useState(false);

  //   const dispatch = useDispatch();

  const navigate = useNavigate();

  //   const { pathname } = useLocation();

  const { handleSubmit } = form;

  const onSubmit = (data: any) => {
    console.log({ data });
    () => setModalOpen(true);
    // dispatch(vendorsActions.addVendors({ ...data }));

    // let path = pathname;

    // // Remove the last segment of the path
    // path = path.substring(0, path.lastIndexOf("/"));

    // // Append the new segment to the path
    // path += "/the-company";
    // navigate(path);
  };
  return (
    <>
      <div className='px-3 '>
        <h2 className='text-lg font-bold'>New Compensation</h2>
        <div className='mt-10'>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid grid-cols-2 gap-6'>
                <FormInput
                  label='Compensation Name'
                  name='compensation_name'
                  type='text'
                />
                <FormSelect name='type' label='Type'>
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
              <FormSelect
                name='amount_or_percentage'
                label='Amount or Percentage'
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
              <FormInput label='Percentage' name='percentegae' type='text' />
              <FormInput label='Amount' name='amount' type='text' />

              <div className=''>
                <h2 className='text-md font-semibold mb-10'>Pay Group</h2>
                <div className='grid grid-cols-2 col-span-3 gap-x-6  mb-4'>
                  <FormSelect name='position' label='Position'>
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
                  </FormSelect>{" "}
                  <FormSelect name='grade' label='Grade'>
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
                <FormSelect name='period' label='Period'>
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

              <div className='flex justify-end gap-6 mt-16'>
                <Button
                  type='button'
                  onClick={() => navigate(-1)}
                  className='bg-[#FFF2F2] text-primary dark:text-gray-500'
                >
                  Cancel
                </Button>
                {/* <Button className="bg-primary">
                  Proceed <ChevronRight size={14} />{" "}
                </Button> */}
                <FormButton
                  suffix={<ChevronRight size={14} type='submit' />}
                  onClick={() => setModalOpen(true)}
                >
                  Create
                </FormButton>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <PayGroupModal
        isOpen={isModalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => {}}
      />
    </>
  );
};

export default NewCompensation;
