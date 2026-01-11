"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ISubGrantSubmissionPaginatedData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import { formatNumberCurrency } from "@/utils/utls";

export const awardedBeneficiariesColumn: ColumnDef<ISubGrantSubmissionPaginatedData>[] = [
    {
        header: "Grant Name",
        id: "sub_grant",
        accessorFn: (row) => {
            const subGrant = row.sub_grant;
            return typeof subGrant === 'object' ? subGrant.title : subGrant;
        },
        size: 200,
    },

    {
        header: "Donor",
        id: "donor",
        accessorFn: (row) => {
            const subGrant = row.sub_grant;
            if (typeof subGrant === 'object' && subGrant.project?.funding_sources) {
                return subGrant.project.funding_sources[0]?.name || "N/A";
            }
            return "N/A";
        },
        size: 200,
    },

    {
        header: "Project",
        id: "project",
        accessorFn: (row) => {
            const subGrant = row.sub_grant;
            if (typeof subGrant === 'object' && subGrant.project) {
                return subGrant.project?.title || "N/A";
            }
            return "N/A";
        },
        size: 200,
    },

    {
        header: "Sub Grantee Name",
        id: "organisation_name",
        accessorFn: (row) => {
            // Check if there's awarded submission data
            if (row.awarded_submission) {
                return row.awarded_submission.organisation_name || "N/A";
            }
            // Check if there's award data with submission
            if (row.award?.submission) {
                const submission = row.award.submission;
                return typeof submission === 'object' ? submission.organisation_name : "N/A";
            }
            // Fallback to direct field
            return row.organisation_name || "N/A";
        },
        size: 200,
    },

    {
        header: "Sub Grantee Address",
        id: "address",
        accessorFn: (row) => {
            if (row.awarded_submission) {
                return row.awarded_submission.address || "N/A";
            }
            if (row.award?.submission) {
                const submission = row.award.submission;
                return typeof submission === 'object' ? submission.address : "N/A";
            }
            return row.address || "N/A";
        },
        size: 200,
    },

    {
        header: "Sub Grantee Email",
        id: "email",
        accessorFn: (row) => {
            if (row.awarded_submission) {
                return row.awarded_submission.email || "N/A";
            }
            if (row.award?.submission) {
                const submission = row.award.submission;
                return typeof submission === 'object' ? submission.email : "N/A";
            }
            return row.email || "N/A";
        },
        size: 200,
    },

    {
        header: "Sub Grantee Phone Number",
        id: "phone_number",
        accessorFn: (row) => {
            if (row.awarded_submission) {
                return row.awarded_submission.phone_number || "N/A";
            }
            if (row.award?.submission) {
                const submission = row.award.submission;
                return typeof submission === 'object' ? submission.phone_number : "N/A";
            }
            return row.phone_number || "N/A";
        },
        size: 200,
    },

    {
        header: "Subaward Life of Project Value (USD)",
        id: "award_usd",
        accessorFn: (row) => {
            const subGrant = row.sub_grant;
            if (typeof subGrant === 'object' && subGrant.amount_usd) {
                return formatNumberCurrency(subGrant.amount_usd, "USD");
            }
            return "N/A";
        },
        size: 200,
    },

    {
        header: "Subaward Life of Project Value (Local Currency)",
        id: "award_ngn",
        accessorFn: (row) => {
            const subGrant = row.sub_grant;
            if (typeof subGrant === 'object' && subGrant.amount_ngn) {
                return formatNumberCurrency(subGrant.amount_ngn, "NGN");
            }
            return "N/A";
        },
        size: 200,
    },

    {
        header: "Start Date",
        id: "start_date",
        accessorFn: (row) => {
            const subGrant = row.sub_grant;
            return typeof subGrant === 'object' ? (subGrant.start_date || "N/A") : "N/A";
        },
        size: 200,
    },

    {
        header: "End Date",
        id: "end_date",
        accessorFn: (row) => {
            const subGrant = row.sub_grant;
            return typeof subGrant === 'object' ? (subGrant.end_date || "N/A") : "N/A";
        },
        size: 200,
    },
];
