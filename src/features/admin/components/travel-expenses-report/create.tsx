"use client";

import Card from "components/Card";
import { CardContent } from "components/ui/card";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import FormButton from "@/components/FormButton";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import BackNavigation from "components/atoms/BackNavigation";
import { Separator } from "components/ui/separator";
import AddSquareIconFaded from "components/icons/AddSquareIconFaded";
import {
  TravelExpenseSchema,
  TTravelExpenseFormData,
} from "features/admin/types/travel-expense";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useEffect, useMemo } from "react";
import {
  useCreateTravelExpense,
  useGetSingleTravelExpense,
  useModifyTravelExpense,
} from "@/features/admin/controllers/travelExpenseController";
import { toast } from "sonner";
import DeleteIcon from "components/icons/DeleteIcon";
import { useGetAllExpenseAuthorizations } from "@/features/admin/controllers/expenseAuthorizationController";

const visaFreeOptions = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

export default function CreateTravelExpenseReportPage() {
  const form = useForm<TTravelExpenseFormData>({
    resolver: zodResolver(TravelExpenseSchema),
    defaultValues: {
      expense_authorization: "",
      user: "",
      staff_id: "",
      travel_purpose: "",
      reviewer: "",
      authorizer: "",
      approver: "",
      activities: [
        {
          date: "",
          activity: "",
          departure_datetime: "",
          departure_point: "",
          arrival_datetime: "",
          assignment_location: "",
          visa_free: "",
          airport_taxi_fee: "",
          registration_fee: "",
          inter_city_taxi_fee: "",
          total_amount: "",
          others: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "activities",
    control: form.control,
  });

  const { data: user } = useGetAllUsers({
    page: 1,
    size: 2000000,
    search: "",
  });

  const userOptions = useMemo(
    () =>
      user?.data.results.map(({ first_name, last_name, id }) => ({
        label: `${first_name} ${last_name}`,
        value: id,
      })),
    [user]
  );
  console.log({ userOptions });

  const { data: expenseAuthorization } = useGetAllExpenseAuthorizations({
    page: 1,
    size: 2000000,
  });

  const expenseAuthorizationOptions = useMemo(
    () =>
      expenseAuthorization?.data?.results?.map(({ ta_number, id }: any) => ({
        label: ta_number,
        value: id,
      })),
    [expenseAuthorization]
  );

  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  const { createTravelExpense, isLoading: isCreateLoading } =
    useCreateTravelExpense();

  const { modifyTravelExpense, isLoading: isModifyLoading } =
    useModifyTravelExpense(id);

  const onSubmit: SubmitHandler<TTravelExpenseFormData> = async (data) => {
    try {
      const transformedData = {
        ...data,
        user: data.user,
        reviewer: data.reviewer,
        authorizer: data.authorizer,
        approver: data.approver,
      };

      // Only include expense_authorization for new records (when creating)
      if (!id && data.expense_authorization) {
        (transformedData as any).expense_authorization = parseInt(
          data.expense_authorization
        );
      }

      const cleanData = Object.fromEntries(
        Object.entries(transformedData).filter(
          ([, value]) => value !== null && value !== undefined && value !== ""
        )
      ) as any;

      if (id) {
        await modifyTravelExpense(cleanData);
      } else {
        await createTravelExpense(cleanData);
      }

      router.push(AdminRoutes.TRAVEL_EXPENSE_REPORT);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  const { data: travelExpense } = useGetSingleTravelExpense(id || "", !!id);

  useEffect(() => {
    if (travelExpense) {
      const { data } = travelExpense;

      // Extract approval users from the approvals array
      const reviewerApproval = data.approvals?.find(
        (approval) => approval.approval_level === "REVIEW"
      );
      const authorizerApproval = data.approvals?.find(
        (approval) => approval.approval_level === "AUTHORIZE"
      );
      const approverApproval = data.approvals?.find(
        (approval) => approval.approval_level === "APPROVE"
      );

      form.reset({
        expense_authorization: "", // This field is not returned in API response for existing records
        user: data.user.id,
        staff_id: data.staff_id,
        travel_purpose: data.travel_purpose,
        reviewer: reviewerApproval?.user.id || "",
        authorizer: authorizerApproval?.user.id || "",
        approver: approverApproval?.user.id || "",
        activities: data.activities.map((activity) => ({
          date: activity.date,
          activity: activity.activity,
          departure_datetime: activity.departure_datetime,
          departure_point: activity.departure_point,
          arrival_datetime: activity.arrival_datetime,
          assignment_location: activity.assignment_location,
          visa_free: String(activity.visa_free),
          airport_taxi_fee: activity.airport_taxi_fee,
          registration_fee: activity.registration_fee,
          inter_city_taxi_fee: activity.inter_city_taxi_fee,
          total_amount: activity.total_amount,
          others: activity.others,
        })),
      });
    }
  }, [travelExpense, user, form]);

  return (
    <div>
      <BackNavigation />

      <Card>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid grid-cols-2 gap-8'>
                <FormSelect
                  label='Expense Authorization'
                  name='expense_authorization'
                  placeholder='Select Expense Authorization'
                  required={!id} // Only required for new records, not when editing
                  options={expenseAuthorizationOptions}
                  disabled={!!id} // Disable when editing since it's not in the response
                />

                <FormSelect
                  label='User'
                  name='user'
                  placeholder='Select User'
                  required
                  options={userOptions}
                />

                <FormInput
                  label='Staff ID No'
                  name='staff_id'
                  placeholder='Enter Staff ID No'
                  required
                />

                <FormInput
                  label='Purpose of Travel'
                  name='travel_purpose'
                  placeholder='Purpose of Travel'
                  required
                />
              </div>

              <Separator className='my-10' />

              <div className='grid grid-cols-3 gap-8'>
                <FormSelect
                  label='Reviewer'
                  name='reviewer'
                  placeholder='Select Reviewer'
                  required
                  options={userOptions}
                  disabled={
                    !!(
                      id &&
                      travelExpense?.data.approvals?.find(
                        (a) => a.approval_level === "REVIEW"
                      )?.is_executed
                    )
                  }
                />

                <FormSelect
                  label='Authorizer'
                  name='authorizer'
                  placeholder='Select Authorizer'
                  required
                  options={userOptions}
                  disabled={
                    !!(
                      id &&
                      travelExpense?.data.approvals?.find(
                        (a) => a.approval_level === "AUTHORIZE"
                      )?.is_executed
                    )
                  }
                />

                <FormSelect
                  label='Approver'
                  name='approver'
                  placeholder='Select Approver'
                  required
                  options={userOptions}
                  disabled={
                    !!(
                      id &&
                      travelExpense?.data.approvals?.find(
                        (a) => a.approval_level === "APPROVE"
                      )?.is_executed
                    )
                  }
                />
              </div>

              <Separator className='my-10' />

              <div className='space-y-8'>
                {fields.map((field, index) => (
                  <div key={field.id}>
                    <div className='flex items-center justify-between'>
                      <h3 className='font-bold text-lg'>Day {index + 1}</h3>

                      <Button
                        type='button'
                        variant='ghost'
                        title={`Delete Activity ${index + 1}`}
                        className='text-red-500'
                        onClick={() => remove(index)}
                      >
                        <DeleteIcon />
                      </Button>
                    </div>

                    <div key={field.id} className='grid grid-cols-2 gap-8 mt-5'>
                      <FormInput
                        label='Date'
                        name={`activities.${index}.date`}
                        type='date'
                        required
                      />

                      <FormInput
                        label='Activity'
                        name={`activities.${index}.activity`}
                        placeholder='Enter Activity'
                        required
                      />

                      <FormInput
                        label='Departure Date'
                        name={`activities.${index}.departure_datetime`}
                        type='date'
                        required
                      />

                      <FormInput
                        label='Point of Departure'
                        name={`activities.${index}.departure_point`}
                        placeholder='Enter Departure Point'
                        required
                      />

                      <FormInput
                        label='Arrival Date'
                        name={`activities.${index}.arrival_datetime`}
                        type='date'
                        required
                      />

                      <FormInput
                        label='Assignment Location'
                        name={`activities.${index}.assignment_location`}
                        placeholder='Enter Assignment Location'
                        required
                      />

                      <FormSelect
                        label='Visa Free?'
                        name={`activities.${index}.visa_free`}
                        placeholder='Select Visa Free Option'
                        required
                        options={visaFreeOptions}
                      />

                      <FormInput
                        label='Airport Taxi Fee'
                        name={`activities.${index}.airport_taxi_fee`}
                        placeholder='Enter Airport Taxi'
                        required
                      />

                      <FormInput
                        label='Registration Fee'
                        name={`activities.${index}.registration_fee`}
                        placeholder='Enter Registration'
                        required
                      />

                      <FormInput
                        label='Taxi fare within /Between cities'
                        name={`activities.${index}.inter_city_taxi_fee`}
                        placeholder='Enter Taxi Fare'
                        required
                      />

                      <FormInput
                        label='Total Amount'
                        name={`activities.${index}.total_amount`}
                        placeholder='Enter Total Amount'
                        required
                      />

                      <FormInput
                        label='Others '
                        name={`activities.${index}.others`}
                        placeholder='Others'
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className='flex justify-end mt-8'>
                <Button
                  type='button'
                  variant='ghost'
                  className='bg-[#FFF2F2] text-primary font-semibold hover:bg-[#FFF2F2] hover:text-primary'
                  onClick={() =>
                    append({
                      date: "",
                      activity: "",
                      departure_datetime: "",
                      departure_point: "",
                      arrival_datetime: "",
                      assignment_location: "",
                      visa_free: "",
                      airport_taxi_fee: "",
                      registration_fee: "",
                      inter_city_taxi_fee: "",
                      total_amount: "",
                      others: "",
                    })
                  }
                >
                  <AddSquareIconFaded />
                  Add Column
                </Button>
              </div>

              <div className='flex items-center justify-end mt-10 gap-2'>
                <Link href={AdminRoutes.INDEX_PAYMENT_REQUEST}>
                  <Button variant='outline' type='button' size='lg'>
                    Cancel
                  </Button>
                </Link>
                <FormButton
                  loading={isCreateLoading || isModifyLoading}
                  size='lg'
                >
                  Submit
                </FormButton>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
