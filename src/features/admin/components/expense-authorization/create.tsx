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
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

export default function CreateExpenseAuthorization() {
  const form = useForm<TExpenseAuthorizationFormData>({
    resolver: zodResolver(ExpenseAuthorizationSchema),
    defaultValues: {
      project: "",
      department: "",
      fco: "",
      address: "",
      city: "",
      ta_number: "",
      arrival_date: "",
      departure_date: "",
      is_managing_director_notified: false,
      is_travel_advances_dependent: "",
      is_document_needed: "",
      is_car_rental_allowed: "",
      is_hotel_reservation_required: "",
      is_hotel_transport_required: "",
      // destination: "",
      // travel_fee: {
      //     lodging: "",
      //     meals: "",
      //     number_of_nights: "",
      //     interstate: "",
      //     airport_taxi: "",
      //     car_hire: "",
      // },
      reviewer: "",
      authorizer: "",
      approver: "",

      destinations: [
        {
          destination: "",
          travel_fee: {
            lodging: "",
            meals: "",
            number_of_nights: "",
            interstate: "",
            airport_taxi: "",
            car_hire: "",
          },
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "destinations",
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

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const { createExpenseAuthorization, isLoading: isCreateLoading } =
    useCreateExpenseAuthorizationMutation();

  const { modifyExpenseAuthorization, isLoading: isModifyLoading } =
    useModifyExpenseAuthorizationMutation(id || "");

  const onSubmit: SubmitHandler<TExpenseAuthorizationFormData> = async (
    data
  ) => {
    try {
      if (id) {
        await modifyExpenseAuthorization(data);
        toast.success("Expense Authorization Updated");
      } else {
        await createExpenseAuthorization(data);
        toast.success("Expense Authorization Created");
      }

      router.push(AdminRoutes.EXPENSE_AUTHORIZATION);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  const { data: expenseAuthorization } = useGetSingleExpenseAuthorizationQuery(
    id || "", !!id
  );

  useEffect(() => {
    if (expenseAuthorization) {
      const { data } = expenseAuthorization;

      form.reset({
        project: data.project.id,
        department: data.department.id,
        fco: data.fco.id,
        address: data.address,
        city: data.city,
        ta_number: data.ta_number,
        arrival_date: data.arrival_date,
        departure_date: data.departure_date,
        is_managing_director_notified: data.is_managing_director_notified,
        is_travel_advances_dependent: String(data.is_travel_advances_dependent),
        is_document_needed: String(data.is_document_needed),
        is_car_rental_allowed: String(data.is_car_rental_allowed),
        is_hotel_reservation_required: String(
          data.is_hotel_reservation_required
        ),
        is_hotel_transport_required: String(data.is_hotel_transport_required),
        // destination: data.destination,
        // travel_fee: {
        //     lodging: "",
        //     meals: "",
        //     number_of_nights: "",
        //     interstate: "",
        //     airport_taxi: "",
        //     car_hire: "",
        // },

        reviewer: "",
        authorizer: "",
        approver: "",
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
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
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

              <FormInput
                label='Address'
                name='address'
                placeholder='Enter Address'
                required
              />

              <FormInput
                label='City'
                name='city'
                required
                placeholder='Enter City'
              />

              <FormInput
                label='EA Number'
                name='ta_number'
                placeholder='Enter TA Number'
                required
              />

              <FormInput
                label='Arrival Date'
                name='arrival_date'
                type='date'
                required
              />

              <FormInput
                label='Departure Date'
                name='departure_date'
                type='date'
                required
              />
            </div>

            <FormCheckBox
              label='Managing Director Notified?'
              name='is_managing_director_notified'
              value='yes'
            />

            <div className='space-y-4'>
              <Label className='text-lg'>Special Requests:</Label>

              <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                <FormRadio
                  label='Travel advances are based on current State Department per diem rates which are updated on a monthly basis or approved local rates for the projects'
                  name='is_travel_advances_dependent'
                  options={radioOptions}
                />

                <FormRadio
                  label='Documents Needed more than 3 days prior to departure?'
                  name='is_document_needed'
                  options={radioOptions}
                />
                <FormRadio
                  label='Car Rental? If yes, attach approved per diem variance memo to Travel Manager'
                  name='is_car_rental_allowed'
                  options={radioOptions}
                />

                <FormRadio
                  label='Hotel Reservations?  If yes, specify dates in/out and hotel(s) if known.'
                  name='is_hotel_reservation_required'
                  options={radioOptions}
                />

                <FormRadio
                  label='Hotel transfer/taxi/other transportation needed (International travel only)'
                  name='is_hotel_transport_required'
                  options={radioOptions}
                />
              </div>
            </div>
            <section className='space-y-5'>
              {fields?.map((field, index) => (
                <Card key={field.id} className='space-y-5'>
                  <FormSelect
                    label='Project Name'
                    name='project'
                    placeholder='Select Project'
                    required
                    options={projectoptions}
                  />

                  <FormTextArea
                    label='Destination'
                    name={`destinations.${index}.destination`}
                    placeholder='Enter Destination'
                    required
                  />

                  <div className='grid grid-cols-2 gap-5'>
                    <FormInput
                      type='date'
                      label='Date of Arrival'
                      name={`destinations.${index}.travel_fee.car_hire`}
                      required
                    />

                    <FormInput
                      type='date'
                      label='Date of Departure'
                      name={`destinations.${index}.travel_fee.car_hire`}
                      required
                    />
                  </div>

                  <div className='space-y-4'>
                    <Label className='text-lg font-bold'>
                      Travel Office Use:
                    </Label>

                    <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
                      <FormInput
                        label='Lodging'
                        name={`destinations.${index}.travel_fee.lodging`}
                        type='number'
                        placeholder='Enter Lodging'
                        required
                      />

                      <FormInput
                        label='Meals'
                        name={`destinations.${index}.travel_fee.meals`}
                        type='number'
                        placeholder='Enter Meals'
                        required
                      />

                      <FormInput
                        label='Number of Night'
                        name={`destinations.${index}.travel_fee.number_of_nights`}
                        type='number'
                        placeholder='Enter No of Nights'
                        required
                      />

                      <FormInput
                        label='Interstate'
                        name={`destinations.${index}.travel_fee.interstate`}
                        type='number'
                        placeholder='Enter Interstate'
                        required
                      />

                      <FormInput
                        label='Airport Taxi'
                        name={`destinations.${index}.travel_fee.airport_taxi`}
                        type='number'
                        placeholder='Enter Airport Taxi'
                        required
                      />

                      <FormInput
                        label='Car Hire'
                        name={`destinations.${index}.travel_fee.car_hire`}
                        type='number'
                        placeholder='Enter Car Hire'
                        required
                      />

                      <Button
                        variant='ghost'
                        type='button'
                        onClick={() => remove(index)}
                      >
                        <DeleteIcon />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              <div className='flex justify-end'>
                <FadedButton
                  className='text-primary'
                  type='button'
                  onClick={() =>
                    append({
                      destination: "",
                      travel_fee: {
                        lodging: "",
                        meals: "",
                        number_of_nights: "",
                        interstate: "",
                        airport_taxi: "",
                        car_hire: "",
                      },
                    })
                  }
                >
                  <AddSquareIcon /> Add Destination
                </FadedButton>
              </div>
            </section>

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
