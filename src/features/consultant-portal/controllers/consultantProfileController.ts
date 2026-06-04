import { useMutation, useQueryClient } from "@tanstack/react-query";
import ConsultantAxiosWithToken from "@/constants/api_management/ConsultantHttpHelper";

// Consultant profile update endpoint
const CONSULTANT_PROFILE_ENDPOINTS = {
  UPDATE: "/consultant-portal/auth/profile/update/",
};

// Update Consultant Profile Hook
export const useUpdateConsultantProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: {
      surname?: string;
      other_names?: string;
      state_of_origin?: string;
      qualifications?: string;
      account_name?: string;
      bank_name?: string;
      account_number?: string;
      sort_code?: string;
      tax_identification_number?: string;
    }): Promise<any> => {
      const response = await ConsultantAxiosWithToken.patch(
        CONSULTANT_PROFILE_ENDPOINTS.UPDATE,
        profileData
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log('✅ Profile updated successfully:', data);

      // Invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: ['consultant-profile'] });
    },
    onError: (error: any) => {
      console.error('❌ Profile update failed:', error);
    }
  });
};
