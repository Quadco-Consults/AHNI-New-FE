import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { JobCategoryResponse } from "../../types/config";

// GET Operations (Queries)
export const useGetAllJobCategoriesManager = ({
  enabled = true,
}: { enabled?: boolean } = {}) => {
  return useQuery<JobCategoryResponse>({
    queryKey: ["jobCategories"],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/job-categories/");
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// Backward compatibility exports - RTK Query style
export const useGetAllJobCategories = useGetAllJobCategoriesManager;
export const useGetAllJobCategoriesQuery = useGetAllJobCategoriesManager;

// Default export for backward compatibility
const JobCategoryAPI = {
  useGetAllJobCategoriesManager,
  useGetAllJobCategories,
  useGetAllJobCategoriesQuery,
};

export default JobCategoryAPI;
