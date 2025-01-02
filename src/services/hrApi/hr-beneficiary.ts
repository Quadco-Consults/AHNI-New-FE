import {
    TBaseCreateResponse,
    TBasePaginatedResponse,
} from "definations/auth/auth";
import baseAPI from "..";
import { HrBeneficiaryResults } from "definations/hr-types/hr-beneficiary";

const BASE_URL = "/hr/hr-beneficiaries/";

const HrBeneficiaryAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getHrBeneficiaries: builder.query<
            TBasePaginatedResponse<HrBeneficiaryResults[]>,
            {}
        >({
            query: (config) => {
                return {
                    url: `${BASE_URL}`,
                    ...config,
                };
            },
            providesTags: ["HR_BENEFICIARIES"],
        }),
        getHrBeneficiaryList: builder.query<HrBeneficiaryResults[], {}>({
            query: (config) => {
                return {
                    url: `${BASE_URL}`,
                    ...config,
                };
            },
            providesTags: ["HR_BENEFICIARIES"],
        }),
        getHrBeneficiary: builder.query<
            HrBeneficiaryResults,
            { path: { id: string } }
        >({
            query: ({ path }) => {
                return {
                    url: `${BASE_URL}${path.id}/`,
                };
            },
            providesTags: ["HR_BENEFICIARIES"],
        }),
        createHrBeneficiary: builder.mutation<
            TBaseCreateResponse<HrBeneficiaryResults>,
            any
        >({
            query: (body) => ({
                url: `${BASE_URL}`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["HR_BENEFICIARIES"],
        }),
        updateHrBeneficiary: builder.mutation<
            TBaseCreateResponse<HrBeneficiaryResults>,
            { path: { id: string }; body: { name: string } }
        >({
            query: ({ path, body }) => ({
                url: `${BASE_URL}${path.id}/`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["HR_BENEFICIARIES"],
        }),
    }),
});

export default HrBeneficiaryAPI;
