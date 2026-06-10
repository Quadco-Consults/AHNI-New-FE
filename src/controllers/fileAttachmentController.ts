/**
 * File Attachment API Controller
 *
 * Handles file upload, listing, and deletion operations
 * for the generic file attachment system.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import {
  FileAttachmentUploadData,
  FileAttachmentListParams,
  FileAttachmentResponse,
  FileAttachmentUploadResponse,
} from "@/types/file-attachment";

const BASE_URL = "file-attachments/";

/**
 * Upload multiple files to attach to an object
 */
export const useUploadFileAttachments = () => {
  const queryClient = useQueryClient();

  return useMutation<FileAttachmentUploadResponse, Error, FileAttachmentUploadData>({
    mutationFn: async (data: FileAttachmentUploadData) => {
      const formData = new FormData();

      // Add files
      data.files.forEach((file) => {
        formData.append('files', file);
      });

      // Add metadata
      formData.append('content_type', data.content_type);
      formData.append('object_id', data.object_id);

      // Add descriptions if provided
      if (data.descriptions && data.descriptions.length > 0) {
        data.descriptions.forEach((desc) => {
          formData.append('descriptions[]', desc);
        });
      }

      // Add categories if provided
      if (data.categories && data.categories.length > 0) {
        data.categories.forEach((cat) => {
          formData.append('categories[]', cat);
        });
      }

      const response = await AxiosWithToken.post(`${BASE_URL}upload/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate the file list query for this object
      queryClient.invalidateQueries({
        queryKey: ['file-attachments', variables.content_type, variables.object_id],
      });
    },
  });
};

/**
 * List all file attachments for a specific object
 */
export const useFileAttachments = (params: FileAttachmentListParams, enabled: boolean = true) => {
  return useQuery<FileAttachmentResponse>({
    queryKey: ['file-attachments', params.content_type, params.object_id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`${BASE_URL}list/`, {
        params: {
          content_type: params.content_type,
          object_id: params.object_id,
        },
      });
      return response.data;
    },
    enabled: enabled && !!params.content_type && !!params.object_id,
  });
};

/**
 * Delete a file attachment
 */
export const useDeleteFileAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    mutationFn: async (attachmentId: string) => {
      const response = await AxiosWithToken.delete(`${BASE_URL}${attachmentId}/`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all file attachment queries
      queryClient.invalidateQueries({
        queryKey: ['file-attachments'],
      });
    },
  });
};

/**
 * Get details of a single file attachment
 */
export const useFileAttachment = (attachmentId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['file-attachment', attachmentId],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`${BASE_URL}${attachmentId}/`);
      return response.data;
    },
    enabled: enabled && !!attachmentId,
  });
};
