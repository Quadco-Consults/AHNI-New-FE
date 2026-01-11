"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import TableAction from "@/components/TableAction";
import Pagination from "@/components/Pagination";
import { DialogType } from "@/constants/dailogs";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { useGetAllStatesQuery, useDeleteStateMutation } from "@/features/modules/controllers/config/stateController";
import { TStateData } from "@/features/admin/types/config/state";
import { seedNigerianStates, validateStatesCompleteness, checkExistingStates } from "@/utils/seedNigerianStates";
import { useManualStateSeeder } from "@/utils/seedStatesWorkaround";
import { nigerianStatesStats, nigerianStatesData } from "@/data/nigerianStatesData";

export default function AllStates() {
  const [page, setPage] = useState(1);
  const [isSeedingStates, setIsSeedingStates] = useState(false);
  const [seedProgress, setSeedProgress] = useState({ current: 0, total: 0, stateName: "" });
  const dispatch = useAppDispatch();

  const { data: states, isFetching, refetch } = useGetAllStatesQuery({
    page,
    size: 20,
    search: ""
  });

  const [deleteState, { isLoading: isDeleteLoading }] = useDeleteStateMutation();
  const { seedStatesManually, isLoading: isManualSeedingLoading } = useManualStateSeeder();

  const onSubmit = async (id: string) => {
    try {
      await deleteState(id);
      toast.success("State deleted successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to delete state");
    }
  };

  const onUpdate = (item: TStateData) => {
    dispatch(
      openDialog({
        type: DialogType.AddStates,
        dialogProps: {
          header: "Update State",
          data: item,
          type: "update",
        },
      })
    );
  };

  const onAdd = () => {
    dispatch(
      openDialog({
        type: DialogType.AddStates,
        dialogProps: {
          header: "Add New State",
        },
      })
    );
  };

  const handleSeedStates = async () => {
    setIsSeedingStates(true);
    setSeedProgress({ current: 0, total: nigerianStatesStats.totalStates, stateName: "" });

    // Open console to see debug logs
    console.log("🔧 Starting states seeding process (using form workaround)...");

    try {
      const result = await seedStatesManually((current, total, stateName) => {
        setSeedProgress({ current, total, stateName });
      });

      console.log("📊 Manual seeding result:", result);

      if (result.success && result.data) {
        if (result.data.created > 0) {
          toast.success(
            `🔧 States seeded successfully! Created: ${result.data.created}, Errors: ${result.data.errors}`,
            { duration: 5000 }
          );
          // Refresh the states list
          refetch();
        } else if (result.data.errors > 0) {
          toast.error(
            `❌ Failed to seed states! All ${result.data.errors} states failed to create. Check console for details.`,
            { duration: 8000 }
          );
          console.error("💡 Manual seeding failed. This might indicate issues with the state creation API or validation.");
          console.log("📋 Failed state details:", result.data.details);
        } else {
          toast.info("No states needed to be created.");
        }
      } else {
        toast.error(result.message || "Failed to seed states");
        console.error("❌ Manual seeding failed:", result.message);
      }
    } catch (error: any) {
      toast.error(error?.message || "An error occurred while seeding states");
      console.error("❌ Manual seeding error:", error);
    } finally {
      setIsSeedingStates(false);
      setSeedProgress({ current: 0, total: 0, stateName: "" });
    }
  };

  const handleTestAPI = async () => {
    console.log("🧪 Testing States API...");
    try {
      const existingStates = await checkExistingStates();
      console.log("✅ API test completed. Existing states:", existingStates);
      toast.success(`API test completed. Found ${existingStates.length} existing states. Check console for details.`);
    } catch (error: any) {
      console.error("❌ API test failed:", error);
      toast.error(`API test failed: ${error?.message || "Unknown error"}. Check console for details.`);
    }
  };

  const currentStateCount = states?.data?.pagination?.count || 0;
  const expectedStateCount = nigerianStatesStats.totalStates;
  const isIncomplete = currentStateCount < expectedStateCount;

  return (
    <div>
      {/* Header */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Nigerian States</h2>
            <p className="text-muted-foreground">
              Manage the 36 Nigerian states and the Federal Capital Territory
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={handleTestAPI}
              disabled={isSeedingStates || isDeleteLoading || isManualSeedingLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              🧪 Test API
            </Button>
            {isIncomplete && (
              <Button
                onClick={handleSeedStates}
                disabled={isSeedingStates || isDeleteLoading || isManualSeedingLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSeedingStates ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Seeding... ({seedProgress.current}/{seedProgress.total})</span>
                  </div>
                ) : (
                  `🔧 Auto-Populate States (${expectedStateCount - currentStateCount} missing)`
                )}
              </Button>
            )}
            <Button
              onClick={onAdd}
              className="bg-yellow-600 hover:bg-yellow-700"
              disabled={isDeleteLoading || isSeedingStates || isManualSeedingLoading}
            >
              Add New State
            </Button>
          </div>
        </div>

        {/* Status Info */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full ${isIncomplete ? 'bg-orange-400' : 'bg-green-400'}`}></div>
            <span className="text-gray-600">
              {currentStateCount} of {expectedStateCount} states configured
            </span>
          </div>
          {states?.data?.results && (
            <div className="text-gray-500">
              Total LGAs: {states.data.results.reduce((sum: number, state: TStateData) => sum + state.lgas, 0)}
            </div>
          )}
        </div>

        {/* Seeding Progress */}
        {isSeedingStates && seedProgress.current > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-green-800">Creating States...</span>
              <span className="text-sm text-green-600">{seedProgress.current}/{seedProgress.total}</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2 mb-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(seedProgress.current / seedProgress.total) * 100}%` }}
              ></div>
            </div>
            {seedProgress.stateName && (
              <p className="text-sm text-green-700">Currently creating: <strong>{seedProgress.stateName}</strong></p>
            )}
          </div>
        )}
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-7 gap-4 bg-gray-50 p-4 font-semibold text-gray-700 rounded-t-lg">
        <h1>State Name</h1>
        <h1>Code</h1>
        <h1>Capital</h1>
        <h1>Geopolitical Zone</h1>
        <h1>LGAs</h1>
        <h1>Status</h1>
        <h1>Actions</h1>
      </div>

      {/* Loading State */}
      {isFetching ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
          <span className="ml-2">Loading states...</span>
        </div>
      ) : (
        <>
          {/* Table Rows */}
          <div className="bg-white rounded-b-lg shadow">
            {states?.data?.results && states.data.results.length > 0 ? (
              states.data.results.map((item: TStateData) => (
                <div
                  key={item.id}
                  className="grid grid-cols-7 gap-4 p-4 border-b hover:bg-gray-50 transition-colors"
                >
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-gray-600 uppercase font-mono">{item.code}</p>
                  <p className="text-gray-600">{item.capital}</p>
                  <p className="text-gray-600">{item.zone}</p>
                  <p className="text-gray-600">{item.lgas}</p>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <TableAction
                      update
                      removeView
                      action={() => onSubmit(item.id)}
                      updateAction={() => onUpdate(item)}
                      isLoading={isDeleteLoading}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No states configured</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get started by auto-populating all 37 Nigerian states with accurate data
                  </p>
                  <div className="space-y-2 text-xs text-left bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800">What will be populated:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• 36 Nigerian states + FCT Abuja</li>
                      <li>• Correct state capitals and codes</li>
                      <li>• Geopolitical zone assignments</li>
                      <li>• Accurate LGA (Local Government Area) counts</li>
                      <li>• All states marked as active by default</li>
                    </ul>
                  </div>
                  {isIncomplete && (
                    <Button
                      onClick={handleSeedStates}
                      disabled={isSeedingStates || isManualSeedingLoading}
                      className="mt-4 bg-green-600 hover:bg-green-700 text-white"
                    >
                      🔧 Auto-Populate All States
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {states?.data?.pagination && (
            <div className="mt-6 flex justify-center">
              <Pagination
                total={states.data.pagination.count}
                itemsPerPage={states.data.pagination.page_size}
                currentPage={page}
                onChange={(newPage) => setPage(newPage)}
              />
            </div>
          )}
        </>
      )}

      {/* Stats Footer */}
      {states?.data?.pagination && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Showing {states.data.results?.length || 0} of {states.data.pagination.count} states
        </div>
      )}
    </div>
  );
}