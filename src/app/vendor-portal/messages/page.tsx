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
  MessageCircle,
  Send,
  Search,
  Filter,
  Mail,
  MailOpen,
  Clock,
  AlertCircle,
  FileText,
  User,
  Plus,
  Reply,
  Paperclip,
  Star,
  Archive,
  Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/Loading";

interface Message {
  id: string;
  subject: string;
  sender: {
    name: string;
    email: string;
    role: string;
  };
  recipients: string[];
  content: string;
  sent_date: string;
  read_date?: string;
  status: 'unread' | 'read' | 'archived' | 'starred';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  type: 'inquiry' | 'rfq_clarification' | 'system' | 'procurement_update' | 'contract';
  rfq_reference?: string;
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
  }>;
  thread_count: number;
  is_reply: boolean;
}

export default function VendorMessagesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  // Mock messages data - this would come from API
  const [messages] = useState<Message[]>([
    {
      id: "1",
      subject: "RFQ Clarification - Medical Equipment Tender",
      sender: {
        name: "Sarah Johnson",
        email: "procurement@ahnigeria.org",
        role: "Procurement Officer"
      },
      recipients: ["vendor@testcompany.com"],
      content: `Dear Vendor,

Thank you for your interest in RFQ-2024-001 for medical equipment procurement.

We need clarification on the following items in your submission:

1. Warranty period for the diagnostic equipment
2. Installation timeline and requirements
3. Training provision for our staff

Please provide these details by December 10th, 2024.

Best regards,
Sarah Johnson
Procurement Officer
AHNI`,
      sent_date: "2024-12-05T10:30:00Z",
      read_date: "2024-12-05T14:45:00Z",
      status: "read",
      priority: "high",
      type: "rfq_clarification",
      rfq_reference: "RFQ-2024-001",
      thread_count: 3,
      is_reply: false
    },
    {
      id: "2",
      subject: "Contract Award Notification - Office Supplies",
      sender: {
        name: "Michael Chen",
        email: "contracts@ahnigeria.org",
        role: "Contract Manager"
      },
      recipients: ["vendor@testcompany.com"],
      content: `Congratulations! Your bid for RFQ-2024-002 has been successful.

Contract Details:
- Contract Value: $45,000
- Duration: 12 months
- Start Date: January 1, 2025

Please review the attached contract documents and return signed copies within 5 business days.

Best regards,
Michael Chen`,
      sent_date: "2024-12-04T16:20:00Z",
      status: "unread",
      priority: "urgent",
      type: "contract",
      rfq_reference: "RFQ-2024-002",
      attachments: [
        {
          id: "1",
          name: "Contract_Agreement_RFQ-2024-002.pdf",
          size: 1024000,
          type: "application/pdf"
        }
      ],
      thread_count: 1,
      is_reply: false
    },
    {
      id: "3",
      subject: "System Maintenance Notification",
      sender: {
        name: "AHNI System",
        email: "noreply@ahnigeria.org",
        role: "System"
      },
      recipients: ["all_vendors"],
      content: `The vendor portal will undergo scheduled maintenance on December 8th, 2024 from 2:00 AM to 6:00 AM WAT.

During this time, the portal will be temporarily unavailable. We apologize for any inconvenience.

AHNI IT Team`,
      sent_date: "2024-12-03T08:00:00Z",
      read_date: "2024-12-03T09:15:00Z",
      status: "read",
      priority: "normal",
      type: "system",
      thread_count: 1,
      is_reply: false
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'unread':
        return 'default';
      case 'read':
        return 'secondary';
      case 'starred':
        return 'destructive';
      case 'archived':
        return 'outline';
      default:
        return 'secondary';
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rfq_clarification':
        return <FileText className="h-4 w-4" />;
      case 'contract':
        return <FileText className="h-4 w-4" />;
      case 'system':
        return <AlertCircle className="h-4 w-4" />;
      case 'procurement_update':
        return <Mail className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    const matchesType = typeFilter === "all" || message.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const unreadCount = messages.filter(m => m.status === 'unread').length;
  const starredCount = messages.filter(m => m.status === 'starred').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="h-8 w-8" />
            Messages
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </h1>
          <p className="text-gray-600 mt-1">
            Communicate with AHNI procurement team and manage your correspondence
          </p>
        </div>
        <Button onClick={() => setShowCompose(true)}>
          <Plus className="h-4 w-4 mr-1" />
          New Message
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search messages by subject, sender, or content..."
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
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="starred">Starred</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Message Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="rfq_clarification">RFQ Clarifications</SelectItem>
                  <SelectItem value="contract">Contracts</SelectItem>
                  <SelectItem value="procurement_update">Procurement Updates</SelectItem>
                  <SelectItem value="system">System Messages</SelectItem>
                  <SelectItem value="inquiry">General Inquiries</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Inbox</h2>
            <div className="flex gap-1">
              <Badge variant="outline" className="text-xs">
                {filteredMessages.length} total
              </Badge>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
          </div>

          {filteredMessages.length > 0 ? (
            <div className="space-y-2">
              {filteredMessages.map((message) => (
                <Card
                  key={message.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedMessage?.id === message.id ? 'ring-2 ring-blue-500' : ''
                  } ${
                    message.status === 'unread' ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(message.type)}
                        {message.status === 'unread' ? (
                          <Mail className="h-4 w-4 text-blue-600" />
                        ) : (
                          <MailOpen className="h-4 w-4 text-gray-400" />
                        )}
                        {message.status === 'starred' && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <Badge variant={getPriorityBadgeVariant(message.priority)} className="text-xs">
                        {message.priority}
                      </Badge>
                    </div>

                    <h3 className={`font-semibold text-sm mb-1 line-clamp-2 ${
                      message.status === 'unread' ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {message.subject}
                    </h3>

                    <p className="text-xs text-gray-600 mb-2">
                      From: {message.sender.name}
                    </p>

                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {message.content}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(message.sent_date)}
                      </span>
                      {message.thread_count > 1 && (
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {message.thread_count}
                        </span>
                      )}
                      {message.attachments && message.attachments.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Paperclip className="h-3 w-3" />
                          {message.attachments.length}
                        </span>
                      )}
                    </div>

                    {message.rfq_reference && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          {message.rfq_reference}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Messages Found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "You don't have any messages yet"}
                </p>
                {(searchTerm || statusFilter !== "all" || typeFilter !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setTypeFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {getTypeIcon(selectedMessage.type)}
                      {selectedMessage.subject}
                      {selectedMessage.status === 'unread' && (
                        <Badge variant="destructive" className="text-xs">New</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {selectedMessage.sender.name} ({selectedMessage.sender.role})
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(selectedMessage.sent_date)}
                      </span>
                      <Badge variant={getPriorityBadgeVariant(selectedMessage.priority)} className="text-xs">
                        {selectedMessage.priority} priority
                      </Badge>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {selectedMessage.rfq_reference && (
                  <Alert className="mb-4">
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      This message relates to <strong>{selectedMessage.rfq_reference}</strong>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="prose max-w-none mb-6">
                  <div className="whitespace-pre-wrap text-gray-900">
                    {selectedMessage.content}
                  </div>
                </div>

                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Attachments ({selectedMessage.attachments.length})</h4>
                    <div className="space-y-2">
                      {selectedMessage.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-3 p-2 border rounded-lg">
                          <Paperclip className="h-4 w-4 text-gray-500" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{attachment.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reply">Reply</Label>
                      <Textarea
                        id="reply"
                        placeholder="Type your reply here..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button>
                        <Send className="h-4 w-4 mr-1" />
                        Send Reply
                      </Button>
                      <Button variant="outline">
                        <Paperclip className="h-4 w-4 mr-1" />
                        Attach File
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-24 text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Message</h3>
                <p className="text-gray-500">
                  Choose a message from the list to view its contents and reply
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Message Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Message Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{messages.length}</p>
              <p className="text-sm text-blue-800">Total Messages</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
              <p className="text-sm text-orange-800">Unread</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {messages.filter(m => m.type === 'rfq_clarification').length}
              </p>
              <p className="text-sm text-green-800">RFQ Related</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {messages.filter(m => m.priority === 'urgent' || m.priority === 'high').length}
              </p>
              <p className="text-sm text-purple-800">High Priority</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}