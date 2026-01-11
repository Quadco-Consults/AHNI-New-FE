"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Video,
  Phone
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  meeting_type: "in-person" | "virtual" | "phone";
  organizer: {
    name: string;
    department: string;
  };
  attendees: string[];
  category: "meeting" | "training" | "deadline" | "holiday" | "maintenance";
  priority: "low" | "medium" | "high";
  meeting_link?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const { user } = usePermissions();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "agenda">("month");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock calendar events
  const mockEvents: CalendarEvent[] = [
    {
      id: "1",
      title: "Weekly Team Meeting",
      description: "Regular team sync to discuss project updates and blockers",
      start_time: "2025-11-25T09:00:00Z",
      end_time: "2025-11-25T10:00:00Z",
      location: "Conference Room A",
      meeting_type: "in-person",
      organizer: {
        name: "Michael Brown",
        department: "Programs"
      },
      attendees: ["team-programs"],
      category: "meeting",
      priority: "medium"
    },
    {
      id: "2",
      title: "System Maintenance Window",
      description: "Scheduled ERP system maintenance - system will be unavailable",
      start_time: "2025-11-25T02:00:00Z",
      end_time: "2025-11-25T06:00:00Z",
      meeting_type: "in-person",
      organizer: {
        name: "IT Department",
        department: "Operations"
      },
      attendees: ["all-staff"],
      category: "maintenance",
      priority: "high"
    },
    {
      id: "3",
      title: "Budget Planning Session",
      description: "FY 2025 budget review and planning session",
      start_time: "2025-11-26T14:00:00Z",
      end_time: "2025-11-26T16:00:00Z",
      location: "Executive Conference Room",
      meeting_type: "virtual",
      organizer: {
        name: "Robert Wilson",
        department: "Finance"
      },
      attendees: ["department-heads"],
      category: "meeting",
      priority: "high",
      meeting_link: "https://zoom.us/j/123456789"
    },
    {
      id: "4",
      title: "HR Policy Training",
      description: "Mandatory training on updated HR policies and procedures",
      start_time: "2025-11-27T10:00:00Z",
      end_time: "2025-11-27T12:00:00Z",
      location: "Training Center",
      meeting_type: "in-person",
      organizer: {
        name: "Amanda Garcia",
        department: "Human Resources"
      },
      attendees: ["all-staff"],
      category: "training",
      priority: "medium"
    },
    {
      id: "5",
      title: "Project Proposal Deadline",
      description: "Final deadline for Q1 2025 project proposals submission",
      start_time: "2025-11-30T17:00:00Z",
      end_time: "2025-11-30T17:00:00Z",
      organizer: {
        name: "Programs Department",
        department: "Programs"
      },
      attendees: ["program-managers"],
      category: "deadline",
      priority: "high"
    },
    {
      id: "6",
      title: "Independence Day",
      description: "National Holiday - Office Closed",
      start_time: "2025-11-30T00:00:00Z",
      end_time: "2025-11-30T23:59:59Z",
      organizer: {
        name: "HR Department",
        department: "Human Resources"
      },
      attendees: ["all-staff"],
      category: "holiday",
      priority: "low"
    }
  ];

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setEvents(mockEvents);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "meeting": return "bg-blue-100 text-blue-800 border-blue-200";
      case "training": return "bg-green-100 text-green-800 border-green-200";
      case "deadline": return "bg-red-100 text-red-800 border-red-200";
      case "holiday": return "bg-purple-100 text-purple-800 border-purple-200";
      case "maintenance": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case "virtual": return <Video className="w-4 h-4" />;
      case "phone": return <Phone className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="p-2 min-h-[100px] border border-gray-100"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={day}
          className={`p-2 min-h-[100px] border border-gray-100 ${
            isToday ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
          }`}
        >
          <div className={`text-sm font-medium mb-1 ${
            isToday ? "text-blue-600" : "text-gray-900"
          }`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map(event => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded truncate cursor-pointer ${getCategoryColor(event.category)}`}
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-gray-600">View organizational events and schedules</p>
          </div>
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-96 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
            Calendar
          </h1>
          <p className="text-gray-600">View organizational events and schedules</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "month" ? "default" : "outline"}
            onClick={() => setViewMode("month")}
          >
            Month
          </Button>
          <Button
            variant={viewMode === "agenda" ? "default" : "outline"}
            onClick={() => setViewMode("agenda")}
          >
            Agenda
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Categories</option>
              <option value="meeting">Meetings</option>
              <option value="training">Training</option>
              <option value="deadline">Deadlines</option>
              <option value="holiday">Holidays</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {viewMode === "month" ? (
        /* Calendar Grid View */
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-0 mb-4">
              {DAYS.map(day => (
                <div key={day} className="p-2 text-center font-medium text-gray-600 bg-gray-50">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0 border border-gray-200">
              {renderCalendarGrid()}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Agenda View */
        <Card>
          <CardHeader>
            <CardTitle>Event Agenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                  <p className="text-gray-500">
                    {searchTerm || selectedCategory !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "There are no upcoming events"
                    }
                  </p>
                </div>
              ) : (
                filteredEvents.map(event => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{event.title}</h3>
                            <Badge className={getCategoryColor(event.category)}>
                              {event.category}
                            </Badge>
                            {event.priority === "high" && (
                              <Badge variant="destructive">High Priority</Badge>
                            )}
                          </div>

                          {event.description && (
                            <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(event.start_time).toLocaleString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                              {event.end_time !== event.start_time && (
                                <span> - {new Date(event.end_time).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}</span>
                              )}
                            </div>

                            {event.location && (
                              <div className="flex items-center gap-1">
                                {getMeetingTypeIcon(event.meeting_type)}
                                {event.meeting_link ? (
                                  <a href={event.meeting_link} target="_blank" rel="noopener noreferrer"
                                     className="text-blue-600 hover:underline">
                                    {event.location}
                                  </a>
                                ) : (
                                  event.location
                                )}
                              </div>
                            )}

                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              Organized by {event.organizer.name}
                            </div>

                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {event.attendees.join(", ")}
                            </div>
                          </div>
                        </div>

                        {event.meeting_link && (
                          <Button size="sm" asChild>
                            <a href={event.meeting_link} target="_blank" rel="noopener noreferrer">
                              <Video className="w-4 h-4 mr-2" />
                              Join
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}