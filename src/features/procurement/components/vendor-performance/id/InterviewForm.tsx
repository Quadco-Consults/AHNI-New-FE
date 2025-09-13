"use client";

import FormButton from "@/components/FormButton";
import Card from "components/Card";
import GoBack from "components/GoBack";
// import { Loading } from "components/Loading";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Separator } from "components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { Textarea } from "components/ui/textarea";
// import { formatDate } from "date-fns";
import { useForm } from "react-hook-form";
import VendorsEvaluaionAndPerformanceAPI from "@/features/procurement/controllers/vendorPerformanceEvaluationController";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const InterviewForm = () => {
  const params = useParams();
  const router = useRouter();

  const { data: vendorEvaluationData } =
    VendorsEvaluaionAndPerformanceAPI.useGetSingleVendorEvaluation(
      params?.id as string
    );

  const {
    submitVendorEvaluation: createVendorEvaluationMutationById,
    isLoading: createVendorEvaluationMutationByIdLoading,
  } = VendorsEvaluaionAndPerformanceAPI.useCreateVendorEvaluationByIdMutation(
    params?.id as string
  );

  const form = useForm();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const onSubmit = async (formData: any) => {
    const payload = {
      evaluators: vendorEvaluationData?.data?.evaluators,
      supervisors: vendorEvaluationData?.data?.supervisors,
      criteria_scores: [
        {
          criteria: "delivery_leadtime",
          value: formData["rating-0"],
        },
        {
          criteria: "competitive_pricing",
          value: formData["rating-1"],
        },
        {
          criteria: "professionalism",
          value: formData["rating-2"],
        },
        {
          criteria: "responsiveness",
          value: formData["rating-3"],
        },
        {
          criteria: "post_delivery_after_sales_report",
          value: formData["rating-4"],
        },
      ],
      comments: formData.recommendations,
    };

    try {
      await createVendorEvaluationMutationById(payload);

      toast.success(" Interview Submitted successfully");
      router.back();
      // router.push(RouteEnum.VENDOR_PERFORMANCE_EVALUATION);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };
  return (
    <div className='flex flex-col gap-4'>
      <GoBack />

      <Card>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col gap-3'>
            <h2 className='font-semibold'>Name of Vendor</h2>
            <p>{vendorEvaluationData?.data?.vendor?.name}</p>
          </div>
          <div className='flex flex-col gap-3'>
            <h2 className='font-semibold'>Location of Service</h2>
            <p> {vendorEvaluationData?.data?.location_of_service}</p>
          </div>
          <div className='flex flex-col gap-3'>
            <h2 className='font-semibold'>Service</h2>
            <p>{vendorEvaluationData?.data?.service || "-"}</p>
          </div>
          <div className='flex flex-col gap-3'>
            <h2 className='font-semibold'>Evaluator(s)</h2>

            <div>
              {" "}
              {vendorEvaluationData?.data?.evaluators?.map(
                ({ name }: { name: string }, idx: number) => {
                  return (
                    <p key={idx} className='mr-2'>
                      {name}{" "}
                    </p>
                  );
                }
              )}
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <h2 className='font-semibold'>Supervisors(s)</h2>
            <div>
              {" "}
              {vendorEvaluationData?.data?.supervisors?.map(
                ({ name }: { name: string }, idx: number) => {
                  return (
                    <p key={idx} className='mr-2'>
                      {name}{" "}
                    </p>
                  );
                }
              )}
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <h2 className='font-semibold'>Review Start Period</h2>
            <p> {vendorEvaluationData?.data?.reviewed_period_start}</p>
          </div>
          <div className='flex flex-col gap-3'>
            <h2 className='font-semibold'>Review End Period</h2>
            <p> {vendorEvaluationData?.data?.reviewed_period_end}</p>
          </div>
        </div>

        <Separator className='my-6' />
        <div className=''>
          <h2 className='font-semibold'>Key Rating</h2>
        </div>
        <Card className='mt-4'>
          <Table>
            <TableHeader>
              <TableRow className='border-none'>
                <TableCell>Below Average</TableCell>
                <TableCell>Average</TableCell>
                <TableCell>Good</TableCell>
                <TableCell>Very Good</TableCell>
                <TableCell>Outstanding</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className='border-white border-t border-t-gray-200'>
                {[1, 2, 3, 4, 5].map((rating, idx) => (
                  <TableCell key={idx}>
                    <Badge
                      className={`rounded-sm text-black px-12 py-2 bg-[${getColor(
                        rating
                      )}]`}
                    >
                      {rating}
                    </Badge>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='mt-8 flex flex-col gap-8'
        >
          {ratingSections.map((section, index) => (
            <Card key={index} className='flex flex-col gap-4'>
              <div className='flex flex-col gap-3'>
                <h2 className='font-semibold'>{section.title}</h2>
                {/* <p>{section.description}</p> */}
              </div>
              <div className=''>
                <p className='text-primary text-sm'>Tick as appropriate</p>
                <div className='flex gap-4 w-full'>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      type='button'
                      onClick={() => setValue(`rating-${index}`, value)}
                      className={`px-4 py-2 border w-full ${
                        watch(`rating-${index}`) === value
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
                {errors[`rating-${index}`] && (
                  <p className='text-red-500 text-sm mt-2'>
                    {/* @ts-ignore */}
                    {errors[`rating-${index}`]?.message}
                  </p>
                )}
              </div>
            </Card>
          ))}
          <div className=''>
            <label htmlFor={`recommendations`} className='font-semibold'>
              Comments
            </label>
            <Textarea
              id={`recommendations`}
              {...register(`recommendations`, {
                required: "Comments are required",
              })}
              rows={6}
              className='mt-2'
            />
          </div>
          <div className=''></div>
          <div className='flex w-full justify-end mt-4'>
            <FormButton
              disabled={createVendorEvaluationMutationByIdLoading}
              loading={createVendorEvaluationMutationByIdLoading}
              type='submit'
              className='bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition duration-300 ease-in-out'
            >
              Complete Interview
            </FormButton>
          </div>
        </form>
      </Card>
    </div>
  );
};

const getColor = (rating: number) => {
  switch (rating) {
    case 1:
      return "#FECDCA";
    case 2:
      return "#F5DEA2";
    case 3:
      return "#F2BB31";
    case 4:
      return "#BCFBAE";
    case 5:
      return "#8DF384";
    default:
      return "#CCC";
  }
};

export default InterviewForm;

const ratingSections = [
  {
    title: "Delivery leadtime",
    description:
      "Appearance and composure in conformity with acceptable standards of the position",
  },
  {
    title: "Competitive Pricing",
    description:
      "Ability to speak articulately and with clarity displaying good pronunciation and grammar",
  },
  {
    title: "Professionalism",
    description:
      "Ability/tendency to maintain AHNI values (excellence, integrity, responsiveness, respect and dedication) and use judgment to execute duties and responsibilities.",
  },
  {
    title: "Responsiveness",
    description:
      "Ability/tendency to maintain AHNI values (excellence, integrity, responsiveness, respect and dedication) and use judgment to execute duties and responsibilities.",
  },

  {
    title: "Post-delivery after sales report",
    description: "Ability to supervise and/or work as a team member",
  },
];
