"use client";

import React from "react";
import FormInput from "@/components/atoms/FormInput";
import FormRadio from "@/components/atoms/FormRadio";
import FormSelect from "@/components/atoms/FormSelect";
import Card from "@/components/Card";
import GoBack from "@/components/GoBack";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import FormButton from "@/components/FormButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateTimesheet } from "../../controllers/timesheetController";
import { toast } from "sonner";
import { format, startOfWeek, endOfWeek } from "date-fns";

const CreateTimesheet = () => {
  // const [matchedStakeholdersData, setMatchedStakeholdersData] = useState<
  //     StakeholderResultsData[]
  // >([]);

  interface CreateTimesheetForm {
    date_type: string;
    start_date: string;
    end_date: string;
  }

  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  // Use real API hook for creating timesheets
  const { createTimesheet, isLoading: isCreatingTimesheet } = useCreateTimesheet();

  const form = useForm<CreateTimesheetForm>({
    defaultValues: {
      date_type: "range",
      start_date: format(startOfWeek(new Date()), 'yyyy-MM-dd'),
      end_date: format(endOfWeek(new Date()), 'yyyy-MM-dd'),
    },
  });

  const handleCreateTimesheet = async () => {
    setIsCreating(true);

    try {
      // Validate form first
      const isValid = await form.trigger();
      if (!isValid) {
        setIsCreating(false);
        toast.error("Please fill in all required fields");
        return;
      }

      const formData = form.getValues();

      // Transform form data to match backend CreateTimesheetRequest structure
      const timesheetPayload = {
        start_date: formData.start_date,
        end_date: formData.end_date,
        entries: [] // Start with empty entries - will be added in detail view
      };

      console.log('Creating timesheet with payload:', timesheetPayload);

      // Make real API call to create timesheet
      const response = await createTimesheet(timesheetPayload);

      if (response?.data?.id) {
        toast.success("Timesheet created successfully!");

        // Navigate to the timesheet detail page with real ID from backend
        router.push(`/dashboard/hr/timesheet-management/${response.data.id}`);
      } else {
        throw new Error("No timesheet ID returned from server");
      }

    } catch (error: any) {
      console.error('Failed to create timesheet:', error);
      const errorMessage = error?.message || "Failed to create timesheet. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/hr/timesheet-management');
  };

  return (
    <div className='space-y-4'>
      <GoBack />

      <Card className='space-y-8'>
        <h4 className='font-medium text-lg'>Create Timesheet</h4>

        <Form {...form}>
          <form className='space-y-10'>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h5 className="text-lg font-semibold text-blue-800 mb-2">Create New Timesheet</h5>
              <p className="text-blue-700 text-sm mb-4">
                This will create a new timesheet for your account. You can add project activities and hours after creation.
              </p>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <FormRadio
                  label='Period Type'
                  name='date_type'
                  options={[
                    { label: "Single Date", value: "single" },
                    { label: "Date Range (Week)", value: "range" },
                  ]}
                />
                <FormInput
                  name='start_date'
                  type='date'
                  label='Start Date'
                  required
                />
                <FormInput
                  name='end_date'
                  type='date'
                  label='End Date'
                  required
                />
              </div>
            </div>
            <div className='flex justify-between gap-5 py-5'>
              <FormButton
                onClick={handleCancel}
                type='button'
                className='bg-[#FFF2F2] text-primary dark:text-gray-500'
                disabled={isCreating}
              >
                Cancel
              </FormButton>

              <FormButton
                type="button"
                onClick={handleCreateTimesheet}
                disabled={isCreating || isCreatingTimesheet}
                loading={isCreating || isCreatingTimesheet}
              >
                {(isCreating || isCreatingTimesheet) ? 'Creating...' : 'Create'}
              </FormButton>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateTimesheet;
