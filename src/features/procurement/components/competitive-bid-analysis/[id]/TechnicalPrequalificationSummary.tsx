"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Card from "components/Card";
import { Loading } from "components/Loading";
import GoBack from "components/GoBack";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import CbaAPI from "@/features/procurement/controllers/cbaController";
import ManualBidCbaPrequalificationAPI from "@/features/procurement/controllers/manualBidCbaPrequalificationController";
import logoPng from "@/assets/svgs/logo-bg.svg";

interface VendorSubmission {
  id: string;
  vendor_name: string;
  criteria_results: {
    criteria: string;
    passed: boolean;
    stage: string;
  }[];
  overall_status: "PASS" | "FAIL";
}

const TechnicalPrequalificationSummary = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const cbaId = searchParams?.get('cba') || id;
  const solicitationId = searchParams?.get('id');

  const { data: cbaData, isLoading: cbaLoading } = CbaAPI.useGetSingleCba(cbaId as string);
  const { data: prequalificationData, isLoading: prequalLoading } =
    ManualBidCbaPrequalificationAPI.useGetAllManualBidCbaPrequalifications({
      page: 1,
      size: 100,
      search: cbaId as string,
    });

  const [vendorSummaries, setVendorSummaries] = useState<VendorSubmission[]>([]);

  useEffect(() => {
    if (prequalificationData?.results) {
      // Filter results for this specific CBA and group by vendor/bid_submission
      const cbaResults = prequalificationData.results.filter((item: any) =>
        item.cba === cbaId
      );

      const grouped = cbaResults.reduce((acc: any, item: any) => {
        const key = item.bid_submission;
        if (!acc[key]) {
          acc[key] = {
            id: key,
            vendor_name: `Vendor ${key.slice(0, 8)}`, // Simplified - you might want to fetch actual vendor names
            criteria_results: [],
            overall_status: "PASS" as const
          };
        }

        acc[key].criteria_results.push({
          criteria: item.criteria,
          passed: item.passed,
          stage: item.stage
        });

        // If any criteria failed, mark overall as FAIL
        if (!item.passed) {
          acc[key].overall_status = "FAIL";
        }

        return acc;
      }, {});

      setVendorSummaries(Object.values(grouped));
    }
  }, [prequalificationData, cbaId]);

  if (cbaLoading || prequalLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <GoBack />

      <div className="bg-white p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-center items-center flex-col">
          <img src={logoPng} alt="logo" width={200} />
        </div>

        {/* Title Section */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-primary">
            COMPETITIVE BID ANALYSIS
          </h1>
          <h2 className="text-xl font-semibold">
            TECHNICAL PREQUALIFICATION SUMMARY
          </h2>
          <p className="text-lg">
            Project: {typeof cbaData?.data?.solicitation === 'object'
              ? (cbaData?.data?.solicitation as any)?.title
              : 'N/A'}
          </p>
        </div>

        {/* Stage 1 & 2 Summary */}
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-center text-primary">
            STAGE 1 & 2 - TECHNICAL PREQUALIFICATION SUMMARY
          </h3>
          <h4 className="text-center font-medium">OVERALL ASSESSMENT STATUS</h4>

          {vendorSummaries.length > 0 ? (
            <DataTable
              columns={technicalColumns}
              data={vendorSummaries}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No vendor submissions found</p>
              <p className="text-sm">
                Technical prequalification assessments will appear here once completed.
              </p>
            </div>
          )}
        </Card>

        {/* Stage 3 Summary (Financial) */}
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-center text-primary">
            STAGE 3 - FINANCIAL PREQUALIFICATION SUMMARY
          </h3>
          <h4 className="text-center font-medium">OVERALL ASSESSMENT STATUS</h4>

          <DataTable
            columns={financialColumns}
            data={vendorSummaries.filter(v => v.criteria_results.some(c => c.stage === "FINANCIAL"))}
          />

          {vendorSummaries.filter(v => v.criteria_results.some(c => c.stage === "FINANCIAL")).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No vendor submissions found</p>
              <p className="text-sm">
                Financial prequalification assessments will appear here once completed.
              </p>
            </div>
          )}
        </Card>

        {/* Summary Statistics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Assessment Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="text-2xl font-bold text-blue-600">
                {vendorSummaries.length}
              </h4>
              <p className="text-sm text-gray-600">Total Vendors Assessed</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="text-2xl font-bold text-green-600">
                {vendorSummaries.filter(v => v.overall_status === "PASS").length}
              </h4>
              <p className="text-sm text-gray-600">Vendors Passed</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <h4 className="text-2xl font-bold text-red-600">
                {vendorSummaries.filter(v => v.overall_status === "FAIL").length}
              </h4>
              <p className="text-sm text-gray-600">Vendors Failed</p>
            </div>
          </div>
        </Card>

        {/* Committee Members Signature Section */}
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-center">
            Review Conducted, Scores Awarded as agreed by the Procurement Committee Members:
          </h3>
          <DataTable
            columns={committeeColumns}
            data={cbaData?.data?.committee_members || []}
          />
        </Card>
      </div>
    </div>
  );
};

export default TechnicalPrequalificationSummary;

// Technical Prequalification Columns
const technicalColumns: ColumnDef<VendorSubmission>[] = [
  {
    header: "S/N",
    cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
    size: 50,
  },
  {
    header: "BIDDER NAME",
    accessorKey: "vendor_name",
    size: 200,
  },
  {
    header: "CRITERIA 1",
    cell: ({ row }) => {
      const criteria1 = row.original.criteria_results.find(c =>
        c.criteria.includes("COMPLETENESS AND CONFORMITY") || c.stage === "TECHNICAL"
      );
      return (
        <Badge className={cn(
          criteria1?.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          {criteria1?.passed ? "PASS" : "FAIL"}
        </Badge>
      );
    },
  },
  {
    header: "CRITERIA 2",
    cell: ({ row }) => {
      const criteria2 = row.original.criteria_results.find(c =>
        c.criteria.includes("ESSENTIAL AND LEGAL")
      );
      return (
        <Badge className={cn(
          criteria2?.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          {criteria2?.passed ? "PASS" : "FAIL"}
        </Badge>
      );
    },
  },
  {
    header: "CRITERIA 3",
    cell: ({ row }) => {
      const criteria3 = row.original.criteria_results.find(c =>
        c.criteria.includes("TAX CLEARANCE")
      );
      return (
        <Badge className={cn(
          criteria3?.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          {criteria3?.passed ? "PASS" : "FAIL"}
        </Badge>
      );
    },
  },
  {
    header: "CRITERIA 4",
    cell: ({ row }) => {
      const criteria4 = row.original.criteria_results.find(c =>
        c.criteria.includes("GOOD FINANCIAL")
      );
      return (
        <Badge className={cn(
          criteria4?.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          {criteria4?.passed ? "PASS" : "FAIL"}
        </Badge>
      );
    },
  },
  {
    header: "CRITERIA 5",
    cell: ({ row }) => {
      const criteria5 = row.original.criteria_results.find(c =>
        c.criteria.includes("BANK REFERENCE")
      );
      return (
        <Badge className={cn(
          criteria5?.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          {criteria5?.passed ? "PASS" : "FAIL"}
        </Badge>
      );
    },
  },
  {
    header: "CRITERIA 6",
    cell: ({ row }) => {
      const criteria6 = row.original.criteria_results.find(c =>
        c.criteria.includes("ORIGINAL EQUIPMENT")
      );
      return (
        <Badge className={cn(
          criteria6?.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          {criteria6?.passed ? "PASS" : "FAIL"}
        </Badge>
      );
    },
  },
  {
    header: "CRITERIA 7",
    cell: ({ row }) => {
      const criteria7 = row.original.criteria_results.find(c =>
        c.criteria.includes("PREVIOUS JOB")
      );
      return (
        <Badge className={cn(
          criteria7?.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          {criteria7?.passed ? "PASS" : "FAIL"}
        </Badge>
      );
    },
  },
  {
    header: "OVERALL ASSESSMENT STATUS",
    cell: ({ row }) => (
      <Badge className={cn(
        "font-bold",
        row.original.overall_status === "PASS"
          ? "bg-green-200 text-green-800"
          : "bg-red-200 text-red-800"
      )}>
        {row.original.overall_status}
      </Badge>
    ),
  },
];

// Financial Prequalification Columns
const financialColumns: ColumnDef<VendorSubmission>[] = [
  {
    header: "S/N",
    cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
    size: 50,
  },
  {
    header: "BIDDER NAME",
    accessorKey: "vendor_name",
    size: 200,
  },
  {
    header: "CRITERIA 1",
    cell: ({ row }) => {
      const financialCriteria = row.original.criteria_results.find(c =>
        c.stage === "FINANCIAL"
      );
      return (
        <Badge className={cn(
          financialCriteria?.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          {financialCriteria?.passed ? "PASS" : "FAIL"}
        </Badge>
      );
    },
  },
  {
    header: "OVERALL ASSESSMENT STATUS",
    cell: ({ row }) => {
      const hasFinancial = row.original.criteria_results.some(c => c.stage === "FINANCIAL");
      if (!hasFinancial) return <span className="text-gray-400">N/A</span>;

      const financialPassed = row.original.criteria_results
        .filter(c => c.stage === "FINANCIAL")
        .every(c => c.passed);

      return (
        <Badge className={cn(
          "font-bold",
          financialPassed ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
        )}>
          {financialPassed ? "PASS" : "FAIL"}
        </Badge>
      );
    },
  },
];

// Committee Members Columns
const committeeColumns: ColumnDef<any>[] = [
  {
    header: "Name",
    cell: ({ row }) => `${row.original.first_name} ${row.original.last_name}`,
  },
  {
    header: "Designation",
    accessorKey: "designation",
  },
  {
    header: "Signature",
    cell: () => <div className="h-8 border-b border-gray-300 w-32"></div>,
  },
  {
    header: "Date",
    cell: () => <div className="h-8 border-b border-gray-300 w-24"></div>,
  },
];