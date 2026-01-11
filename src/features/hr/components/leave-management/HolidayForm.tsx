"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import GoBack from "@/components/GoBack";
import { toast } from "sonner";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQueryClient } from "@tanstack/react-query";

const holidaySchema = z.object({
  name: z.string().min(3, "Holiday name must be at least 3 characters"),
  date: z.string().min(1, "Please select a date"),
  description: z.string().optional(),
  isRecurring: z.boolean(),
});

type FormData = z.infer<typeof holidaySchema>;

const HolidayForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(holidaySchema),
    defaultValues: {
      name: '',
      date: '',
      description: '',
      isRecurring: false,
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const requestData = {
        name: data.name,
        date: data.date,
        description: data.description || '',
        is_recurring: data.isRecurring,
      };

      console.log('Creating holiday:', requestData);

      await AxiosWithToken.post("hr/holidays/", requestData);

      await queryClient.invalidateQueries({ queryKey: ["holidays"] });

      toast.success("Holiday created successfully!");

      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/dashboard/hr/leave-management/holidays');

    } catch (error: any) {
      console.error('Error creating holiday:', error);

      const responseData = error.response?.data;
      let errorMessage = "Failed to create holiday. Please try again.";

      if (responseData) {
        if (typeof responseData === 'object' && !responseData.message) {
          const fieldErrors: string[] = [];
          Object.entries(responseData).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              fieldErrors.push(...errors);
            } else if (typeof errors === 'string') {
              fieldErrors.push(errors);
            }
          });
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('\n');
          }
        } else if (responseData.message) {
          errorMessage = responseData.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <GoBack />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Add Public Holiday
          </h1>
          <p className="text-gray-600 mt-1">
            Create a new public holiday or non-working day
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Holiday Details</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Holiday Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., New Year's Day, Independence Day" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional details about this holiday..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isRecurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Recurring Holiday</FormLabel>
                      <p className="text-sm text-gray-600">
                        This holiday occurs annually on the same date
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/hr/leave-management/holidays')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Holiday
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default HolidayForm;
