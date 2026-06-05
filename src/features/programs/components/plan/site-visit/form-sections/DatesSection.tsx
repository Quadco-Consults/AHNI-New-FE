"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CalendarIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DateInput from "@/components/DateInput";

import { TSiteVisitApplicationFormValues } from "@/features/programs/types/site-visit";

const DatesSection: React.FC = () => {
  const { control, watch } = useFormContext<TSiteVisitApplicationFormValues>();
  const startDate = watch("start_date");
  const endDate = watch("end_date");

  // Calculate duration
  const duration = React.useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      }
    }
    return 0;
  }, [startDate, endDate]);

  const numberOfNights = duration > 0 ? duration - 1 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-yellow-600" />
          Travel Dates
        </CardTitle>
        <p className="text-sm text-gray-600">
          Select the start and end dates for your travel request. These dates will be used for travel allowance calculations.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <FormField
            control={control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="required">Proposed Start Date</FormLabel>
                <FormControl>
                  <DateInput
                    {...field}
                    placeholder="Select start date"
                    minDate={new Date()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Date */}
          <FormField
            control={control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="required">Proposed End Date</FormLabel>
                <FormControl>
                  <DateInput
                    {...field}
                    placeholder="Select end date"
                    minDate={startDate ? new Date(startDate) : new Date()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Duration Display */}
        {startDate && endDate && duration > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-900 mb-2">Trip Duration Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{duration}</div>
                  <div className="text-blue-700">
                    {duration === 1 ? 'Day' : 'Days'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{numberOfNights}</div>
                  <div className="text-blue-700">
                    {numberOfNights === 1 ? 'Night' : 'Nights'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-blue-700 mb-1">Period</div>
                  <div className="text-sm font-medium text-blue-900">
                    {new Date(startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })} - {new Date(endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Date Validation Warnings */}
        {startDate && endDate && (
          <>
            {new Date(endDate) < new Date(startDate) && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  <strong>Invalid Date Range:</strong> End date must be on or after the start date.
                </AlertDescription>
              </Alert>
            )}

            {duration > 30 && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertDescription className="text-yellow-800">
                  <strong>Long Duration:</strong> This visit is planned for {duration} days.
                  Extended trips may require additional approvals or documentation.
                </AlertDescription>
              </Alert>
            )}

            {duration === 1 && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-800">
                  <strong>Same-Day Trip:</strong> This is a same-day visit with no overnight accommodation required.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}

        {/* Date Guidelines */}
        <div className="bg-gray-50 p-3 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-2">Date Selection Guidelines</h4>
          <ul className="text-sm text-gray-700 space-y-1 list-disc ml-4">
            <li>Select dates that allow adequate time for travel and planned activities</li>
            <li>Consider weekends and public holidays when planning your visit</li>
            <li>Start date cannot be in the past</li>
            <li>End date must be on or after the start date</li>
            <li>Duration affects travel allowance calculations (accommodation, meals, etc.)</li>
            <li>Same-day trips (start = end date) have different allowance structures</li>
          </ul>
        </div>

        {/* Travel Time Considerations */}
        {startDate && endDate && duration > 0 && (
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-900 mb-2">Travel Considerations</h4>
            <div className="text-sm text-yellow-800 space-y-1">
              <p>• <strong>Travel Days:</strong> Consider if travel days are included in your duration</p>
              <p>• <strong>Accommodation:</strong> {numberOfNights} nights of accommodation will be calculated</p>
              <p>• <strong>Meal Allowances:</strong> {duration} days of meal allowances will be included</p>
              {duration > 7 && (
                <p>• <strong>Extended Stay:</strong> Visits over 7 days may require additional justification</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatesSection;