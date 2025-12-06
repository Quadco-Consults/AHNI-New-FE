"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  Filter,
  Sun,
  User,
  Clock,
  ArrowLeft,
  CalendarDays,
  Users,
  MapPin
} from "lucide-react";
import { useGetLeaveRequests } from "@/features/hr/controllers/leaveRequestController";
import { useGetUserProfile } from "@/features/auth/controllers/userController";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, addMonths, subMonths, isSameDay, parseISO } from "date-fns";

const LeaveCalendarPage = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get user profile
  const { data: userProfile } = useGetUserProfile();
  const user = userProfile?.data;

  // Get leave requests for the current month
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);

  const { data: leaveRequestsResponse, isLoading } = useGetLeaveRequests({
    search: "",
    page: 1,
    size: 100,
    enabled: true,
  });

  const leaveRequests = React.useMemo(() => {
    const rawRequests = Array.isArray(leaveRequestsResponse?.data)
      ? leaveRequestsResponse.data
      : Array.isArray(leaveRequestsResponse?.data?.results)
      ? leaveRequestsResponse.data.results
      : [];

    return rawRequests.filter((request: any) =>
      request.status === 'approved' || request.status === 'pending_approval'
    );
  }, [leaveRequestsResponse]);

  // Generate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Helper function to get leaves for a specific date
  const getLeavesForDate = (date: Date) => {
    return leaveRequests.filter((request: any) => {
      if (!request.from_date || !request.to_date) return false;
      const fromDate = parseISO(request.from_date);
      const toDate = parseISO(request.to_date);
      return date >= fromDate && date <= toDate;
    });
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending_approval': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Navigation functions
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
        <div className="absolute top-0 right-0 opacity-10">
          <CalendarDays className="w-24 h-24 text-blue-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="p-2 h-auto"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    Leave Calendar
                  </h1>
                  <p className="text-gray-600 text-sm">
                    View your leave schedule and upcoming time off
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/hr/leave-management')}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <User className="w-4 h-4 mr-2" />
                My Dashboard
              </Button>
              <Button
                onClick={() => router.push('/dashboard/hr/leave-management/apply')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Apply Leave
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={goToPreviousMonth}
              className="p-2 h-auto"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold min-w-[200px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <Button
              variant="outline"
              onClick={goToNextMonth}
              className="p-2 h-auto"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={goToToday}
            className="text-sm"
          >
            Today
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span>Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-500"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span>Rejected</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                const leavesForDay = getLeavesForDate(day);
                const isCurrentDay = isToday(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);

                return (
                  <div
                    key={index}
                    className={`
                      relative min-h-[100px] p-2 border border-gray-200 rounded-lg cursor-pointer
                      transition-all duration-200 hover:shadow-md
                      ${isCurrentDay ? 'bg-blue-50 border-blue-300' : ''}
                      ${isSelected ? 'bg-blue-100 border-blue-400' : ''}
                      ${!isSameMonth(day, currentDate) ? 'bg-gray-50 text-gray-400' : 'hover:bg-gray-50'}
                    `}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-medium ${isCurrentDay ? 'text-blue-700' : ''}`}>
                        {format(day, 'd')}
                      </span>
                      {isCurrentDay && (
                        <Sun className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>

                    {/* Leave indicators */}
                    <div className="space-y-1">
                      {leavesForDay.slice(0, 2).map((leave: any, idx) => (
                        <div
                          key={idx}
                          className={`text-xs px-2 py-1 rounded text-center truncate ${getStatusColor(leave.status)}`}
                        >
                          {leave.leave_type?.name || 'Leave'}
                        </div>
                      ))}
                      {leavesForDay.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{leavesForDay.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Info */}
          {selectedDate && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                {format(selectedDate, 'EEEE, MMMM dd')}
              </h3>

              {getLeavesForDate(selectedDate).length > 0 ? (
                <div className="space-y-3">
                  {getLeavesForDate(selectedDate).map((leave: any, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">
                          {leave.leave_type?.name || 'Leave'}
                        </span>
                        <Badge className={getStatusColor(leave.status)}>
                          {leave.status?.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {format(parseISO(leave.from_date), 'MMM dd')} - {format(parseISO(leave.to_date), 'MMM dd')}
                          </span>
                        </div>
                        {leave.reason && (
                          <p className="text-xs text-gray-500 mt-1">{leave.reason}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No leaves on this date</p>
                </div>
              )}
            </Card>
          )}

          {/* Upcoming Leaves */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-600" />
              Upcoming Leaves
            </h3>

            {leaveRequests
              .filter((leave: any) => new Date(leave.from_date) > new Date() && leave.status === 'approved')
              .slice(0, 3)
              .map((leave: any, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-3 mb-3 last:mb-0">
                  <div className="font-medium text-sm mb-1">
                    {leave.leave_type?.name || 'Leave'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {format(parseISO(leave.from_date), 'MMM dd')} - {format(parseISO(leave.to_date), 'MMM dd')}
                  </div>
                </div>
              ))}

            {leaveRequests.filter((leave: any) => new Date(leave.from_date) > new Date() && leave.status === 'approved').length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No upcoming leaves
              </p>
            )}
          </Card>

          {/* Quick Stats */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              This Month
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Leaves:</span>
                <span className="font-medium">
                  {leaveRequests.filter((leave: any) => {
                    const fromDate = parseISO(leave.from_date);
                    return isSameMonth(fromDate, currentDate);
                  }).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Approved:</span>
                <span className="font-medium text-green-600">
                  {leaveRequests.filter((leave: any) => {
                    const fromDate = parseISO(leave.from_date);
                    return isSameMonth(fromDate, currentDate) && leave.status === 'approved';
                  }).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending:</span>
                <span className="font-medium text-amber-600">
                  {leaveRequests.filter((leave: any) => {
                    const fromDate = parseISO(leave.from_date);
                    return isSameMonth(fromDate, currentDate) && leave.status === 'pending_approval';
                  }).length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeaveCalendarPage;