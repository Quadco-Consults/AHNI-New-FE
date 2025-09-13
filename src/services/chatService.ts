import axios, { AxiosResponse } from 'axios';
import { getAccessToken } from '@/utils/auth';
import { mockChatService } from './mockChatService';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  conversationId?: string;
  responseType?: 'text' | 'structured' | 'navigation' | 'task_guide';
  structuredData?: {
    type: string;
    [key: string]: any;
  };
}

export interface ChatConversation {
  id: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface SendMessageRequest {
  message: string;
  conversation_id?: string;
}

export interface SendMessageResponse {
  response: string;
  conversation_id: string;
  timestamp: string;
  message_id?: string;
  response_type?: 'text' | 'structured' | 'navigation' | 'task_guide';
  structured_data?: {
    type: string;
    [key: string]: any;
  };
}

export interface CreateConversationResponse {
  conversation_id: string;
  created_at: string;
}

class ChatService {
  private baseURL: string;
  private timeout: number;
  private isDevelopment: boolean;

  constructor() {
    // Use your Heroku backend URL
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000/api';
    this.timeout = 30000;
    this.isDevelopment = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_USE_MOCK_CHAT === 'true';
    
    // Remove trailing slash and /v1 for chat endpoints
    if (this.baseURL.endsWith('/v1') || this.baseURL.endsWith('/v1/')) {
      this.baseURL = this.baseURL.replace(/\/v1\/?$/, '');
    }
    
    console.log('Chat API Base URL:', this.baseURL);
    console.log('Using mock chat service:', this.isDevelopment);
  }

  private getAuthHeaders() {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios({
        method,
        url: `${this.baseURL}${endpoint}`,
        data,
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
        timeout: this.timeout,
      });

      return response.data;
    } catch (error) {
      console.error('Chat API Error:', error);
      throw this.handleApiError(error);
    }
  }

  private handleApiError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message || 'Chat service error';
      const status = error.response?.status;
      
      if (status === 401) {
        throw new Error('Authentication required. Please log in.');
      } else if (status === 429) {
        throw new Error('Too many requests. Please wait a moment.');
      } else if (status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      throw new Error(message);
    }
    
    throw new Error('Network error. Please check your connection.');
  }

  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    // Use mock service in development or when backend is not available
    if (this.isDevelopment) {
      try {
        const result = await this.makeRequest<SendMessageResponse>('POST', '/chat/sessions/chat/', {
          message: request.message,
          session_id: request.conversation_id || null,
          context: {}
        });
        return result;
      } catch (error) {
        console.warn('Backend not available, using mock service');
        return mockChatService.sendMessage(request);
      }
    }

    // Try the Django backend endpoint first
    try {
      return this.makeRequest<SendMessageResponse>('POST', '/chat/sessions/chat/', {
        message: request.message,
        session_id: request.conversation_id || null,
        context: {}
      });
    } catch (error) {
      console.log('Django endpoint failed, trying fallback...');
      // Fallback to original endpoint structure
      return this.makeRequest<SendMessageResponse>('POST', '/chat/message/', request);
    }
  }

  async createConversation(): Promise<CreateConversationResponse> {
    if (this.isDevelopment) {
      try {
        const response = await this.makeRequest<any>('POST', '/chat/sessions/chat/', {
          message: 'Hello',
          session_id: null,
          context: {}
        });
        return { 
          conversation_id: response.session_id || response.conversation_id,
          created_at: new Date().toISOString()
        };
      } catch (error) {
        console.warn('Backend not available, using mock service');
        return mockChatService.createConversation();
      }
    }

    // For Django backend, we can start with a simple message to create session
    try {
      const response = await this.makeRequest<any>('POST', '/chat/sessions/chat/', {
        message: 'Hello',
        session_id: null,
        context: {}
      });
      return { 
        conversation_id: response.session_id || response.conversation_id,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      return this.makeRequest<CreateConversationResponse>('POST', '/chat/conversations/', {});
    }
  }

  async getConversations(): Promise<ChatConversation[]> {
    if (this.isDevelopment) {
      try {
        return this.makeRequest<ChatConversation[]>('GET', '/chat/sessions/');
      } catch (error) {
        console.warn('Backend not available, using mock service');
        return mockChatService.getConversations();
      }
    }

    try {
      return this.makeRequest<ChatConversation[]>('GET', '/chat/sessions/');
    } catch (error) {
      console.log('Django sessions endpoint failed, trying fallback...');
      return this.makeRequest<ChatConversation[]>('GET', '/chat/conversations/');
    }
  }

  async getConversation(conversationId: string): Promise<ChatConversation> {
    if (this.isDevelopment) {
      try {
        return this.makeRequest<ChatConversation>('GET', `/chat/sessions/${conversationId}/`);
      } catch (error) {
        console.warn('Backend not available, using mock service');
        return mockChatService.getConversation(conversationId);
      }
    }

    try {
      return this.makeRequest<ChatConversation>('GET', `/chat/sessions/${conversationId}/`);
    } catch (error) {
      return this.makeRequest<ChatConversation>('GET', `/chat/conversations/${conversationId}/`);
    }
  }

  async deleteConversation(conversationId: string): Promise<void> {
    if (this.isDevelopment) {
      try {
        return this.makeRequest<void>('DELETE', `/chat/sessions/${conversationId}/`);
      } catch (error) {
        console.warn('Backend not available, using mock service');
        return mockChatService.deleteConversation(conversationId);
      }
    }

    try {
      return this.makeRequest<void>('DELETE', `/chat/sessions/${conversationId}/`);
    } catch (error) {
      return this.makeRequest<void>('DELETE', `/chat/conversations/${conversationId}/`);
    }
  }
}

export const chatService = new ChatService();