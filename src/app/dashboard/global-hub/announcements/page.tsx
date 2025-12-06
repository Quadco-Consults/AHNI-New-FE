"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Calendar, Search, Filter, Bell, Pin } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  author: {
    name: string;
    department: string;
  };
  created_date: string;
  is_pinned: boolean;
  target_audience: string[];
}

export default function AnnouncementsPage() {
  const { user } = usePermissions();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with actual API call
  const mockAnnouncements: Announcement[] = [
    {
      id: "1",
      title: "System Maintenance Scheduled",
      content: "The ERP system will undergo scheduled maintenance on Saturday, November 25th from 2:00 AM to 6:00 AM. During this time, some features may be temporarily unavailable.",
      priority: "high",
      category: "System",
      author: {
        name: "IT Department",
        department: "Information Technology"
      },
      created_date: "2025-11-20T10:30:00Z",
      is_pinned: true,
      target_audience: ["all"]
    },
    {
      id: "2",
      title: "New Contract Request Process",
      content: "We have updated the contract request workflow to streamline approvals. Please review the new process documentation in the knowledge base.",
      priority: "medium",
      category: "Process Update",
      author: {
        name: "Contracts & Grants Team",
        department: "Contracts and Grants"
      },
      created_date: "2025-11-18T14:15:00Z",
      is_pinned: false,
      target_audience: ["contracts", "admin"]
    },
    {
      id: "3",
      title: "Holiday Schedule Reminder",
      content: "Please remember that the office will be closed on November 30th for the national holiday. All pending requests should be submitted by November 29th.",
      priority: "medium",
      category: "General",
      author: {
        name: "HR Department",
        department: "Human Resources"
      },
      created_date: "2025-11-15T09:00:00Z",
      is_pinned: false,
      target_audience: ["all"]
    },
    {
      id: "4",
      title: "Security Update Required",
      content: "All users must update their passwords by December 1st, 2025. Please ensure your new password meets the security requirements outlined in the security policy.",
      priority: "urgent",
      category: "Security",
      author: {
        name: "Security Team",
        department: "Information Technology"
      },
      created_date: "2025-11-22T16:45:00Z",
      is_pinned: true,
      target_audience: ["all"]
    }
  ];

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setAnnouncements(mockAnnouncements);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || announcement.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pinnedAnnouncements = filteredAnnouncements.filter(a => a.is_pinned);
  const regularAnnouncements = filteredAnnouncements.filter(a => !a.is_pinned);

  const categories = ["all", ...Array.from(new Set(announcements.map(a => a.category)))];

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Announcements</h1>
            <p className="text-gray-600">Stay updated with the latest news and updates</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            Announcements
          </h1>
          <p className="text-gray-600">Stay updated with the latest news and updates</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search announcements..."
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
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Pinned Announcements */}
      {pinnedAnnouncements.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Pin className="w-4 h-4 text-blue-600" />
            <h2 className="text-lg font-semibold">Pinned Announcements</h2>
          </div>
          {pinnedAnnouncements.map(announcement => (
            <Card key={announcement.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Pin className="w-4 h-4 text-blue-600" />
                      {announcement.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {announcement.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{announcement.category}</Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(announcement.created_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{announcement.content}</p>
                <div className="text-sm text-gray-500">
                  <p>Posted by: <strong>{announcement.author.name}</strong> ({announcement.author.department})</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Regular Announcements */}
      <div className="space-y-4">
        {pinnedAnnouncements.length > 0 && (
          <h2 className="text-lg font-semibold">Recent Announcements</h2>
        )}
        {regularAnnouncements.length === 0 && pinnedAnnouncements.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "There are no announcements at this time"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          regularAnnouncements.map(announcement => (
            <Card key={announcement.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {announcement.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{announcement.category}</Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(announcement.created_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{announcement.content}</p>
                <div className="text-sm text-gray-500">
                  <p>Posted by: <strong>{announcement.author.name}</strong> ({announcement.author.department})</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}