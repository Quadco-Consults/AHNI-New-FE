"use client";

import React, { useMemo } from "react";
import { useGetSingleSubGrant } from "@/features/contracts-grants/controllers/subGrantController";
import { useGetAwardsBySubGrant } from "@/features/contracts-grants/controllers/subGrantAwardController";
import { LoadingSpinner } from "components/Loading";
import { formatNumberCurrency } from "utils/utls";

interface AwardDetailsTabProps {
  subGrantId: string;
}

const AwardDetailsTab: React.FC<AwardDetailsTabProps> = ({ subGrantId }) => {
  const { data, isLoading } = useGetSingleSubGrant(subGrantId, !!subGrantId);
  const { data: awardsData, isLoading: isLoadingAwards } = useGetAwardsBySubGrant(subGrantId, !!subGrantId);

  const subGrant = data?.data;


  // Get the top-ranked award from the awards data
  const awardData = useMemo(() => {
    if (!awardsData?.data) return null;

    // useGetAwardsBySubGrant returns ApiResponse<SubGrantAward[]>, so data is directly an array
    const awards = Array.isArray(awardsData.data) ? awardsData.data : [awardsData.data];
    // Get the top-ranked award
    return awards.find((a: any) => a.rank === 1) || awards[0] || null;
  }, [awardsData]);

  if (isLoading || isLoadingAwards) {
    return <LoadingSpinner />;
  }

  // Calculate analytics
  const totalAward = parseFloat(subGrant?.amount_usd || "0");
  const totalObligation = parseFloat(subGrant?.total_obligation_amount || "0");
  const totalExpenditure = parseFloat(subGrant?.total_expenditure_amount || "0");

  // Pipeline = Total Award - Total Obligation
  const pipeline = totalAward - totalObligation;

  // Burn Rate = Total Expenditure / Total Obligation (if obligation > 0)
  const burnRate = totalObligation > 0 ? (totalExpenditure / totalObligation) * 100 : 0;

  // Money Month Remaining calculation
  // First, calculate months elapsed and remaining
  const startDate = subGrant?.start_date ? new Date(subGrant.start_date) : null;
  const endDate = subGrant?.end_date ? new Date(subGrant.end_date) : null;
  const today = new Date();

  let moneyMonthRemaining = "N/A";
  if (startDate && endDate && totalExpenditure > 0) {
    const totalMonths = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    const monthsElapsed = (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    const monthsRemaining = Math.max(0, totalMonths - monthsElapsed);

    // Average monthly burn
    const avgMonthlyBurn = totalExpenditure / Math.max(monthsElapsed, 1);

    // Remaining funds
    const remainingFunds = totalObligation - totalExpenditure;

    // Money months remaining = Remaining funds / Average monthly burn
    if (avgMonthlyBurn > 0) {
      const mmr = remainingFunds / avgMonthlyBurn;
      moneyMonthRemaining = mmr.toFixed(2);
    }
  }

  const awardee = awardData?.submission;

  return (
    <section className="w-full flex flex-col space-y-5">
      {/* Grant Analytics */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold border-b pb-3 mb-4">Grant Analytics</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200">
            <label className="text-sm font-medium text-blue-700">Pipeline</label>
            <p className="text-3xl font-bold text-blue-900 mt-2">
              {formatNumberCurrency(pipeline.toString(), "USD")}
            </p>
            <p className="text-xs text-blue-600 mt-1">Unobligated funds</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200">
            <label className="text-sm font-medium text-green-700">Burn Rate</label>
            <p className="text-3xl font-bold text-green-900 mt-2">
              {burnRate.toFixed(2)}%
            </p>
            <p className="text-xs text-green-600 mt-1">Expenditure vs Obligation</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg border border-purple-200">
            <label className="text-sm font-medium text-purple-700">Money Months Remaining</label>
            <p className="text-3xl font-bold text-purple-900 mt-2">
              {moneyMonthRemaining}
            </p>
            <p className="text-xs text-purple-600 mt-1">Based on avg. burn rate</p>
          </div>
        </div>
      </div>

      {/* Awardee Information */}
      {awardee && (
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold border-b pb-3 mb-4">Awardee Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Organization Name</label>
              <p className="text-base mt-1 font-semibold">{awardee.organisation_name || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Organization Type</label>
              <p className="text-base mt-1">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {awardee.organisation_type || "N/A"}
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-base mt-1">{awardee.email || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone Number</label>
              <p className="text-base mt-1">{awardee.phone_number || "N/A"}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-600">Address</label>
              <p className="text-base mt-1">{awardee.address || "N/A"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Award Information Card */}
      <div className="bg-white border rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold border-b pb-3">Award Information</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Sub-Grant Title</label>
              <p className="text-base mt-1">{subGrant?.title || "N/A"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Award Type</label>
              <p className="text-base mt-1">{subGrant?.award_type || "N/A"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Amount (USD)</label>
              <p className="text-base mt-1 font-semibold">
                {formatNumberCurrency(subGrant?.amount_usd || "0", "USD")}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Amount (NGN)</label>
              <p className="text-base mt-1 font-semibold">
                {formatNumberCurrency(subGrant?.amount_ngn || "0", "NGN")}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <p className="text-base mt-1">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  subGrant?.status === "AWARDED"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {subGrant?.status || "N/A"}
                </span>
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Project Name</label>
              <p className="text-base mt-1">{subGrant?.project?.title || "N/A"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Project ID</label>
              <p className="text-base mt-1">{subGrant?.project?.project_id || "N/A"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Start Date</label>
              <p className="text-base mt-1">
                {subGrant?.start_date
                  ? new Date(subGrant.start_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">End Date</label>
              <p className="text-base mt-1">
                {subGrant?.end_date
                  ? new Date(subGrant.end_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Intervention Area</label>
              <p className="text-base mt-1">
                {subGrant?.project?.intervention_area?.description ||
                 subGrant?.project?.intervention_area?.name ||
                 subGrant?.project?.intervention_area ||
                 "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {subGrant?.description && (
          <div className="pt-4 border-t">
            <label className="text-sm font-medium text-gray-600">Description</label>
            <p className="text-base mt-2 text-gray-700">{subGrant.description}</p>
          </div>
        )}
      </div>

      {/* Funding Source */}
      {subGrant?.project?.funding_sources && subGrant.project.funding_sources.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold border-b pb-3 mb-4">Funding Source</h2>
          <div className="space-y-2">
            {subGrant.project.funding_sources.map((source: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                <span className="text-base">{source.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Summary */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold border-b pb-3 mb-4">Financial Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <label className="text-sm font-medium text-blue-700">Total Award Amount</label>
            <p className="text-2xl font-bold text-blue-900 mt-2">
              {formatNumberCurrency(subGrant?.amount_usd || "0", "USD")}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <label className="text-sm font-medium text-green-700">Total Obligations</label>
            <p className="text-2xl font-bold text-green-900 mt-2">
              {formatNumberCurrency(subGrant?.total_obligation_amount || "0", "USD")}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <label className="text-sm font-medium text-red-700">Total Expenditures</label>
            <p className="text-2xl font-bold text-red-900 mt-2">
              {formatNumberCurrency(subGrant?.total_expenditure_amount || "0", "USD")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardDetailsTab;
