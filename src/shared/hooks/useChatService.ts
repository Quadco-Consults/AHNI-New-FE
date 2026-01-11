import { useEffect, useCallback } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useAuth } from '@/hooks/useAuth';

export const useChatService = () => {
  const { isLoggedIn } = useAuth();
  const {
    messages,
    conversations,
    currentConversationId,
    isLoading,
    isTyping,
    error,
    initializeChat,
    sendMessage,
    createNewConversation,
    loadConversation,
    loadConversations,
    clearError,
    clearCurrentConversation,
  } = useChatStore();

  // Initialize chat when user is authenticated
  useEffect(() => {
    if (isLoggedIn && !currentConversationId) {
      initializeChat();
    }
  }, [isLoggedIn, currentConversationId, initializeChat]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    await sendMessage(text.trim());
  }, [sendMessage]);

  const handleCreateNewConversation = useCallback(async () => {
    await createNewConversation();
  }, [createNewConversation]);

  const handleLoadConversation = useCallback(async (conversationId: string) => {
    await loadConversation(conversationId);
  }, [loadConversation]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  const handleClearCurrentConversation = useCallback(() => {
    clearCurrentConversation();
  }, [clearCurrentConversation]);

  // Refresh conversations periodically if needed
  const refreshConversations = useCallback(async () => {
    if (isLoggedIn) {
      await loadConversations();
    }
  }, [isLoggedIn, loadConversations]);

  return {
    // State
    messages,
    conversations,
    currentConversationId,
    isLoading,
    isTyping,
    error,
    isAuthenticated: isLoggedIn,

    // Actions
    sendMessage: handleSendMessage,
    createNewConversation: handleCreateNewConversation,
    loadConversation: handleLoadConversation,
    refreshConversations,
    clearError: handleClearError,
    clearCurrentConversation: handleClearCurrentConversation,
  };
};