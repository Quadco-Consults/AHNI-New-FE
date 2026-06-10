"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plane, Plus, Search, Eye, CalendarIcon, MapPinIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  useGetConsultantTravelRequests,
  useGetMyVisits,
} from "@/features/consultant-portal/controllers/consultantTravelRequestController";
import {
  SiteVisitStatus,
  SiteVisitStatusLabels,
  SiteVisitTypeLabels,
} from "@/features/programs/types/site-visit";
import { ConsultantAuthUtils } from "@/features/consultant-portal/controllers/consultantAuthController";

export default function ConsultantTravelRequestsPage() {
  const router = useRouter();
  const consultantData = ConsultantAuthUtils.getConsultantData();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"my-requests" | "assigned">("my-requests");

  const pageSize = 10;

  // Get travel requests created by consultant
  const {
    data: travelRequestsData,
    isLoading: isLoadingRequests,
    error: requestsError,
  } = useGetConsultantTravelRequests(page, pageSize, search, statusFilter === "all" ? "" : statusFilter);

  // Get visits where consultant is assigned as team member
  const {
    data: myVisitsData,
    isLoading: isLoadingVisits,
    error: visitsError,
  } = useGetMyVisits(page, pageSize);

  const travelRequests = travelRequestsData?.data?.results || [];
  const myVisits = myVisitsData?.data?.results || [];
  const totalCount = travelRequestsData?.data?.count || 0;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case SiteVisitStatus.APPROVED:
        return "bg-green-100 text-green-800 border-green-200";
      case SiteVisitStatus.SUBMITTED:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case SiteVisitStatus.DRAFT:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case SiteVisitStatus.REJECTED:
        return "bg-red-100 text-red-800 border-red-200";
      case SiteVisitStatus.IN_PROGRESS:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case SiteVisitStatus.COMPLETED:
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleCreateNew = () => {
    router.push("/consultant-portal/travel-requests/create");
  };

  const handleViewDetails = (id: string) => {
    router.push(`/consultant-portal/travel-requests/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Plane className="h-8 w-8 text-green-600" />
              Travel Requests
            </h1>
            <p className="text-gray-600 mt-1">
              Submit and manage your site visit travel requests
            </p>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Travel Request
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("my-requests")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "my-requests"
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            My Requests ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab("assigned")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "assigned"
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Assigned to Me ({myVisits.length})
          </button>
        </div>

        {/* Filters */}
        {activeTab === "my-requests" && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search travel requests..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {Object.entries(SiteVisitStatusLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Requests Table */}
        {activeTab === "my-requests" && (
          <Card>
            <CardHeader>
              <CardTitle>My Travel Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingRequests ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                  <span className="ml-2 text-gray-600">Loading travel requests...</span>
                </div>
              ) : requestsError ? (
                <div className="text-center py-12 text-red-600">
                  Error loading travel requests. Please try again.
                </div>
              ) : travelRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No travel requests found</p>
                  <Button onClick={handleCreateNew} className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Request
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {travelRequests.map((request: any) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {request.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {SiteVisitTypeLabels[request.visit_type as keyof typeof SiteVisitTypeLabels] || request.visit_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{request.state || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <CalendarIcon className="h-3 w-3 text-gray-400" />
                            {request.start_date && format(new Date(request.start_date), "MMM dd, yyyy")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getStatusBadgeColor(request.status)}
                          >
                            {SiteVisitStatusLabels[request.status as keyof typeof SiteVisitStatusLabels] || request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(request.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Assigned to Me Table */}
        {activeTab === "assigned" && (
          <Card>
            <CardHeader>
              <CardTitle>Visits Assigned to Me</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingVisits ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                  <span className="ml-2 text-gray-600">Loading assigned visits...</span>
                </div>
              ) : visitsError ? (
                <div className="text-center py-12 text-red-600">
                  Error loading assigned visits. Please try again.
                </div>
              ) : myVisits.length === 0 ? (
                <div className="text-center py-12">
                  <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No visits assigned to you yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Visit Title</TableHead>
                      <TableHead>Your Role</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myVisits.map((visit: any) => (
                      <TableRow key={visit.id}>
                        <TableCell className="font-medium">
                          {visit.site_visit?.title || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{visit.role || "Team Member"}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{visit.site_visit?.state || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <CalendarIcon className="h-3 w-3 text-gray-400" />
                            {visit.site_visit?.start_date &&
                              format(new Date(visit.site_visit.start_date), "MMM dd, yyyy")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getStatusBadgeColor(visit.site_visit?.status)}
                          >
                            {SiteVisitStatusLabels[visit.site_visit?.status as keyof typeof SiteVisitStatusLabels] || visit.site_visit?.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(visit.site_visit?.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
