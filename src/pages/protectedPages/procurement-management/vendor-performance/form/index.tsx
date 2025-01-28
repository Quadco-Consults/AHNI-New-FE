import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import LongArrowRight from "components/icons/LongArrowRight";
import GoBack from "components/shared/GoBack";
import { Form } from "components/ui/form";
import { Separator } from "components/ui/separator";
import { RouteEnum } from "constants/RouterConstants";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useGetAllUsersQuery } from "services/auth/user";
import VendorsAPI from "services/procurementApi/vendors";

const CreateVendorEvaluation = () => {
  const navigate = useNavigate();
  const {
    data: vendor,

    // @ts-ignore
  } = VendorsAPI.useGetVendorsQuery({});

  const { data: users } = useGetAllUsersQuery({
    page: 1,
    size: 2000000,
  });

  const form = useForm<any>({
    // resolver: zodResolver(),
    defaultValues: {
      evaluators: [],
      supervisors: [],
      vendor_name: "",
      service: [],
      location_of_service: [],
      reviewed_period_start: [],
      reviewed_period_end: [],
      comments: "",
    },
  });

  const { handleSubmit, watch, setValue } = form;

  // Watch the selected vendor
  const selectedVendorId = watch("vendor_name");

  const vendorsOptions = vendor?.data.results.map(({ company_name, id }) => ({
    label: company_name,
    value: id,
  }));

  const usersOptions = users?.data.results.map(
    ({ first_name, last_name, id }) => ({
      label: `${first_name} ${last_name}`,
      value: id,
    })
  );

  console.log({ usersOptions });

  const ratingOptions = [
    { label: "Excellent", value: "5" },
    { label: "Good", value: "4" },
    { label: "Satisfactorily", value: "3" },
    { label: "Fair", value: "2" },
    { label: "Low", value: "1" },
  ];

  // Autofill location based on selected vendor
  useEffect(() => {
    if (selectedVendorId && vendor) {
      const selectedVendor = vendor.data.results.find(
        (v) => v.id === selectedVendorId
      );
      if (selectedVendor) {
        setValue("location_of_service", selectedVendor.company_address || "");
      }
    }
  }, [selectedVendorId, vendor, setValue]);

  const onSubmit = async (data: any) => {
    console.log({ data });
    navigate(RouteEnum.VENDOR_PERFORMANCE_EVALUATION_ID);

    // try {
    //   await createPurchaseRequestMutation(data).unwrap();
    //   toast.success("Successfully created.");
    // } catch (error) {
    //   toast.error("Something went wrong");
    //   console.log(error);
    // }
  };
  const lon = form.getValues();

  console.log({ lon, vendorsOptions, selectedVendorId });

  return (
    <div className=''>
      <GoBack />

      <div className='pt-20'>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6'
          >
            <div className='grid gap-5'>
              {vendorsOptions && (
                <FormSelect
                  label='Vendor Name'
                  name='vendor_name'
                  required
                  options={vendorsOptions}
                />
              )}
            </div>
            <div className='grid grid-cols-2 gap-5'>
              <FormInput
                label='Vendor Service'
                name='vendor_service'
                type='text'
              />
              <FormInput
                label='Location of Service'
                name='location_of_service'
                type='text'
              />
            </div>

            <div className='grid gap-5'>
              <FormInput
                label='Review Start Period'
                name='reviewed_period_start'
                type='date'
                placeholder='01/01/2024'
              />
              <FormInput
                label='Review End Period'
                name='reviewed_period_end'
                type='date'
                placeholder='01/01/2024'
              />
            </div>

            <span className='block space-y-2'>
              <h3 className='font-semibold text-xl text-black'>EVALUATION</h3>
            </span>
            <Separator className='my-4' />
            <div className='grid grid-cols-2 gap-5'>
              <FormSelect
                label='Delivery leadtime'
                name='delivery_leadtime'
                required
                options={ratingOptions}
              />

              <FormSelect
                label='Competitive Pricing'
                name='competitive_pricing'
                required
                options={ratingOptions}
              />
            </div>

            <div className='grid grid-cols-2 gap-5'>
              <FormSelect
                label='Post-delivery after sales report'
                name='post_delivery_after_sales_report'
                required
                options={ratingOptions}
              />{" "}
              <FormSelect
                label='Professionalism'
                name='professionalism'
                required
                options={ratingOptions}
              />
            </div>
            <div className='grid grid-cols-2 gap-5'>
              <FormSelect
                label='Responsiveness'
                name='responsiveness'
                required
                options={ratingOptions}
              />
            </div>
            <FormButton
              // loading={isLoading}
              // disabled={isLoading}
              type='submit'
              className='flex items-center justify-center gap-2'
            >
              <LongArrowRight />
              Save
            </FormButton>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateVendorEvaluation;
