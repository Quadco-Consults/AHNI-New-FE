'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useChatService } from '@/hooks/useChatService';
import { ChatErrorBoundary } from './ErrorBoundary';
import { EnhancedMessageBubble } from './EnhancedMessageBubble';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatWindow = ({ isOpen, onClose }: ChatWindowProps) => {
  const [message, setMessage] = useState('');
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
      await sendMessage(userMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
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
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot size={16} />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">AHNI Assistant</h3>
              <p className="text-xs text-muted-foreground">
                {isTyping ? 'Typing...' : 'Online'}
              </p>
            </div>
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