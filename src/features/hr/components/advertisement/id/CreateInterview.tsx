"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import { CardContent } from "components/ui/card";
import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";
// import {
//   useAddLot,
//   useUpdateLot,
// } from "@/features/modules/procurement/lotController";
import { useGetJobAdvertisement } from "@/features/hr/controllers/jobAdvertisementController";
import { Badge } from "components/ui/badge";
import {
  Briefcase,
  Calendar,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  PersonStanding,
  Users,
} from "lucide-react";
import moment from "moment";

import { useMemo, useState } from "react";
import FormSelect from "components/atoms/FormSelectField";
import { SelectContent, SelectItem } from "components/ui/select";
import { z } from "zod";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { Label } from "components/ui/label";
import MultiSelectFormField from "components/ui/multiselect";
import FormInput from "components/atoms/FormInput";

export const LotSchema = z.object({
  interview_type: z.string().min(1, "Field Required"),
  interviewer: z.string().min(1, "Field Required"),
  interviewers: z.array(z.string().min(1, "Field is required")),
  start_date: z.string().min(1, "This field is required"),
  end_date: z.string().min(1, "This field is required"),
});

export type TInterviewFormValues = z.infer<typeof LotSchema>;

export interface TInterviewData {
  id: string;
  interview_type: string;
  interviewer: number;
  interviewers: string[];
  start_date: string;
  end_date: string;
}

const CreateInterviewModal = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const urlId = dialogProps?.data as unknown as string;

  //   const { id } = useParams();

  const {
    // @ts-ignore
    data: { data },
    // isLoading: advertLoading,
  } = useGetJobAdvertisement({
    id: urlId as string,
  });

  const { data: user } = useGetAllUsers({
    page: 1,
    size: 2000000,
  });

  const {
    job_type,

    background,
    duration,
    locations,
    number_of_positions,
    supervisor,
    //   title,
    created_datetime,
    //   grade_level,
    commencement_date,
    any_other_info,
    //   interviewers,
  } = data;

  const userOptions = useMemo(
    () =>
      user?.results?.map(({ first_name, last_name, id }) => ({
        label: `${first_name} ${last_name}`,
        value: id,
      })),
    [user]
  );

  const usersOptions = user?.results?.map(
    ({ first_name, last_name, id }) => ({
      name: `${first_name} ${last_name}`,
      id,
    })
  );

  const form = useForm<TInterviewFormValues>({
    resolver: zodResolver(LotSchema),
    defaultValues: {
      interview_type: "",
      start_date: "",
      end_date: "",
      //   interviewers: data?.interviewers ?? [],
    },
  });

  const { watch } = form;

  //   const { lots, isLoading } = useAddLot();
  //   const { updateLots, isLoading: updateLotsLoading } = useUpdateLot();
  const [showFullBackground, setShowFullBackground] = useState(false);
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<TInterviewFormValues> = async (data) => {
    console.log({ data });

    try {
      //   dialogProps?.type === "update"
      //     ? await updateLots({
      //         //@ts-ignore
      //         id: String(dialogProps?.data?.id),
      //         body: data,
      //       })
      //     : await lots(data)();
      toast.success("Lots Added Succesfully");
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      toast.error(error.data.message || "Something went wrong");
    }
  };
  return (
    <CardContent>
      <div className='space-y-6'>
        <div className='flex flex-wrap gap-2 max-w-2xl'>
          <Badge variant='md'>
            <Users size={15} />({number_of_positions} positions)
          </Badge>
          <Badge variant='md'>
            <Clock size={15} /> {duration}
          </Badge>
          <Badge variant='md'>
            <CalendarDays size={15} />{" "}
            {moment(created_datetime!).format("DD-MM-YYYY")}
          </Badge>
          <Badge variant='md'>
            <MapPin size={15} /> {locations}
          </Badge>
          <Badge variant='md'>
            <Briefcase size={15} /> {job_type}
          </Badge>
          <Badge variant='md'>
            <PersonStanding size={15} /> {supervisor}
          </Badge>
          {commencement_date && (
            <Badge variant='md'>
              <Calendar size={15} /> Starts:{" "}
              {moment(commencement_date).format("DD-MM-YYYY")}
            </Badge>
          )}
        </div>

        <div>
          <h4 className='font-medium mb-2'>Background</h4>
          <p className={`text-sm ${!showFullBackground ? "line-clamp-4" : ""}`}>
            {background}
          </p>
          {background && background.length > 150 && (
            <button
              onClick={() => setShowFullBackground(!showFullBackground)}
              className='text-blue-600 text-sm font-medium mt-1 flex items-center hover:underline'
            >
              {showFullBackground ? (
                <>
                  Show less <ChevronUp size={14} className='ml-1' />
                </>
              ) : (
                <>
                  Read more <ChevronDown size={14} className='ml-1' />
                </>
              )}
            </button>
          )}
        </div>

        {/* Additional information */}
        {any_other_info && (
          <div>
            <h4 className='font-medium mb-2'>Additional Information</h4>
            <p className='text-sm'>{any_other_info}</p>
          </div>
        )}
        <Form {...form}>
          <form
            action=''
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-y-7'
          >
            <FormSelect name='interview_type' label='Interview type'>
              <SelectContent>
                {["COMMITTEE", "NON COMMITTEE"].map(
                  (value: string, index: number) => (
                    <SelectItem key={index} value={value}>
                      {value}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </FormSelect>
            {watch("interview_type") === "COMMITTEE" ? (
              <div className=''>
                <Label className='font-semibold'>Interviewers</Label>
                <FormField
                  control={form.control}
                  name='interviewers'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiSelectFormField
                          options={usersOptions || []}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder='Please Select'
                          variant='inverted'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <FormSelect
                name='interviewer'
                label='Select Interviewer'
                required
                //   placeholder="Select Authorizer"
                options={userOptions}
              />
            )}
            <div className='grid grid-cols-2 gap-4'>
              <FormInput
                label='Start Date'
                type='date'
                name='start_date'
                required
              />

              <FormInput
                label='End Date'
                type='date'
                name='end_date'
                required
              />
            </div>

            <div className='flex justify-start gap-4'>
              <FormButton>
                {/* <FormButton loading={isLoading || updateLotsLoading}> */}
                Save
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </CardContent>
  );
};

export default CreateInterviewModal;
