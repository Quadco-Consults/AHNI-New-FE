"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calculator,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  RotateCcw
} from 'lucide-react';
import useTravelRates, { TravelFees } from '../../hooks/useTravelRates';

interface TravelFeesCalculatorProps {
  locationName?: string;
  state?: string;
  startDate?: string;
  endDate?: string;
  teamMembersCount?: number;
  onFeesUpdate?: (fees: TravelFees, totalCost: number) => void;
  readOnly?: boolean;
  initialFees?: Partial<TravelFees>;
}

const TravelFeesCalculator = ({
  locationName = '',
  state = '',
  startDate = '',
  endDate = '',
  teamMembersCount = 1,
  onFeesUpdate,
  readOnly = false,
  initialFees = {}
}: TravelFeesCalculatorProps) => {
  const {
    travelFees,
    setTravelFees,
    updateTravelFees,
    getTravelRateByLocation,
    isLoading,
    availableRates
  } = useTravelRates(undefined, state);

  const [manualOverride, setManualOverride] = useState(false);

  // Initialize with provided fees or calculate from rates
  useEffect(() => {
    if (Object.keys(initialFees).length > 0) {
      setTravelFees(prev => ({ ...prev, ...initialFees }));
      setManualOverride(true);
    } else if (startDate && endDate && (locationName || state)) {
      updateTravelFees(startDate, endDate, locationName);
    }
  }, [startDate, endDate, locationName, state, initialFees]);

  // Auto-calculate when dates or location change
  useEffect(() => {
    if (!manualOverride && startDate && endDate && (locationName || state)) {
      updateTravelFees(startDate, endDate, locationName);
    }
  }, [startDate, endDate, locationName, state, manualOverride]); // Removed updateTravelFees to prevent infinite loop

  // Notify parent of fee changes
  useEffect(() => {
    if (onFeesUpdate) {
      const totalCost = travelFees.totalPerPerson * teamMembersCount;
      onFeesUpdate(travelFees, totalCost);
    }
  }, [travelFees, teamMembersCount, onFeesUpdate]);

  const handleFeeChange = (field: keyof TravelFees, value: number) => {
    const updatedFees = { ...travelFees, [field]: value };

    // Recalculate total
    const total = updatedFees.lodging + updatedFees.meals + updatedFees.interstate +
                  updatedFees.airportTaxi + updatedFees.carHire;
    updatedFees.totalPerPerson = total;

    setTravelFees(updatedFees);
    setManualOverride(true);
  };

  const handleAutoCalculate = () => {
    if (startDate && endDate && (locationName || state)) {
      updateTravelFees(startDate, endDate, locationName);
      setManualOverride(false);
    }
  };

  const applicableRate = getTravelRateByLocation(locationName || state);
  const totalTeamCost = travelFees.totalPerPerson * teamMembersCount;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calculator className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Travel Fees Calculator</h3>
            <p className="text-sm text-gray-600">
              {applicableRate ? 'Auto-calculated from travel rates' : 'Manual entry required'}
            </p>
          </div>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-2">
            {manualOverride && (
              <Badge variant="outline" className="text-yellow-600">
                Manual Override
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleAutoCalculate}
              disabled={!startDate || !endDate || !locationName}
              className="flex items-center gap-2"
            >
              <RotateCcw size={14} />
              Auto-Calculate
            </Button>
          </div>
        )}
      </div>

      {/* Location and Date Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Location</p>
            <p className="font-medium">{locationName || state || 'Not specified'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Duration</p>
            <p className="font-medium">{travelFees.numberOfNights} nights</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users size={16} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Team Size</p>
            <p className="font-medium">{teamMembersCount} members</p>
          </div>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="lodging">Lodging per night</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
            <Input
              id="lodging"
              type="number"
              value={travelFees.lodging / Math.max(1, travelFees.numberOfNights)}
              onChange={(e) => handleFeeChange('lodging', parseFloat(e.target.value) * travelFees.numberOfNights)}
              disabled={readOnly}
              className="pl-8"
              placeholder="0.00"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Total: ₦{travelFees.lodging.toLocaleString()}
          </p>
        </div>

        <div>
          <Label htmlFor="meals">Meals per day</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
            <Input
              id="meals"
              type="number"
              value={travelFees.meals / Math.max(1, travelFees.numberOfNights)}
              onChange={(e) => handleFeeChange('meals', parseFloat(e.target.value) * travelFees.numberOfNights)}
              disabled={readOnly}
              className="pl-8"
              placeholder="0.00"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Total: ₦{travelFees.meals.toLocaleString()}
          </p>
        </div>

        <div>
          <Label htmlFor="interstate">Interstate/Transport</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
            <Input
              id="interstate"
              type="number"
              value={travelFees.interstate}
              onChange={(e) => handleFeeChange('interstate', parseFloat(e.target.value))}
              disabled={readOnly}
              className="pl-8"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="airportTaxi">Airport Taxi</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
            <Input
              id="airportTaxi"
              type="number"
              value={travelFees.airportTaxi}
              onChange={(e) => handleFeeChange('airportTaxi', parseFloat(e.target.value))}
              disabled={readOnly}
              className="pl-8"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="carHire">Car Hire</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
            <Input
              id="carHire"
              type="number"
              value={travelFees.carHire}
              onChange={(e) => handleFeeChange('carHire', parseFloat(e.target.value))}
              disabled={readOnly}
              className="pl-8"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="numberOfNights">Number of Nights</Label>
          <Input
            id="numberOfNights"
            type="number"
            min="1"
            value={travelFees.numberOfNights}
            onChange={(e) => handleFeeChange('numberOfNights', parseInt(e.target.value))}
            disabled={readOnly}
            placeholder="1"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-blue-600" />
              <span className="text-sm font-medium">Per Person Total</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              ₦{travelFees.totalPerPerson.toLocaleString()}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-green-600" />
              <span className="text-sm font-medium">Team Cost</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              ₦{totalTeamCost.toLocaleString()}
            </p>
          </div>

          {applicableRate && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-purple-600" />
                <span className="text-sm font-medium">Rate Category</span>
              </div>
              <p className="text-lg font-bold text-purple-600">{applicableRate.category}</p>
              <p className="text-xs text-purple-500">{applicableRate.currency}</p>
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">Loading travel rates...</p>
        </div>
      )}
    </Card>
  );
};

export default TravelFeesCalculator;