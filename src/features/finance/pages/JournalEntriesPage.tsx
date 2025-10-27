"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Badge } from "components/ui/badge";
import { Card } from "components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Plus, Search, Filter, FileText, Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import DataTable from "components/Table/DataTable";
import {
  useGetJournalEntries,
  useCreateJournalEntry,
  useGetSingleJournalEntry,
  useUpdateJournalEntry,
  useDeleteJournalEntry,
} from "../controllers/accountingController";
import { JournalEntry, JournalEntryFormData } from "../types/accounting.types";
import JournalEntryForm from "../components/accounting/JournalEntryForm";

export default function JournalEntriesPage() {
  const [filters, setFilters] = useState<{
    status?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }>({
    page: 1,
    page_size: 10,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  // Data fetching
  const { data: journalData, isLoading } = useGetJournalEntries(filters);
  const { createJournalEntry, isLoading: isCreating } = useCreateJournalEntry();

  // Single entry operations
  const { data: singleEntryData } = useGetSingleJournalEntry(
    selectedEntry?.id || "",
    !!selectedEntry?.id
  );
  const { updateJournalEntry, isLoading: isUpdating } = useUpdateJournalEntry(
    selectedEntry?.id || ""
  );
  const { deleteJournalEntry, isLoading: isDeleting } = useDeleteJournalEntry();

  const journalEntries = journalData?.data?.results || [];
  const totalEntries = journalData?.data?.count || 0;

  // Handlers
  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleCreateEntry = async (data: JournalEntryFormData) => {
    await createJournalEntry(data);
  };

  const clearFilters = () => {
    setFilters({ page: 1, page_size: 10 });
  };

  // CRUD Handlers
  const handleViewEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setViewDialogOpen(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setEditDialogOpen(true);
  };

  const handleDeleteEntry = async (entry: JournalEntry) => {
    if (!confirm(`Are you sure you want to delete journal entry "${entry.entry_number}"?`)) {
      return;
    }

    try {
      await deleteJournalEntry(entry.id);
      toast.success("Journal entry deleted successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete journal entry");
    }
  };

  const handleUpdateEntry = async (data: JournalEntryFormData) => {
    try {
      await updateJournalEntry(data);
      toast.success("Journal entry updated successfully");
      setEditDialogOpen(false);
      setSelectedEntry(null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to update journal entry");
    }
  };

  // Status badge color mapping
  const getStatusColor = (status: string | undefined | null) => {
    if (!status) {
      return 'bg-gray-100 text-gray-800'; // Default for undefined/null
    }

    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'PENDING_APPROVAL':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-blue-100 text-blue-800';
      case 'POSTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Column definitions
  const columns = [
    {
      accessorKey: "entry_number",
      header: "Entry #",
      cell: ({ row }: any) => (
        <span className="font-mono text-sm">
          {row.getValue("entry_number")}
        </span>
      ),
    },
    {
      accessorKey: "entry_date",
      header: "Date",
      cell: ({ row }: any) => (
        <span className="text-sm">
          {new Date(row.getValue("entry_date")).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: any) => (
        <span className="text-sm max-w-xs truncate">
          {row.getValue("description")}
        </span>
      ),
    },
    {
      accessorKey: "reference_number",
      header: "Reference",
      cell: ({ row }: any) => (
        <span className="text-sm">
          {row.getValue("reference_number") || "—"}
        </span>
      ),
    },
    {
      accessorKey: "total_debit",
      header: "Amount",
      cell: ({ row }: any) => (
        <span className="font-mono text-sm">
          ${row.getValue("total_debit")?.toLocaleString() || "0.00"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        return (
          <Badge className={getStatusColor(status)}>
            {status ? status.replace('_', ' ') : 'N/A'}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_by",
      header: "Created By",
      cell: ({ row }: any) => (
        <span className="text-sm">
          {row.getValue("created_by") || "System"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const entry = row.original;
        return (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="View Details"
              onClick={() => handleViewEntry(entry)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Edit Entry"
              onClick={() => handleEditEntry(entry)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              title="Delete Entry"
              onClick={() => handleDeleteEntry(entry)}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Statistics
  const statusCounts = journalEntries.reduce((acc, entry) => {
    acc[entry.status] = (acc[entry.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Journal Entries</h1>
          <p className="text-gray-600">
            Create, review, and post journal entries to the general ledger
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={20} className="mr-2" />
          New Journal Entry
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{totalEntries}</div>
          <div className="text-sm text-gray-600">Total Entries</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.DRAFT || 0}</div>
          <div className="text-sm text-gray-600">Draft</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{statusCounts.APPROVED || 0}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{statusCounts.POSTED || 0}</div>
          <div className="text-sm text-gray-600">Posted</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">{statusCounts.REJECTED || 0}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search entries..."
              value={filters.search || ""}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-64"
            />
          </div>

          <Select
            value={filters.status || "all"}
            onValueChange={(value) => handleFilterChange("status", value === "all" ? undefined : value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="POSTED">Posted</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <Input
              type="date"
              placeholder="From Date"
              value={filters.date_from || ""}
              onChange={(e) => handleFilterChange("date_from", e.target.value || undefined)}
              className="w-40"
            />
            <span className="text-gray-400">to</span>
            <Input
              type="date"
              placeholder="To Date"
              value={filters.date_to || ""}
              onChange={(e) => handleFilterChange("date_to", e.target.value || undefined)}
              className="w-40"
            />
          </div>

          {(filters.search || filters.status || filters.date_from || filters.date_to) && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}

          <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>
              {journalEntries.length} of {totalEntries} entries
            </span>
          </div>
        </div>
      </Card>

      {/* Journal Entries Table */}
      <Card className="p-6">
        {journalEntries.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Journal Entries Found</h3>
            <p className="text-gray-600 mb-4">
              {filters.search || filters.status || filters.date_from || filters.date_to
                ? "No entries match your current filters."
                : "Get started by creating your first journal entry."}
            </p>
            <Button onClick={() => setFormOpen(true)}>
              <Plus size={16} className="mr-2" />
              Create Journal Entry
            </Button>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={journalEntries}
            loading={isLoading}
            pagination={{
              page: filters.page || 1,
              pageSize: filters.page_size || 10,
              total: totalEntries,
              onPageChange: handlePageChange,
            }}
          />
        )}
      </Card>

      {/* Journal Entry Form */}
      <JournalEntryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreateEntry}
        loading={isCreating}
      />

      {/* View Journal Entry Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Journal Entry Details</DialogTitle>
            <DialogDescription>
              {selectedEntry?.entry_number} - {selectedEntry?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedEntry && (
            <div className="space-y-6">
              {/* Header Information */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Entry Number</label>
                  <p className="text-sm">{selectedEntry.entry_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date</label>
                  <p className="text-sm">{new Date(selectedEntry.entry_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <Badge className={getStatusColor(selectedEntry.status)}>
                    {selectedEntry.status ? selectedEntry.status.replace('_', ' ') : 'N/A'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Created By</label>
                  <p className="text-sm">{selectedEntry.created_by || 'System'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-sm">{selectedEntry.description}</p>
              </div>

              {selectedEntry.reference_number && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Reference Number</label>
                  <p className="text-sm">{selectedEntry.reference_number}</p>
                </div>
              )}

              {/* Line Items */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Line Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium">Account</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Description</th>
                        <th className="px-4 py-2 text-right text-sm font-medium">Debit</th>
                        <th className="px-4 py-2 text-right text-sm font-medium">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEntry.line_items?.map((line, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2 text-sm">
                            {typeof line.account === 'string' ? line.account : line.account?.account_name}
                          </td>
                          <td className="px-4 py-2 text-sm">{line.description || '-'}</td>
                          <td className="px-4 py-2 text-sm text-right font-mono">
                            {line.debit_amount > 0 ? `$${line.debit_amount.toLocaleString()}` : '-'}
                          </td>
                          <td className="px-4 py-2 text-sm text-right font-mono">
                            {line.credit_amount > 0 ? `$${line.credit_amount.toLocaleString()}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-semibold">
                      <tr>
                        <td colSpan={2} className="px-4 py-2 text-sm">Total</td>
                        <td className="px-4 py-2 text-sm text-right font-mono">
                          ${selectedEntry.total_debit?.toLocaleString() || '0.00'}
                        </td>
                        <td className="px-4 py-2 text-sm text-right font-mono">
                          ${selectedEntry.total_credit?.toLocaleString() || '0.00'}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Journal Entry Dialog */}
      {selectedEntry && (
        <JournalEntryForm
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSubmit={handleUpdateEntry}
          loading={isUpdating}
          initialData={{
            entry_date: selectedEntry.entry_date.split('T')[0],
            description: selectedEntry.description,
            reference_number: selectedEntry.reference_number || '',
            line_items: selectedEntry.line_items?.map(line => ({
              account: typeof line.account === 'string' ? line.account : line.account?.id || '',
              description: line.description || '',
              debit_amount: line.debit_amount,
              credit_amount: line.credit_amount,
              project: line.project || '',
              department: line.department || '',
            })) || []
          }}
        />
      )}
    </div>
  );
}