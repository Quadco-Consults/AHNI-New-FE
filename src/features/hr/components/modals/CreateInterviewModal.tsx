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
import { useGetJobApplications } from "@/features/hr/controllers/hrJobApplicationsController";
import { Label } from "@/components/ui/label";
import MultiSelectFormField from "@/components/ui/multiselect";
import FormInput from "@/components/FormInput";
import { useAppDispatch } from "@/hooks/useStore";
import { closeDialog } from "@/store/ui";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

export const InterviewSchema = z.object({
  application: z.string().min(1, "Please select an application"),
  interview_type: z.string().min(1, "Interview type is required"),
  interviewer: z.string().optional(),
  interviewers: z.array(z.string()).optional().default([]),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
}).refine(
  (data) => {
    if (data.interview_type === "non_committee") {
      return data.interviewer && data.interviewer.length > 0;
    }
    if (data.interview_type === "committee") {
      return data.interviewers && data.interviewers.length > 0;
    }
    return true;
  },
  {
    message: "Please select interviewer(s) based on interview type",
    path: ["interviewer"], // This will show the error on the interviewer field
  }
);

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
  jobAdvertisementId?: string;
  data?: string; // Alternative prop name for dialog system - can be advertisement ID or application ID
  preSelectedApplicationId?: string; // For pre-selecting a specific application
  onClose?: () => void;
}

const CreateInterviewModal = ({ jobAdvertisementId, data, onClose }: CreateInterviewModalProps) => {
  const dispatch = useAppDispatch();

  // Handle different data formats - could be string (advertisement ID) or object with both IDs
  let advertisementId: string;
  let preSelectedApplicationId: string | undefined;

  if (typeof data === 'string') {
    advertisementId = jobAdvertisementId || data;
  } else if (data && typeof data === 'object') {
    advertisementId = (data as any).advertisementId;
    preSelectedApplicationId = (data as any).applicationId;
  } else {
    advertisementId = jobAdvertisementId || '';
  }

  console.log("CreateInterviewModal received props:", { jobAdvertisementId, data, advertisementId });

  if (!advertisementId) {
    return (
      <CardContent>
        <p>Error: No advertisement ID provided</p>
      </CardContent>
    );
  }

  const { data: jobAdvert } = useGetJobAdvertisement(advertisementId);
  const { data: users } = useGetAllUsers({
    page: 1,
    size: 2000,
    search: "",
  });

  // Fetch shortlisted applications for this advertisement
  const { data: applicationsData } = useGetJobApplications({
    id: advertisementId,
    status: "SHORTLISTED",
    size: 1000, // Get all shortlisted applications
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
    title,
    position,
    grade,
    level,
  } = jobData || {};

  // Handle locations array properly
  const locationString = Array.isArray(locations) && locations.length > 0
    ? locations.map((loc: any) => loc.name || loc).join(', ')
    : 'Not specified';

  // Handle supervisor display
  const supervisorDisplay = supervisor?.name || supervisor || 'Not assigned';

  // Handle position/title display
  const positionDisplay = position?.name || position || title || 'Not specified';

  // Handle grade/level display
  const gradeDisplay = grade?.name || grade || level?.name || level || 'Not specified';

  const userOptions = useMemo(
    () =>
      (users as any)?.data?.results?.map((user: any) => {
        // Handle different user object structures
        const firstName = user.first_name || user.name?.split(' ')[0] || '';
        const lastName = user.last_name || user.name?.split(' ')[1] || '';
        const fullName = `${firstName} ${lastName}`.trim() || user.name || 'Unnamed User';
        return {
          label: fullName,
          value: String(user.id), // Ensure value is string
        };
      }) || [],
    [users]
  );

  const applicationOptions = useMemo(
    () =>
      (applicationsData as any)?.data?.results?.map((application: any) => {
        // Build applicant name
        const applicantName = [
          application.applicant_first_name,
          application.applicant_middle_name,
          application.applicant_last_name
        ].filter(Boolean).join(' ') || 'Unnamed Applicant';

        return {
          label: `${applicantName} - ${application.position_applied || 'No Position'}`,
          value: String(application.id),
        };
      }) || [],
    [applicationsData]
  );

  const usersOptions = (users as any)?.data?.results?.map(
    (user: any) => {
      // Handle different user object structures
      const firstName = user.first_name || user.name?.split(' ')[0] || '';
      const lastName = user.last_name || user.name?.split(' ')[1] || '';
      const fullName = `${firstName} ${lastName}`.trim() || user.name || 'Unnamed User';
      return {
        name: fullName,
        id: String(user.id), // Ensure id is string
      };
    }
  ) || [];

  // Debug logging
  console.log("Users data:", users);
  console.log("User options:", userOptions);
  console.log("Job data:", jobData);
  console.log("Supervisor:", supervisor, "Type:", typeof supervisor);

  const { createInterview, isLoading: isCreating } = useCreateInterview();

  const form = useForm<TInterviewFormValues>({
    resolver: zodResolver(InterviewSchema),
    defaultValues: {
      application: preSelectedApplicationId || "",
      interview_type: "",
      interviewer: "",
      start_date: "",
      end_date: "",
      interviewers: [],
    },
    mode: "onChange", // This will validate on change
  });

  const { watch } = form;
  const [showFullBackground, setShowFullBackground] = useState(false);

  const onSubmit: SubmitHandler<TInterviewFormValues> = async (data) => {
    console.log("🔥 SAVE BUTTON CLICKED - onSubmit triggered");

    try {
      console.log("=== INTERVIEW CREATION DEBUG ===");
      console.log("Form data:", data);
      console.log("Advertisement ID:", advertisementId);
      console.log("Form validation state:", form.formState.errors);

      if (!data.application) {
        toast.error("Please select an application");
        return;
      }

      // Validate form data
      if (!data.interview_type) {
        toast.error("Please select an interview type");
        return;
      }

      if (data.interview_type === "non_committee" && !data.interviewer) {
        toast.error("Please select an interviewer");
        return;
      }

      if (data.interview_type === "committee" && (!data.interviewers || data.interviewers.length === 0)) {
        toast.error("Please select at least one interviewer for committee interview");
        return;
      }

      if (!data.start_date || !data.end_date) {
        toast.error("Please provide both start and end dates");
        return;
      }

      const interviewData = {
        application: data.application,
        interview_type: data.interview_type,
        interviewers: data.interview_type === "committee" ? data.interviewers : (data.interviewer ? [data.interviewer] : []),
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
      };

      console.log("Interview data being sent:", interviewData);
      console.log("API endpoint:", "hr/jobs/interviews/");

      const result = await createInterview(interviewData);
      console.log("API Response:", result);

      toast.success("Interview created successfully");

      // Close the dialog
      if (onClose) {
        onClose();
      } else {
        dispatch(closeDialog());
      }

      form.reset();
    } catch (error: any) {
      console.error("=== INTERVIEW CREATION ERROR ===");
      console.error("Error object:", error);
      console.error("Error message:", error?.message);
      console.error("Error response:", error?.response?.data);

      // Show more specific error message
      const errorMessage = error?.response?.data?.message ||
                          error?.message ||
                          "Failed to create interview. Please check the console for details.";

      toast.error(errorMessage);
    }
  };

  // Check if there are any shortlisted applications
  const hasApplications = applicationOptions.length > 0;

  if (!hasApplications) {
    return (
      <CardContent>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            No shortlisted applications found for this advertisement.
          </p>
          <p className="text-sm text-gray-400">
            Applications must be shortlisted before creating interviews.
          </p>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 max-w-2xl">
          <Badge variant="secondary">
            <Users size={15} />({number_of_positions} positions)
          </Badge>
          <Badge variant="secondary">
            <Clock size={15} /> {String(duration || 'N/A')}
          </Badge>
          <Badge variant="secondary">
            <CalendarDays size={15} />{" "}
            {created_datetime ? moment(created_datetime).format("DD-MM-YYYY") : 'N/A'}
          </Badge>
          <Badge variant="secondary">
            <MapPin size={15} /> {locationString}
          </Badge>
          <Badge variant="secondary">
            <Briefcase size={15} /> {String(job_type || 'N/A')}
          </Badge>
          <Badge variant="secondary">
            <PersonStanding size={15} /> {supervisorDisplay}
          </Badge>
          <Badge variant="secondary">
            <Users size={15} /> Position: {positionDisplay}
          </Badge>
          <Badge variant="secondary">
            <Users size={15} /> Grade: {gradeDisplay}
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
            {String(background || 'No background information available')}
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
            <p className="text-sm">{String(any_other_info)}</p>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-7"
          >
            <FormSelect
              name="application"
              label="Select Application"
              placeholder="Choose an application to interview"
              required
              options={applicationOptions}
            />

            <FormSelect
              name="interview_type"
              label="Interview type"
              options={[
                { label: "Committee", value: "committee" },
                { label: "Non Committee", value: "non_committee" }
              ]}
            />
            
            {watch("interview_type") === "committee" ? (
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
              watch("interview_type") === "non_committee" && (
                <FormSelect
                  name="interviewer"
                  label="Select Interviewer"
                  placeholder="Choose an interviewer"
                  required
                  options={userOptions}
                />
              )
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Start Date & Time"
                type="datetime-local"
                name="start_date"
                required
              />

              <FormInput
                label="End Date & Time"
                type="datetime-local"
                name="end_date"
                required
              />
            </div>

            <div className="flex justify-start gap-4">
              <FormButton
                type="submit"
                loading={isCreating}
                onClick={() => {
                  console.log("🖱️ Save button clicked!");
                  console.log("Form state:", form.formState);
                  console.log("Form errors:", form.formState.errors);
                  console.log("Form is valid:", form.formState.isValid);
                }}
              >
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