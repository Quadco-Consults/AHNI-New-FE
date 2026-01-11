"use client";

export const dynamic = "force-dynamic";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Card from "@/components/Card";
import GoBack from "@/components/GoBack";
import { LoadingSpinner } from "@/components/Loading";
import CbaAPI from "@/features/procurement/controllers/cbaController";
import { useGetSolicitationSubmission } from "@/features/procurement/controllers/vendorBidSubmissionsController";
import { useGetSingleSolicitation } from "@/features/procurement/controllers/solicitationController";
import {

Users,
  Building2,
  FileText,
  BarChart,
  CheckCircle,
  ClipboardCheck,
  Eye,
  PlayCircle,
  Download,
  Shield,
  Calendar,
  Package,
  TrendingUp,
  UserCheck,
  Clock
} from 'lucide-react';
import { RouteEnum } from "@/constants/RouterConstants";
import { useState, useMemo } from "react";

const generatePath = (route: string, params?: Record<string, any>): string => {
  let path = route;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, String(value));
    });
  }
  return path;
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'APPROVED': return 'default';
    case 'REJECTED': return 'destructive';
    case 'PENDING': return 'secondary';
    case 'COMPLETED': return 'outline';
    default: return 'secondary';
  }
};

const CbaDetailsPage = () => {
  const { id } = useParams();

  const { data: cbaData, isLoading: cbaLoading } = CbaAPI.useGetSingleCba(id as string);

  // Get RFQ/Solicitation ID from CBA data
  const solicitationId = typeof cbaData?.data?.solicitation === 'object'
    ? (cbaData?.data?.solicitation as any)?.id
    : cbaData?.data?.solicitation;

  // Fetch RFQ/Solicitation details
  const { data: rfqData } = useGetSingleSolicitation(solicitationId as string, !!solicitationId);

  // Fetch vendor submissions
  const { data: submissionsData, isLoading: submissionsLoading, error: submissionsError } = useGetSolicitationSubmission(solicitationId as string, !!solicitationId);

  // Debug logging
  console.log("🔍 CBA Details Debug:", {
    cbaData: cbaData?.data,
    solicitationId,
    submissionsData,
    submissionsLoading,
    submissionsError,
    rfqData: rfqData?.data
  });

  if (cbaLoading) return <LoadingSpinner />;

  if (!cbaData?.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500">CBA not found</p>
          <GoBack />
        </div>
      </div>
    );
  }

  const vendors = submissionsData?.data?.data?.results || [];
  const totalItems = rfqData?.data?.solicitation_items?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <GoBack />
              <div className="h-8 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">CBA Details & Analysis</h1>
                <p className="text-sm text-gray-500">Complete vendor participation and workflow management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={getStatusVariant(cbaData?.data?.status) as any} className="px-4 py-2 text-sm font-medium">
                {cbaData?.data?.status || 'PENDING'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">

        {/* CBA Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart size={24} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{cbaData.data.title || 'Competitive Bid Analysis'}</h2>
                  <p className="text-gray-600 text-sm">Analysis ID: {(id as string).slice(0, 13)}...</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{vendors.length}</div>
                <div className="text-sm text-gray-600">Vendors</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{totalItems}</div>
                <div className="text-sm text-gray-600">Items</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{cbaData.data.cba_type || 'Standard'}</div>
                <div className="text-sm text-gray-600">Type</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {cbaData.data.cba_date ? new Date(cbaData.data.cba_date).toLocaleDateString() : 'Not Set'}
                </div>
                <div className="text-sm text-gray-600">Date</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PlayCircle size={20} className="mr-2 text-blue-600" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link href={`/dashboard/procurement/competitive-bid-analysis/${id}/vendor-analysis?id=${solicitationId}&cba=${id}`} className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <ClipboardCheck size={16} />
                  Conduct Analysis
                </Button>
              </Link>
              <Link href={`/dashboard/procurement/competitive-bid-analysis/${id}/analysis-results`} className="w-full">
                <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                  <BarChart size={16} />
                  View Results
                </Button>
              </Link>
              <Link href={`/dashboard/procurement/competitive-bid-analysis/${id}/check-approval`} className="w-full">
                <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50">
                  <Shield size={16} />
                  Approve Results
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Vendor Participation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Users size={24} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Vendor Participation</h3>
                  <p className="text-gray-600 text-sm">
                    {vendors.length} vendors participated in RFQ: {rfqData?.data?.rfq_id || 'N/A'}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 px-4 py-2">
                {vendors.length} Submissions
              </Badge>
            </div>
          </div>

          <div className="p-6">
            {vendors.length === 0 ? (
              <div className="text-center py-12">
                <Users size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No vendor submissions yet</p>
                <p className="text-gray-400 text-sm">Vendors will appear here once they submit their bids</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendors.map((vendor: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Building2 size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {vendor.vendor?.company_name || vendor.company_name || 'Unknown Vendor'}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {vendor.vendor?.type_of_business || 'Business Type Not Specified'}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={vendor.status === 'SUBMITTED' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {vendor.status || 'Unknown'}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Registration:</span>
                        <span className="font-mono text-gray-900">
                          {vendor.vendor?.company_registration_number || vendor.company_registration_number || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="text-gray-900">{vendor.vendor?.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Bid Status:</span>
                        <Badge variant="outline" className="text-xs">
                          {vendor.bid_details?.status || 'Unknown'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RFQ Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">RFQ Information</h3>
                <p className="text-gray-600 text-sm">Details of the Request for Quotation</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">RFQ ID</span>
                  <span className="text-sm text-gray-900 font-mono">{rfqData?.data?.rfq_id || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Title</span>
                  <span className="text-sm text-gray-900">{rfqData?.data?.title || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Type</span>
                  <span className="text-sm text-gray-900">{rfqData?.data?.tender_type || 'N/A'}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Opening Date</span>
                  <span className="text-sm text-gray-900">
                    {rfqData?.data?.opening_date ? new Date(rfqData.data.opening_date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Closing Date</span>
                  <span className="text-sm text-gray-900">
                    {rfqData?.data?.closing_date ? new Date(rfqData.data.closing_date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <Badge variant="outline">{rfqData?.data?.status || 'Unknown'}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Workflow */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Analysis Workflow</h3>
              <p className="text-gray-600 text-sm">Manage the complete bid analysis process</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href={`/dashboard/procurement/competitive-bid-analysis/${id}/vendor-analysis?id=${solicitationId}&cba=${id}`} className="block">
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <ClipboardCheck size={24} className="text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Conduct Analysis</h4>
                <p className="text-gray-600 text-sm mb-4">Evaluate vendor submissions and perform comparative analysis</p>
                <Button className="w-full">
                  Start Analysis
                </Button>
              </div>
            </Link>

            <Link href={`/dashboard/procurement/competitive-bid-analysis/${id}/analysis-results`} className="block">
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-green-300">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart size={24} className="text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">View Results</h4>
                <p className="text-gray-600 text-sm mb-4">Review analysis results and vendor recommendations</p>
                <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                  View Results
                </Button>
              </div>
            </Link>

            <Link href={`/dashboard/procurement/competitive-bid-analysis/${id}/check-approval`} className="block">
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-purple-300">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield size={24} className="text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Approve Results</h4>
                <p className="text-gray-600 text-sm mb-4">Final approval and authorization of analysis results</p>
                <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50">
                  Review for Approval
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CbaDetailsPage;