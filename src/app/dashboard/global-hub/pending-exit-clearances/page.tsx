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
import { Badge } from "@/components/ui/badge";
import { Search, Eye, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { ExitTrackerSeparation } from "@/features/hr/types/separation-management";

export default function PendingExitClearancesPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [separations, setSeparations] = useState<ExitTrackerSeparation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingApproval, setLoadingApproval] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");

  // Fetch pending clearances
  useEffect(() => {
    fetchPendingClearances();
  }, []);

  const fetchPendingClearances = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/hr/separations/tracker-dashboard/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch pending clearances");

      const result = await response.json();
      const allSeparations: ExitTrackerSeparation[] = result.data?.results || [];

      // Filter to show only items that need action
      const pendingSeparations = allSeparations.filter(
        (sep) => sep.checklist_status !== "fully_approved"
      );

      setSeparations(pendingSeparations);
    } catch (error) {
      console.error("Error fetching pending clearances:", error);
      toast({
        title: "Error",
        description: "Failed to load pending clearances",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter by search term
  const filteredSeparations = separations.filter((sep) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      sep.employee.legal_firstname.toLowerCase().includes(search) ||
      sep.employee.legal_lastname.toLowerCase().includes(search) ||
      sep.employee.employee_number.toLowerCase().includes(search)
    );
  });

  // Group separations by what's pending
  const awaitingDept = filteredSeparations.filter(
    (s) => s.checklist_status === "awaiting_dept_clearance"
  );
  const awaitingIT = filteredSeparations.filter(
    (s) => s.checklist_status === "awaiting_it_clearance"
  );
  const awaitingFinance = filteredSeparations.filter(
    (s) => s.checklist_status === "awaiting_finance_clearance"
  );
  const awaitingHR = filteredSeparations.filter(
    (s) => s.checklist_status === "awaiting_hr_approval"
  );
  const awaitingMD = filteredSeparations.filter(
    (s) => s.checklist_status === "awaiting_md_approval"
  );

  // Handle approval
  const handleApproval = async (separationId: string, endpoint: string, deptName: string) => {
    setLoadingApproval(`${separationId}-${endpoint}`);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/hr/separations/${separationId}/${endpoint}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(`Failed to approve ${deptName}`);

      toast({
        title: "Success",
        description: `${deptName} clearance approved successfully`,
      });

      // Refresh data
      fetchPendingClearances();
    } catch (error) {
      console.error(`Error approving ${deptName}:`, error);
      toast({
        title: "Error",
        description: `Failed to approve ${deptName} clearance`,
        variant: "destructive",
      });
    } finally {
      setLoadingApproval(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Pending Exit Clearances</h1>
        <p className="text-muted-foreground mt-1">
          Review and approve exit clearances for departing employees
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Awaiting Dept
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{awaitingDept.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Awaiting IT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{awaitingIT.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Awaiting Finance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{awaitingFinance.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Awaiting HR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{awaitingHR.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Awaiting MD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{awaitingMD.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by employee name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pending Clearances Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Pending Clearances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Exit Date</TableHead>
                  <TableHead>Days Since Exit</TableHead>
                  <TableHead>Current Status</TableHead>
                  <TableHead>Bottleneck</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading pending clearances...
                    </TableCell>
                  </TableRow>
                ) : filteredSeparations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                        <p className="text-lg font-medium">No pending clearances</p>
                        <p className="text-sm text-muted-foreground">
                          All exit clearances are up to date
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSeparations.map((separation) => {
                    const isLoadingThis = loadingApproval?.startsWith(separation.id);

                    return (
                      <TableRow key={separation.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {separation.employee.full_name}
                            </div>
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
                          {format(new Date(separation.exit_date), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              separation.days_since_separation > 30
                                ? "destructive"
                                : separation.days_since_separation > 14
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {separation.days_since_separation}d
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {separation.checklist_status_display}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <AlertCircle className="w-4 h-4" />
                            {separation.current_bottleneck}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {/* Department Approval */}
                            {!separation.dept_cleared_by &&
                              separation.checklist_status === "awaiting_dept_clearance" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleApproval(
                                      separation.id,
                                      "approve-department",
                                      "Department"
                                    )
                                  }
                                  disabled={isLoadingThis}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  {loadingApproval === `${separation.id}-approve-department`
                                    ? "Processing..."
                                    : "Approve Dept"}
                                </Button>
                              )}

                            {/* IT Approval */}
                            {!separation.it_cleared_by &&
                              separation.checklist_status === "awaiting_it_clearance" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleApproval(separation.id, "approve-it", "IT")
                                  }
                                  disabled={isLoadingThis}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  {loadingApproval === `${separation.id}-approve-it`
                                    ? "Processing..."
                                    : "Approve IT"}
                                </Button>
                              )}

                            {/* Finance Approval */}
                            {!separation.finance_cleared_by &&
                              separation.checklist_status === "awaiting_finance_clearance" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleApproval(
                                      separation.id,
                                      "approve-finance",
                                      "Finance"
                                    )
                                  }
                                  disabled={isLoadingThis}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  {loadingApproval === `${separation.id}-approve-finance`
                                    ? "Processing..."
                                    : "Approve Finance"}
                                </Button>
                              )}

                            {/* HR Approval */}
                            {!separation.hr_cleared_by &&
                              separation.checklist_status === "awaiting_hr_approval" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleApproval(separation.id, "approve-hr", "HR")
                                  }
                                  disabled={isLoadingThis}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  {loadingApproval === `${separation.id}-approve-hr`
                                    ? "Processing..."
                                    : "Approve HR"}
                                </Button>
                              )}

                            {/* MD Approval */}
                            {!separation.md_approved_by &&
                              separation.checklist_status === "awaiting_md_approval" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleApproval(separation.id, "approve-md", "MD")
                                  }
                                  disabled={isLoadingThis}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  {loadingApproval === `${separation.id}-approve-md`
                                    ? "Processing..."
                                    : "Approve MD"}
                                </Button>
                              )}

                            {/* View Details */}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                router.push(
                                  `/dashboard/hr/separation-management/${separation.id}`
                                )
                              }
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      {filteredSeparations.length > 0 && (
        <Card className="border-l-4 border-l-blue-500 bg-blue-50">
          <CardContent className="pt-6">
            <h5 className="font-semibold mb-2">How Exit Clearances Work</h5>
            <div className="text-sm space-y-1">
              <p>
                Exit clearances follow a sequential approval process:
              </p>
              <ol className="list-decimal list-inside ml-2 space-y-1">
                <li>Department Head clears departmental tasks</li>
                <li>IT clears technology and access items</li>
                <li>Finance clears financial obligations</li>
                <li>HR validates all clearances</li>
                <li>MD provides final approval</li>
              </ol>
              <p className="mt-2 text-muted-foreground">
                Click the approval button when you've verified that the employee has
                completed all tasks in your department's checklist.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
