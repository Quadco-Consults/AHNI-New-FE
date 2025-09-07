"use client";

import FormButton from "@/components/FormButton";
import FormCheckBox from "components/atoms/FormCheckBox";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import FormTextArea from "components/atoms/FormTextArea";
import Card from "components/Card";
import GoBack from "components/GoBack";
import { Form } from "components/ui/form";
import { Label } from "components/ui/label";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import FormRadio from "components/atoms/FormRadio";
import {
  ExpenseAuthorizationSchema,
  TExpenseAuthorizationFormData,
} from "features/admin/types/expense-authorization";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetAllProjectsQuery } from "@/features/projects/controllers/projectController";
import { useEffect, useMemo } from "react";
import { useGetAllDepartmentsQuery } from "@/features/modules/controllers/config/departmentController";
import { useGetAllFCONumbersQuery } from "@/features/modules/controllers/finance/fcoNumberController";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AdminRoutes } from "constants/RouterConstants";
import { Button } from "components/ui/button";
import {
  useCreateExpenseAuthorizationMutation,
  useGetSingleExpenseAuthorizationQuery,
  useModifyExpenseAuthorizationMutation,
} from "@/features/admin/controllers/expenseAuthorizationController";
import { toast } from "sonner";
import { useGetAllUsersQuery } from "@/features/auth/controllers/userController";
import FadedButton from "components/atoms/FadedButton";

import AddSquareIcon from "components/icons/AddSquareIcon";
import DeleteIcon from "components/icons/DeleteIcon";

const radioOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

export default function CreateExpenseAuthorization() {
  const form = useForm<TExpenseAuthorizationFormData>({
    resolver: zodResolver(ExpenseAuthorizationSchema),
    defaultValues: {
      traveler_type: "SINGLE" as const,
      ta_number: "",
      department: "",
      fco: "",
      is_managing_director_notified: false,
      is_travel_advances_dependent: false,
      is_document_needed: false,
      is_car_rental_allowed: false,
      is_hotel_reservation_required: false,
      is_hotel_transport_required: false,
      travel_advances_dependent_comment: "",
      document_needed_comment: "",
      car_rental_comment: "",
      hotel_reservation_comment: "",
      hotel_transport_comment: "",
      justification: "",
      reviewer: "",
      authorizer: "",
      approver: "",
      // Single traveler fields
      address: "",
      destinations: [
        {
          project: "",
          city: "",
          state: "",
          arrival_date: "",
          departure_date: "",
          purpose: "",
          accommodation_required: false,
          transport_required: false,
          travel_fee: {
            lodging: 0,
            meals: 0,
            number_of_nights: 1,
            interstate: 0,
            airport_taxi: 0,
            car_hire: 0,
          },
        },
      ],
      // Multiple travelers field
      travelers: [],
    },
  });

  const {
    fields: destinationFields,
    append: appendDestination,
    remove: removeDestination,
  } = useFieldArray({
    name: "destinations",
    control: form.control,
  });

  const {
    fields: travelerFields,
    append: appendTraveler,
    remove: removeTraveler,
  } = useFieldArray({
    name: "travelers",
    control: form.control,
  });

  const router = useRouter();

  const { data: project } = useGetAllProjectsQuery({
    page: 1,
    size: 2000000,
    search: "",
  });

  const projectoptions = useMemo(
    () =>
      project?.data.results.map(({ title, id }) => ({
        label: title,
        value: id,
      })),
    [project]
  );

  const { data: department } = useGetAllDepartmentsQuery({
    page: 1,
    size: 2000000,
    search: "",
  });

  const departmentOptions = useMemo(
    () =>
      department?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [department]
  );

  const { data: fco } = useGetAllFCONumbersQuery({
    page: 1,
    size: 20000000,
    search: "",
  });

  const fcoOptions = useMemo(
    () =>
      fco?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [fco]
  );

  const { data: user } = useGetAllUsersQuery({
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

  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  const { createExpenseAuthorization, isLoading: isCreateLoading } =
    useCreateExpenseAuthorizationMutation();

  const { modifyExpenseAuthorization, isLoading: isModifyLoading } =
    useModifyExpenseAuthorizationMutation(id || "");

  const onSubmit: SubmitHandler<TExpenseAuthorizationFormData> = async (
    data
  ) => {
    try {
      // Transform data to match API expectations
      const transformedData = {
        ...data,
        destinations: data.destinations?.map((dest) => ({
          ...dest,
          // Convert travel_fee object to array format
          travel_fee: [dest.travel_fee],
        })),
      };

      console.log(
        "Transformed data:",
        JSON.stringify(transformedData, null, 2)
      );
      let res;

      if (id) {
        res = await modifyExpenseAuthorization(transformedData);
        console.log({ res });
      } else {
        res = await createExpenseAuthorization(transformedData);
      }
      if (res?.status === "success") {
        // toast.success("Good Receive Note saved successfully");
        router.push(AdminRoutes.EXPENSE_AUTHORIZATION);
      }
    } catch (error: any) {
      console.error("API Error:", error);
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  const { data: expenseAuthorization } = useGetSingleExpenseAuthorizationQuery(
    id || "",
    !!id
  );

  useEffect(() => {
    if (expenseAuthorization) {
      const { data } = expenseAuthorization;

      // Map destinations from API response
      const mappedDestinations = data.destinations && data.destinations.length > 0 
        ? data.destinations.map(dest => ({
            project: dest.project?.id || "",
            city: dest.city || "",
            state: dest.state || "",
            arrival_date: dest.arrival_date || "",
            departure_date: dest.departure_date || "",
            purpose: dest.purpose || "",
            accommodation_required: dest.accommodation_required || false,
            transport_required: dest.transport_required || false,
            travel_fee: {
              lodging: parseFloat(dest.travel_fee?.[0]?.lodging || "0"),
              meals: parseFloat(dest.travel_fee?.[0]?.meals || "0"),
              number_of_nights: dest.travel_fee?.[0]?.number_of_nights || 1,
              interstate: parseFloat(dest.travel_fee?.[0]?.interstate || "0"),
              airport_taxi: parseFloat(dest.travel_fee?.[0]?.airport_taxi || "0"),
              car_hire: parseFloat(dest.travel_fee?.[0]?.car_hire || "0"),
            },
          }))
        : [
            {
              project: "",
              city: "",
              state: "",
              arrival_date: "",
              departure_date: "",
              purpose: "",
              accommodation_required: false,
              transport_required: false,
              travel_fee: {
                lodging: 0,
                meals: 0,
                number_of_nights: 1,
                interstate: 0,
                airport_taxi: 0,
                car_hire: 0,
              },
            },
          ];

      // Find approval users by level
      const reviewerApproval = data.approvals?.find(a => a.approval_level === "REVIEW");
      const authorizerApproval = data.approvals?.find(a => a.approval_level === "AUTHORIZE");
      const approverApproval = data.approvals?.find(a => a.approval_level === "APPROVE");

      form.reset({
        traveler_type: data.traveler_type || "SINGLE" as const,
        ta_number: data.ta_number || "",
        department: data.department?.id || "",
        fco: data.fco?.id || "",
        is_managing_director_notified: data.is_managing_director_notified || false,
        is_travel_advances_dependent: data.is_travel_advances_dependent || false,
        is_document_needed: data.is_document_needed || false,
        is_car_rental_allowed: data.is_car_rental_allowed || false,
        is_hotel_reservation_required: data.is_hotel_reservation_required || false,
        is_hotel_transport_required: data.is_hotel_transport_required || false,
        travel_advances_dependent_comment: data.travel_advances_dependent_comment || "",
        document_needed_comment: data.document_needed_comment || "",
        car_rental_comment: data.car_rental_comment || "",
        hotel_reservation_comment: data.hotel_reservation_comment || "",
        hotel_transport_comment: data.hotel_transport_comment || "",
        justification: data.justification || "",
        address: data.address || "",
        destinations: mappedDestinations,
        travelers: [], // For future multiple traveler support
        reviewer: reviewerApproval?.user?.id || "",
        authorizer: authorizerApproval?.user?.id || "",
        approver: approverApproval?.user?.id || "",
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenseAuthorization, project, department, fco, user]);

  return (
    <div className='space-y-8'>
      <div className='flex items-center gap-x-5'>
        <GoBack />
        <h4 className='text-xl font-bold'>Expense Authorization Form</h4>
      </div>
      <Card>
        <Form {...form}>
          <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
            {/* Traveler Type Selection */}
            <div className='space-y-4'>
              <Label className='text-lg font-bold'>Traveler Type</Label>
              <FormRadio
                label='Select traveler type'
                name='traveler_type'
                options={[
                  { label: "Single Traveler", value: "SINGLE" },
                  { label: "Multiple Travelers", value: "MULTIPLE" },
                ]}
              />
            </div>

            {/* Basic Information */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <FormInput
                label='TA Number'
                name='ta_number'
                placeholder='Enter TA Number'
                required
              />

              <FormSelect
                label='Department'
                name='department'
                placeholder='Select Department'
                required
                options={departmentOptions}
              />

              <FormSelect
                label='FCO'
                name='fco'
                placeholder='Select FCO'
                required
                options={fcoOptions}
              />
            </div>

            {/* Single Traveler Address */}
            {form.watch("traveler_type") === "SINGLE" && (
              <FormInput
                label='Address'
                name='address'
                placeholder='Enter Address'
                required
              />
            )}

            <FormCheckBox
              label='Managing Director Notified?'
              name='is_managing_director_notified'
              value='yes'
            />

            <div className='space-y-4'>
              <Label className='text-lg'>Special Requests:</Label>

              <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                <div className='space-y-2'>
                  <FormRadio
                    label='Travel advances are based on current State Department per diem rates which are updated on a monthly basis or approved local rates for the projects'
                    name='is_travel_advances_dependent'
                    options={radioOptions}
                  />
                  <FormTextArea
                    label='Travel Advances Comment (Optional)'
                    name='travel_advances_dependent_comment'
                    placeholder='Enter additional comments about travel advances'
                  />
                </div>

                <div className='space-y-2'>
                  <FormRadio
                    label='Documents Needed more than 3 days prior to departure?'
                    name='is_document_needed'
                    options={radioOptions}
                  />
                  <FormTextArea
                    label='Document Comment (Optional)'
                    name='document_needed_comment'
                    placeholder='Enter additional comments about documents'
                  />
                </div>

                <div className='space-y-2'>
                  <FormRadio
                    label='Car Rental? If yes, attach approved per diem variance memo to Travel Manager'
                    name='is_car_rental_allowed'
                    options={radioOptions}
                  />
                  <FormTextArea
                    label='Car Rental Comment (Optional)'
                    name='car_rental_comment'
                    placeholder='Enter additional comments about car rental'
                  />
                </div>

                <div className='space-y-2'>
                  <FormRadio
                    label='Hotel Reservations?  If yes, specify dates in/out and hotel(s) if known.'
                    name='is_hotel_reservation_required'
                    options={radioOptions}
                  />
                  <FormTextArea
                    label='Hotel Reservation Comment (Optional)'
                    name='hotel_reservation_comment'
                    placeholder='Enter additional comments about hotel reservations'
                  />
                </div>

                <div className='space-y-2'>
                  <FormRadio
                    label='Hotel transfer/taxi/other transportation needed (International travel only)'
                    name='is_hotel_transport_required'
                    options={radioOptions}
                  />
                  <FormTextArea
                    label='Hotel Transport Comment (Optional)'
                    name='hotel_transport_comment'
                    placeholder='Enter additional comments about hotel transport'
                  />
                </div>
              </div>

              <FormTextArea
                label='Justification (Optional)'
                name='justification'
                placeholder='Enter justification for this expense authorization'
              />
            </div>

            {/* Multiple Travelers Section */}
            {form.watch("traveler_type") === "MULTIPLE" && (
              <div className='space-y-4'>
                <Label className='text-lg font-bold'>Travelers:</Label>
                <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                  <p className='text-blue-700'>
                    Multiple travelers functionality is coming soon. Please use
                    Single Traveler mode for now.
                  </p>
                </div>
              </div>
            )}

            {/* Destinations Section for Single Traveler */}
            {form.watch("traveler_type") === "SINGLE" && (
              <div className='space-y-4'>
                <Label className='text-lg font-bold'>Destinations:</Label>

                <section className='space-y-5'>
                  {destinationFields?.map((field, index) => (
                    <Card key={field.id} className='space-y-5 p-6'>
                      <div className='flex items-center justify-between'>
                        <Label className='text-lg'>
                          Destination {index + 1}
                        </Label>
                        {destinationFields.length > 1 && (
                          <Button
                            variant='ghost'
                            type='button'
                            onClick={() => removeDestination(index)}
                          >
                            <DeleteIcon />
                          </Button>
                        )}
                      </div>

                      <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                        <FormSelect
                          label='Project'
                          name={`destinations.${index}.project`}
                          placeholder='Select Project'
                          required
                          options={projectoptions}
                        />

                        <FormInput
                          label='City'
                          name={`destinations.${index}.city`}
                          placeholder='Enter City'
                          required
                        />

                        <FormInput
                          label='State'
                          name={`destinations.${index}.state`}
                          placeholder='Enter State'
                          required
                        />

                        <FormTextArea
                          label='Purpose'
                          name={`destinations.${index}.purpose`}
                          placeholder='Enter Purpose'
                          required
                        />

                        <FormInput
                          label='Arrival Date'
                          name={`destinations.${index}.arrival_date`}
                          type='date'
                          required
                        />

                        <FormInput
                          label='Departure Date'
                          name={`destinations.${index}.departure_date`}
                          type='date'
                          required
                        />
                      </div>

                      <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                        <FormCheckBox
                          label='Accommodation Required'
                          name={`destinations.${index}.accommodation_required`}
                        />

                        <FormCheckBox
                          label='Transport Required'
                          name={`destinations.${index}.transport_required`}
                        />
                      </div>

                      {/* Travel Fee for this destination */}
                      <div className='space-y-4'>
                        <Label className='text-lg font-bold'>
                          Travel Fees:
                        </Label>

                        <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
                          <FormInput
                            label='Lodging'
                            name={`destinations.${index}.travel_fee.lodging`}
                            type='number'
                            placeholder='0.00'
                            required
                          />

                          <FormInput
                            label='Meals'
                            name={`destinations.${index}.travel_fee.meals`}
                            type='number'
                            placeholder='0.00'
                            required
                          />

                          <FormInput
                            label='Number of Nights'
                            name={`destinations.${index}.travel_fee.number_of_nights`}
                            type='number'
                            placeholder='1'
                            required
                          />

                          <FormInput
                            label='Interstate'
                            name={`destinations.${index}.travel_fee.interstate`}
                            type='number'
                            placeholder='0.00'
                            required
                          />

                          <FormInput
                            label='Airport Taxi'
                            name={`destinations.${index}.travel_fee.airport_taxi`}
                            type='number'
                            placeholder='0.00'
                            required
                          />

                          <FormInput
                            label='Car Hire'
                            name={`destinations.${index}.travel_fee.car_hire`}
                            type='number'
                            placeholder='0.00'
                            required
                          />
                        </div>
                      </div>
                    </Card>
                  ))}

                  <div className='flex justify-end'>
                    <FadedButton
                      className='text-primary'
                      type='button'
                      onClick={() =>
                        appendDestination({
                          project: "",
                          city: "",
                          state: "",
                          arrival_date: "",
                          departure_date: "",
                          purpose: "",
                          accommodation_required: false,
                          transport_required: false,
                          travel_fee: {
                            lodging: 0,
                            meals: 0,
                            number_of_nights: 1,
                            interstate: 0,
                            airport_taxi: 0,
                            car_hire: 0,
                          },
                        })
                      }
                    >
                      <AddSquareIcon /> Add Destination
                    </FadedButton>
                  </div>
                </section>
              </div>
            )}

            <div className='space-y-4'>
              <Label className='font-bold text-lg'>Approvals</Label>

              <div className='grid grid-cols-3 gap-5'>
                <FormSelect
                  label='Reviewer'
                  name='reviewer'
                  placeholder='Select Reviewer'
                  required
                  options={userOptions}
                />

                <FormSelect
                  label='Authorizer'
                  name='authorizer'
                  placeholder='Select Authorizer'
                  required
                  options={userOptions}
                />

                <FormSelect
                  label='Approver'
                  name='approver'
                  placeholder='Select Approver'
                  required
                  options={userOptions}
                />
              </div>
            </div>

            <div className='flex items-center justify-end gap-5'>
              <Link href={AdminRoutes.EXPENSE_AUTHORIZATION}>
                <Button type='button' size='lg' variant='outline'>
                  Cancel
                </Button>
              </Link>
              <FormButton
                type='submit'
                size='lg'
                loading={isCreateLoading || isModifyLoading}
              >
                Submit
              </FormButton>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
