/**
 * WebSocket client for real-time chat updates.
 *
 * Handles:
 * - Connection to chat WebSocket server
 * - Real-time message delivery
 * - Admin response notifications
 * - Reconnection logic
 * - Heartbeat/keepalive
 */

export type WebSocketMessageType =
  | 'connection_established'
  | 'new_message'
  | 'admin_response'
  | 'session_status_update'
  | 'typing_indicator'
  | 'pong'
  | 'error'
  | 'session_subscribed';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  message?: any;
  session_id?: string;
  admin_name?: string;
  status?: string;
  timestamp?: number;
  user_id?: string;
  user_name?: string;
  is_typing?: boolean;
}

export type WebSocketEventHandler = (message: WebSocketMessage) => void;

class ChatWebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000; // Start with 1 second
  private heartbeatInterval: number = 30000; // 30 seconds
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private eventHandlers: Map<WebSocketMessageType, Set<WebSocketEventHandler>> = new Map();
  private isIntentionallyClosed: boolean = false;

  constructor(token: string) {
    // Determine WebSocket URL based on environment
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.NEXT_PUBLIC_WEBSOCKET_URL || window.location.host;

    // WebSocket URL includes token as query parameter for authentication
    this.url = `${protocol}//${host}/ws/chat/?token=${token}`;
  }

  /**
   * Connect to the WebSocket server.
   */
  connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('[ChatWebSocket] Already connected');
      return;
    }

    this.isIntentionallyClosed = false;

    try {
      console.log('[ChatWebSocket] Connecting to:', this.url.replace(/token=.*/, 'token=***'));
      this.ws = new WebSocket(this.url);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
    } catch (error) {
      console.error('[ChatWebSocket] Connection error:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Disconnect from the WebSocket server.
   */
  disconnect(): void {
    this.isIntentionallyClosed = true;
    this.stopHeartbeat();

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }

    console.log('[ChatWebSocket] Disconnected');
  }

  /**
   * Subscribe to a specific event type.
   *
   * @param eventType - Type of event to listen for
   * @param handler - Function to call when event occurs
   */
  on(eventType: WebSocketMessageType, handler: WebSocketEventHandler): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }
    this.eventHandlers.get(eventType)!.add(handler);
  }

  /**
   * Unsubscribe from an event type.
   *
   * @param eventType - Type of event to stop listening for
   * @param handler - Handler function to remove
   */
  off(eventType: WebSocketMessageType, handler: WebSocketEventHandler): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * Subscribe to a specific session for real-time updates.
   *
   * @param sessionId - Session ID to subscribe to
   */
  subscribeToSession(sessionId: string): void {
    this.send({
      type: 'subscribe_session',
      session_id: sessionId
    });
  }

  /**
   * Send typing indicator.
   *
   * @param sessionId - Session ID
   * @param isTyping - True if typing, false if stopped
   */
  sendTypingIndicator(sessionId: string, isTyping: boolean): void {
    this.send({
      type: 'typing',
      session_id: sessionId,
      is_typing: isTyping
    });
  }

  /**
   * Check if WebSocket is connected.
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  // ===== Private Methods =====

  private handleOpen(event: Event): void {
    console.log('[ChatWebSocket] Connected successfully');
    this.reconnectAttempts = 0;
    this.reconnectDelay = 1000;
    this.startHeartbeat();
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data: WebSocketMessage = JSON.parse(event.data);
      console.log('[ChatWebSocket] Received:', data.type, data);

      // Emit event to all registered handlers
      const handlers = this.eventHandlers.get(data.type);
      if (handlers) {
        handlers.forEach(handler => {
          try {
            handler(data);
          } catch (error) {
            console.error('[ChatWebSocket] Handler error:', error);
          }
        });
      }
    } catch (error) {
      console.error('[ChatWebSocket] Message parse error:', error);
    }
  }

  private handleError(event: Event): void {
    console.error('[ChatWebSocket] Error:', event);
  }

  private handleClose(event: CloseEvent): void {
    console.log('[ChatWebSocket] Closed:', event.code, event.reason);
    this.stopHeartbeat();

    // Reconnect unless intentionally closed
    if (!this.isIntentionallyClosed) {
      this.scheduleReconnect();
    }
  }

  private send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('[ChatWebSocket] Cannot send, not connected');
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      this.send({
        type: 'ping',
        timestamp: Date.now()
      });
    }, this.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[ChatWebSocket] Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000);

    console.log(`[ChatWebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }
}

// Singleton instance
let chatWebSocketInstance: ChatWebSocketClient | null = null;

/**
 * Get or create ChatWebSocket instance.
 *
 * @param token - Authentication token
 * @returns ChatWebSocket instance
 */
export function getChatWebSocket(token: string): ChatWebSocketClient {
  if (!chatWebSocketInstance) {
    chatWebSocketInstance = new ChatWebSocketClient(token);
  }
  return chatWebSocketInstance;
}

/**
 * Disconnect and destroy ChatWebSocket instance.
 */
export function destroyChatWebSocket(): void {
  if (chatWebSocketInstance) {
    chatWebSocketInstance.disconnect();
    chatWebSocketInstance = null;
  }
}

export default ChatWebSocketClient;
