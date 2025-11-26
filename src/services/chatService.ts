import axios, { AxiosResponse } from 'axios';
import { getAccessToken } from '@/utils/auth';
import { mockChatService } from './mockChatService';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot' | 'admin';
  timestamp: string;
  conversationId?: string;
  responseType?: 'text' | 'structured' | 'navigation' | 'task_guide' | 'template' | 'process_flow' | 'template_list';
  structuredData?: {
    type: string;
    template?: Template;
    templates?: Template[];
    process?: ProcessFlow;
    [key: string]: any;
  };
  role?: 'user' | 'bot' | 'admin';
  adminName?: string;
  metadata?: {
    admin_name?: string;
    admin_id?: string;
    [key: string]: any;
  };
}

export interface ChatConversation {
  id: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
  status?: 'bot' | 'transferred' | 'admin_responding' | 'resolved' | 'closed';
  assigned_admin?: {
    id: string;
    name: string;
    email: string;
  };
  transferred_at?: string;
  transfer_reason?: string;
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
  transferred?: boolean;
  transfer_status?: 'bot' | 'transferred' | 'admin_responding' | 'resolved' | 'closed';
  session_id?: string;
}

export interface CreateConversationResponse {
  conversation_id: string;
  created_at: string;
}

export interface Template {
  key: string;
  name: string;
  category: string;
  description: string;
  file_type: string;
  template_content?: string;
  variables?: string[];
}

export interface TemplateListResponse {
  total_templates: number;
  categories: string[];
  templates: Template[];
}

export interface TemplateSearchResponse {
  query: string;
  category: string | null;
  total_results: number;
  results: Template[];
}

export interface ProcessStep {
  step: number;
  name: string;
  description: string;
  actor: string;
  outputs: string[];
  duration: string;
  template?: string;
}

export interface ProcessFlow {
  key: string;
  name: string;
  category: string;
  description: string;
  steps: ProcessStep[];
  total_duration: string;
  required_documents: string[];
  step_count?: number;
}

export interface ProcessListResponse {
  total_processes: number;
  processes: ProcessFlow[];
}

class ChatService {
  private baseURL: string;
  private timeout: number;
  private isDevelopment: boolean;

  constructor() {
    // Use your Heroku backend URL
    // Chat endpoints are at /api/v1/chat/sessions/ so we keep the /v1
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000/api/v1';
    this.timeout = 30000;
    // Only use mock service if explicitly enabled
    this.isDevelopment = process.env.NEXT_PUBLIC_USE_MOCK_CHAT === 'true';

    // Log configuration only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Chat Service Configuration:', {
        baseURL: this.baseURL,
        isDevelopment: this.isDevelopment,
        useMockChat: process.env.NEXT_PUBLIC_USE_MOCK_CHAT,
        nodeEnv: process.env.NODE_ENV
      });
    }

    // Normalize trailing slash
    if (!this.baseURL.endsWith('/')) {
      this.baseURL = `${this.baseURL}/`;
    }

    // Chat service initialized
  }

  private isValidUUID(str: string | null | undefined): boolean {
    if (!str || typeof str !== 'string' || str.trim() === '') {
      return false;
    }
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidPattern.test(str);
  }

  private getAuthHeaders() {
    const token = getAccessToken();
    if (token) {
      console.log('🔑 Using auth token for chat request (length:', token.length, ')');
      return { Authorization: `Bearer ${token}` };
    } else {
      console.warn('⚠️ No auth token found in localStorage');
      return {};
    }
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
      const status = error.response?.status;
      const responseData = error.response?.data;

      // Log the full error for debugging
      console.error('🚨 Chat API Error:', {
        status,
        data: responseData,
        url: error.config?.url,
        method: error.config?.method,
        requestData: error.config?.data,
      });

      if (status === 400 && responseData) {
        // Handle validation errors specifically
        if (responseData.session_id) {
          throw new Error(`Invalid session ID: ${responseData.session_id.join(', ')}`);
        }
        if (responseData.message) {
          throw new Error(`Validation error: ${responseData.message.join ? responseData.message.join(', ') : responseData.message}`);
        }
        throw new Error(`Validation error: ${JSON.stringify(responseData)}`);
      }

      if (status === 401) {
        throw new Error('Authentication required. Please log in.');
      } else if (status === 429) {
        throw new Error('Too many requests. Please wait a moment.');
      } else if (status && status >= 500) {
        throw new Error('Server error. Please try again later.');
      }

      const message = responseData?.message || error.message || 'Chat service error';
      throw new Error(message);
    }

    throw new Error('Network error. Please check your connection.');
  }

  private transformApiResponse(backendResponse: any): SendMessageResponse {
    // Handle different backend response formats
    console.log('🔄 Transforming backend response:', backendResponse);

    // Extract the AI response content
    let response = '';
    let conversationId = '';
    let timestamp = new Date().toISOString();

    if (backendResponse.response) {
      response = backendResponse.response;
    } else if (backendResponse.message) {
      response = backendResponse.message;
    } else if (backendResponse.content) {
      response = backendResponse.content;
    } else {
      console.warn('⚠️ No response content found in backend response');
      response = 'Sorry, I encountered an issue generating a response.';
    }

    // Extract session/conversation ID (backend returns session_id)
    if (backendResponse.session_id) {
      conversationId = backendResponse.session_id;
      console.log('📋 Extracted session_id from response:', conversationId);
    } else if (backendResponse.conversation_id) {
      conversationId = backendResponse.conversation_id;
      console.log('📋 Extracted conversation_id from response:', conversationId);
    } else if (backendResponse.id) {
      conversationId = backendResponse.id;
      console.log('📋 Extracted id from response:', conversationId);
    } else {
      console.warn('⚠️ No session/conversation ID found in backend response');
    }

    if (backendResponse.timestamp) {
      timestamp = backendResponse.timestamp;
    } else if (backendResponse.created_at) {
      timestamp = backendResponse.created_at;
    } else if (backendResponse.created_datetime) {
      timestamp = backendResponse.created_datetime;
    }

    const transformedResponse: SendMessageResponse = {
      response,
      conversation_id: conversationId,
      timestamp,
      message_id: backendResponse.message_id || backendResponse.id,
      response_type: backendResponse.response_type || 'text',
      structured_data: backendResponse.structured_data,
      transferred: backendResponse.transferred,
      transfer_status: backendResponse.transfer_status,
      session_id: conversationId // Use the same ID for both fields
    };

    // Validate the session ID we're returning
    if (conversationId && this.isValidUUID(conversationId)) {
      console.log('✅ Returning valid session ID:', conversationId);
    } else if (conversationId) {
      console.warn('⚠️ Backend returned invalid session ID format:', conversationId);
    } else {
      console.warn('⚠️ No session ID returned from backend');
    }

    console.log('✅ Transformed response:', transformedResponse);
    return transformedResponse;
  }

  private transformMessage(backendMessage: any): ChatMessage {
    // Handle different backend message formats
    console.log('🔄 Transforming message:', backendMessage);

    // Map backend roles to frontend senders
    let sender: 'user' | 'bot' | 'admin' = 'bot';
    if (backendMessage.role === 'user' || backendMessage.sender === 'user') {
      sender = 'user';
    } else if (backendMessage.role === 'assistant' || backendMessage.sender === 'bot') {
      sender = 'bot';
    } else if (backendMessage.role === 'admin' || backendMessage.sender === 'admin') {
      sender = 'admin';
    }

    // Extract content
    let content = '';
    if (backendMessage.content) {
      content = backendMessage.content;
    } else if (backendMessage.message) {
      content = backendMessage.message;
    } else if (backendMessage.text) {
      content = backendMessage.text;
    }

    // Extract timestamp
    let timestamp = new Date().toISOString();
    if (backendMessage.created_datetime) {
      timestamp = backendMessage.created_datetime;
    } else if (backendMessage.timestamp) {
      timestamp = backendMessage.timestamp;
    } else if (backendMessage.created_at) {
      timestamp = backendMessage.created_at;
    }

    const transformedMessage: ChatMessage = {
      id: backendMessage.id || `msg-${Date.now()}-${Math.random()}`,
      content,
      sender,
      timestamp,
      conversationId: backendMessage.conversation_id || backendMessage.session_id,
      responseType: backendMessage.response_type || 'text',
      structuredData: backendMessage.structured_data,
      role: sender, // Also set role for backward compatibility
      adminName: backendMessage.admin_name,
      metadata: backendMessage.metadata
    };

    console.log('✅ Transformed message:', transformedMessage);
    return transformedMessage;
  }

  private transformConversationResponse(backendConversation: any): ChatConversation {
    console.log('🔄 Transforming conversation:', backendConversation);

    // Transform messages if they exist
    const messages = (backendConversation.messages || []).map((msg: any) =>
      this.transformMessage(msg)
    );

    const transformedConversation: ChatConversation = {
      id: backendConversation.id || backendConversation.session_id,
      messages,
      created_at: backendConversation.created_at || backendConversation.created_datetime || new Date().toISOString(),
      updated_at: backendConversation.updated_at || backendConversation.updated_datetime || new Date().toISOString(),
      status: backendConversation.status,
      assigned_admin: backendConversation.assigned_admin,
      transferred_at: backendConversation.transferred_at,
      transfer_reason: backendConversation.transfer_reason
    };

    console.log('✅ Transformed conversation:', transformedConversation);
    return transformedConversation;
  }

  private transformConversationsResponse(backendResponse: any): ChatConversation[] {
    console.log('🔄 Transforming conversations response:', backendResponse);

    // Handle different response formats
    let conversations = [];
    if (Array.isArray(backendResponse)) {
      conversations = backendResponse;
    } else if (backendResponse.results) {
      conversations = backendResponse.results;
    } else if (backendResponse.data) {
      conversations = backendResponse.data;
    } else if (backendResponse.conversations) {
      conversations = backendResponse.conversations;
    } else {
      console.warn('⚠️ Unexpected conversations response format');
      return [];
    }

    const transformedConversations = conversations.map((conv: any) =>
      this.transformConversationResponse(conv)
    );

    console.log('✅ Transformed conversations:', transformedConversations);
    return transformedConversations;
  }

  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    // Prepare payload - only include session_id if it's a valid UUID
    const payload: any = {
      message: request.message,
      context: {}
    };

    // Only include session_id if we have a valid UUID
    if (this.isValidUUID(request.conversation_id)) {
      payload.session_id = request.conversation_id;
      console.log('✅ Using existing session ID:', request.conversation_id);
    } else {
      console.log('🆕 Starting new chat session (no valid session_id provided)');
      if (request.conversation_id) {
        console.log('⚠️ Invalid session ID format rejected:', request.conversation_id);
      }
    }

    console.log('📤 Sending payload to backend:', payload);

    // Use mock service in development or when backend is not available
    if (this.isDevelopment) {
      try {
        const result = await this.makeRequest<any>('POST', 'chat/sessions/', payload);

        console.log('✅ Backend response:', result);

        // Transform backend response to frontend format
        return this.transformApiResponse(result);
      } catch (error) {
        // Check if it's an authentication error
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          console.error('🔐 Authentication required for chat service');
          throw new Error('Authentication required. Please log in to use chat.');
        }
        console.warn('Backend not available, using mock service');
        return mockChatService.sendMessage(request);
      }
    }

    // Try the Django backend endpoint first
    try {
      const result = await this.makeRequest<any>('POST', 'chat/sessions/', payload);

      console.log('✅ Backend response:', result);

      // Transform backend response to frontend format
      return this.transformApiResponse(result);
    } catch (error) {
      // Check if it's an authentication error
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.error('🔐 Authentication required for chat service');
        throw new Error('Authentication required. Please log in to use chat.');
      }
      console.log('Django endpoint failed, trying fallback...');
      // Fallback to original endpoint structure
      const fallbackResult = await this.makeRequest<any>('POST', 'chat/message/', request);
      return this.transformApiResponse(fallbackResult);
    }
  }

  async createConversation(): Promise<CreateConversationResponse> {
    // Payload without session_id for new conversations
    const payload = {
      message: 'Hello',
      context: {}
    };

    console.log('🆕 Creating new conversation with payload:', payload);

    if (this.isDevelopment) {
      try {
        const response = await this.makeRequest<any>('POST', 'chat/sessions/', payload);
        console.log('✅ New conversation response:', response);
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
      const response = await this.makeRequest<any>('POST', 'chat/sessions/', payload);
      console.log('✅ New conversation response:', response);
      return {
        conversation_id: response.session_id || response.conversation_id,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      return this.makeRequest<CreateConversationResponse>('POST', 'chat/conversations/', {});
    }
  }

  async getConversations(): Promise<ChatConversation[]> {
    if (this.isDevelopment) {
      try {
        const result = await this.makeRequest<any>('GET', 'chat/sessions/');
        return this.transformConversationsResponse(result);
      } catch (error) {
        console.warn('Backend not available, using mock service');
        return mockChatService.getConversations();
      }
    }

    try {
      // Try the main chat sessions endpoint first
      const result = await this.makeRequest<any>('GET', 'chat/sessions/');
      return this.transformConversationsResponse(result);
    } catch (error) {
      console.log('📝 Chat sessions list endpoint not available, using fallback');
      try {
        const fallbackResult = await this.makeRequest<any>('GET', 'chat/conversations/');
        return this.transformConversationsResponse(fallbackResult);
      } catch (fallbackError) {
        console.log('⚠️ No conversation history endpoint available, returning empty list');
        return [];
      }
    }
  }

  async getConversation(conversationId: string): Promise<ChatConversation> {
    if (this.isDevelopment) {
      try {
        const result = await this.makeRequest<any>('GET', `chat/sessions/${conversationId}/`);
        return this.transformConversationResponse(result);
      } catch (error) {
        console.warn('Backend not available, using mock service');
        return mockChatService.getConversation(conversationId);
      }
    }

    try {
      const result = await this.makeRequest<any>('GET', `chat/sessions/${conversationId}/`);
      return this.transformConversationResponse(result);
    } catch (error) {
      const fallbackResult = await this.makeRequest<any>('GET', `chat/conversations/${conversationId}/`);
      return this.transformConversationResponse(fallbackResult);
    }
  }

  async deleteConversation(conversationId: string): Promise<void> {
    if (this.isDevelopment) {
      try {
        return this.makeRequest<void>('DELETE', `chat/sessions/${conversationId}/`);
      } catch (error) {
        console.warn('Backend not available, using mock service');
        return mockChatService.deleteConversation(conversationId);
      }
    }

    try {
      return this.makeRequest<void>('DELETE', `chat/sessions/${conversationId}/`);
    } catch (error) {
      return this.makeRequest<void>('DELETE', `chat/conversations/${conversationId}/`);
    }
  }

  // Template methods
  async getTemplates(category?: string): Promise<TemplateListResponse> {
    const params = category ? `?category=${category}` : '';
    return this.makeRequest<TemplateListResponse>('GET', `chat/sessions/templates/${params}`);
  }

  async getTemplate(templateKey: string): Promise<Template> {
    return this.makeRequest<Template>('GET', `chat/sessions/templates/${templateKey}/`);
  }

  async searchTemplates(query: string, category?: string): Promise<TemplateSearchResponse> {
    const params = new URLSearchParams({ q: query });
    if (category) params.append('category', category);
    return this.makeRequest<TemplateSearchResponse>('GET', `chat/sessions/templates/search/?${params}`);
  }

  // Process flow methods
  async getProcesses(): Promise<ProcessListResponse> {
    return this.makeRequest<ProcessListResponse>('GET', 'chat/sessions/processes/');
  }

  async getProcess(processKey: string): Promise<ProcessFlow> {
    return this.makeRequest<ProcessFlow>('GET', `chat/sessions/processes/${processKey}/`);
  }

  // Test connection method for debugging
  async testConnection(): Promise<{ status: string; authenticated: boolean; backend: string }> {
    const token = getAccessToken();

    try {
      // Try a simple endpoint to test connection
      await this.makeRequest('POST', 'chat/sessions/', {
        message: 'Connection test',
        context: {}
      });

      return {
        status: 'success',
        authenticated: true,
        backend: this.baseURL
      };
    } catch (error: any) {
      if (error.message?.includes('Authentication required')) {
        return {
          status: 'auth_required',
          authenticated: false,
          backend: this.baseURL
        };
      }

      return {
        status: 'error',
        authenticated: !!token,
        backend: this.baseURL
      };
    }
  }
}

export const chatService = new ChatService();