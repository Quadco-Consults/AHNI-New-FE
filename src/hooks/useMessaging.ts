import { useState, useEffect, useCallback, useRef } from 'react';
import AxiosWithToken from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
}

export interface Message {
  id: string;
  conversation: string;
  sender: User;
  type: 'text' | 'file' | 'system';
  content: string;
  attachments: MessageAttachment[];
  reply_to: any;
  metadata: any;
  is_edited: boolean;
  edited_at: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
  read_receipts: any[];
  read_by_count: number;
  created_datetime: string;
  updated_datetime: string;
}

export interface MessageAttachment {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  url: string;
  thumbnail_url: string | null;
  is_image: boolean;
  is_video: boolean;
  is_document: boolean;
  created_datetime: string;
}

export interface ConversationParticipant {
  id: string;
  user: User;
  role: 'admin' | 'member';
  is_muted: boolean;
  joined_at: string;
  left_at: string | null;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name: string;
  description: string;
  avatar: string | null;
  participants: ConversationParticipant[];
  last_message: Message | null;
  unread_count: number;
  is_archived: boolean;
  created_datetime: string;
  updated_datetime: string;
}

export const useMessaging = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const isRequestInFlight = useRef(false);

  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isRequestInFlight.current) {
      console.log('Request already in flight, skipping...');
      return;
    }

    isRequestInFlight.current = true;
    setIsLoading(true);
    try {
      const response = await AxiosWithToken.get('/messaging/conversations/');

      // Handle different response structures
      let data;
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        data = response.data.results;
      } else if (response.data?.data?.results && Array.isArray(response.data.data.results)) {
        data = response.data.data.results;
      } else {
        console.warn('Unexpected response structure:', response.data);
        data = [];
      }

      setConversations(data);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      console.error('Error details:', error.response?.data);
      toast({
        title: 'Unable to load messages',
        description: 'The messaging service is currently unavailable. Please try again later.',
        variant: 'destructive',
      });
      // Set empty array on error
      setConversations([]);
    } finally {
      setIsLoading(false);
      isRequestInFlight.current = false;
    }
  }, [toast]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(
    async (conversationId: string) => {
      setIsLoading(true);
      try {
        const response = await AxiosWithToken.get(
          `/messaging/conversations/${conversationId}/messages/`
        );
        setMessages(response.data.results || []);
      } catch (error: any) {
        console.error('Error fetching messages:', error);
        toast({
          title: 'Error',
          description: 'Failed to load messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  // Send a message
  const sendMessage = useCallback(
    async (conversationId: string, content: string, type: 'text' | 'file' = 'text') => {
      setIsSending(true);
      try {
        const response = await AxiosWithToken.post(
          `/messaging/conversations/${conversationId}/send_message/`,
          {
            content,
            type,
          }
        );

        // Add the new message to the messages list
        setMessages((prev) => [...prev, response.data]);

        // Update conversations list to reflect new last message
        await fetchConversations();

        return response.data;
      } catch (error: any) {
        console.error('Error sending message:', error);
        toast({
          title: 'Error',
          description: 'Failed to send message',
          variant: 'destructive',
        });
        throw error;
      } finally {
        setIsSending(false);
      }
    },
    [toast, fetchConversations]
  );

  // Create a new conversation
  const createConversation = useCallback(
    async (type: 'direct' | 'group', participantIds: string[], name?: string, description?: string) => {
      setIsLoading(true);
      try {
        const response = await AxiosWithToken.post('/messaging/conversations/', {
          type,
          participant_ids: participantIds,
          name: name || '',
          description: description || '',
        });

        // Add to conversations list
        setConversations((prev) => [response.data, ...prev]);
        setCurrentConversation(response.data);

        toast({
          title: 'Success',
          description: 'Conversation created successfully',
        });

        return response.data;
      } catch (error: any) {
        console.error('Error creating conversation:', error);
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to create conversation',
          variant: 'destructive',
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  // Mark conversation as read
  const markConversationAsRead = useCallback(
    async (conversationId: string) => {
      try {
        await AxiosWithToken.post(`/messaging/conversations/${conversationId}/mark_read/`);

        // Update the unread count in the conversations list
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
          )
        );
      } catch (error: any) {
        console.error('Error marking conversation as read:', error);
      }
    },
    []
  );

  // Load a conversation and its messages
  const loadConversation = useCallback(
    async (conversationId: string) => {
      setIsLoading(true);
      try {
        // Fetch conversation details
        const convResponse = await AxiosWithToken.get(`/messaging/conversations/${conversationId}/`);
        setCurrentConversation(convResponse.data);

        // Fetch messages
        await fetchMessages(conversationId);

        // Mark as read
        await markConversationAsRead(conversationId);
      } catch (error: any) {
        console.error('Error loading conversation:', error);
        toast({
          title: 'Error',
          description: 'Failed to load conversation',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [fetchMessages, markConversationAsRead, toast]
  );

  // Upload file attachment
  const uploadAttachment = useCallback(
    async (messageId: string, file: File) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('message_id', messageId);

        const response = await AxiosWithToken.post('/messaging/attachments/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return response.data;
      } catch (error: any) {
        console.error('Error uploading attachment:', error);
        toast({
          title: 'Error',
          description: 'Failed to upload file',
          variant: 'destructive',
        });
        throw error;
      }
    },
    [toast]
  );

  // Send message with files
  const sendMessageWithFiles = useCallback(
    async (conversationId: string, content: string, files: File[]) => {
      setIsSending(true);
      try {
        // First send the message
        const messageResponse = await AxiosWithToken.post(
          `/messaging/conversations/${conversationId}/send_message/`,
          {
            content: content || 'Sent attachments',
            type: files.length > 0 ? 'file' : 'text',
          }
        );

        const messageId = messageResponse.data.id;

        // Upload files if any
        if (files.length > 0) {
          const uploadPromises = files.map((file) => uploadAttachment(messageId, file));
          await Promise.all(uploadPromises);
        }

        // Refresh messages to show the updated message with attachments
        await fetchMessages(conversationId);

        // Update conversations list
        await fetchConversations();

        toast({
          title: 'Success',
          description: 'Message sent successfully',
        });

        return messageResponse.data;
      } catch (error: any) {
        console.error('Error sending message with files:', error);
        toast({
          title: 'Error',
          description: 'Failed to send message',
          variant: 'destructive',
        });
        throw error;
      } finally {
        setIsSending(false);
      }
    },
    [toast, uploadAttachment, fetchMessages, fetchConversations]
  );

  // Delete a message
  const deleteMessage = useCallback(
    async (conversationId: string, messageId: string) => {
      try {
        await AxiosWithToken.delete(`/messaging/messages/${messageId}/`);

        // Remove the message from the local state
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));

        // Update conversations list to reflect the deletion
        await fetchConversations();

        toast({
          title: 'Success',
          description: 'Message deleted successfully',
        });
      } catch (error: any) {
        console.error('Error deleting message:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete message',
          variant: 'destructive',
        });
        throw error;
      }
    },
    [toast, fetchConversations]
  );

  // Delete a conversation
  const deleteConversation = useCallback(
    async (conversationId: string) => {
      try {
        await AxiosWithToken.delete(`/messaging/conversations/${conversationId}/`);

        // Remove the conversation from the local state
        setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));

        // If the deleted conversation was the current one, clear it
        if (currentConversation?.id === conversationId) {
          setCurrentConversation(null);
          setMessages([]);
        }

        toast({
          title: 'Success',
          description: 'Conversation deleted successfully',
        });
      } catch (error: any) {
        console.error('Error deleting conversation:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete conversation',
          variant: 'destructive',
        });
        throw error;
      }
    },
    [toast, currentConversation]
  );

  // Load conversations on mount (only once)
  useEffect(() => {
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once on mount

  return {
    // State
    conversations,
    messages,
    currentConversation,
    isLoading,
    isSending,

    // Actions
    fetchConversations,
    fetchMessages,
    sendMessage,
    sendMessageWithFiles,
    deleteMessage,
    deleteConversation,
    createConversation,
    loadConversation,
    markConversationAsRead,
    uploadAttachment,
    setCurrentConversation,
  };
};
