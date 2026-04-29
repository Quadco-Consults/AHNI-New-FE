"use client";

import { useState } from "react";
import { Plus, Mail, MailOpen, Archive, Send, Paperclip, X, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useGetMessageThreads, useGetMessageThread, useCreateVendorMessage, useReplyToMessage, useMarkMessageAsRead, useGetUnreadMessageCount } from "@/features/procurement/controllers/vendorMessageController";
import { useGetVendors } from "@/features/procurement/controllers/vendorController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { toast } from "sonner";

export default function VendorMessaging() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read">("all");
  const [replyText, setReplyText] = useState("");

  // Fetch data
  const { threads, isLoading: threadsLoading } = useGetMessageThreads();
  const { thread, isLoading: threadLoading } = useGetMessageThread(selectedThreadId || "");
  const { unreadCount } = useGetUnreadMessageCount();
  const { vendors } = useGetVendors({ page: 1, size: 100 });
  const { data: users } = useGetAllUsers({ page: 1, size: 100 });

  // Mutations
  const { replyToMessage, isLoading: replyLoading } = useReplyToMessage(selectedThreadId || "");
  const { markAsRead } = useMarkMessageAsRead(selectedThreadId || "");

  // Filter threads
  const filteredThreads = threads?.filter((t) => {
    if (statusFilter === "unread") return t.status === "UNREAD";
    if (statusFilter === "read") return t.status === "READ";
    return true;
  });

  // Handle thread selection
  const handleSelectThread = async (threadId: string) => {
    setSelectedThreadId(threadId);
    const selectedThread = threads?.find(t => t.thread_id === threadId);
    if (selectedThread && selectedThread.status === "UNREAD") {
      await markAsRead();
    }
  };

  // Handle reply
  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      await replyToMessage({ message: replyText });
      toast.success("Reply sent successfully");
      setReplyText("");
    } catch (error) {
      toast.error("Failed to send reply");
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT": return "bg-red-500 text-white";
      case "HIGH": return "bg-orange-500 text-white";
      case "NORMAL": return "bg-blue-500 text-white";
      case "LOW": return "bg-gray-500 text-white";
      default: return "bg-blue-500 text-white";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-sm text-gray-600 mt-1">
              Communicate with vendors and procurement team
            </p>
          </div>
          <div className="flex items-center gap-4">
            {unreadCount > 0 && (
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {unreadCount} Unread
                </span>
              </div>
            )}
            <ComposeMessageDialog
              open={composeOpen}
              onOpenChange={setComposeOpen}
              vendors={vendors?.results || []}
              users={users?.results || []}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Thread List */}
        <div className="w-96 border-r border-gray-200 bg-gray-50 overflow-y-auto">
          {/* Filter Tabs */}
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
                className="flex-1"
              >
                All
              </Button>
              <Button
                variant={statusFilter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("unread")}
                className="flex-1"
              >
                <MailOpen className="h-4 w-4 mr-2" />
                Unread
              </Button>
              <Button
                variant={statusFilter === "read" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("read")}
                className="flex-1"
              >
                <Mail className="h-4 w-4 mr-2" />
                Read
              </Button>
            </div>
          </div>

          {/* Thread List */}
          <div className="p-4 space-y-2">
            {threadsLoading ? (
              <div className="text-center py-8 text-gray-500">Loading messages...</div>
            ) : !filteredThreads || filteredThreads.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No messages yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setComposeOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Start a conversation
                </Button>
              </div>
            ) : (
              filteredThreads.map((thread) => (
                <Card
                  key={thread.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedThreadId === thread.thread_id && "border-blue-500 bg-blue-50",
                    thread.status === "UNREAD" && "border-l-4 border-l-blue-500 bg-blue-50"
                  )}
                  onClick={() => handleSelectThread(thread.thread_id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className={cn(
                          "font-medium truncate",
                          thread.status === "UNREAD" && "font-bold"
                        )}>
                          {thread.subject}
                        </h3>
                        <p className="text-xs text-gray-600 truncate">
                          {thread.is_from_vendor ? (
                            <>From: {thread.vendor_details?.company_name}</>
                          ) : (
                            <>To: {thread.vendor_details?.company_name}</>
                          )}
                        </p>
                      </div>
                      <Badge className={cn("text-[10px]", getPriorityColor(thread.priority))}>
                        {thread.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                      {thread.message}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(thread.created_datetime).toLocaleDateString()}</span>
                      {thread.reply_count && thread.reply_count > 0 && (
                        <span className="flex items-center gap-1">
                          <Send className="h-3 w-3" />
                          {thread.reply_count} {thread.reply_count === 1 ? "reply" : "replies"}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Main Panel - Thread View */}
        <div className="flex-1 flex flex-col bg-white">
          {!selectedThreadId ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Select a conversation
                </h2>
                <p className="text-gray-500">
                  Choose a message from the left to view the conversation
                </p>
              </div>
            </div>
          ) : threadLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-gray-500">Loading conversation...</div>
            </div>
          ) : !thread ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-gray-500">Thread not found</div>
            </div>
          ) : (
            <>
              {/* Thread Header */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{thread.subject}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Conversation with {thread.vendor_details?.company_name}
                    </p>
                  </div>
                  <Badge className={getPriorityColor(thread.priority)}>
                    {thread.priority}
                  </Badge>
                </div>
                {(thread.related_solicitation || thread.related_purchase_order) && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>
                      Related to:{" "}
                      {thread.related_solicitation ? "RFQ" : "Purchase Order"}
                    </span>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* First Message */}
                <MessageBubble
                  message={thread}
                  isFromCurrentUser={!thread.is_from_vendor}
                />

                {/* Replies */}
                {thread.replies && thread.replies.length > 0 && (
                  thread.replies.map((reply) => (
                    <MessageBubble
                      key={reply.id}
                      message={reply}
                      isFromCurrentUser={!reply.is_from_vendor}
                    />
                  ))
                )}
              </div>

              {/* Reply Box */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="space-y-3">
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach File
                    </Button>
                    <Button
                      onClick={handleReply}
                      disabled={replyLoading || !replyText.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Message Bubble Component
function MessageBubble({ message, isFromCurrentUser }: { message: any; isFromCurrentUser: boolean }) {
  return (
    <div className={cn("flex", isFromCurrentUser ? "justify-end" : "justify-start")}>
      <div className={cn(
        "max-w-2xl rounded-lg p-4",
        isFromCurrentUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
      )}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">
            {isFromCurrentUser ? "You" : message.sender_details?.first_name + " " + message.sender_details?.last_name}
          </span>
          <span className={cn(
            "text-xs",
            isFromCurrentUser ? "text-blue-100" : "text-gray-500"
          )}>
            {new Date(message.created_datetime).toLocaleString()}
          </span>
        </div>
        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.attachments.map((attachment: any) => (
              <div key={attachment.id} className={cn(
                "flex items-center gap-2 text-xs p-2 rounded",
                isFromCurrentUser ? "bg-blue-700" : "bg-gray-200"
              )}>
                <Paperclip className="h-3 w-3" />
                <span>{attachment.file_name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Compose Message Dialog Component
function ComposeMessageDialog({ open, onOpenChange, vendors, users }: any) {
  const [formData, setFormData] = useState({
    vendor: "",
    recipient: "",
    subject: "",
    message: "",
    priority: "NORMAL" as "LOW" | "NORMAL" | "HIGH" | "URGENT",
  });

  const { createMessage, isLoading } = useCreateVendorMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.vendor || !formData.recipient || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createMessage(formData);
      toast.success("Message sent successfully");
      onOpenChange(false);
      setFormData({
        vendor: "",
        recipient: "",
        subject: "",
        message: "",
        priority: "NORMAL",
      });
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Compose New Message</DialogTitle>
          <DialogDescription>
            Send a message to a vendor or procurement team member
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor *</Label>
              <Select
                value={formData.vendor}
                onValueChange={(value) => setFormData({ ...formData, vendor: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor: any) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient *</Label>
              <Select
                value={formData.recipient}
                onValueChange={(value) => setFormData({ ...formData, recipient: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user: any) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Enter subject"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter your message"
              rows={6}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
