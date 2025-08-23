import { 
  useGetVendorsQuery,
  useGetVendorListQuery, 
  useGetVendorQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useModifyVendorMutation,
  useDeleteVendorMutation
} from "./vendorsController";

// Default export for backward compatibility
const VendorsAPI = {
  useGetVendorsQuery,
  useGetVendorListQuery,
  useGetVendorQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useModifyVendorMutation,
  useDeleteVendorMutation
};

export default VendorsAPI;

// Additional missing exports
export const useGetVendors = useGetVendorsQuery;