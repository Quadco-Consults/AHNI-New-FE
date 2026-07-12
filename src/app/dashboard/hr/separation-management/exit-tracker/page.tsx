"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import type { ExitTrackerSeparation, PaginatedSeparationResponse } from "@/features/hr/types/separation-management";

export default function ExitTrackerDashboard() {
  const router = useRouter();
  const { toast } = useToast();

  const [separations, setSeparations] = useState<ExitTrackerSeparation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterChecklist, setFilterChecklist] = useState<string>("all");
  const [filterBenefits, setFilterBenefits] = useState<string>("all");
  const [filterPayment, setFilterPayment] = useState<string>("all");

  // Fetch exit tracker data
  useEffect(() => {
    fetchExitTrackerData();
  }, [filterChecklist, filterBenefits, filterPayment]);

  const fetchExitTrackerData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filterChecklist !== "all") params.append("checklist_status", filterChecklist);
      if (filterBenefits !== "all") params.append("terminal_benefit_status", filterBenefits);
      if (filterPayment !== "all") params.append("payment_status", filterPayment);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/hr/separation-management/tracker-dashboard/?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch exit tracker data");

      const result = await response.json();
      // API returns deeply nested structure: response.data.data.results.data
      const separationsData = result.data?.data?.results?.data || result.data?.results || [];
      setSeparations(separationsData);
    } catch (error) {
      console.error("Error fetching exit tracker data:", error);
      toast({
        title: "Error",
        description: "Failed to load exit tracker data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter by search term (client-side)
  const filteredSeparations = separations.filter((sep) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      sep.employee.legal_firstname.toLowerCase().includes(search) ||
      sep.employee.legal_lastname.toLowerCase().includes(search) ||
      sep.employee.employee_number.toLowerCase().includes(search)
    );
  });

  // Status badge styling
  const getStatusBadgeVariant = (status: string) => {
    if (status.includes("fully") || status.includes("paid") || status.includes("complete")) {
      return "default"; // Green
    }
    if (status.includes("awaiting") || status.includes("prepared") || status.includes("submitted")) {
      return "secondary"; // Yellow
    }
    return "outline"; // Gray
  };

  const exportToExcel = () => {
    toast({
      title: "Export",
      description: "Excel export functionality coming soon",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exit Tracker Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track employee separations across all stages
          </p>
        </div>
        <Button onClick={exportToExcel} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export to Excel
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Active Exits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{separations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {separations.filter(s => s.checklist_status !== "fully_approved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Benefits Unsigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {separations.filter(s => s.terminal_benefit_status !== "fully_signed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {separations.filter(s => s.payment_status !== "paid").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterChecklist} onValueChange={setFilterChecklist}>
              <SelectTrigger>
                <SelectValue placeholder="Checklist Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Checklist Statuses</SelectItem>
                <SelectItem value="staff_to_submit">Staff to Submit</SelectItem>
                <SelectItem value="awaiting_dept_clearance">Awaiting Dept</SelectItem>
                <SelectItem value="awaiting_it_clearance">Awaiting IT</SelectItem>
                <SelectItem value="awaiting_finance_clearance">Awaiting Finance</SelectItem>
                <SelectItem value="awaiting_hr_approval">Awaiting HR</SelectItem>
                <SelectItem value="awaiting_md_approval">Awaiting MD</SelectItem>
                <SelectItem value="fully_approved">Fully Approved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterBenefits} onValueChange={setFilterBenefits}>
              <SelectTrigger>
                <SelectValue placeholder="Benefits Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Benefit Statuses</SelectItem>
                <SelectItem value="not_prepared">Not Prepared</SelectItem>
                <SelectItem value="prepared">Prepared</SelectItem>
                <SelectItem value="not_fully_signed">Not Fully Signed</SelectItem>
                <SelectItem value="fully_signed">Fully Signed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPayment} onValueChange={setFilterPayment}>
              <SelectTrigger>
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Statuses</SelectItem>
                <SelectItem value="not_submitted">Not Submitted</SelectItem>
                <SelectItem value="submitted_to_finance">Submitted to Finance</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="payment_confirmed">Payment Confirmed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Exit Tracker Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Exit Method</TableHead>
                  <TableHead>Submit Date</TableHead>
                  <TableHead>Exit Date</TableHead>
                  <TableHead>Checklist Status</TableHead>
                  <TableHead>Terminal Benefit Status</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead className="text-right">Net Payable</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Bottleneck</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8">
                      Loading exit tracker data...
                    </TableCell>
                  </TableRow>
                ) : filteredSeparations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8">
                      No separations found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSeparations.map((separation) => (
                    <TableRow key={separation.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <div className="font-medium">{separation.employee.full_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {separation.employee.employee_number}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {separation.employee.position?.name || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{separation.exit_method}</Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(separation.submit_date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(separation.exit_date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(separation.checklist_status)}>
                          {separation.checklist_status_display}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(separation.terminal_benefit_status)}>
                          {separation.terminal_benefit_status_display}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(separation.payment_status)}>
                          {separation.payment_status_display}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(parseFloat(separation.net_amount_payable))}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{separation.days_since_separation}d</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {separation.current_bottleneck}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/dashboard/hr/separation-management/${separation.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
