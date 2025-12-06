"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { DollarSignIcon } from "lucide-react";
import { useGetAllTravelRatesManager } from "@/features/modules/controllers/config/travelRateController";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Badge } from "components/ui/badge";
import { Alert, AlertDescription } from "components/ui/alert";
import { InfoIcon, AlertCircleIcon } from "lucide-react";

import { TSiteVisitApplicationFormValues } from "@/features/programs/types/site-visit";

const TravelFeesSection: React.FC = () => {
  const { setValue, watch } = useFormContext<TSiteVisitApplicationFormValues>();

  const location = watch("location");
  const state = watch("state");
  const teamMembers = watch("team_members") || [];
  const travelFees = watch("travel_fees");

  // Get travel rates data
  const { data: travelRatesData, isLoading: isRatesLoading } = useGetAllTravelRatesManager({
    page: 1,
    size: 100,
  });

  const travelRates = React.useMemo(() => {
    return travelRatesData?.data?.results || [];
  }, [travelRatesData]);

  // Find applicable rate based on state or location
  const applicableRate = React.useMemo(() => {
    const searchState = state || location;
    if (!searchState) return null;

    return travelRates.find((rate: any) =>
      rate.state?.toLowerCase() === searchState.toLowerCase() ||
      rate.location?.toLowerCase() === searchState.toLowerCase()
    );
  }, [travelRates, state, location]);

  // Calculate total cost using all cost components
  const totalCost = React.useMemo(() => {
    if (!applicableRate) return 0;
    const accommodationRate = Number(applicableRate.accommodation_rate || 0);
    const mealAllowance = Number(applicableRate.meal_allowance || 0);
    const transportAllowance = Number(applicableRate.transport_allowance || 0);
    const perDiemRate = Number(applicableRate.per_diem_rate || 0);

    // Total per person per day
    const totalPerPersonPerDay = accommodationRate + mealAllowance + transportAllowance + perDiemRate;
    const teamSize = teamMembers.length || 1;

    return totalPerPersonPerDay * teamSize;
  }, [applicableRate, teamMembers.length]);

  // Update form when rate or team size changes (prevent circular updates)
  React.useEffect(() => {
    if (applicableRate) {
      const accommodationRate = Number(applicableRate.accommodation_rate || 0);
      const mealAllowance = Number(applicableRate.meal_allowance || 0);
      const transportAllowance = Number(applicableRate.transport_allowance || 0);
      const perDiemRate = Number(applicableRate.per_diem_rate || 0);

      const totalPerPersonPerDay = accommodationRate + mealAllowance + transportAllowance + perDiemRate;
      const teamSize = teamMembers.length || 1;
      const total = totalPerPersonPerDay * teamSize;

      // Only update if the values actually changed to prevent loops
      if (travelFees?.total_per_person !== totalPerPersonPerDay || travelFees?.total_cost !== total) {
        setValue("travel_fees", {
          lodging_per_night: accommodationRate,
          meal_allowance_per_day: mealAllowance,
          interstate_cost: transportAllowance,
          airport_taxi: 0, // Not provided by backend, keep as 0
          car_hire: perDiemRate, // Using per_diem_rate for miscellaneous costs
          total_per_person: totalPerPersonPerDay,
          team_size: teamSize,
          number_of_nights: 1,
          total_cost: total,
          location: state || location || "",
        });
      }
    }
  }, [applicableRate?.accommodation_rate, applicableRate?.meal_allowance, applicableRate?.transport_allowance, applicableRate?.per_diem_rate, teamMembers.length, setValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSignIcon className="h-5 w-5 text-yellow-600" />
          Travel Allowance
        </CardTitle>
        <p className="text-sm text-gray-600">
          Travel allowance is a flat rate per person based on the destination state.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rate Information */}
        {isRatesLoading ? (
          <div className="flex items-center justify-center p-6">
            <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin mr-2" />
            <span className="text-sm text-gray-600">Loading travel rates...</span>
          </div>
        ) : applicableRate ? (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-green-900">Travel Rate Found</h4>
                <Badge className="bg-green-100 text-green-800">
                  {applicableRate.state || applicableRate.location}
                </Badge>
              </div>

              <div className="space-y-4">
                {/* Cost Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      ₦{(applicableRate.accommodation_rate || 0).toLocaleString()}
                    </div>
                    <div className="text-green-700">Accommodation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      ₦{(applicableRate.meal_allowance || 0).toLocaleString()}
                    </div>
                    <div className="text-green-700">Meals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      ₦{(applicableRate.transport_allowance || 0).toLocaleString()}
                    </div>
                    <div className="text-green-700">Transport</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      ₦{(applicableRate.per_diem_rate || 0).toLocaleString()}
                    </div>
                    <div className="text-green-700">Per Diem</div>
                  </div>
                </div>

                {/* Summary */}
                <div className="border-t pt-3 grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      ₦{(Number(applicableRate.accommodation_rate || 0) + Number(applicableRate.meal_allowance || 0) + Number(applicableRate.transport_allowance || 0) + Number(applicableRate.per_diem_rate || 0)).toLocaleString()}
                    </div>
                    <div className="text-green-700">Per Person/Day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {teamMembers.length || 1}
                    </div>
                    <div className="text-green-700">Team Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      ₦{totalCost.toLocaleString()}
                    </div>
                    <div className="text-green-700">Total Cost</div>
                  </div>
                </div>
              </div>

              {applicableRate.notes && (
                <div className="mt-3 pt-3 border-t border-green-200">
                  <p className="text-sm text-green-800">
                    <InfoIcon className="h-4 w-4 inline mr-1" />
                    <strong>Note:</strong> {applicableRate.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircleIcon className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>No Travel Rate Found:</strong> No travel rate is configured for "{state || location}".
              Please contact the administrator to set up travel rates for this destination.
            </AlertDescription>
          </Alert>
        )}

        {/* Manual Override Section */}
        {applicableRate && (
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-900 mb-3">Manual Override (Optional)</h4>
              <p className="text-sm text-gray-600 mb-4">
                You can manually adjust the travel allowance if special circumstances apply.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accommodation" className="text-sm font-medium">
                    Accommodation (₦)
                  </Label>
                  <Input
                    id="accommodation"
                    type="number"
                    value={travelFees?.lodging_per_night || applicableRate.accommodation_rate || 0}
                    onChange={(e) => {
                      const newAccommodation = Number(e.target.value) || 0;
                      const meals = Number(travelFees?.meal_allowance_per_day || 0);
                      const transport = Number(travelFees?.interstate_cost || 0);
                      const perDiem = Number(travelFees?.car_hire || 0);
                      const totalPerPerson = newAccommodation + meals + transport + perDiem;
                      const teamSize = teamMembers.length || 1;

                      setValue("travel_fees", {
                        ...travelFees,
                        lodging_per_night: newAccommodation,
                        total_per_person: totalPerPerson,
                        total_cost: totalPerPerson * teamSize,
                        team_size: teamSize,
                        location: state || location || "",
                      });
                    }}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="meals" className="text-sm font-medium">
                    Meals (₦)
                  </Label>
                  <Input
                    id="meals"
                    type="number"
                    value={travelFees?.meal_allowance_per_day || applicableRate.meal_allowance || 0}
                    onChange={(e) => {
                      const newMeals = Number(e.target.value) || 0;
                      const accommodation = Number(travelFees?.lodging_per_night || 0);
                      const transport = Number(travelFees?.interstate_cost || 0);
                      const perDiem = Number(travelFees?.car_hire || 0);
                      const totalPerPerson = accommodation + newMeals + transport + perDiem;
                      const teamSize = teamMembers.length || 1;

                      setValue("travel_fees", {
                        ...travelFees,
                        meal_allowance_per_day: newMeals,
                        total_per_person: totalPerPerson,
                        total_cost: totalPerPerson * teamSize,
                        team_size: teamSize,
                        location: state || location || "",
                      });
                    }}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="transport" className="text-sm font-medium">
                    Transport (₦)
                  </Label>
                  <Input
                    id="transport"
                    type="number"
                    value={travelFees?.interstate_cost || applicableRate.transport_allowance || 0}
                    onChange={(e) => {
                      const newTransport = Number(e.target.value) || 0;
                      const accommodation = Number(travelFees?.lodging_per_night || 0);
                      const meals = Number(travelFees?.meal_allowance_per_day || 0);
                      const perDiem = Number(travelFees?.car_hire || 0);
                      const totalPerPerson = accommodation + meals + newTransport + perDiem;
                      const teamSize = teamMembers.length || 1;

                      setValue("travel_fees", {
                        ...travelFees,
                        interstate_cost: newTransport,
                        total_per_person: totalPerPerson,
                        total_cost: totalPerPerson * teamSize,
                        team_size: teamSize,
                        location: state || location || "",
                      });
                    }}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="per-diem" className="text-sm font-medium">
                    Per Diem (₦)
                  </Label>
                  <Input
                    id="per-diem"
                    type="number"
                    value={travelFees?.car_hire || applicableRate.per_diem_rate || 0}
                    onChange={(e) => {
                      const newPerDiem = Number(e.target.value) || 0;
                      const accommodation = Number(travelFees?.lodging_per_night || 0);
                      const meals = Number(travelFees?.meal_allowance_per_day || 0);
                      const transport = Number(travelFees?.interstate_cost || 0);
                      const totalPerPerson = accommodation + meals + transport + newPerDiem;
                      const teamSize = teamMembers.length || 1;

                      setValue("travel_fees", {
                        ...travelFees,
                        car_hire: newPerDiem,
                        total_per_person: totalPerPerson,
                        total_cost: totalPerPerson * teamSize,
                        team_size: teamSize,
                        location: state || location || "",
                      });
                    }}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">
                    Total Per Person (₦)
                  </Label>
                  <Input
                    value={`₦${(travelFees?.total_per_person || (Number(applicableRate.accommodation_rate || 0) + Number(applicableRate.meal_allowance || 0) + Number(applicableRate.transport_allowance || 0) + Number(applicableRate.per_diem_rate || 0))).toLocaleString()}`}
                    readOnly
                    className="mt-1 bg-gray-50"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Total Cost (₦)
                  </Label>
                  <Input
                    value={`₦${(travelFees?.total_cost || totalCost).toLocaleString()}`}
                    readOnly
                    className="mt-1 bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cost Breakdown */}
        {applicableRate && (
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-900 mb-3">Cost Calculation</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Accommodation per person:</span>
                  <span className="font-medium">₦{(applicableRate.accommodation_rate || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Meals per person:</span>
                  <span className="font-medium">₦{(applicableRate.meal_allowance || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Transport per person:</span>
                  <span className="font-medium">₦{(applicableRate.transport_allowance || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Per diem per person:</span>
                  <span className="font-medium">₦{(applicableRate.per_diem_rate || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-gray-300 pt-2">
                  <span className="text-gray-700">Total per person per day:</span>
                  <span className="font-medium">₦{(Number(applicableRate.accommodation_rate || 0) + Number(applicableRate.meal_allowance || 0) + Number(applicableRate.transport_allowance || 0) + Number(applicableRate.per_diem_rate || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Number of team members:</span>
                  <span className="font-medium">{teamMembers.length || 1}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between text-base">
                  <span className="font-medium text-gray-900">Total travel allowance:</span>
                  <span className="font-bold text-green-600">₦{totalCost.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Note */}
        <Alert className="border-blue-200 bg-blue-50">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Travel Allowance Policy:</strong> AHNI uses detailed rate structures per person based on destination state.
            This includes accommodation, meals, transport allowance, and per diem for miscellaneous expenses.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default TravelFeesSection;