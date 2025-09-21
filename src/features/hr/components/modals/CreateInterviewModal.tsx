"use client";

import { useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import { CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
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
import FormSelect from "@/components/FormSelect";
import { useGetJobAdvertisement } from "@/features/hr/controllers/jobAdvertisementController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useCreateInterview } from "@/features/hr/controllers/hrInterviewController";
import { Label } from "@/components/ui/label";
import MultiSelectFormField from "@/components/ui/multiselect";
import FormInput from "@/components/FormInput";

export const InterviewSchema = z.object({
  interview_type: z.string().min(1, "Field Required"),
  interviewer: z.string().min(1, "Field Required"),
  interviewers: z.array(z.string().min(1, "Field is required")),
  start_date: z.string().min(1, "This field is required"),
  end_date: z.string().min(1, "This field is required"),
});

export type TInterviewFormValues = z.infer<typeof InterviewSchema>;

export interface TInterviewData {
  id: string;
  interview_type: string;
  interviewer: number;
  interviewers: string[];
  start_date: string;
  end_date: string;
}

interface CreateInterviewModalProps {
  jobAdvertisementId: string;
  onClose?: () => void;
}

const CreateInterviewModal = ({ jobAdvertisementId, onClose }: CreateInterviewModalProps) => {
  const { data: jobAdvert } = useGetJobAdvertisement(jobAdvertisementId);
  const { data: users } = useGetAllUsers({
    page: 1,
    size: 2000,
    search: "",
  });

  const jobData = jobAdvert?.data;

  const {
    job_type,
    background,
    duration,
    locations,
    number_of_positions,
    supervisor,
    created_datetime,
    commencement_date,
    any_other_info,
  } = jobData || {};

  const userOptions = useMemo(
    () =>
      (users as any)?.data?.results?.map(({ first_name, last_name, id }: any) => {
        // Handle users with null names
        const fullName = `${first_name || ''} ${last_name || ''}`.trim() || 'Unnamed User';
        return {
          label: fullName,
          value: id,
        };
      }) || [],
    [users]
  );

  const usersOptions = (users as any)?.data?.results?.map(
    ({ first_name, last_name, id }: any) => {
      // Handle users with null names
      const fullName = `${first_name || ''} ${last_name || ''}`.trim() || 'Unnamed User';
      return {
        name: fullName,
        id,
      };
    }
  ) || [];

  // Debug logging
  console.log("Users data:", users);
  console.log("User options:", userOptions);

  const { createInterview, isLoading: isCreating } = useCreateInterview();

  const form = useForm<TInterviewFormValues>({
    resolver: zodResolver(InterviewSchema),
    defaultValues: {
      interview_type: "",
      interviewer: "",
      start_date: "",
      end_date: "",
      interviewers: [],
    },
  });

  const { watch } = form;
  const [showFullBackground, setShowFullBackground] = useState(false);

  const onSubmit: SubmitHandler<TInterviewFormValues> = async (data) => {
    try {
      console.log("Form data:", data);

      const interviewData = {
        advertisement: jobAdvertisementId,
        interview_type: data.interview_type,
        interviewer: data.interview_type === "COMMITTEE" ? undefined : data.interviewer,
        interviewers: data.interview_type === "COMMITTEE" ? data.interviewers : [],
        start_date: data.start_date,
        end_date: data.end_date,
      };

      console.log("Interview data being sent:", interviewData);

      await createInterview(interviewData);

      // Wait a bit for the state to update
      await new Promise(resolve => setTimeout(resolve, 100));

      toast.success("Interview created successfully");
      onClose?.();
      form.reset();
    } catch (error: any) {
      console.error("Interview creation error:", error);
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <CardContent>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 max-w-2xl">
          <Badge variant="secondary">
            <Users size={15} />({number_of_positions} positions)
          </Badge>
          <Badge variant="secondary">
            <Clock size={15} /> {duration}
          </Badge>
          <Badge variant="secondary">
            <CalendarDays size={15} />{" "}
            {moment(created_datetime!).format("DD-MM-YYYY")}
          </Badge>
          <Badge variant="secondary">
            <MapPin size={15} /> {locations}
          </Badge>
          <Badge variant="secondary">
            <Briefcase size={15} /> {job_type}
          </Badge>
          <Badge variant="secondary">
            <PersonStanding size={15} /> {supervisor}
          </Badge>
          {commencement_date && (
            <Badge variant="secondary">
              <Calendar size={15} /> Starts:{" "}
              {moment(commencement_date).format("DD-MM-YYYY")}
            </Badge>
          )}
        </div>

        <div>
          <h4 className="font-medium mb-2">Background</h4>
          <p className={`text-sm ${!showFullBackground ? "line-clamp-4" : ""}`}>
            {background}
          </p>
          {background && background.length > 150 && (
            <button
              onClick={() => setShowFullBackground(!showFullBackground)}
              className="text-blue-600 text-sm font-medium mt-1 flex items-center hover:underline"
            >
              {showFullBackground ? (
                <>
                  Show less <ChevronUp size={14} className="ml-1" />
                </>
              ) : (
                <>
                  Read more <ChevronDown size={14} className="ml-1" />
                </>
              )}
            </button>
          )}
        </div>

        {any_other_info && (
          <div>
            <h4 className="font-medium mb-2">Additional Information</h4>
            <p className="text-sm">{any_other_info}</p>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-7"
          >
            <FormSelect
              name="interview_type"
              label="Interview type"
              options={[
                { label: "COMMITTEE", value: "COMMITTEE" },
                { label: "NON COMMITTEE", value: "NON COMMITTEE" }
              ]}
            />
            
            {watch("interview_type") === "COMMITTEE" ? (
              <div>
                <Label className="font-semibold">Interviewers</Label>
                <FormField
                  control={form.control}
                  name="interviewers"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiSelectFormField
                          options={usersOptions || []}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder="Please Select"
                          variant="inverted"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <FormSelect
                name="interviewer"
                label="Select Interviewer"
                placeholder="Choose an interviewer"
                required
                options={userOptions}
              />
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Start Date"
                type="date"
                name="start_date"
                required
              />

              <FormInput
                label="End Date"
                type="date"
                name="end_date"
                required
              />
            </div>

            <div className="flex justify-start gap-4">
              <FormButton type="submit" loading={isCreating}>
                {isCreating ? "Creating..." : "Save"}
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </CardContent>
  );
};

export default CreateInterviewModal;