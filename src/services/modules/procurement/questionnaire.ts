import baseAPI from "services/index";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    TQuestionnaireData,
    TQuestionnaireFormValues,
} from "definations/modules/procurement/questionnaire";

const QuestionnaireAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllQuestionnaires: builder.query<
            TPaginatedResponse<TQuestionnaireData>,
            TRequest
        >({
            query: (params) => ({
                url: "/procurements/questionaire/",
                params,
            }),
            providesTags: ["Questionairs"],
        }),

        addQuestionnaire: builder.mutation<
            TResponse<TQuestionnaireData>,
            TQuestionnaireFormValues
        >({
            query: (body) => ({
                url: "/procurements/questionaire/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Questionairs"],
        }),

        updateQuestionnaire: builder.mutation<
            TResponse<TQuestionnaireData>,
            { id: string; body: TQuestionnaireFormValues }
        >({
            query: ({ id, body }) => ({
                url: `/procurements/questionaire/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["Questionairs"],
        }),

        deleteQuestionnaire: builder.mutation<
            TResponse<TQuestionnaireData>,
            string
        >({
            query: (id) => ({
                url: `/procurements/questionaire/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Questionairs"],
        }),
    }),
});

export const {
    useGetAllQuestionnairesQuery,
    useAddQuestionnaireMutation,
    useUpdateQuestionnaireMutation,
    useDeleteQuestionnaireMutation,
} = QuestionnaireAPI;
