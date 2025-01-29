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
import {
  useGetAllUsersQuery,
  useGetUserProfileQuery,
} from "services/auth/user";
import VendorsAPI from "services/procurementApi/vendors";
import VendorsEvaluaionAndPerformanceAPI from "services/procurementApi/vendors-evaluation-performance";
import { toast } from "sonner";

const CreateVendorEvaluation = () => {
  const navigate = useNavigate();
  const {
    data: vendor,

    // @ts-ignore
  } = VendorsAPI.useGetVendorsQuery({});

  const [
    createVendorEvaluationMutation,
    { isLoading: createVendorEvaluationMutationLoading },
  ] = VendorsEvaluaionAndPerformanceAPI.useCreateVendorEvaluationMutation();
  // VendorsEvaluaionAndPerformanceAPI.useGetVendorsQuery({});

  const { data: users } = useGetAllUsersQuery({
    page: 1,
    size: 2000000,
  });

  const { data: profile } = useGetUserProfileQuery(null);

  const form = useForm<any>({
    // resolver: zodResolver(),
    defaultValues: {
      evaluators: profile?.data.id,
      supervisors: "",
      vendor: "",
      vendor_service: "",
      location_of_service: "",
      reviewed_period_start: "",
      reviewed_period_end: "",
      comments: "",
    },
  });

  const { handleSubmit, watch, setValue } = form;

  // Watch the selected vendor
  const selectedVendorId = watch("vendor");

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
    setValue("evaluators", profile?.data.id || "");
  }, [selectedVendorId, vendor, setValue]);

  const onSubmit = async (data: any) => {
    const payload = {
      evaluators: [data.evaluators],
      supervisors: [data.supervisors],
      criteria_scores: [
        {
          criteria: "delivery_leadtime",
          value: data.delivery_leadtime,
          evaluation: "",
        },
        {
          criteria: "competitive_pricing",
          value: data?.competitive_pricing,
          evaluation: "",
        },
        {
          criteria: "professionalism",
          value: data?.professionalism,
          evaluation: "",
        },
        {
          criteria: "responsiveness",
          value: data?.responsiveness,
          evaluation: "",
        },
        {
          criteria: "post_delivery_after_sales_report",
          value: data?.post_delivery_after_sales_report,
          evaluation: "",
        },
      ],

      vendor: data?.vendor,
      service: data?.vendor_service,
      location_of_service: data?.location_of_service,
      reviewed_period_start: data?.reviewed_period_start,
      reviewed_period_end: data?.reviewed_period_end,
      comments: data?.comments,
    };

    try {
      await createVendorEvaluationMutation(payload).unwrap();
      toast.success("Successfully created.");
      navigate(RouteEnum.VENDOR_PERFORMANCE_EVALUATION);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

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
                  name='vendor'
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
              {usersOptions && (
                <FormSelect
                  label='Supervisor'
                  name='supervisors'
                  required
                  options={usersOptions}
                />
              )}
              <FormSelect
                label='Responsiveness'
                name='responsiveness'
                required
                options={ratingOptions}
              />
            </div>
            <FormButton
              loading={createVendorEvaluationMutationLoading}
              disabled={createVendorEvaluationMutationLoading}
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
