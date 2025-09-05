"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Badge } from "components/ui/badge";
import { X, Filter, Search } from "lucide-react";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useGetVendors } from "@/features/procurement/controllers/vendorController";
import { useGetAllItemsQuery } from "@/features/modules/controllers";

interface FuelConsumptionFiltersProps {
  onFilterChange: (filters: FuelConsumptionFilters) => void;
  currentFilters: FuelConsumptionFilters;
}

export interface FuelConsumptionFilters {
  search: string;
  status: string;
  date_from: string;
  date_to: string;
  vendor: string;
  location: string;
  driver: string;
  asset: string;
}

const DEFAULT_FILTERS: FuelConsumptionFilters = {
  search: "",
  status: "all",
  date_from: "",
  date_to: "",
  vendor: "all",
  location: "all",
  driver: "all",
  asset: "all",
};

export default function FuelConsumptionFilters({
  onFilterChange,
  currentFilters,
}: FuelConsumptionFiltersProps) {
  const [localFilters, setLocalFilters] =
    useState<FuelConsumptionFilters>(currentFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Data fetching for filter options
  const { data: assets } = useGetAllItemsQuery({
    page: 1,
    size: 2000000,
    category: "b0983944-f926-4141-8e28-093960d75246",
  });

  const { data: users } = useGetAllUsers({
    page: 1,
    size: 2000000,
    search: "",
  });
  const { data: locations } = useGetAllLocations({
    page: 1,
    size: 2000000,
    search: "",
  });
  const { data: vendors } = useGetVendors({ page: 1, size: 2000000 });

  // Options for dropdowns
  const assetOptions = useMemo(
    () =>
      assets?.data?.results?.map(({ name, id }: any) => ({
        label: name,
        value: id,
      })) || [],
    [assets]
  );

  const driverOptions = useMemo(
    () =>
      users?.results?.map(({ first_name, last_name, employee_id }: any) => ({
        label: `${first_name} ${last_name}`,
        value: employee_id,
      })) || [],
    [users]
  );

  const locationOptions = useMemo(
    () =>
      locations?.results?.map(({ name, id }: any) => ({
        label: name,
        value: id,
      })) || [],
    [locations]
  );

  const vendorOptions = useMemo(
    () =>
      vendors?.data?.results?.map(({ company_name, id }: any) => ({
        label: company_name,
        value: id,
      })) || [],
    [vendors]
  );

  const statusOptions = [
    { label: "All Status", value: "" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
  ];

  const handleFilterChange = (
    key: keyof FuelConsumptionFilters,
    value: string
  ) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
  };

  const applyFilters = () => {
    // Convert "all" values back to empty strings for API
    const apiFilters = {
      ...localFilters,
      status: localFilters.status === "all" ? "" : localFilters.status,
      vendor: localFilters.vendor === "all" ? "" : localFilters.vendor,
      location: localFilters.location === "all" ? "" : localFilters.location,
      driver: localFilters.driver === "all" ? "" : localFilters.driver,
      asset: localFilters.asset === "all" ? "" : localFilters.asset,
    };
    onFilterChange(apiFilters);
  };

  const clearFilters = () => {
    setLocalFilters(DEFAULT_FILTERS);
    onFilterChange(DEFAULT_FILTERS);
  };

  const getActiveFilterCount = () => {
    return Object.values(localFilters).filter(
      (value) => value !== "" && value !== "all"
    ).length;
  };

  const hasActiveFilters = getActiveFilterCount() > 0;

  return (
    <Card className='mb-6'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Filter size={20} />
            Filters
            {hasActiveFilters && (
              <Badge variant='secondary' className='ml-2'>
                {getActiveFilterCount()}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? "Hide Advanced" : "Show Advanced"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Basic Filters */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <Label>Search</Label>
            <div className='relative'>
              <Search
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                size={16}
              />
              <Input
                placeholder='Search vendors, locations...'
                value={localFilters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className='pl-10'
              />
            </div>
          </div>
          <div>
            <Label>Status</Label>
            <Select
              value={localFilters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='All Status' />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option: any) => (
                  <SelectItem
                    key={option.value || "all"}
                    value={option.value || "all"}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date From</Label>
            <Input
              type='date'
              value={localFilters.date_from}
              onChange={(e) => handleFilterChange("date_from", e.target.value)}
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className='space-y-4 pt-4 border-t'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <div>
                <Label>Date To</Label>
                <Input
                  type='date'
                  value={localFilters.date_to}
                  onChange={(e) =>
                    handleFilterChange("date_to", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Vehicle</Label>
                <Select
                  value={localFilters.asset}
                  onValueChange={(value) => handleFilterChange("asset", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='All Vehicles' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Vehicles</SelectItem>
                    {assetOptions.map((option: any) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Driver</Label>
                <Select
                  value={localFilters.driver}
                  onValueChange={(value) => handleFilterChange("driver", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='All Drivers' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Drivers</SelectItem>
                    {driverOptions.map((option: any) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Location</Label>
                <Select
                  value={localFilters.location}
                  onValueChange={(value) =>
                    handleFilterChange("location", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='All Locations' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Locations</SelectItem>
                    {locationOptions.map((option: any) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label>Vendor</Label>
                <Select
                  value={localFilters.vendor}
                  onValueChange={(value) => handleFilterChange("vendor", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='All Vendors' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Vendors</SelectItem>
                    {vendorOptions.map((option: any) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex items-center gap-2 pt-4 border-t'>
          <Button onClick={applyFilters}>Apply Filters</Button>
          {hasActiveFilters && (
            <Button variant='outline' onClick={clearFilters}>
              <X size={16} className='mr-2' />
              Clear All
            </Button>
          )}
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className='flex flex-wrap gap-2 pt-2'>
            {localFilters.search && (
              <Badge variant='secondary' className='flex items-center gap-1'>
                Search: {localFilters.search}
                <X
                  size={12}
                  className='cursor-pointer'
                  onClick={() => handleFilterChange("search", "")}
                />
              </Badge>
            )}
            {localFilters.status && (
              <Badge variant='secondary' className='flex items-center gap-1'>
                Status: {localFilters.status}
                <X
                  size={12}
                  className='cursor-pointer'
                  onClick={() => handleFilterChange("status", "")}
                />
              </Badge>
            )}
            {localFilters.date_from && (
              <Badge variant='secondary' className='flex items-center gap-1'>
                From: {localFilters.date_from}
                <X
                  size={12}
                  className='cursor-pointer'
                  onClick={() => handleFilterChange("date_from", "")}
                />
              </Badge>
            )}
            {localFilters.date_to && (
              <Badge variant='secondary' className='flex items-center gap-1'>
                To: {localFilters.date_to}
                <X
                  size={12}
                  className='cursor-pointer'
                  onClick={() => handleFilterChange("date_to", "")}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
