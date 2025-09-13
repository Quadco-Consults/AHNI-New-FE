"use client";

import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { Checkbox } from "components/ui/checkbox";

interface FilterPanelProps {
  filters: {
    page: number;
    size: number;
    status: string;
    item_type: string;
    service_status: string;
    services_only: string;
    search: string;
    year: string;
  };
  onFilterChange: (filters: any) => void;
}

const FilterPanel = ({ filters, onFilterChange }: FilterPanelProps) => {
  const updateFilter = (key: string, value: string | number) => {
    // Convert "all" back to empty string for API calls
    const apiValue = value === "all" ? "" : value;
    
    onFilterChange({
      ...filters,
      [key]: apiValue,
      page: 1, // Reset to first page when filtering
    });
  };

  const clearFilters = () => {
    onFilterChange({
      page: 1,
      size: 20,
      status: "",
      item_type: "",
      service_status: "",
      services_only: "false",
      search: "",
      year: "",
    });
  };

  const statusOptions = [
    { label: "All Statuses", value: "all" },
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" },
  ];

  const itemTypeOptions = [
    { label: "All Types", value: "all" },
    { label: "Services", value: "SERVICE" },
    { label: "Goods", value: "GOODS" },
    { label: "Works", value: "WORK" },
    { label: "Others", value: "OTHERS" },
  ];

  const serviceStatusOptions = [
    { label: "All Service Status", value: "all" },
    { label: "Pending", value: "PENDING" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Rejected", value: "REJECTED" },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { label: "All Years", value: "all" },
    ...Array.from({ length: 5 }, (_, i) => ({
      label: (currentYear - i).toString(),
      value: (currentYear - i).toString(),
    })),
  ];

  return (
    <div className='bg-gray-50 p-4 rounded-lg mb-6 space-y-4'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-gray-800'>Filter Procurement Data</h3>
        <Button onClick={clearFilters} variant="outline" size="sm">
          Clear All Filters
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Search */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>Search</label>
          <Input
            placeholder="PR reference or item name..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Status */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>Status</label>
          <Select value={filters.status || "all"} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Item Type */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>Item Type</label>
          <Select value={filters.item_type || "all"} onValueChange={(value) => updateFilter('item_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              {itemTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>Year</label>
          <Select value={filters.year || "all"} onValueChange={(value) => updateFilter('year', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {/* Service Status */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>Service Status</label>
          <Select 
            value={filters.service_status || "all"} 
            onValueChange={(value) => updateFilter('service_status', value)}
            disabled={filters.services_only !== 'true' && filters.item_type !== 'SERVICE'}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Service Status" />
            </SelectTrigger>
            <SelectContent>
              {serviceStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Services Only Checkbox */}
        <div className='space-y-2 flex items-end'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id="services_only"
              checked={filters.services_only === 'true'}
              onCheckedChange={(checked) => updateFilter('services_only', checked ? 'true' : 'false')}
            />
            <label 
              htmlFor="services_only" 
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Services Only
            </label>
          </div>
        </div>

        {/* Page Size */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>Items Per Page</label>
          <Select value={filters.size.toString()} onValueChange={(value) => updateFilter('size', parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.search || filters.status || filters.item_type || filters.year || filters.service_status || filters.services_only === 'true') && (
        <div className='mt-4 p-3 bg-blue-50 rounded-lg'>
          <p className='text-sm font-medium text-blue-800 mb-2'>Active Filters:</p>
          <div className='flex flex-wrap gap-2'>
            {filters.search && (
              <span className='px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs'>
                Search: {filters.search}
              </span>
            )}
            {filters.status && (
              <span className='px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs'>
                Status: {filters.status}
              </span>
            )}
            {filters.item_type && (
              <span className='px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs'>
                Type: {filters.item_type}
              </span>
            )}
            {filters.year && (
              <span className='px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs'>
                Year: {filters.year}
              </span>
            )}
            {filters.service_status && (
              <span className='px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs'>
                Service: {filters.service_status}
              </span>
            )}
            {filters.services_only === 'true' && (
              <span className='px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs'>
                Services Only
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;