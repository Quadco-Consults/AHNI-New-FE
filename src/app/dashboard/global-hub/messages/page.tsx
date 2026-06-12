'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Users, Search, Plus, Send, Paperclip, MoreVertical, Loader2, X, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useMessaging } from '@/hooks/useMessaging';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { useGetAllUsers, useGetCurrentUser } from '@/features/auth/controllers/userController';

export default function MessagesPage() {
  const { data: currentUserData } = useGetCurrentUser();
  const user = currentUserData?.data;

  const {
    conversations,
    messages,
    currentConversation,
    isLoading,
    isSending,
    loadConversation,
    sendMessage,
    sendMessageWithFiles,
    deleteMessage,
    deleteConversation,
    fetchConversations,
    createConversation,
  } = useMessaging();

  const { data: usersData, isLoading: isLoadingUsers } = useGetAllUsers({ page: 1, size: 100 });
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewConversationModalOpen, setIsNewConversationModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [conversationType, setConversationType] = useState<'direct' | 'group'>('direct');
  const [groupName, setGroupName] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      const MAX_FILES = 5;

      // Check if adding these files would exceed the limit
      if (selectedFiles.length + newFiles.length > MAX_FILES) {
        alert(`You can only attach up to ${MAX_FILES} files at a time`);
        return;
      }

      // Validate file sizes
      const oversizedFiles = newFiles.filter(file => file.size > MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        alert(`Some files are too large. Maximum file size is 10MB.\nOversized files: ${oversizedFiles.map(f => f.name).join(', ')}`);
        return;
      }

      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if ((!messageInput.trim() && selectedFiles.length === 0) || !currentConversation) {
      return;
    }

    try {
      // Send message with files
      await sendMessageWithFiles(currentConversation.id, messageInput.trim(), selectedFiles);

      // Clear inputs
      setMessageInput('');
      setSelectedFiles([]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleDeleteClick = (messageId: string) => {
    setMessageToDelete(messageId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConversationClick = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation(); // Prevent selecting the conversation
    setConversationToDelete(conversationId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // Check if deleting a message or conversation
      if (conversationToDelete) {
        await deleteConversation(conversationToDelete);
        setConversationToDelete(null);
      } else if (messageToDelete && currentConversation) {
        await deleteMessage(currentConversation.id, messageToDelete);
        setMessageToDelete(null);
      }
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setMessageToDelete(null);
    setConversationToDelete(null);
  };

  const handleSelectConversation = (conversationId: string) => {
    loadConversation(conversationId);
  };

  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) return;

    try {
      const conversation = await createConversation(
        conversationType,
        selectedUsers,
        conversationType === 'group' ? groupName : undefined
      );

      // Close modal and reset form
      setIsNewConversationModalOpen(false);
      setSelectedUsers([]);
      setGroupName('');
      setConversationType('direct');

      // Load the new conversation
      if (conversation) {
        loadConversation(conversation.id);
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        // For direct messages, only allow one user
        if (conversationType === 'direct') {
          return [userId];
        }
        return [...prev, userId];
      }
    });
  };

  const getConversationName = (conversation: any) => {
    if (conversation.type === 'group') {
      return conversation.name;
    }
    // For direct messages, get the other participant's name
    const otherParticipant = conversation.participants?.find(
      (p: any) => p.user.id !== user?.id
    );
    return otherParticipant?.user.full_name || 'Unknown';
  };

  const getConversationAvatar = (conversation: any) => {
    const name = getConversationName(conversation);
    const initials = name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    return initials;
  };

  const formatMessageTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return '';
    }
  };

  const filteredConversations = Array.isArray(conversations)
    ? conversations.filter((conv) =>
        getConversationName(conv).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];


  // Filter users for the modal
  const availableUsers = usersData?.data?.results?.filter((u: any) => u.id !== user?.id) || [];
  const filteredUsers = availableUsers.filter((u: any) => {
    const fullName = u.full_name || `${u.first_name || ''} ${u.last_name || ''}`.trim();
    return (
      fullName?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex h-[calc(100vh-120px)] bg-gray-50">
      {/* Sidebar - Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => fetchConversations()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsNewConversationModalOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {isLoading && !currentConversation ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`relative group w-full p-3 rounded-lg mb-1 transition-colors ${
                    currentConversation?.id === conversation.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <button
                    onClick={() => handleSelectConversation(conversation.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-600 text-white text-sm">
                          {getConversationAvatar(conversation)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900 truncate">
                            {getConversationName(conversation)}
                          </span>
                          {conversation.last_message && (
                            <span className="text-xs text-gray-500">
                              {formatMessageTime(conversation.last_message.created_datetime)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.last_message?.content || 'No messages yet'}
                          </p>
                          {conversation.unread_count > 0 && (
                            <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                              {conversation.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Delete button - appears on hover */}
                  <button
                    onClick={(e) => handleDeleteConversationClick(e, conversation.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 z-10"
                    title="Delete conversation"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {getConversationAvatar(currentConversation)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {getConversationName(currentConversation)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {currentConversation.participants.length} participant{currentConversation.participants.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {currentConversation.type === 'group' && (
                    <Button variant="ghost" size="icon">
                      <Users className="h-5 w-5 text-gray-600" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 bg-gray-50">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isOwn = message.sender.id === user?.id;
                    const senderInitials = message.sender.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <div
                        key={message.id}
                        className={`flex items-end gap-2 group ${
                          isOwn ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        {!isOwn && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gray-400 text-white text-xs">
                              {senderInitials}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-md ${
                            isOwn ? 'items-end' : 'items-start'
                          } flex flex-col gap-1 relative`}
                        >
                          {/* Delete button - only for own messages */}
                          {isOwn && (
                            <button
                              onClick={() => handleDeleteClick(message.id)}
                              className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                              title="Delete message"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                          {!isOwn && (
                            <span className="text-xs text-gray-600 px-3">
                              {message.sender.full_name}
                            </span>
                          )}
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              isOwn
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-900 border border-gray-200'
                            }`}
                          >
                            {message.content && (
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            )}

                            {/* Display attachments */}
                            {message.attachments && message.attachments.length > 0 && (
                              <div className={`mt-2 space-y-2 ${message.content ? 'pt-2 border-t' : ''} ${isOwn ? 'border-blue-500' : 'border-gray-200'}`}>
                                {message.attachments.map((attachment) => (
                                  <a
                                    key={attachment.id}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 p-2 rounded ${
                                      isOwn
                                        ? 'bg-blue-500 hover:bg-blue-400'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                                  >
                                    <Paperclip className="h-4 w-4" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium truncate">
                                        {attachment.file_name}
                                      </p>
                                      <p className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                                        {(attachment.file_size / 1024).toFixed(1)} KB
                                      </p>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 px-3">
                            <span className="text-xs text-gray-500">
                              {formatMessageTime(message.created_datetime)}
                            </span>
                            {isOwn && message.read_by_count > 0 && (
                              <span className="text-xs text-gray-500">
                                Read by {message.read_by_count}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              {/* File Previews */}
              {selectedFiles.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 text-sm"
                    >
                      <Paperclip className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700 truncate max-w-[200px]">
                        {file.name}
                      </span>
                      <span className="text-gray-500 text-xs">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                  title="Attach files (max 5 files, 10MB each)"
                />
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={isSending || selectedFiles.length >= 5}
                    title={selectedFiles.length >= 5 ? 'Maximum 5 files allowed' : 'Attach files'}
                  >
                    <Paperclip className="h-5 w-5 text-gray-600" />
                  </Button>
                  {selectedFiles.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {selectedFiles.length}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={isSending}
                    className="min-h-[44px]"
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={(!messageInput.trim() && selectedFiles.length === 0) || isSending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500 mb-4">
                Choose a conversation from the sidebar to start messaging
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsNewConversationModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Start New Conversation
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      <Dialog open={isNewConversationModalOpen} onOpenChange={setIsNewConversationModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Start New Conversation</DialogTitle>
            <DialogDescription>
              Select users to start a conversation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Conversation Type Toggle */}
            <div className="flex gap-2">
              <Button
                variant={conversationType === 'direct' ? 'default' : 'outline'}
                onClick={() => {
                  setConversationType('direct');
                  setSelectedUsers([]);
                }}
                className="flex-1"
              >
                Direct Message
              </Button>
              <Button
                variant={conversationType === 'group' ? 'default' : 'outline'}
                onClick={() => setConversationType('group')}
                className="flex-1"
              >
                Group Chat
              </Button>
            </div>

            {/* Group Name (only for group chats) */}
            {conversationType === 'group' && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Group Name
                </label>
                <Input
                  placeholder="Enter group name..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
            )}

            {/* User Search */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {conversationType === 'direct' ? 'Select User' : 'Select Users'}
              </label>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  className="pl-9"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* User List */}
            <ScrollArea className="h-64 border rounded-md">
              <div className="p-2">
                {isLoadingUsers ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No users found</p>
                  </div>
                ) : (
                  filteredUsers.map((u: any) => {
                    const isSelected = selectedUsers.includes(u.id);
                    const fullName = u.full_name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email;
                    const initials = fullName
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <button
                        key={u.id}
                        onClick={() => toggleUserSelection(u.id)}
                        className={`w-full p-3 rounded-lg mb-1 text-left transition-colors ${
                          isSelected
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-600 text-white text-sm">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {fullName}
                            </p>
                            <p className="text-sm text-gray-500 truncate">{u.email}</p>
                          </div>
                          {isSelected && (
                            <div className="h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center">
                              <svg
                                className="h-3 w-3 text-white"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </ScrollArea>

            {/* Selected Count */}
            {selectedUsers.length > 0 && (
              <div className="text-sm text-gray-600">
                {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsNewConversationModalOpen(false);
                  setSelectedUsers([]);
                  setGroupName('');
                  setUserSearchQuery('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateConversation}
                disabled={
                  selectedUsers.length === 0 ||
                  (conversationType === 'group' && !groupName.trim()) ||
                  isLoading
                }
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Start Conversation'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {conversationToDelete ? 'Delete Conversation?' : 'Delete Message?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {conversationToDelete
                ? 'Are you sure you want to delete this conversation? This action cannot be undone and all messages in this conversation will be permanently removed.'
                : 'Are you sure you want to delete this message? This action cannot be undone and the message will be permanently removed from the conversation.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
