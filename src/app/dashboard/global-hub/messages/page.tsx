'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Users, Search, Plus, Send, Paperclip, MoreVertical, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMessaging } from '@/hooks/useMessaging';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

export default function MessagesPage() {
  const { user } = useAuth();
  const {
    conversations,
    messages,
    currentConversation,
    isLoading,
    isSending,
    loadConversation,
    sendMessage,
    fetchConversations,
  } = useMessaging();

  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = async () => {
    if (messageInput.trim() && currentConversation) {
      try {
        await sendMessage(currentConversation.id, messageInput.trim());
        setMessageInput('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    loadConversation(conversationId);
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

  return (
    <div className="flex h-[calc(100vh-120px)] bg-gray-50">
      {/* Sidebar - Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
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
                <button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={`w-full p-3 rounded-lg mb-1 text-left transition-colors ${
                    currentConversation?.id === conversation.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-100'
                  }`}
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
                        className={`flex items-end gap-2 ${
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
                          } flex flex-col gap-1`}
                        >
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
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
              <div className="flex items-end gap-2">
                <Button variant="ghost" size="icon" disabled>
                  <Paperclip className="h-5 w-5 text-gray-400" />
                </Button>
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
                  disabled={!messageInput.trim() || isSending}
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
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Start New Conversation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
