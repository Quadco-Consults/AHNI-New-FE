"use client";

import Card from "@/components/Card";
import { consultancyReportColumns } from "@/features/contracts-grants/components/table-columns/contract-management/consultancy-report";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { Button } from "@/components/ui/button";
import { CG_ROUTES } from "@/constants/RouterConstants";
import { Plus } from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useGetAllConsultancyReports } from "@/features/contracts-grants/controllers/consultancyReportController";
import { useGetAllConsultancyApplicants } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { useGetAllConsultantManagements } from "@/features/contracts-grants/controllers/consultantManagementController";

export default function ConsultancyReport() {
    const [page, setPage] = useState(1);

    const { data, isFetching } = useGetAllConsultancyReports({
        page,
        size: 10,
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
        console.log('📋 Sample title mappings:', Object.entries(titleMap).slice(0, 3));

        return {
            consultantIdToName: idToName,
            titleToId: titleMap,
        };
    }, [applicantsData, consultantManagementsData]);

    // Enrich report data with consultant names
    const enrichedReports = useMemo(() => {
        const reports = data?.data.results || [];

        if (reports.length === 0) {
            console.log('⚠️ No reports to enrich yet');
            return reports;
        }

        console.log('📊 Enriching', reports.length, 'reports');

        const enriched = reports.map((report, index) => {
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

        return enriched;
    }, [data?.data.results, consultantIdToName, titleToId]);

    return (
        <section className="space-y-10">
            <div className="flex items-center justify-end">
                <Link href={CG_ROUTES.CREATE_CONSULTANCY_REPORT}>
                    <Button>
                        <Plus size={20} />
                        Add New
                    </Button>
                </Link>
            </div>
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
