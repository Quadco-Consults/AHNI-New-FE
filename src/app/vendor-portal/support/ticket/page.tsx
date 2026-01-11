"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Ticket,
  Plus,
  Search,
  Filter,
  Clock,
  User,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowRight,
  Paperclip,
  Calendar,
  Priority,
  FileText
} from "lucide-react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/Loading";

interface SupportTicket {
  id: string;
  ticket_number: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'rfq_inquiry' | 'account' | 'portal_issue' | 'general';
  created_date: string;
  updated_date: string;
  assigned_to?: {
    name: string;
    email: string;
    role: string;
  };
  responses_count: number;
  last_response_date?: string;
  last_response_by?: 'vendor' | 'support';
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
  }>;
  resolution_date?: string;
  vendor: {
    company_name: string;
    email: string;
  };
}

export default function VendorSupportTicketsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "",
    priority: "normal",
    attachments: [] as File[]
  });

  // Mock tickets data - this would come from API
  const [tickets] = useState<SupportTicket[]>([
    {
      id: "1",
      ticket_number: "TKT-2024-001",
      subject: "Unable to submit bid for RFQ-2024-001",
      description: "I'm getting an error when trying to submit my bid. The submit button is not working.",
      status: "in_progress",
      priority: "high",
      category: "technical",
      created_date: "2024-12-05T10:00:00Z",
      updated_date: "2024-12-05T14:30:00Z",
      assigned_to: {
        name: "Technical Support Team",
        email: "techsupport@ahnigeria.org",
        role: "Support Agent"
      },
      responses_count: 3,
      last_response_date: "2024-12-05T14:30:00Z",
      last_response_by: "support",
      vendor: {
        company_name: "Test Vendor Inc.",
        email: "vendor@testcompany.com"
      }
    },
    {
      id: "2",
      ticket_number: "TKT-2024-002",
      subject: "Question about prequalification categories",
      description: "I need clarification on which categories my company qualifies for in the prequalification process.",
      status: "waiting_response",
      priority: "normal",
      category: "rfq_inquiry",
      created_date: "2024-12-03T16:20:00Z",
      updated_date: "2024-12-04T09:15:00Z",
      assigned_to: {
        name: "Procurement Support",
        email: "procurement@ahnigeria.org",
        role: "Procurement Officer"
      },
      responses_count: 2,
      last_response_date: "2024-12-04T09:15:00Z",
      last_response_by: "support",
      vendor: {
        company_name: "Test Vendor Inc.",
        email: "vendor@testcompany.com"
      }
    },
    {
      id: "3",
      ticket_number: "TKT-2024-003",
      subject: "Account access issue",
      description: "I cannot access my vendor portal account. Password reset is not working.",
      status: "resolved",
      priority: "urgent",
      category: "account",
      created_date: "2024-12-01T08:30:00Z",
      updated_date: "2024-12-01T10:45:00Z",
      resolution_date: "2024-12-01T10:45:00Z",
      responses_count: 4,
      last_response_date: "2024-12-01T10:45:00Z",
      last_response_by: "support",
      vendor: {
        company_name: "Test Vendor Inc.",
        email: "vendor@testcompany.com"
      }
    }
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'waiting_response':
        return 'destructive';
      case 'resolved':
        return 'outline';
      case 'closed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'waiting_response':
        return <MessageCircle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'closed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Ticket className="h-4 w-4" />;
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      case 'normal':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getCategoryDisplayName = (category: string) => {
    const names = {
      'technical': 'Technical Issue',
      'billing': 'Billing & Payments',
      'rfq_inquiry': 'RFQ Inquiry',
      'account': 'Account Access',
      'portal_issue': 'Portal Issue',
      'general': 'General Support'
    };
    return names[category as keyof typeof names] || category;
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const openTicketsCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
  const waitingResponseCount = tickets.filter(t => t.status === 'waiting_response').length;

  const handleCreateTicket = () => {
    // Handle ticket creation here
    console.log('Creating ticket:', formData);
    setShowCreateTicket(false);
    setFormData({
      subject: "",
      description: "",
      category: "",
      priority: "normal",
      attachments: []
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Ticket className="h-8 w-8" />
            Support Tickets
            {(openTicketsCount + inProgressCount + waitingResponseCount) > 0 && (
              <Badge variant="destructive" className="ml-2">
                {openTicketsCount + inProgressCount + waitingResponseCount} active
              </Badge>
            )}
          </h1>
          <p className="text-gray-600 mt-1">
            Create and manage your support requests and get help from our team
          </p>
        </div>
        <Button onClick={() => setShowCreateTicket(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Create Ticket
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{openTicketsCount}</p>
            <p className="text-sm text-blue-800">Open Tickets</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-600">{inProgressCount}</p>
            <p className="text-sm text-orange-800">In Progress</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <MessageCircle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">{waitingResponseCount}</p>
            <p className="text-sm text-red-800">Awaiting Response</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">
              {tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length}
            </p>
            <p className="text-sm text-green-800">Resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Ticket Form */}
      {showCreateTicket && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Support Ticket</CardTitle>
            <CardDescription>
              Describe your issue and our support team will assist you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing & Payments</SelectItem>
                      <SelectItem value="rfq_inquiry">RFQ Inquiry</SelectItem>
                      <SelectItem value="account">Account Access</SelectItem>
                      <SelectItem value="portal_issue">Portal Issue</SelectItem>
                      <SelectItem value="general">General Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide detailed information about your issue..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={6}
                  />
                </div>
                <div>
                  <Label>Attachments (Optional)</Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <Paperclip className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, PNG, JPG, DOC up to 10MB each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowCreateTicket(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTicket}>
                Create Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tickets by subject, number, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="waiting_response">Awaiting Response</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="billing">Billing & Payments</SelectItem>
                  <SelectItem value="rfq_inquiry">RFQ Inquiry</SelectItem>
                  <SelectItem value="account">Account Access</SelectItem>
                  <SelectItem value="portal_issue">Portal Issue</SelectItem>
                  <SelectItem value="general">General Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <Card
              key={ticket.id}
              className={`hover:shadow-md transition-shadow cursor-pointer ${
                ticket.status === 'waiting_response' ? 'border-l-4 border-l-red-500' :
                ticket.status === 'in_progress' ? 'border-l-4 border-l-orange-500' :
                ticket.status === 'open' ? 'border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => router.push(`/vendor-portal/support/tickets/${ticket.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(ticket.status)}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {ticket.subject}
                      </h3>
                      <Badge variant={getStatusBadgeVariant(ticket.status)} className="capitalize">
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant={getPriorityBadgeVariant(ticket.priority)} className="capitalize">
                        {ticket.priority}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      <strong>#{ticket.ticket_number}</strong> • {getCategoryDisplayName(ticket.category)}
                    </p>

                    <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                      {ticket.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Created: {formatDate(ticket.created_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Updated: {formatDate(ticket.updated_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{ticket.responses_count} responses</span>
                      </div>
                      {ticket.assigned_to && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>Assigned to: {ticket.assigned_to.name}</span>
                        </div>
                      )}
                    </div>

                    {ticket.last_response_date && (
                      <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">
                          Last response: {formatDate(ticket.last_response_date)} by {ticket.last_response_by}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/vendor-portal/support/tickets/${ticket.id}`);
                      }}
                      size="sm"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Ticket className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Tickets Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                  ? "Try adjusting your search criteria or filters"
                  : "You don't have any support tickets yet. Create one if you need help."}
              </p>
              {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setCategoryFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              ) : (
                <Button onClick={() => setShowCreateTicket(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Create First Ticket
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}