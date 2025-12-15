"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "components/ui/form";
import { Input } from "components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import FormSelect from "components/atoms/FormSelectField";
import { Textarea } from "components/ui/textarea";
import { MapPinIcon } from "lucide-react";
import { LoadingSpinner } from "components/Loading";

import { TSiteVisitApplicationFormValues, SiteVisitType } from "@/features/programs/types/site-visit";

interface LocationSectionProps {
  facilities: any[];
  locations: any[];
  isLocationsLoading?: boolean;
  isFacilitiesLoading?: boolean;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  facilities,
  locations,
  isLocationsLoading = false,
  isFacilitiesLoading = false,
}) => {
  const { control, watch, setValue } = useFormContext<TSiteVisitApplicationFormValues>();
  const selectedFacility = watch("facility");
  const visitType = watch("visit_type");

  // Get facility details when one is selected
  const facilityData = React.useMemo(() => {
    if (selectedFacility && selectedFacility !== "no-facility") {
      return facilities.find(facility => facility.id === selectedFacility);
    }
    return null;
  }, [facilities, selectedFacility]);

  const selectedLocation = watch("location");

  // Check if visit type requires facility selection (supportive supervision types)
  const requiresFacility = React.useMemo(() => {
    return visitType === SiteVisitType.SUPPORTIVE_SUPERVISION ||
           visitType === SiteVisitType.INTEGRATED_SUPPORTIVE_SUPERVISION ||
           visitType === SiteVisitType.EMERGENCY_SUPPORTIVE_SUPERVISION;
  }, [visitType]);

  // Nigerian states list for validation
  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
    "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
    "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
  ];

  // Create facility options for FormSelect with search
  const facilityOptions = React.useMemo(() => {
    const options = [
      { label: "No Facility (General Location)", value: "no-facility" }
    ];

    if (facilities && facilities.length > 0) {
      const facilityOpts = facilities.map((facility: any) => ({
        label: `${facility.name} (${facility.state}${facility.lga ? ` • ${facility.lga}` : ''})`,
        value: facility.id,
      }));
      options.push(...facilityOpts);
    }

    return options;
  }, [facilities]);

  // Create state options for FormSelect
  const stateOptions = nigerianStates.map(state => ({
    label: state,
    value: state,
  }));

  // Auto-populate state field when facility is selected (only for supportive supervision)
  React.useEffect(() => {
    if (facilityData && requiresFacility) {
      // If facility is selected for supportive supervision, use facility's state and LGA
      let stateValue = facilityData.state || "";

      // Handle FCT name variations
      if (stateValue === "Federal Capital Territory (FCT)" || stateValue === "Federal Capital Territory") {
        stateValue = "FCT";
      }

      setValue("location", stateValue);  // Location/State dropdown
      setValue("state", stateValue);     // State dropdown
      setValue("lga", facilityData.lga || "");         // LGA field
    }
  }, [facilityData, requiresFacility]); // Removed setValue to prevent infinite loop

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPinIcon className="h-5 w-5 text-yellow-600" />
          Location Information
        </CardTitle>
        <p className="text-sm text-gray-600">
          Select the destination for your site visit. For external venues (training, meetings, etc.), simply choose the state you're traveling to. For supportive supervision visits, you can optionally select a specific AHNI facility.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Facility Selection (Only for Supportive Supervision) */}
        {requiresFacility && (
          <FormField
            control={control}
            name="facility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facility (Optional)</FormLabel>
                {isFacilitiesLoading ? (
                  <div className="flex items-center justify-center p-4 border rounded-md">
                    <LoadingSpinner />
                    <span className="ml-2 text-sm">Loading facilities...</span>
                  </div>
                ) : (
                  <FormSelect
                    name="facility"
                    placeholder="Select a facility if visit is facility-specific"
                    options={facilityOptions}
                    searchPlaceholder="Search facilities by name, state, or LGA..."
                    emptyMessage="No facilities found matching your search."
                    onValueChange={field.onChange}
                  />
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Facility Details Display */}
        {facilityData && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-yellow-900 mb-2">Selected Facility Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <div className="font-medium">{facilityData.name}</div>
                </div>
                <div>
                  <span className="text-gray-600">State:</span>
                  <div className="font-medium">{facilityData.state}</div>
                </div>
                {facilityData.lga && (
                  <div>
                    <span className="text-gray-600">LGA:</span>
                    <div className="font-medium">{facilityData.lga}</div>
                  </div>
                )}
                {facilityData.facility_type && (
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <div className="font-medium">{facilityData.facility_type}</div>
                  </div>
                )}
                {facilityData.contact_person && (
                  <div>
                    <span className="text-gray-600">Contact Person:</span>
                    <div className="font-medium">{facilityData.contact_person}</div>
                  </div>
                )}
                {facilityData.email && (
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <div className="font-medium">{facilityData.email}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location */}
        <FormField
          control={control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required">Location/State</FormLabel>
              {isLocationsLoading ? (
                <div className="flex items-center justify-center p-4 border rounded-md">
                  <LoadingSpinner />
                  <span className="ml-2 text-sm">Loading states...</span>
                </div>
              ) : (
                <FormSelect
                  name="location"
                  placeholder="Select the state you're traveling to"
                  options={stateOptions}
                  searchPlaceholder="Search Nigerian states..."
                  emptyMessage="No states found matching your search."
                  onValueChange={field.onChange}
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* State and LGA */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="required">State</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!!facilityData && requiresFacility}
                >
                  <FormControl>
                    <SelectTrigger className={facilityData && requiresFacility ? "bg-gray-50" : ""}>
                      <SelectValue placeholder="Select destination state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Abia">Abia</SelectItem>
                    <SelectItem value="Adamawa">Adamawa</SelectItem>
                    <SelectItem value="Akwa Ibom">Akwa Ibom</SelectItem>
                    <SelectItem value="Anambra">Anambra</SelectItem>
                    <SelectItem value="Bauchi">Bauchi</SelectItem>
                    <SelectItem value="Bayelsa">Bayelsa</SelectItem>
                    <SelectItem value="Benue">Benue</SelectItem>
                    <SelectItem value="Borno">Borno</SelectItem>
                    <SelectItem value="Cross River">Cross River</SelectItem>
                    <SelectItem value="Delta">Delta</SelectItem>
                    <SelectItem value="Ebonyi">Ebonyi</SelectItem>
                    <SelectItem value="Edo">Edo</SelectItem>
                    <SelectItem value="Ekiti">Ekiti</SelectItem>
                    <SelectItem value="Enugu">Enugu</SelectItem>
                    <SelectItem value="FCT">Federal Capital Territory (FCT)</SelectItem>
                    <SelectItem value="Gombe">Gombe</SelectItem>
                    <SelectItem value="Imo">Imo</SelectItem>
                    <SelectItem value="Jigawa">Jigawa</SelectItem>
                    <SelectItem value="Kaduna">Kaduna</SelectItem>
                    <SelectItem value="Kano">Kano</SelectItem>
                    <SelectItem value="Katsina">Katsina</SelectItem>
                    <SelectItem value="Kebbi">Kebbi</SelectItem>
                    <SelectItem value="Kogi">Kogi</SelectItem>
                    <SelectItem value="Kwara">Kwara</SelectItem>
                    <SelectItem value="Lagos">Lagos</SelectItem>
                    <SelectItem value="Nasarawa">Nasarawa</SelectItem>
                    <SelectItem value="Niger">Niger</SelectItem>
                    <SelectItem value="Ogun">Ogun</SelectItem>
                    <SelectItem value="Ondo">Ondo</SelectItem>
                    <SelectItem value="Osun">Osun</SelectItem>
                    <SelectItem value="Oyo">Oyo</SelectItem>
                    <SelectItem value="Plateau">Plateau</SelectItem>
                    <SelectItem value="Rivers">Rivers</SelectItem>
                    <SelectItem value="Sokoto">Sokoto</SelectItem>
                    <SelectItem value="Taraba">Taraba</SelectItem>
                    <SelectItem value="Yobe">Yobe</SelectItem>
                    <SelectItem value="Zamfara">Zamfara</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
                {facilityData && requiresFacility && (
                  <p className="text-xs text-blue-600 mt-1">
                    State auto-selected from facility
                  </p>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="lga"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LGA (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter LGA"
                    {...field}
                    readOnly={!!facilityData && requiresFacility}
                    className={facilityData && requiresFacility ? "bg-gray-50" : ""}
                  />
                </FormControl>
                <FormMessage />
                {facilityData && requiresFacility && (
                  <p className="text-xs text-blue-600 mt-1">
                    LGA auto-filled from facility
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>

        {/* Specific Address */}
        <FormField
          control={control}
          name="specific_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specific Address (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`Enter specific venue details, e.g.:\n• Hotel name: "Excellence Hotel Conference Center, Bank Road"\n• Ministry office: "Kano State Ministry of Health Training Hall"\n• Meeting venue: "Lagos State Secretariat, Alausa"`}
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location Guidelines */}
        <div className="bg-gray-50 p-3 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-2">Location Selection Guide</h4>
          <ul className="text-sm text-gray-700 space-y-1 list-disc ml-4">
            {requiresFacility ? (
              <li><strong>Facility:</strong> Select the specific healthcare facility for supportive supervision visits. This will auto-populate state and LGA.</li>
            ) : (
              <li><strong>External Venues:</strong> For {visitType === SiteVisitType.TRAINING_WORKSHOP ? 'training workshops' : visitType === SiteVisitType.STAKEHOLDER_ENGAGEMENT ? 'stakeholder engagement' : 'non-supervision visits'}, the system automatically handles external venue locations.</li>
            )}
            <li><strong>Location/State:</strong> General location reference - selecting a state will automatically create an external venue location.</li>
            <li><strong>State (Required):</strong> Select the Nigerian state you're traveling to. This determines travel rates and allowances.</li>
            <li><strong>LGA (Optional):</strong> Add Local Government Area for more specific location details.</li>
            <li><strong>Specific Address:</strong> Add detailed address, landmarks, hotels, conference centers, or meeting venues for external visits.</li>
            <li><strong>Important:</strong> Travel rates are determined by the selected state. External venue locations are automatically managed by the system.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSection;