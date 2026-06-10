"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plane, Loader2, CalendarIcon, MapPinIcon, FileTextIcon } from "lucide-react";
import { useCreateConsultantTravelRequest } from "@/features/consultant-portal/controllers/consultantTravelRequestController";
import {
  SiteVisitType,
  SiteVisitTypeLabels,
} from "@/features/programs/types/site-visit";

// Simplified schema for consultant travel requests
const consultantTravelRequestSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  visit_type: z.nativeEnum(SiteVisitType),
  other_visit_type: z.string().optional(),
  purpose: z.string().min(20, "Purpose must be at least 20 characters"),
  state: z.string().min(1, "State is required"),
  lga: z.string().optional(),
  specific_address: z.string().min(10, "Specific address is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  estimated_budget: z.number().optional(),
  special_requirements: z.string().optional(),
  expected_outcomes: z.string().optional(),
});

type ConsultantTravelRequestFormValues = z.infer<typeof consultantTravelRequestSchema>;

// Nigerian states
const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

export default function CreateConsultantTravelRequestPage() {
  const router = useRouter();
  const createMutation = useCreateConsultantTravelRequest();

  const form = useForm<ConsultantTravelRequestFormValues>({
    resolver: zodResolver(consultantTravelRequestSchema),
    defaultValues: {
      title: "",
      visit_type: SiteVisitType.TRAINING_WORKSHOP,
      other_visit_type: "",
      purpose: "",
      state: "",
      lga: "",
      specific_address: "",
      start_date: "",
      end_date: "",
      estimated_budget: 0,
      special_requirements: "",
      expected_outcomes: "",
    },
  });

  const visitType = form.watch("visit_type");

  const onSubmit = async (values: ConsultantTravelRequestFormValues) => {
    try {
      // Transform data to match backend expectations
      const payload = {
        ...values,
        facility: "no-facility", // Consultants typically don't visit AHNI facilities
        location: "", // Will be set by backend based on state
        team_members: [], // Consultant is automatically added as requester
        travel_fees: {
          lodging_per_night: 0,
          meal_allowance_per_day: 0,
          interstate_cost: 0,
          airport_taxi: 0,
          car_hire: 0,
          total_per_person: 0,
          team_size: 1,
          number_of_nights: 1,
          total_cost: 0,
          location: values.state,
        },
        project: "none",
        reviewer: "",
        authorizer: "",
        approver: "",
      };

      await createMutation.mutateAsync(payload as any);
      toast.success("Travel request submitted successfully!");
      router.push("/consultant-portal/travel-requests");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit travel request");
    }
  };

  const handleBack = () => {
    router.push("/consultant-portal/travel-requests");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Plane className="h-8 w-8 text-green-600" />
              New Travel Request
            </h1>
            <p className="text-gray-600 mt-1">
              Submit a new site visit or travel request
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5 text-green-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Training Workshop on Health Systems Strengthening"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a clear, descriptive title for your travel request
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visit_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">Visit Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select visit type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(SiteVisitTypeLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {visitType === SiteVisitType.OTHER && (
                  <FormField
                    control={form.control}
                    name="other_visit_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required">Specify Other Visit Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Research Visit" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">Purpose</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the purpose and objectives of this travel..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Explain why this travel is necessary and what you aim to achieve
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-green-600" />
                  Location Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required">State</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {nigerianStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lga"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LGA (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter LGA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="specific_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">Specific Address/Venue</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Excellence Hotel Conference Center, Bank Road, Kano"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide the full address of the hotel, office, or venue
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Travel Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-green-600" />
                  Travel Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required">Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required">End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="estimated_budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Budget (₦)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Provide an estimated budget if known
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="special_requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requirements</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special equipment, dietary requirements, accessibility needs, etc."
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
                  name="expected_outcomes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Outcomes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What outcomes or deliverables do you expect from this travel?"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
