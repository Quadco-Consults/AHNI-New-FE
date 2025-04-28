import { GrievianceManagementDocument } from "definations/hr-types/grieviance-management";
import baseAPI from "..";

const BASE_URL = "hr/grievances/complaints/documents/";

const GrievianceManagementDocumentAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getGrievianceManagementDocuments: builder.query<
    GrievianceManagementDocument[],
      { status?: string; search?: string }
    >({
      query: ({ status, search }) => ({
        url: BASE_URL,
        params: {
          ...(status && { status }), // Include status if provided
          ...(search && { search }), // Include search if provided
        },
      }),
      providesTags: ["GRIEVIANCE_MANAGEMENT"],
    }),

    getGrievianceManagementDocument: builder.query<
    GrievianceManagementDocument,
      { id: string }
    >({
      query: ({ id }) => ({ url: `${BASE_URL}${id}/` }),
      providesTags: ["GRIEVIANCE_MANAGEMENT"],
    }),

    createGrievianceManagementDocument: builder.mutation<
    GrievianceManagementDocument,
      Partial<GrievianceManagementDocument>
    >({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["GRIEVIANCE_MANAGEMENT"],
    }),

    updateGrievianceManagementDocument: builder.mutation<
    GrievianceManagementDocument,
      { id: string; body: Partial<GrievianceManagementDocument> }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["GRIEVIANCE_MANAGEMENT"],
    }),
    deleteGrievianceManagementDocument: builder.mutation<
    GrievianceManagementDocument,
      { id: string; }
    >({
      query: ({ id,  }) => ({
        url: `${BASE_URL}${id}/`,
        method: "DELETE", 
      }),
      invalidatesTags: ["GRIEVIANCE_MANAGEMENT"],
    }),

    patchGrievianceManagementDocument: builder.mutation<
    GrievianceManagementDocument,
      { id: string; body: Partial<GrievianceManagementDocument> }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["GRIEVIANCE_MANAGEMENT"],
    }),
  }),
});

export const {
  useCreateGrievianceManagementDocumentMutation,
  useGetGrievianceManagementDocumentQuery,
  useGetGrievianceManagementDocumentsQuery,
  useUpdateGrievianceManagementDocumentMutation,
  useDeleteGrievianceManagementDocumentMutation
} = GrievianceManagementDocumentAPI;
