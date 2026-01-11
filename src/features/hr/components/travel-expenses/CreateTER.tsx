"use client";

import React, { useState, useEffect, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { format } from "date-fns";
import { Plus, Trash2, Upload, Calculator, MapPin, Clock, DollarSign } from "lucide-react";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

// Form Components
import FormInput from "@/components/atoms/FormInput";
import FormTextArea from "@/components/atoms/FormTextArea";
import FormSelect from "@/components/atoms/FormSelect";
import FormCheckBox from "@/components/FormCheckBox";
import FormButton from "@/components/FormButton";

// Types and Controllers
import {
  EmployeeTERSchema,
  TEmployeeTERFormData,
} from "@/features/admin/types/travel-expense";
import {
  useGetEmployeeSiteVisits,
  useCreateEmployeeTravelExpense,
  calculateActualTotal,
} from "@/features/hr/controllers/employeeTravelExpenseController";

interface CreateTERProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateTER: React.FC<CreateTERProps> = ({ onSuccess, onCancel }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSiteVisit, setSelectedSiteVisit] = useState<any>(null);

  // API Hooks
  const { data: siteVisitsData, isLoading: isLoadingSiteVisits } = useGetEmployeeSiteVisits();
  const { createEmployeeTravelExpense, isLoading: isSubmitting } = useCreateEmployeeTravelExpense();

  // Form Setup
  const form = useForm<TEmployeeTERFormData>({
    resolver: zodResolver(EmployeeTERSchema),
    defaultValues: {
      site_visit_id: "",
      travel_purpose: "",
      activities: [
        {
          date: "",
          activity: "",
          departure_datetime: "",
          departure_point: "",
          arrival_datetime: "",
          assignment_location: "",
          visa_free: "false",
          airport_taxi_fee: "",
          registration_fee: "",
          inter_city_taxi_fee: "",
          others: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "activities",
  });

  const watchSiteVisitId = form.watch("site_visit_id");
  const watchActivities = form.watch("activities");

  // Site visit options
  const siteVisitOptions = React.useMemo(() => {
    if (!siteVisitsData?.data?.results) return [];

    return siteVisitsData.data.results
      .filter((visit: any) => visit.status === "APPROVED") // Only approved site visits
      .map((visit: any) => ({
        label: `${visit.location} - ${format(new Date(visit.start_date), "MMM dd, yyyy")} (${visit.purpose})`,
        value: visit.id,
      }));
  }, [siteVisitsData]);

  // Update travel purpose when site visit is selected
  useEffect(() => {
    if (watchSiteVisitId && siteVisitsData?.data?.results) {
      const selected = siteVisitsData.data.results.find(
        (visit: any) => visit.id === watchSiteVisitId
      );
      if (selected) {
        setSelectedSiteVisit(selected);
        form.setValue("travel_purpose", selected.purpose || "");
      }
    }
  }, [watchSiteVisitId, siteVisitsData, form]);

  // Calculate totals for each activity
  const calculateActivityTotal = useCallback((activity: any) => {
    const airportTaxi = parseFloat(activity.airport_taxi_fee || 0);
    const registration = parseFloat(activity.registration_fee || 0);
    const interCityTaxi = parseFloat(activity.inter_city_taxi_fee || 0);
    const others = parseFloat(activity.others || 0);
    return airportTaxi + registration + interCityTaxi + others;
  }, []);

  // Calculate grand total
  const grandTotal = React.useMemo(() => {
    return watchActivities.reduce((total, activity) => {
      return total + calculateActivityTotal(activity);
    }, 0);
  }, [watchActivities, calculateActivityTotal]);

  // Add new activity
  const addActivity = () => {
    append({
      date: "",
      activity: "",
      departure_datetime: "",
      departure_point: "",
      arrival_datetime: "",
      assignment_location: "",
      visa_free: "false",
      airport_taxi_fee: "",
      registration_fee: "",
      inter_city_taxi_fee: "",
      others: "",
    });
  };

  // Remove activity
  const removeActivity = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast.error("At least one activity is required");
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF, JPG, PNG files are allowed");
        return;
      }

      setSelectedFile(file);
      toast.success("File uploaded successfully");
    }
  };

  // Submit form
  const onSubmit: SubmitHandler<TEmployeeTERFormData> = async (data) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add form fields
      formData.append("site_visit_id", data.site_visit_id);
      formData.append("travel_purpose", data.travel_purpose);
      formData.append("activities", JSON.stringify(data.activities));

      // Add file if selected
      if (selectedFile) {
        formData.append("document", selectedFile);
      }

      await createEmployeeTravelExpense(formData);

      toast.success("Travel Expense Report submitted successfully");
      form.reset();
      setSelectedFile(null);
      setSelectedSiteVisit(null);

      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? error.message ?? "Something went wrong"
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submit Travel Expense Report</h1>
          <p className="text-gray-600">
            Record your actual travel expenses for reimbursement or reconciliation
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Site Visit Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Travel Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormSelect
                label="Select Site Visit"
                name="site_visit_id"
                placeholder={
                  isLoadingSiteVisits
                    ? "Loading site visits..."
                    : "Select the site visit for this expense report"
                }
                options={siteVisitOptions}
                required
                disabled={isLoadingSiteVisits}
              />

              {selectedSiteVisit && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Selected Site Visit Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Location:</span> {selectedSiteVisit.location}
                    </div>
                    <div>
                      <span className="font-medium">State:</span> {selectedSiteVisit.state}
                    </div>
                    <div>
                      <span className="font-medium">Start Date:</span> {format(new Date(selectedSiteVisit.start_date), "MMM dd, yyyy")}
                    </div>
                    <div>
                      <span className="font-medium">End Date:</span> {format(new Date(selectedSiteVisit.end_date), "MMM dd, yyyy")}
                    </div>
                    {selectedSiteVisit.travel_fees && (
                      <div className="col-span-2">
                        <span className="font-medium">Budgeted Allowance:</span> ₦{selectedSiteVisit.travel_fees.total_cost?.toLocaleString() || 'N/A'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <FormTextArea
                label="Travel Purpose"
                name="travel_purpose"
                placeholder="Enter the purpose of your travel"
                required
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Activities Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  Daily Activities & Expenses
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addActivity}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Day
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-6 space-y-4">
                  {/* Activity Header */}
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-lg">Day {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeActivity(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Activity Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Date"
                      name={`activities.${index}.date`}
                      type="date"
                      required
                    />
                    <FormInput
                      label="Activity Description"
                      name={`activities.${index}.activity`}
                      placeholder="Brief description of the day's activities"
                      required
                    />
                  </div>

                  {/* Travel Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Departure Point"
                      name={`activities.${index}.departure_point`}
                      placeholder="Where did you depart from?"
                    />
                    <FormInput
                      label="Departure Date & Time"
                      name={`activities.${index}.departure_datetime`}
                      type="datetime-local"
                      required
                    />
                    <FormInput
                      label="Assignment Location"
                      name={`activities.${index}.assignment_location`}
                      placeholder="Where was your assignment?"
                    />
                    <FormInput
                      label="Arrival Date & Time"
                      name={`activities.${index}.arrival_datetime`}
                      type="datetime-local"
                      required
                    />
                  </div>

                  {/* Visa Free Status */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormSelect
                      label="Visa Free Travel"
                      name={`activities.${index}.visa_free`}
                      options={[
                        { label: "No", value: "false" },
                        { label: "Yes", value: "true" },
                      ]}
                      placeholder="Select visa status"
                    />
                  </div>

                  <Separator />

                  {/* Expense Fields */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-700 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Expenses (Enter amounts in Naira)
                    </h5>

                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label="Airport Taxi (₦)"
                        name={`activities.${index}.airport_taxi_fee`}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                      />
                      <FormInput
                        label="Registration Fees (₦)"
                        name={`activities.${index}.registration_fee`}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                      />
                      <FormInput
                        label="Inter-City Taxi (₦)"
                        name={`activities.${index}.inter_city_taxi_fee`}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                      />
                      <FormInput
                        label="Other Expenses (₦)"
                        name={`activities.${index}.others`}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>

                    {/* Activity Total */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Day {index + 1} Total:</span>
                        <span className="text-lg font-bold text-green-600">
                          ₦{calculateActivityTotal(watchActivities[index] || {}).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-purple-600" />
                Supporting Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="document" className="text-sm font-medium">
                  Upload Receipt/Document (Optional)
                </Label>
                <Input
                  id="document"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload receipts, boarding passes, or other supporting documents (PDF, JPG, PNG - Max 5MB)
                </p>
              </div>

              {selectedFile && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Upload className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-900">{selectedFile.name}</p>
                        <p className="text-sm text-green-600">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-orange-600" />
                Expense Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {watchActivities.map((activity, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>Day {index + 1} ({activity.date || 'No date'})</span>
                    <span className="font-medium">
                      ₦{calculateActivityTotal(activity).toLocaleString()}
                    </span>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Expenses Claimed:</span>
                  <span className="text-green-600">₦{grandTotal.toLocaleString()}</span>
                </div>

                {selectedSiteVisit?.travel_fees?.total_cost && (
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Budgeted Allowance:</span>
                      <span>₦{selectedSiteVisit.travel_fees.total_cost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Actual Expenses:</span>
                      <span>₦{grandTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Difference:</span>
                      <span className={grandTotal > selectedSiteVisit.travel_fees.total_cost ? "text-red-600" : "text-green-600"}>
                        {grandTotal > selectedSiteVisit.travel_fees.total_cost ? "+" : ""}
                        ₦{Math.abs(grandTotal - selectedSiteVisit.travel_fees.total_cost).toLocaleString()}
                      </span>
                    </div>
                    <Alert>
                      <AlertDescription className="text-sm">
                        {grandTotal > selectedSiteVisit.travel_fees.total_cost
                          ? `You spent ₦${(grandTotal - selectedSiteVisit.travel_fees.total_cost).toLocaleString()} more than budgeted. This will be reviewed for reimbursement.`
                          : grandTotal < selectedSiteVisit.travel_fees.total_cost
                          ? `You spent ₦${(selectedSiteVisit.travel_fees.total_cost - grandTotal).toLocaleString()} less than budgeted. The difference should be returned to AHNI.`
                          : "Your expenses exactly match the budgeted allowance."
                        }
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <FormButton loading={isSubmitting} className="px-8">
              Submit Travel Expense Report
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateTER;