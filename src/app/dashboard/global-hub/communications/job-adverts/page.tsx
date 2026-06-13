"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Eye,
  UserCheck,
  Users,
  Calendar,
  Briefcase,
  Mail,
  Download,
  Filter
} from "lucide-react";
import { LoadingSpinner } from "@/components/Loading";
import { format, isValid } from "date-fns";

// Placeholder interface - replace with actual API response
interface JobApplication {
  id: string;
  job_advertisement: {
    id: string;
    title: string;
    position: { name: string };
  };
  applicant_first_name: string;
  applicant_last_name: string;
  applicant_email: string;
  position_applied: string;
  employment_type: string;
  status: string;
  created_datetime: string;
  resume?: string;
  cover_letter?: string;
}

export default function JobAdvertsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Replace with actual API call
  // const { data, isLoading, error } = useGetJobApplications({ search, status });
  const applications: JobApplication[] = [];

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy") : "Invalid date";
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'APPLIED': 'secondary',
      'SHORTLISTED': 'default',
      'INTERVIEWED': 'secondary',
      'PREFERRED': 'default',
      'ACCEPTED': 'default',
      'REJECTED': 'destructive',
    };
    return variants[status] || 'secondary';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Job Applications</h1>
          <p className="text-muted-foreground mt-2">
            Review and manage applications from the public opportunities portal
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/hr/jobs/advertisements')}>
          <Briefcase className="h-4 w-4 mr-2" />
          Manage Job Ads
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New (Applied)</p>
                <p className="text-2xl font-bold text-blue-600">
                  {applications.filter((a: any) => a.status === 'APPLIED').length}
                </p>
              </div>
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Shortlisted</p>
                <p className="text-2xl font-bold text-green-600">
                  {applications.filter((a: any) => a.status === 'SHORTLISTED').length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold text-purple-600">
                  {applications.filter((a: any) => a.status === 'ACCEPTED').length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by applicant name, email, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="APPLIED">Applied</SelectItem>
                <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                <SelectItem value="INTERVIEWED">Interviewed</SelectItem>
                <SelectItem value="PREFERRED">Preferred</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
            <span className="ml-2">Loading applications...</span>
          </div>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
              <p className="text-muted-foreground mb-4">
                There are no job applications matching your filters.
              </p>
              <p className="text-sm text-muted-foreground">
                Note: This page shows applications from the public opportunities portal.
                To connect to the backend API, implement the useGetJobApplications hook.
              </p>
            </CardContent>
          </Card>
        ) : (
          applications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getStatusBadge(application.status) as any}>
                        {application.status}
                      </Badge>
                      <Badge variant="outline">
                        {application.employment_type}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold mb-1">
                      {application.applicant_first_name} {application.applicant_last_name}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-2">
                      Applied for: <span className="font-medium">{application.position_applied}</span>
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{application.applicant_email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Applied: {formatDate(application.created_datetime)}</span>
                      </div>
                      {application.resume && (
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          <span>Resume attached</span>
                        </div>
                      )}
                      {application.cover_letter && (
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          <span>Cover letter attached</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => router.push(`/dashboard/hr/jobs/applications/${application.id}`)}
                      className="w-full md:w-auto"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {application.status === 'APPLIED' && (
                      <Button
                        variant="outline"
                        onClick={() => {/* TODO: Shortlist action */}}
                        className="w-full md:w-auto"
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Shortlist
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Implementation Note */}
      <Card className="border-dashed border-2">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Implementation Notes</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Backend API endpoint exists: GET /hr/jobs/applications/</li>
            <li>Create useGetJobApplications hook in HR controllers</li>
            <li>Implement shortlist action: POST /hr/jobs/applications/:id/shortlist/</li>
            <li>Implement accept action: POST /hr/jobs/applications/:id/accept/</li>
            <li>Add application detail view page</li>
            <li>Add file download functionality for resumes and cover letters</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
