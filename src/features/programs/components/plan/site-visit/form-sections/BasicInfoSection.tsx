"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  TSiteVisitApplicationFormValues,
  SiteVisitType,
  SiteVisitTypeLabels,
} from "@/features/programs/types/site-visit";

const BasicInfoSection: React.FC = () => {
  const { control, watch } = useFormContext<TSiteVisitApplicationFormValues>();
  const visitType = watch("visit_type");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <InfoIcon className="h-5 w-5 text-yellow-600" />
          Basic Information
        </CardTitle>
        <p className="text-sm text-gray-600">
          Provide the basic details about your site visit request.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Site Visit Title */}
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required">Site Visit Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a descriptive title for your site visit"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Visit Type */}
        <FormField
          control={control}
          name="visit_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required">Site Visit Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the type of site visit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(SiteVisitType).map(([key, value]) => (
                    <SelectItem key={value} value={value}>
                      {SiteVisitTypeLabels[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Other Visit Type Description (conditional) */}
        {visitType === SiteVisitType.OTHER && (
          <FormField
            control={control}
            name="other_visit_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="required">Other Visit Type Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please describe the other type of site visit"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Purpose */}
        <FormField
          control={control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required">Purpose</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Explain the purpose and objectives of this site visit"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Expected Outcomes */}
        <FormField
          control={control}
          name="expected_outcomes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Outcomes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the expected outcomes and deliverables from this visit"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Info Alert for Supervision Visits */}
        {[
          SiteVisitType.SUPPORTIVE_SUPERVISION,
          SiteVisitType.INTEGRATED_SUPPORTIVE_SUPERVISION,
          SiteVisitType.EMERGENCY_SUPPORTIVE_SUPERVISION
        ].includes(visitType) && (
          <Alert className="border-blue-200 bg-blue-50">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Supervision Visit Detected:</strong> You can link this visit to an existing Annual Supervision Plan
              below to auto-populate location and other details.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection;