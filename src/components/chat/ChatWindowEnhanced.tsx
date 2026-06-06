'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, AlertCircle, Clock, Shield, CheckCircle2, Wifi, WifiOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useChatService } from '@/hooks/useChatService';
import { useChatWebSocket } from '@/hooks/useChatWebSocket';
import { ChatErrorBoundary } from './ErrorBoundary';
import { EnhancedMessageBubble } from './EnhancedMessageBubble';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface ChatWindowEnhancedProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatWindowEnhanced = ({ isOpen, onClose }: ChatWindowEnhancedProps) => {
  const [message, setMessage] = useState('');
  const [transferStatus, setTransferStatus] = useState<'bot' | 'transferred' | 'admin_responding' | 'resolved' | 'closed' | null>(null);
  const [adminTyping, setAdminTyping] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    messages,
    isLoading,
    isTyping,
    error,
    sendMessage: sendMessageHTTP,
    clearError,
    isAuthenticated,
    currentConversationId
  } = useChatService();

  const { toast } = useToast();

  // WebSocket integration for real-time updates
  const { isConnected, subscribeToSession, sendTypingIndicator } = useChatWebSocket({
    autoConnect: isAuthenticated,
    sessionId: currentConversationId,
    onNewMessage: (messageData, sessionId) => {
      // Message received via WebSocket - already added to store
      console.log('[ChatWindow] New message received:', messageData);

      // Play notification sound
      if (soundEnabled && messageData.role === 'assistant') {
        playNotificationSound();
      }

      // Auto-scroll to bottom
      scrollToBottom();
    },
    onAdminResponse: (messageData, sessionId, adminName) => {
      console.log('[ChatWindow] Admin response received:', adminName);

      // Show toast notification
      toast({
        title: `${adminName} responded`,
        description: messageData.content?.substring(0, 100) || 'New message from admin',
        duration: 5000,
      });

      // Update transfer status
      setTransferStatus('admin_responding');

      // Play notification sound
      if (soundEnabled) {
        playNotificationSound();
      }

      // Auto-scroll to bottom
      scrollToBottom();
    },
    onSessionStatusUpdate: (sessionId, status, statusMessage) => {
      console.log('[ChatWindow] Session status update:', status);

      // Update transfer status
      setTransferStatus(status as any);

      // Show toast for important status changes
      if (status === 'transferred') {
        toast({
          title: 'Transferred to Admin',
          description: 'An admin will respond shortly',
          duration: 5000,
        });
      } else if (status === 'resolved') {
        toast({
          title: 'Issue Resolved',
          description: statusMessage || 'Your issue has been marked as resolved',
          duration: 5000,
        });
      }
    },
    onTypingIndicator: (sessionId, userName, isTyping) => {
      console.log('[ChatWindow] Typing indicator:', userName, isTyping);

      if (isTyping) {
        setAdminTyping(userName);
      } else {
        setAdminTyping(null);
      }
    }
  });

  // Play notification sound
  const playNotificationSound = () => {
    if (!audioRef.current) {
      // Create audio element for notification
      audioRef.current = new Audio('/sounds/notification.mp3');
    }
    audioRef.current.play().catch(err => {
      console.log('Could not play notification sound:', err);
    });
  };

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  // Handle typing in input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    // Send typing indicator via WebSocket
    if (currentConversationId && isConnected) {
      // Clear previous timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      // Send "is typing" indicator
      sendTypingIndicator(currentConversationId, true);

      // Set timeout to send "stopped typing" after 3 seconds
      const timeout = setTimeout(() => {
        sendTypingIndicator(currentConversationId, false);
      }, 3000);
      setTypingTimeout(timeout);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');

    // Clear typing indicator
    if (currentConversationId && isConnected) {
      sendTypingIndicator(currentConversationId, false);
    }
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    try {
      const response = await sendMessageHTTP(userMessage);
      // Check if the message triggered a transfer
      if (response && (response as any).transferred) {
        setTransferStatus((response as any).transfer_status || 'transferred');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Subscribe to session when conversation changes
  useEffect(() => {
    if (currentConversationId && isConnected) {
      subscribeToSession(currentConversationId);
    }
  }, [currentConversationId, isConnected, subscribeToSession]);

  // Display error messages to user
  useEffect(() => {
    if (error) {
      console.error('Chat error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error,
        duration: 5000,
      });
      clearError();
    }
  }, [error, clearError, toast]);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Render connection status
  const renderConnectionStatus = () => {
    if (!isAuthenticated) return null;

    return (
      <div className="flex items-center space-x-1 text-xs">
        {isConnected ? (
          <>
            <Wifi size={12} className="text-green-500" />
            <span className="text-green-600">Live</span>
          </>
        ) : (
          <>
            <WifiOff size={12} className="text-amber-500" />
            <span className="text-amber-600">Reconnecting...</span>
          </>
        )}
      </div>
    );
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
        <Card className="h-full flex flex-col shadow-2xl border-2">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3 flex-1">
            <Avatar className={`w-10 h-10 ${transferStatus && transferStatus !== 'bot' ? 'border-2 border-blue-500 ring-2 ring-blue-100' : ''}`}>
              <AvatarFallback className={transferStatus && transferStatus !== 'bot' ? 'bg-blue-500 text-white' : 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white'}>
                {transferStatus === 'admin_responding' || transferStatus === 'transferred' ? <Shield size={20} /> : <Bot size={20} />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-sm">
                  {transferStatus === 'admin_responding' ? 'AHNI Admin' : 'AHNI Assistant'}
                </h3>
                {transferStatus && transferStatus !== 'bot' && (
                  <Badge variant="outline" className="text-xs h-5">
                    {transferStatus === 'transferred' && 'Transferred'}
                    {transferStatus === 'admin_responding' && 'Admin'}
                    {transferStatus === 'resolved' && 'Resolved'}
                    {transferStatus === 'closed' && 'Closed'}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {adminTyping ? (
                  <p className="text-xs text-blue-600 font-medium animate-pulse">
                    {adminTyping} is typing...
                  </p>
                ) : isTyping ? (
                  <p className="text-xs text-muted-foreground">Thinking...</p>
                ) : (
                  renderConnectionStatus()
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 h-auto"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-muted-foreground" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 h-auto"
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        {/* Transfer Status Banner */}
        {renderTransferBanner()}

        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                  <Bot className="text-white" size={32} />
                </div>
              </div>
              <p className="font-semibold text-lg mb-1">Hi! I'm your AHNI assistant.</p>
              <p className="text-xs">How can I help you today?</p>
            </div>
          ) : (
            messages.map((msg: any, index: number) => (
              <div key={index} className="space-y-1">
                <EnhancedMessageBubble message={msg} />
                {msg.created_datetime && (
                  <p className={`text-xs text-muted-foreground ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {formatDistanceToNow(new Date(msg.created_datetime), { addSuffix: true })}
                  </p>
                )}
              </div>
            ))
          )}
          {(isTyping || adminTyping) && (
            <div className="flex space-x-2 justify-start">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white">
                  {adminTyping ? <Shield size={12} /> : <Bot size={12} />}
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t bg-gray-50">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={message}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 bg-white"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!message.trim() || isLoading}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              <Send size={16} />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {isConnected ? '🟢 Real-time updates enabled' : '🟡 Reconnecting...'}
          </p>
        </div>
      </Card>
    </div>
    </ChatErrorBoundary>
  );
};
