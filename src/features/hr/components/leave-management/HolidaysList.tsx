"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Plus, Search, Trash2, Edit, AlertCircle } from "lucide-react";
import DataTable from "@/components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import GoBack from "@/components/GoBack";
import { Badge } from "@/components/ui/badge";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { toast } from "sonner";

interface Holiday {
  id: string;
  name: string;
  date: string;
  description?: string;
  is_recurring: boolean;
  created_at: string;
}

const HolidaysList = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch holidays from backend
  const { data: holidaysData, isLoading } = useQuery({
    queryKey: ["holidays"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("hr/holidays/");
        return response.data;
      } catch (error: any) {
        console.error("Error fetching holidays:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });

  const holidays = Array.isArray(holidaysData?.data)
    ? holidaysData.data
    : Array.isArray(holidaysData?.data?.results)
    ? holidaysData.data.results
    : [];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this holiday?")) return;

    try {
      await AxiosWithToken.delete(`hr/holidays/${id}/`);
      await queryClient.invalidateQueries({ queryKey: ["holidays"] });
      toast.success("Holiday deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting holiday:", error);
      toast.error("Failed to delete holiday. Please try again.");
    }
  };

  const columns: ColumnDef<Holiday>[] = [
    {
      header: "Holiday Name",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          {row.original.description && (
            <div className="text-sm text-gray-500">{row.original.description}</div>
          )}
        </div>
      ),
    },
    {
      header: "Date",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.date ? format(new Date(row.original.date), 'MMMM dd, yyyy') : 'N/A'}
        </div>
      ),
    },
    {
      header: "Type",
      cell: ({ row }) => (
        <Badge variant={row.original.is_recurring ? "default" : "secondary"}>
          {row.original.is_recurring ? "Recurring" : "One-time"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/hr/leave-management/holidays/${row.original.id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const filteredHolidays = holidays.filter((holiday: Holiday) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      holiday.name?.toLowerCase().includes(search) ||
      holiday.description?.toLowerCase().includes(search) ||
      holiday.date?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      <GoBack />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Public Holidays
          </h1>
          <p className="text-gray-600 mt-1">
            Manage public holidays and non-working days
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/hr/leave-management/holidays/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Holiday
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Holidays</p>
              <p className="text-2xl font-bold">{holidays.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Recurring Holidays</p>
              <p className="text-2xl font-bold">
                {holidays.filter((h: Holiday) => h.is_recurring).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">One-time Holidays</p>
              <p className="text-2xl font-bold">
                {holidays.filter((h: Holiday) => !h.is_recurring).length}
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search holidays by name, date, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Holidays Table */}
      <Card>
        <DataTable
          data={filteredHolidays}
          columns={columns}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default HolidaysList;
