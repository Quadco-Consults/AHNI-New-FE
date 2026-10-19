"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Filter, Bell, Pin, Briefcase, MapPin, Clock } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { usePublishedJobAdvertisements } from "@/hooks/useJobAdvertisements";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { format } from "date-fns";

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
  type: "general" | "job_vacancy";
  job_metadata?: {
    position: string;
    locations: string;
    deadline: string;
    number_of_positions: number;
    job_type: string;
    advertisement_id: string;
  };
}

export default function AnnouncementsPage() {
  const router = useRouter();
  const { user } = usePermissions();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch published job advertisements
  const { data: jobAdsData, isLoading: isLoadingJobs } = usePublishedJobAdvertisements();
  const jobAdvertisements = jobAdsData?.data || [];

  // Fetch general announcements from backend
  const { data: announcementsData, isLoading: isLoadingAnnouncements } = useAnnouncements();
  const generalAnnouncements = announcementsData?.data || announcementsData?.results || [];

  // Convert general announcements from backend to unified format
  const formattedGeneralAnnouncements: Announcement[] = useMemo(() => {
    if (!Array.isArray(generalAnnouncements)) {
      return [];
    }
    return generalAnnouncements.map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      category: announcement.announcement_type_display || "General",
      type: "general" as const,
      author: {
        name: announcement.author_name,
        department: announcement.department || ""
      },
      created_date: announcement.published_date || announcement.created_datetime,
      is_pinned: announcement.is_pinned,
      target_audience: announcement.target_all_staff ? ["all"] : [],
    }));
  }, [generalAnnouncements]);

  // Convert job advertisements to announcements
  const jobAnnouncements: Announcement[] = useMemo(() => {
    if (!Array.isArray(jobAdvertisements)) {
      return [];
    }
    return jobAdvertisements.map((job) => {
      const locationNames = job.locations.map(l => l.name).join(", ");
      const daysUntilDeadline = job.application_deadline
        ? Math.ceil((new Date(job.application_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null;

      const priority: "low" | "medium" | "high" | "urgent" = daysUntilDeadline !== null
        ? daysUntilDeadline <= 3 ? "urgent" : daysUntilDeadline <= 7 ? "high" : "medium"
        : "medium";

      return {
        id: `job_${job.id}`,
        title: `${job.title || job.position?.name} - ${job.number_of_positions} Position${job.number_of_positions > 1 ? 's' : ''}`,
        content: job.background || job.role_description || "View full job details and requirements. Click to apply.",
        priority,
        category: "Job Vacancies",
        type: "job_vacancy" as const,
        author: {
          name: job.published_by?.first_name ? `${job.published_by.first_name} ${job.published_by.last_name}` : "HR Department",
          department: "Human Resources"
        },
        created_date: job.published_date || job.created_datetime,
        is_pinned: job.job_type === "INTERNAL", // Pin internal job postings
        target_audience: job.job_type === "INTERNAL" ? ["all"] : ["external"],
        job_metadata: {
          position: job.title || job.position?.name || "Position",
          locations: locationNames,
          deadline: job.application_deadline || "",
          number_of_positions: job.number_of_positions,
          job_type: job.job_type,
          advertisement_id: job.id,
        }
      };
    });
  }, [jobAdvertisements]);

  // Combine all announcements
  const allAnnouncements = useMemo(() => {
    return [...formattedGeneralAnnouncements, ...jobAnnouncements];
  }, [formattedGeneralAnnouncements, jobAnnouncements]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredAnnouncements = allAnnouncements.filter((announcement) => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || announcement.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pinnedAnnouncements = filteredAnnouncements.filter((a) => a.is_pinned);
  const regularAnnouncements = filteredAnnouncements.filter((a) => !a.is_pinned);

  const categories = ["all", ...Array.from(new Set(allAnnouncements.map((a) => a.category)))];

  const isLoading = isLoadingJobs || isLoadingAnnouncements;

  const handleJobClick = (announcement: Announcement) => {
    if (announcement.type === "job_vacancy" && announcement.job_metadata) {
      // Navigate to job advertisement details page
      router.push(`/dashboard/hr/jobs/advertisements/${announcement.job_metadata.advertisement_id}`);
    }
  };

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
          {[1, 2, 3].map((i) => (
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
          <p className="text-gray-600">Stay updated with the latest news, job vacancies, and updates</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search announcements and job vacancies..."
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
              {categories.map((category) => (
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
          {pinnedAnnouncements.map((announcement) => (
            <Card
              key={announcement.id}
              className={`border-l-4 border-l-blue-500 ${announcement.type === 'job_vacancy' ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
              onClick={() => announcement.type === 'job_vacancy' && handleJobClick(announcement)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Pin className="w-4 h-4 text-blue-600" />
                      {announcement.type === 'job_vacancy' && <Briefcase className="w-4 h-4 text-green-600" />}
                      {announcement.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {announcement.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{announcement.category}</Badge>
                      {announcement.job_metadata && (
                        <>
                          <Badge variant="secondary" className="gap-1">
                            <MapPin className="w-3 h-3" />
                            {announcement.job_metadata.locations}
                          </Badge>
                          {announcement.job_metadata.deadline && (
                            <Badge variant="destructive" className="gap-1">
                              <Clock className="w-3 h-3" />
                              Deadline: {format(new Date(announcement.job_metadata.deadline), "MMM dd, yyyy")}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(announcement.created_date), "MMM dd, yyyy")}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 line-clamp-3">{announcement.content}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <p>Posted by: <strong>{announcement.author.name}</strong> ({announcement.author.department})</p>
                  </div>
                  {announcement.type === 'job_vacancy' && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJobClick(announcement);
                      }}
                    >
                      View Details & Apply
                    </Button>
                  )}
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
          regularAnnouncements.map((announcement) => (
            <Card
              key={announcement.id}
              className={`hover:shadow-md transition-shadow ${announcement.type === 'job_vacancy' ? 'cursor-pointer' : ''}`}
              onClick={() => announcement.type === 'job_vacancy' && handleJobClick(announcement)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {announcement.type === 'job_vacancy' && <Briefcase className="w-4 h-4 text-green-600" />}
                      {announcement.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {announcement.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{announcement.category}</Badge>
                      {announcement.job_metadata && (
                        <>
                          <Badge variant="secondary" className="gap-1">
                            <MapPin className="w-3 h-3" />
                            {announcement.job_metadata.locations}
                          </Badge>
                          {announcement.job_metadata.deadline && (
                            <Badge variant="destructive" className="gap-1">
                              <Clock className="w-3 h-3" />
                              Deadline: {format(new Date(announcement.job_metadata.deadline), "MMM dd, yyyy")}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(announcement.created_date), "MMM dd, yyyy")}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 line-clamp-3">{announcement.content}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <p>Posted by: <strong>{announcement.author.name}</strong> ({announcement.author.department})</p>
                  </div>
                  {announcement.type === 'job_vacancy' && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJobClick(announcement);
                      }}
                    >
                      View Details & Apply
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
