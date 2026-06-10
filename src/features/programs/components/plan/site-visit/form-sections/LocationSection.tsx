"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormSelect from "@/components/atoms/FormSelectField";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MapPinIcon, Building2, MapPin } from "lucide-react";
import { LoadingSpinner } from "@/components/Loading";

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

  // Check if visit type requires facility selection (supportive supervision types)
  const requiresFacility = React.useMemo(() => {
    return visitType === SiteVisitType.SUPPORTIVE_SUPERVISION ||
           visitType === SiteVisitType.INTEGRATED_SUPPORTIVE_SUPERVISION ||
           visitType === SiteVisitType.EMERGENCY_SUPPORTIVE_SUPERVISION;
  }, [visitType]);

  // New state to track venue type selection - default based on visit type
  const [venueType, setVenueType] = React.useState<"ahni_facility" | "external_venue">(
    requiresFacility ? "ahni_facility" : "external_venue"
  );

  // Get facility details when one is selected
  const facilityData = React.useMemo(() => {
    if (selectedFacility && selectedFacility !== "no-facility") {
      return facilities.find(facility => facility.id === selectedFacility);
    }
    return null;
  }, [facilities, selectedFacility]);

  const selectedLocation = watch("location");

  // Auto-switch venue type when visit type changes
  React.useEffect(() => {
    if (requiresFacility) {
      setVenueType("ahni_facility");
      setValue("facility", "");
    } else {
      setVenueType("external_venue");
      setValue("facility", "no-facility");
    }
  }, [requiresFacility, setValue]);

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

  // Create location options from actual Location objects (with UUIDs)
  const locationOptions = React.useMemo(() => {
    if (!locations || locations.length === 0) return [];

    return locations
      .filter((loc: any) => loc.name.includes('State') || loc.name.includes('FCT'))
      .map((location: any) => ({
        label: location.name,
        value: location.id,  // Send UUID to backend
      }));
  }, [locations]);

  // Auto-populate state and location fields when facility is selected
  React.useEffect(() => {
    if (facilityData && venueType === "ahni_facility" && locations && locations.length > 0) {
      // If facility is selected, use facility's state and LGA
      let stateName = facilityData.state || "";

      // Handle FCT name variations
      if (stateName === "Federal Capital Territory (FCT)" || stateName === "Federal Capital Territory") {
        stateName = "FCT Abuja";
      }

      // Strip " State" suffix to match state dropdown values (e.g., "Borno State" -> "Borno")
      const stateForDropdown = stateName.replace(/ State$/i, "").trim();

      // Find matching Location by state name (Location names include " (External)")
      const matchingLocation = locations.find((loc: any) => {
        const locName = loc.name.replace(/ \(External\)$/i, "").trim();
        return locName === stateName ||
               locName.includes(stateForDropdown) ||
               (stateForDropdown === "FCT" && locName.includes("FCT Abuja"));
      });

      // Set Location UUID if found
      if (matchingLocation) {
        setValue("location", matchingLocation.id);
      }

      setValue("state", stateForDropdown);     // State dropdown (without " State")
      setValue("lga", facilityData.lga || "");         // LGA field
    }
  }, [facilityData, venueType, setValue, locations]);

  // Handle venue type change
  const handleVenueTypeChange = (value: "ahni_facility" | "external_venue") => {
    // Don't allow switching to external venue if facility is required
    if (value === "external_venue" && requiresFacility) {
      return;
    }

    setVenueType(value);

    // Clear fields when switching venue type
    if (value === "ahni_facility") {
      // Switching to AHNI facility - clear manual state/lga/address, set facility to placeholder
      setValue("facility", "");
      setValue("specific_address", "");
    } else {
      // Switching to external venue - clear facility selection
      setValue("facility", "no-facility");
      setValue("location", "");
      setValue("state", "");
      setValue("lga", "");
      setValue("specific_address", "");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPinIcon className="h-5 w-5 text-yellow-600" />
          Location Information
        </CardTitle>
        <p className="text-sm text-gray-600">
          Select where you're traveling to - either an AHNI facility or an external venue.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Venue Type Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Where are you traveling to?</Label>
          <RadioGroup
            value={venueType}
            onValueChange={(value) => handleVenueTypeChange(value as "ahni_facility" | "external_venue")}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="ahni_facility" id="ahni_facility" />
              <Label htmlFor="ahni_facility" className="flex items-center gap-2 cursor-pointer flex-1">
                <Building2 className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="font-medium">AHNI Facility</div>
                  <div className="text-xs text-gray-500">Health facility managed by AHNI</div>
                </div>
              </Label>
            </div>
            <div className={`flex items-center space-x-2 border rounded-lg p-4 ${requiresFacility ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}>
              <RadioGroupItem value="external_venue" id="external_venue" disabled={requiresFacility} />
              <Label htmlFor="external_venue" className={`flex items-center gap-2 flex-1 ${requiresFacility ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <MapPin className="h-4 w-4 text-green-600" />
                <div>
                  <div className="font-medium">External Venue</div>
                  <div className="text-xs text-gray-500">
                    {requiresFacility
                      ? "Not available for supportive supervision visits"
                      : "Hotel, office, training center, etc."}
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
          {requiresFacility && (
            <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
              ℹ️ Supportive supervision visits must be conducted at AHNI facilities
            </p>
          )}
        </div>

        {/* Facility Selection (Only when AHNI Facility is selected) */}
        {venueType === "ahni_facility" && (
          <FormField
            control={control}
            name="facility"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="required">Select AHNI Facility</FormLabel>
                {isFacilitiesLoading ? (
                  <div className="flex items-center justify-center p-4 border rounded-md">
                    <LoadingSpinner />
                    <span className="ml-2 text-sm">Loading facilities...</span>
                  </div>
                ) : (
                  <FormSelect
                    name="facility"
                    placeholder="Search and select the AHNI facility you're visiting"
                    options={facilityOptions.filter(opt => opt.value !== "no-facility")}
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

        {/* Facility Details Display (AHNI Facility Only) */}
        {venueType === "ahni_facility" && facilityData && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Selected Facility Information
              </h4>
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
              <p className="text-xs text-blue-700 mt-3 italic">
                ✓ Location details automatically set from this facility
              </p>
            </CardContent>
          </Card>
        )}

        {/* External Venue Fields - Only show when External Venue is selected */}
        {venueType === "external_venue" && (
          <>
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
                      <span className="ml-2 text-sm">Loading locations...</span>
                    </div>
                  ) : (
                    <FormSelect
                      name="location"
                      placeholder="Select the state you're traveling to"
                      options={locationOptions}
                      searchPlaceholder="Search locations..."
                      emptyMessage="No locations found matching your search."
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
                    >
                      <FormControl>
                        <SelectTrigger>
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
                    />
                  </FormControl>
                  <FormMessage />
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
                <FormLabel className="required">Specific Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={`Enter venue details, e.g.:\n• Hotel: "Excellence Hotel Conference Center, Bank Road"\n• Ministry: "Kano State Ministry of Health Training Hall"\n• Meeting venue: "Lagos State Secretariat, Alausa"`}
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-gray-600 mt-1">
                  Provide the full address of the hotel, office, or venue you'll be visiting
                </p>
              </FormItem>
            )}
          />
        </>
        )}

        {/* Location Guidelines */}
        <div className="bg-gray-50 p-3 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-2">📍 Location Selection Guide</h4>
          <ul className="text-sm text-gray-700 space-y-1 list-disc ml-4">
            {venueType === "ahni_facility" ? (
              <>
                <li><strong>AHNI Facility:</strong> Select the specific health facility you're visiting. All location details will be automatically set from the facility record.</li>
                <li><strong>Auto-populated:</strong> State, LGA, and contact information are automatically filled from the selected facility.</li>
                <li><strong>Travel Rates:</strong> Determined by the facility's state location.</li>
              </>
            ) : (
              <>
                <li><strong>External Venue:</strong> For hotels, training centers, ministry offices, conference halls, or any non-AHNI location.</li>
                <li><strong>State (Required):</strong> Select the Nigerian state you're traveling to. This determines your travel allowances and rates.</li>
                <li><strong>LGA (Optional):</strong> Add Local Government Area for more specific location tracking.</li>
                <li><strong>Specific Address (Required):</strong> Provide the full venue address including hotel name, street, landmarks, or office location.</li>
                <li><strong>Travel Rates:</strong> Automatically calculated based on the selected state.</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSection;