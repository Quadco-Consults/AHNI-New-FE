import { useState, useEffect } from 'react';
import { useGetAllTravelRatesManager } from '@/features/modules/controllers/config/travelRateController';
import { ITravelRate } from '@/features/admin/types/config/travel-rate';

export interface TravelFees {
  lodging: number;
  meals: number;
  interstate: number;
  airportTaxi: number;
  carHire: number;
  numberOfNights: number;
  totalPerPerson: number;
}

export const useTravelRates = (locationId?: string, state?: string) => {
  const [travelFees, setTravelFees] = useState<TravelFees>({
    lodging: 0,
    meals: 0,
    interstate: 0,
    airportTaxi: 0,
    carHire: 0,
    numberOfNights: 1,
    totalPerPerson: 0,
  });

  const { data: travelRatesResponse, isFetching } = useGetAllTravelRatesManager({
    page: 1,
    size: 100,
    search: state || '',
    enabled: !!state || !!locationId,
  });

  const calculateTravelFees = (
    startDate: string,
    endDate: string,
    location?: string,
    customRates?: Partial<ITravelRate>
  ): TravelFees => {
    // Calculate number of nights
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const numberOfNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Find applicable travel rate
    const applicableRate = travelRatesResponse?.data?.results?.find(
      (rate: ITravelRate) =>
        rate.is_active &&
        (rate.location.toLowerCase().includes(location?.toLowerCase() || '') ||
         rate.state.toLowerCase().includes(state?.toLowerCase() || ''))
    );

    const rate = customRates || applicableRate;

    if (!rate) {
      return {
        lodging: 0,
        meals: 0,
        interstate: 0,
        airportTaxi: 0,
        carHire: 0,
        numberOfNights,
        totalPerPerson: 0,
      };
    }

    // Calculate fees based on travel rate config
    const lodging = (rate.accommodation_rate || 0) * numberOfNights;
    const meals = (rate.meal_allowance || 0) * numberOfNights;
    const interstate = rate.transport_allowance || 0;
    const airportTaxi = rate.per_diem_rate * 0.1 || 0; // 10% of per diem for airport taxi
    const carHire = rate.per_diem_rate * 0.2 || 0; // 20% of per diem for car hire

    const totalPerPerson = lodging + meals + interstate + airportTaxi + carHire;

    return {
      lodging,
      meals,
      interstate,
      airportTaxi,
      carHire,
      numberOfNights,
      totalPerPerson,
    };
  };

  const updateTravelFees = (startDate: string, endDate: string, location?: string) => {
    const fees = calculateTravelFees(startDate, endDate, location);
    setTravelFees(fees);
  };

  const getApplicableTravelRates = (): ITravelRate[] => {
    return travelRatesResponse?.data?.results?.filter(
      (rate: ITravelRate) => rate.is_active
    ) || [];
  };

  const getTravelRateByLocation = (location: string): ITravelRate | null => {
    return travelRatesResponse?.data?.results?.find(
      (rate: ITravelRate) =>
        rate.is_active &&
        (rate.location.toLowerCase().includes(location.toLowerCase()) ||
         rate.state.toLowerCase().includes(location.toLowerCase()))
    ) || null;
  };

  return {
    travelFees,
    setTravelFees,
    updateTravelFees,
    calculateTravelFees,
    getApplicableTravelRates,
    getTravelRateByLocation,
    isLoading: isFetching,
    availableRates: travelRatesResponse?.data?.results || [],
  };
};

export default useTravelRates;