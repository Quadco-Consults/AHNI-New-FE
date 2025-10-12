"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import BackNavigation from "@/components/atoms/BackNavigation";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, MapPin, User, Building2, Calendar, CheckCircle, XCircle } from "lucide-react";
import { useGetSingleStore } from "@/features/admin/controllers/storeController";
import { AdminRoutes } from "@/constants/RouterConstants";
import { cn } from "@/lib/utils";

interface StoreDetailPageProps {
  storeId: string;
}

export default function StoreDetailPage({ storeId }: StoreDetailPageProps) {
  const router = useRouter();
  const { data: storeData, isLoading } = useGetSingleStore(storeId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!storeData?.data) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Store not found</p>
      </div>
    );
  }

  const store = storeData.data;

  return (
    <div className="space-y-6">
      <BackNavigation extraText="Store Details" />

      {/* Header Card */}
      <Card>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
              <Badge
                variant="outline"
                className={cn(
                  "font-medium",
                  store.is_active
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-red-100 text-red-800 border-red-200"
                )}
              >
                {store.is_active ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Inactive
                  </>
                )}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "font-medium",
                  store.store_type === "CENTRAL"
                    ? "bg-purple-100 text-purple-800 border-purple-200"
                    : "bg-blue-100 text-blue-800 border-blue-200"
                )}
              >
                {store.store_type === "CENTRAL" ? "Central Store" : "Location Store"}
              </Badge>
            </div>
            <p className="text-gray-600">Store Code: <span className="font-mono font-semibold">{store.code}</span></p>
            {store.description && (
              <p className="text-gray-700">{store.description}</p>
            )}
          </div>
          <Button
            onClick={() => router.push(`${AdminRoutes.STORES}/create?id=${storeId}`)}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Store
          </Button>
        </div>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location Information */}
        <Card>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-700 font-medium">
                {store.location?.name || "N/A"}
              </p>
              {store.location?.description && (
                <p className="text-sm text-gray-500 mt-1">
                  {store.location.description}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Store Keeper Information */}
        <Card>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Store Keeper</h3>
              <p className="text-gray-700 font-medium">
                {store.store_keeper?.first_name} {store.store_keeper?.last_name}
              </p>
              <p className="text-sm text-gray-500">
                {store.store_keeper?.email}
              </p>
              {store.store_keeper?.mobile_number && (
                <p className="text-sm text-gray-500">
                  {store.store_keeper.mobile_number}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Parent Store (if applicable) */}
        {store.parent_store && (
          <Card>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Parent Store</h3>
                <p className="text-gray-700 font-medium">
                  {store.parent_store.name}
                </p>
                <p className="text-sm text-gray-500 font-mono">
                  {store.parent_store.code}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Audit Information */}
        <Card>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Audit Information</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900">
                    {format(new Date(store.created_datetime), "dd MMM yyyy, HH:mm")}
                  </span>
                </div>
                {store.created_by && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created By:</span>
                    <span className="text-gray-900">
                      {store.created_by.first_name} {store.created_by.last_name}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="text-gray-900">
                    {format(new Date(store.updated_datetime), "dd MMM yyyy, HH:mm")}
                  </span>
                </div>
                {store.updated_by && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Updated By:</span>
                    <span className="text-gray-900">
                      {store.updated_by.first_name} {store.updated_by.last_name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Future: Inventory Summary Section */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Inventory Summary
        </h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-500">
            Inventory tracking will be available in Phase 2
          </p>
          <p className="text-sm text-gray-400 mt-2">
            This section will display total items, stock levels, and recent transactions
          </p>
        </div>
      </Card>
    </div>
  );
}
