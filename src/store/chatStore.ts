import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { chatService, ChatMessage, ChatConversation } from '@/services/chatService';

export interface ChatState {
  messages: ChatMessage[];
  conversations: ChatConversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
}

export interface ChatActions {
  initializeChat: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  createNewConversation: () => Promise<void>;
  loadConversation: (conversationId: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  clearError: () => void;
  setTyping: (isTyping: boolean) => void;
  clearCurrentConversation: () => void;
}

export type ChatStore = ChatState & ChatActions;

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // State
      messages: [],
      conversations: [],
      currentConversationId: null,
      isLoading: false,
      isTyping: false,
      error: null,

      // Actions
      initializeChat: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Try to load existing conversations
          await get().loadConversations();
          
          const { conversations } = get();
          if (conversations.length > 0) {
            // Load the most recent conversation
            const latestConversation = conversations[0];
            set({
              currentConversationId: latestConversation.id,
              messages: latestConversation.messages,
            });
          } else {
            // Create a new conversation if none exist
            await get().createNewConversation();
          }
        } catch (error: any) {
          set({ error: error.message || 'Failed to initialize chat' });
        } finally {
          set({ isLoading: false });
        }
      },

      sendMessage: async (text: string) => {
        const { currentConversationId } = get();
        
        try {
          set({ isLoading: true, error: null });

          // Add user message immediately for better UX
          const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            content: text,
            sender: 'user',
            timestamp: new Date().toISOString(),
            conversationId: currentConversationId || undefined,
          };

          set((state) => ({
            messages: [...state.messages, userMessage],
            isTyping: true,
          }));

          // Send message to backend
          const response = await chatService.sendMessage({
            message: text,
            conversation_id: currentConversationId || undefined,
          });

          console.log('📨 Raw API response:', response);

          // Add bot response
          const botMessage: ChatMessage = {
            id: `bot-${Date.now()}`,
            content: response.response,
            sender: 'bot',
            timestamp: response.timestamp,
            conversationId: response.conversation_id,
            responseType: response.response_type || 'text',
            structuredData: response.structured_data,
          };

          console.log('🤖 Created bot message:', botMessage);

          set((state) => {
            const updatedMessages = [...state.messages, botMessage];
            console.log('💬 All messages after update:', updatedMessages);

            return {
              messages: updatedMessages,
              currentConversationId: response.conversation_id,
              isTyping: false,
            };
          });

          // Refresh conversations list to include new messages
          await get().loadConversations();

        } catch (error: any) {
          console.error('❌ Chat send message error:', error);

          let errorMessage = error.message || 'Failed to send message';

          // Handle specific error types
          if (error.message?.includes('Authentication required')) {
            errorMessage = 'Please log in to use the chat feature.';
          } else if (error.message?.includes('Network')) {
            errorMessage = 'Connection error. Please check your internet connection.';
          }

          set({
            error: errorMessage,
            isTyping: false
          });
        } finally {
          set({ isLoading: false });
        }
      },

      createNewConversation: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await chatService.createConversation();
          
          set({
            currentConversationId: response.conversation_id,
            messages: [],
          });

          // Refresh conversations list
          await get().loadConversations();

        } catch (error: any) {
          set({ error: error.message || 'Failed to create conversation' });
        } finally {
          set({ isLoading: false });
        }
      },

      loadConversation: async (conversationId: string) => {
        try {
          set({ isLoading: true, error: null });

          console.log('🔄 Loading conversation:', conversationId);
          const conversation = await chatService.getConversation(conversationId);
          console.log('📑 Loaded conversation:', conversation);

          set({
            currentConversationId: conversationId,
            messages: conversation.messages,
          });

          console.log('✅ Conversation loaded into store with messages:', conversation.messages);

        } catch (error: any) {
          console.error('❌ Failed to load conversation:', error);
          set({ error: error.message || 'Failed to load conversation' });
        } finally {
          set({ isLoading: false });
        }
      },

      loadConversations: async () => {
        try {
          const conversations = await chatService.getConversations();
          set({ conversations });
        } catch (error: any) {
          set({ error: error.message || 'Failed to load conversations' });
        }
      },

      clearError: () => set({ error: null }),

      setTyping: (isTyping: boolean) => set({ isTyping }),

      clearCurrentConversation: () => set({
        messages: [],
        currentConversationId: null,
      }),
    }),
    {
      name: 'chat-store',
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
        messages: state.messages,
      }),
    }
  )
);