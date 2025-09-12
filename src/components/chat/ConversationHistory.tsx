'use client';

import { useState } from 'react';
import { MessageSquare, Plus, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useChatService } from '@/hooks/useChatService';
import { chatService } from '@/services/chatService';

interface ConversationHistoryProps {
  className?: string;
}

export const ConversationHistory = ({ className }: ConversationHistoryProps) => {
  const {
    conversations,
    currentConversationId,
    loadConversation,
    createNewConversation,
    refreshConversations,
  } = useChatService();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleSelectConversation = (conversationId: string) => {
    if (conversationId !== currentConversationId) {
      loadConversation(conversationId);
    }
  };

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      try {
        setIsDeleting(conversationId);
        await chatService.deleteConversation(conversationId);
        await refreshConversations();
        
        // If we deleted the current conversation, create a new one
        if (conversationId === currentConversationId) {
          await createNewConversation();
        }
      } catch (error) {
        console.error('Failed to delete conversation:', error);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString("en-US");
  };

  const getConversationPreview = (messages: any[]) => {
    const lastUserMessage = [...messages]
      .reverse()
      .find(msg => msg.sender === 'user');
    
    return lastUserMessage?.content || 'New conversation';
  };

  return (
    <Card className={cn("w-80 h-[600px] flex flex-col", className)}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Conversations</h3>
          <Button
            size="sm"
            onClick={createNewConversation}
            className="h-8 w-8 p-0"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {conversations.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageSquare className="mx-auto mb-2" size={32} />
              <p>No conversations yet</p>
              <p className="text-sm">Start chatting to create your first conversation</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors",
                  currentConversationId === conversation.id && "bg-muted border-primary"
                )}
                onClick={() => handleSelectConversation(conversation.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <MessageSquare size={14} className="text-muted-foreground" />
                      {currentConversationId === conversation.id && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium truncate">
                      {getConversationPreview(conversation.messages)}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(conversation.updated_at)}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {conversation.messages.length} messages
                      </Badge>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => handleDeleteConversation(conversation.id, e)}
                        disabled={isDeleting === conversation.id}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};