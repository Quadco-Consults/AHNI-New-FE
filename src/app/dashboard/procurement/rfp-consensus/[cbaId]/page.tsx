"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import DataTable from "@/components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";

interface VendorScore {
  vendor_id: string;
  vendor_name: string;
  member_scores: {
    member_name: string;
    technical: number;
    financial: number;
    commercial: number;
    documents: number;
    total: number;
  }[];
  average_technical: number;
  average_financial: number;
  average_commercial: number;
  average_documents: number;
  average_total: number;
  agreement_percentage: number;
}

export default function RFPConsensusPage() {
  const params = useParams();
  const router = useRouter();
  const cbaId = params?.cbaId as string;

  const [vendorScores, setVendorScores] = useState<VendorScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cbaDetails, setCBADetails] = useState<any>(null);
  const [committeMembers, setCommitteeMembers] = useState<any[]>([]);

  useEffect(() => {
    fetchConsensusData();
  }, [cbaId]);

  const fetchConsensusData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch CBA details
      const cbaResponse = await AxiosWithToken.get(`/procurements/cbas/${cbaId}/`);
      const cba = cbaResponse.data?.data;
      setCBADetails(cba);

      // 2. Fetch all committee member evaluations for this CBA
      const evaluationsResponse = await AxiosWithToken.get('/procurements/committee-member-evaluations/', {
        params: {
          cba: cbaId,
          page: 1,
          size: 1000,
        }
      });

      const evaluations = evaluationsResponse.data?.data?.results || [];

      // 3. Fetch committee members
      const membersData = cba?.committee_members || [];
      setCommitteeMembers(membersData);

      // 4. Group evaluations by vendor
      const vendorMap = new Map<string, any>();

      evaluations.forEach((evaluation: any) => {
        const vendorId = evaluation.selected_bid_submission?.id;
        const vendorName = evaluation.selected_bid_submission?.vendor?.company_name || "Unknown Vendor";

        if (!vendorId) return;

        if (!vendorMap.has(vendorId)) {
          vendorMap.set(vendorId, {
            vendor_id: vendorId,
            vendor_name: vendorName,
            member_scores: [],
          });
        }

        const technicalScore = evaluation.technical_score || 0;
        const financialScore = evaluation.financial_score || 0;
        const commercialScore = evaluation.commercial_score || 0;
        const documentsScore = evaluation.evaluation_criteria_data?.documents_score || 0;

        vendorMap.get(vendorId).member_scores.push({
          member_name: evaluation.member_name,
          technical: technicalScore,
          financial: financialScore,
          commercial: commercialScore,
          documents: documentsScore,
          total: technicalScore + financialScore + commercialScore + documentsScore,
        });
      });

      // 5. Calculate averages and agreement for each vendor
      const processedVendors: VendorScore[] = Array.from(vendorMap.values()).map((vendor) => {
        const scores = vendor.member_scores;
        const count = scores.length;

        if (count === 0) {
          return {
            ...vendor,
            average_technical: 0,
            average_financial: 0,
            average_commercial: 0,
            average_documents: 0,
            average_total: 0,
            agreement_percentage: 0,
          };
        }

        const avgTech = scores.reduce((sum: number, s: any) => sum + s.technical, 0) / count;
        const avgFin = scores.reduce((sum: number, s: any) => sum + s.financial, 0) / count;
        const avgComm = scores.reduce((sum: number, s: any) => sum + s.commercial, 0) / count;
        const avgDocs = scores.reduce((sum: number, s: any) => sum + s.documents, 0) / count;
        const avgTotal = avgTech + avgFin + avgComm + avgDocs;

        // Calculate agreement (based on total score variance)
        const totalScores = scores.map((s: any) => s.total);
        const meanTotal = totalScores.reduce((a: number, b: number) => a + b, 0) / totalScores.length;
        const variance = totalScores.reduce((sum: number, score: number) => sum + Math.pow(score - meanTotal, 2), 0) / totalScores.length;
        const stdDev = Math.sqrt(variance);
        const agreementPct = Math.max(0, 100 - (stdDev * 2)); // Simple agreement metric

        return {
          ...vendor,
          average_technical: Math.round(avgTech * 10) / 10,
          average_financial: Math.round(avgFin * 10) / 10,
          average_commercial: Math.round(avgComm * 10) / 10,
          average_documents: Math.round(avgDocs * 10) / 10,
          average_total: Math.round(avgTotal * 10) / 10,
          agreement_percentage: Math.round(agreementPct),
        };
      });

      // Sort by average total descending
      processedVendors.sort((a, b) => b.average_total - a.average_total);

      setVendorScores(processedVendors);
    } catch (error: any) {
      console.error("Error fetching consensus data:", error);
      toast.error("Failed to load consensus data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const topVendor = vendorScores.length > 0 ? vendorScores[0] : null;
  const completionRate = committeMembers.length > 0
    ? ((vendorScores[0]?.member_scores.length || 0) / committeMembers.length) * 100
    : 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()} variant="ghost" size="sm">
            <Icon icon="mdi:arrow-left" className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">RFP Committee Consensus</h1>
            <p className="text-gray-600 mt-1">Aggregated evaluation scores from all committee members</p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Committee Members</p>
              <p className="text-3xl font-bold text-blue-700 mt-1">{committeMembers.length}</p>
            </div>
            <Icon icon="mdi:account-group" className="w-12 h-12 text-blue-600 opacity-20" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Vendors Evaluated</p>
              <p className="text-3xl font-bold text-green-700 mt-1">{vendorScores.length}</p>
            </div>
            <Icon icon="mdi:domain" className="w-12 h-12 text-green-600 opacity-20" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Completion Rate</p>
              <p className="text-3xl font-bold text-purple-700 mt-1">{Math.round(completionRate)}%</p>
            </div>
            <Icon icon="mdi:progress-check" className="w-12 h-12 text-purple-600 opacity-20" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Average Agreement</p>
              <p className="text-3xl font-bold text-yellow-700 mt-1">
                {vendorScores.length > 0
                  ? Math.round(vendorScores.reduce((sum, v) => sum + v.agreement_percentage, 0) / vendorScores.length)
                  : 0}%
              </p>
            </div>
            <Icon icon="mdi:handshake" className="w-12 h-12 text-yellow-600 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Recommended Vendor */}
      {topVendor && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-green-300">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center">
              <Icon icon="mdi:trophy" className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900">Recommended Vendor (Highest Average Score)</h3>
              <p className="text-2xl font-bold text-green-700 mt-1">{topVendor.vendor_name}</p>
              <p className="text-sm text-green-600 mt-1">
                Average Score: <span className="font-bold">{topVendor.average_total}/100</span> |
                Agreement: <span className="font-bold">{topVendor.agreement_percentage}%</span>
              </p>
            </div>
            <Badge className="bg-green-600 text-white text-lg px-4 py-2">
              {topVendor.average_total >= 70 ? "QUALIFIED" : "BELOW THRESHOLD"}
            </Badge>
          </div>
        </Card>
      )}

      {/* Vendor Scores Table */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Icon icon="mdi:chart-bar" className="w-6 h-6" />
          Vendor Average Scores
        </h3>

        {vendorScores.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="mdi:clipboard-alert" className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No evaluations submitted yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Rank</th>
                  <th className="px-4 py-3 text-left font-semibold">Vendor Name</th>
                  <th className="px-4 py-3 text-center font-semibold">Technical<br/>(40)</th>
                  <th className="px-4 py-3 text-center font-semibold">Financial<br/>(20)</th>
                  <th className="px-4 py-3 text-center font-semibold">Commercial<br/>(30)</th>
                  <th className="px-4 py-3 text-center font-semibold">Documents<br/>(10)</th>
                  <th className="px-4 py-3 text-center font-semibold">Total<br/>(100)</th>
                  <th className="px-4 py-3 text-center font-semibold">Agreement</th>
                  <th className="px-4 py-3 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {vendorScores.map((vendor, index) => (
                  <tr key={vendor.vendor_id} className={index === 0 ? "bg-green-50" : ""}>
                    <td className="px-4 py-4 text-center">
                      {index === 0 && <Icon icon="mdi:medal" className="w-6 h-6 text-yellow-500 mx-auto" />}
                      {index > 0 && <span className="font-bold text-gray-600">#{index + 1}</span>}
                    </td>
                    <td className="px-4 py-4 font-medium">{vendor.vendor_name}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="font-semibold text-blue-600">{vendor.average_technical}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="font-semibold text-green-600">{vendor.average_financial}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="font-semibold text-purple-600">{vendor.average_commercial}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="font-semibold text-orange-600">{vendor.average_documents}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-xl font-bold text-primary">{vendor.average_total}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Badge variant="outline" className={
                        vendor.agreement_percentage >= 80 ? "border-green-500 text-green-700" :
                        vendor.agreement_percentage >= 60 ? "border-yellow-500 text-yellow-700" :
                        "border-red-500 text-red-700"
                      }>
                        {vendor.agreement_percentage}%
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Badge className={
                        vendor.average_total >= 70 ? "bg-green-100 text-green-700" :
                        vendor.average_total >= 50 ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }>
                        {vendor.average_total >= 70 ? "PASS" : "FAIL"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Individual Member Scores */}
      {vendorScores.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Icon icon="mdi:account-details" className="w-6 h-6" />
            Individual Member Scores
          </h3>
          <div className="space-y-6">
            {vendorScores.map((vendor) => (
              <div key={vendor.vendor_id} className="border rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-3">{vendor.vendor_name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {vendor.member_scores.map((score, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded border">
                      <p className="font-medium text-sm mb-2">{score.member_name}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Tech: <span className="font-bold">{score.technical}</span></div>
                        <div>Fin: <span className="font-bold">{score.financial}</span></div>
                        <div>Comm: <span className="font-bold">{score.commercial}</span></div>
                        <div>Docs: <span className="font-bold">{score.documents}</span></div>
                      </div>
                      <div className="mt-2 pt-2 border-t">
                        <span className="font-bold text-primary">Total: {score.total}/100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold">Next Steps</h4>
            <p className="text-sm text-gray-600">Review consensus and proceed to committee voting</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Icon icon="mdi:download" className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <Icon icon="mdi:gavel" className="w-4 h-4 mr-2" />
              Proceed to Committee Vote
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
