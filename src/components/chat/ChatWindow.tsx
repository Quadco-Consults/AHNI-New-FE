'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, AlertCircle, Clock, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useChatService } from '@/hooks/useChatService';
import { ChatErrorBoundary } from './ErrorBoundary';
import { EnhancedMessageBubble } from './EnhancedMessageBubble';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatWindow = ({ isOpen, onClose }: ChatWindowProps) => {
  const [message, setMessage] = useState('');
  const [transferStatus, setTransferStatus] = useState<'bot' | 'transferred' | 'admin_responding' | 'resolved' | 'closed' | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isLoading,
    isTyping,
    error,
    sendMessage,
    clearError,
    isAuthenticated
  } = useChatService();

  // Display error messages to user
  useEffect(() => {
    if (error) {
      console.error('Chat error:', error);
      // Auto-clear error after 5 seconds
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');

    try {
      const response = await sendMessage(userMessage);
      // Check if the message triggered a transfer
      if (response && (response as any).transferred) {
        setTransferStatus((response as any).transfer_status || 'transferred');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Render transfer status banner
  const renderTransferBanner = () => {
    if (!transferStatus || transferStatus === 'bot') return null;

    const bannerConfig = {
      transferred: {
        icon: Clock,
        title: 'Transferred to Admin Team',
        description: 'Your chat has been transferred. An admin will respond shortly.',
        color: 'bg-amber-50 border-amber-200 text-amber-900',
        iconColor: 'text-amber-600'
      },
      admin_responding: {
        icon: Shield,
        title: 'Admin is Responding',
        description: 'An AHNI administrator is now helping you.',
        color: 'bg-blue-50 border-blue-200 text-blue-900',
        iconColor: 'text-blue-600'
      },
      resolved: {
        icon: CheckCircle2,
        title: 'Issue Resolved',
        description: 'Your issue has been marked as resolved by the admin.',
        color: 'bg-green-50 border-green-200 text-green-900',
        iconColor: 'text-green-600'
      },
      closed: {
        icon: CheckCircle2,
        title: 'Session Closed',
        description: 'This chat session has been closed.',
        color: 'bg-gray-50 border-gray-200 text-gray-900',
        iconColor: 'text-gray-600'
      }
    };

    const config = bannerConfig[transferStatus];
    if (!config) return null;

    const Icon = config.icon;

    return (
      <Alert className={`mx-4 mt-2 ${config.color}`}>
        <Icon className={`h-4 w-4 ${config.iconColor}`} />
        <AlertTitle className="text-sm font-semibold">{config.title}</AlertTitle>
        <AlertDescription className="text-xs">{config.description}</AlertDescription>
      </Alert>
    );
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-96 h-[400px]">
        <Card className="h-full flex flex-col shadow-xl justify-center items-center p-6">
          <p className="text-center text-muted-foreground mb-4">
            Please log in to use the chat feature
          </p>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <ChatErrorBoundary>
      <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] max-h-[80vh]">
        <Card className="h-full flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Avatar className={`w-8 h-8 ${transferStatus && transferStatus !== 'bot' ? 'border-2 border-primary' : ''}`}>
              <AvatarFallback className={transferStatus && transferStatus !== 'bot' ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                {transferStatus === 'admin_responding' || transferStatus === 'transferred' ? <Shield size={16} /> : <Bot size={16} />}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">
                {transferStatus === 'admin_responding' ? 'AHNI Admin' : 'AHNI Assistant'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isTyping ? 'Typing...' : transferStatus === 'transferred' ? 'Waiting for admin...' : 'Online'}
              </p>
            </div>
            {transferStatus && transferStatus !== 'bot' && (
              <Badge variant="outline" className="text-xs ml-2">
                {transferStatus === 'transferred' && 'Transferred'}
                {transferStatus === 'admin_responding' && 'Admin'}
                {transferStatus === 'resolved' && 'Resolved'}
                {transferStatus === 'closed' && 'Closed'}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 h-auto"
          >
            <X size={16} />
          </Button>
        </div>

        {/* Transfer Status Banner */}
        {renderTransferBanner()}

        {/* Error Display */}
        {error && (
          <div className="px-4 py-2 bg-destructive/10 border-b">
            <div className="flex items-center justify-between">
              <p className="text-sm text-destructive">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              >
                <X size={14} />
              </Button>
            </div>
          </div>
        )}

        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              <Bot className="mx-auto mb-2" size={32} />
              <p>Hi! I'm your AHNI assistant.</p>
              <p>How can I help you today?</p>
            </div>
          ) : (
            messages.map((msg: any, index: number) => (
              <EnhancedMessageBubble key={index} message={msg} />
            ))
          )}
          {isTyping && (
            <div className="flex space-x-2 justify-start">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="bg-muted">
                  <Bot size={12} />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!message.trim() || isLoading}
            >
              <Send size={16} />
            </Button>
          </form>
        </div>
      </Card>
    </div>
    </ChatErrorBoundary>
  );
};