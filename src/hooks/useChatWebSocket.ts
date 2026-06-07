/**
 * React hook for chat WebSocket integration.
 *
 * Provides easy access to real-time chat updates in React components.
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { getChatWebSocket, destroyChatWebSocket, WebSocketMessage, WebSocketEventHandler } from '@/services/chatWebSocket';

interface UseChatWebSocketOptions {
  /**
   * Auto-connect on mount (default: true)
   */
  autoConnect?: boolean;

  /**
   * Session ID to auto-subscribe to
   */
  sessionId?: string;

  /**
   * Callback for new messages
   */
  onNewMessage?: (message: any, sessionId: string) => void;

  /**
   * Callback for admin responses
   */
  onAdminResponse?: (message: any, sessionId: string, adminName: string) => void;

  /**
   * Callback for session status updates
   */
  onSessionStatusUpdate?: (sessionId: string, status: string, message?: string) => void;

  /**
   * Callback for typing indicators
   */
  onTypingIndicator?: (sessionId: string, userName: string, isTyping: boolean) => void;
}

export function useChatWebSocket(options: UseChatWebSocketOptions = {}) {
  const {
    autoConnect = true,
    sessionId,
    onNewMessage,
    onAdminResponse,
    onSessionStatusUpdate,
    onTypingIndicator
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<ReturnType<typeof getChatWebSocket> | null>(null);

  /**
   * Initialize WebSocket connection.
   */
  const connect = useCallback(() => {
    // Skip WebSocket connection if using mock chat
    if (process.env.NEXT_PUBLIC_USE_MOCK_CHAT === 'true') {
      console.log('[ChatWebSocket] Mock chat enabled - skipping WebSocket connection');
      setIsConnected(false);
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setConnectionError('No authentication token found');
        return;
      }

      wsRef.current = getChatWebSocket(token);

      // Register event handlers
      const handleConnection: WebSocketEventHandler = () => {
        setIsConnected(true);
        setConnectionError(null);

        // Auto-subscribe to session if provided
        if (sessionId && wsRef.current) {
          wsRef.current.subscribeToSession(sessionId);
        }
      };

      const handleNewMessage: WebSocketEventHandler = (data) => {
        if (onNewMessage && data.message && data.session_id) {
          onNewMessage(data.message, data.session_id);
        }
      };

      const handleAdminResponse: WebSocketEventHandler = (data) => {
        if (onAdminResponse && data.message && data.session_id && data.admin_name) {
          onAdminResponse(data.message, data.session_id, data.admin_name);
        }
      };

      const handleSessionStatusUpdate: WebSocketEventHandler = (data) => {
        if (onSessionStatusUpdate && data.session_id && data.status) {
          onSessionStatusUpdate(data.session_id, data.status, data.message);
        }
      };

      const handleTypingIndicator: WebSocketEventHandler = (data) => {
        if (onTypingIndicator && data.session_id && data.user_name) {
          onTypingIndicator(data.session_id, data.user_name, data.is_typing || false);
        }
      };

      const handleError: WebSocketEventHandler = (data) => {
        setConnectionError(data.message?.toString() || 'WebSocket error');
      };

      // Register all handlers
      wsRef.current.on('connection_established', handleConnection);
      wsRef.current.on('new_message', handleNewMessage);
      wsRef.current.on('admin_response', handleAdminResponse);
      wsRef.current.on('session_status_update', handleSessionStatusUpdate);
      wsRef.current.on('typing_indicator', handleTypingIndicator);
      wsRef.current.on('error', handleError);

      // Connect
      wsRef.current.connect();

      // Return cleanup function
      return () => {
        if (wsRef.current) {
          wsRef.current.off('connection_established', handleConnection);
          wsRef.current.off('new_message', handleNewMessage);
          wsRef.current.off('admin_response', handleAdminResponse);
          wsRef.current.off('session_status_update', handleSessionStatusUpdate);
          wsRef.current.off('typing_indicator', handleTypingIndicator);
          wsRef.current.off('error', handleError);
        }
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setConnectionError(error instanceof Error ? error.message : 'Connection failed');
    }
  }, [sessionId, onNewMessage, onAdminResponse, onSessionStatusUpdate, onTypingIndicator]);

  /**
   * Disconnect from WebSocket.
   */
  const disconnect = useCallback(() => {
    destroyChatWebSocket();
    wsRef.current = null;
    setIsConnected(false);
  }, []);

  /**
   * Subscribe to a specific session.
   */
  const subscribeToSession = useCallback((sessionId: string) => {
    if (wsRef.current && wsRef.current.isConnected()) {
      wsRef.current.subscribeToSession(sessionId);
    }
  }, []);

  /**
   * Send typing indicator.
   */
  const sendTypingIndicator = useCallback((sessionId: string, isTyping: boolean) => {
    if (wsRef.current && wsRef.current.isConnected()) {
      wsRef.current.sendTypingIndicator(sessionId, isTyping);
    }
  }, []);

  /**
   * Reconnect to WebSocket.
   */
  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(connect, 100);
  }, [disconnect, connect]);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect) {
      const cleanup = connect();
      return cleanup;
    }
  }, [autoConnect, connect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't disconnect on unmount - keep WebSocket alive for other components
      // Only disconnect when user logs out (handled elsewhere)
    };
  }, []);

  return {
    isConnected,
    connectionError,
    connect,
    disconnect,
    reconnect,
    subscribeToSession,
    sendTypingIndicator,
    ws: wsRef.current
  };
}

export default useChatWebSocket;
