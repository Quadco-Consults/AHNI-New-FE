"use client";

import Card from "@/components/Card";
import { consultancyReportColumns } from "@/features/contracts-grants/components/table-columns/contract-management/consultancy-report";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { Button } from "@/components/ui/button";
import { CG_ROUTES } from "@/constants/RouterConstants";
import { Plus, Search, Filter as FilterIcon } from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllConsultancyReports } from "@/features/contracts-grants/controllers/consultancyReportController";
import { useGetAllConsultancyApplicants } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { useGetAllConsultantManagements } from "@/features/contracts-grants/controllers/consultantManagementController";

export default function ConsultancyReport() {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [consultantFilter, setConsultantFilter] = useState<string>("");

    const { data, isFetching } = useGetAllConsultancyReports({
        page,
        size: 10,
        status: statusFilter === "all" ? "" : statusFilter,
    });

    // Fetch consultancy applicants to map consultant names
    const { data: applicantsData } = useGetAllConsultancyApplicants({
        page: 1,
        size: 2000000,
    });

    // Fetch consultant management records to match titles to IDs
    const { data: consultantManagementsData } = useGetAllConsultantManagements({
        page: 1,
        size: 2000000,
        type: "",
    });

    // Create mappings for consultant names
    const { consultantIdToName, titleToId } = useMemo(() => {
        const idToName: Record<string, string> = {};
        const titleMap: Record<string, string> = {};

        // Map consultant management ID → applicant name
        const applicants = applicantsData?.data?.results || [];
        applicants.forEach((applicant) => {
            const consultantIds = Array.isArray(applicant.consultants)
                ? applicant.consultants
                : applicant.consultants
                ? [applicant.consultants]
                : applicant.consultancy
                ? [applicant.consultancy]
                : [];

            consultantIds.forEach((consultantId) => {
                if (consultantId && !idToName[consultantId]) {
                    idToName[consultantId] = applicant.name;
                }
            });
        });

        // Map consultant management title → consultant management ID
        const consultantManagements = consultantManagementsData?.data?.results || [];
        consultantManagements.forEach((cm) => {
            if (cm.title && cm.id) {
                titleMap[cm.title] = cm.id;
            }
        });

        console.log('✅ Created mappings:');
        console.log('   - ID → Name:', Object.keys(idToName).length, 'entries');
        console.log('   - Title → ID:', Object.keys(titleMap).length, 'entries');
        console.log('📋 Sample ID → Name mappings:', Object.entries(idToName).slice(0, 5));
        console.log('📋 Sample Title → ID mappings:', Object.entries(titleMap).slice(0, 5));

        return {
            consultantIdToName: idToName,
            titleToId: titleMap,
        };
    }, [applicantsData, consultantManagementsData]);

    // Enrich report data with consultant names and apply filters
    const enrichedReports = useMemo(() => {
        const reports = data?.data.results || [];

        if (reports.length === 0) {
            console.log('⚠️ No reports to enrich yet');
            return reports;
        }

        console.log('📊 Enriching', reports.length, 'reports');
        console.log('📊 First report raw consultant field:', reports[0]?.consultant);

        let enriched = reports.map((report, index) => {
            // Get the consultant field - could be an ID or a title string
            let consultantIdOrTitle = typeof report.consultant === 'object'
                ? (report.consultant as any)?.id
                : report.consultant;

            // Check if it's a title (not a UUID format) and convert to ID
            let consultantId = consultantIdOrTitle;
            const isTitle = consultantIdOrTitle && !consultantIdOrTitle.match(/^[0-9a-f-]{36}$/i);

            if (isTitle && titleToId[consultantIdOrTitle]) {
                consultantId = titleToId[consultantIdOrTitle];
                if (index < 3) {
                    console.log(`🔄 Converted title "${consultantIdOrTitle}" → ID "${consultantId}"`);
                }
            }

            // Look up consultant name from the ID
            const consultantName = consultantId ? consultantIdToName[consultantId] : null;

            // Log first 3 reports in detail
            if (index < 3) {
                console.log(`\n🔍 Report ${index}:`, {
                    reportId: report.id,
                    originalValue: consultantIdOrTitle,
                    isTitle: isTitle,
                    consultantId: consultantId,
                    consultantName: consultantName,
                    found: !!consultantName,
                });
            }

            // If we found a consultant name, enrich the consultant object
            if (consultantName) {
                return {
                    ...report,
                    consultant: {
                        id: consultantId,
                        name: consultantName,
                        title: consultantIdOrTitle, // Keep original title
                    },
                };
            }

            return report;
        });

        // Log summary
        const enrichedCount = enriched.filter(r =>
            typeof r.consultant === 'object' && r.consultant !== null && (r.consultant as any).name
        ).length;

        console.log(`\n✅ Successfully enriched ${enrichedCount}/${reports.length} reports with consultant names`);

        // Show sample
        if (enriched.length > 0) {
            const sample = enriched[0];
            const sampleConsultant = sample.consultant as any;
            console.log('📋 Sample enriched report consultant:', {
                id: sampleConsultant?.id,
                name: sampleConsultant?.name,
                title: sampleConsultant?.title,
            });
        }

        // Apply client-side consultant name filter
        if (consultantFilter) {
            enriched = enriched.filter((report) => {
                const consultantName = typeof report.consultant === 'object' && report.consultant !== null
                    ? (report.consultant as any).name
                    : null;
                return consultantName && consultantName.toLowerCase().includes(consultantFilter.toLowerCase());
            });
        }

        return enriched;
    }, [data?.data.results, consultantIdToName, titleToId, consultantFilter]);

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">All Consultant Reports</h1>
                    <p className="text-gray-600 mt-1">Manage and review all consultancy reports</p>
                </div>
                <Link href={CG_ROUTES.CREATE_CONSULTANCY_REPORT}>
                    <Button>
                        <Plus size={20} />
                        Add New Report
                    </Button>
                </Link>
            </div>

            {/* Filters Card */}
            <Card>
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FilterIcon className="h-5 w-5 text-gray-600" />
                        <h3 className="text-lg font-semibold">Filters</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="text-sm font-medium mb-2 block">Search by Consultant Name</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search consultant..."
                                    value={consultantFilter}
                                    onChange={(e) => setConsultantFilter(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Status</label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="APPROVED">Approved</SelectItem>
                                    <SelectItem value="REJECTED">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {(consultantFilter || statusFilter !== "all") && (
                        <div className="mt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setConsultantFilter("");
                                    setStatusFilter("all");
                                }}
                            >
                                Clear All Filters
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            {/* Reports Table */}
            <Card>
                <TableFilters>
                    <DataTable
                        columns={consultancyReportColumns}
                        data={enrichedReports}
                        isLoading={isFetching}
                        pagination={{
                            total: data?.data.pagination.count ?? 0,
                            pageSize: data?.data.pagination.page_size ?? 0,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}
