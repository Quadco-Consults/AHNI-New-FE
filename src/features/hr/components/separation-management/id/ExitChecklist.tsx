"use client";

import { useState } from "react";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ExitTrackerSeparation, SeparationChecklistItem } from "@/features/hr/types/separation-management";

interface ExitChecklistProps {
  data?: ExitTrackerSeparation;
}

const ExitChecklist = ({ data }: ExitChecklistProps) => {
  const { toast } = useToast();
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [loadingApproval, setLoadingApproval] = useState<string | null>(null);

  if (!data) {
    return null;
  }

  const actualData = (data as any).data || data;
  const checklistItems = actualData.checklist_items || [];

  // Group checklist items by category
  const groupedItems: Record<string, SeparationChecklistItem[]> = {
    DEPARTMENTAL: [],
    IT: [],
    FINANCE: [],
    HR: [],
  };

  checklistItems.forEach((item: SeparationChecklistItem) => {
    if (groupedItems[item.category]) {
      groupedItems[item.category].push(item);
    }
  });

  // Calculate progress
  const totalItems = checklistItems.length;
  const completedItems = checklistItems.filter((item: SeparationChecklistItem) => item.is_completed).length;
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const handleMarkComplete = async (itemId: string) => {
    setLoadingItems(prev => new Set(prev).add(itemId));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/hr/separation-management/${actualData.id}/checklist-items/${itemId}/complete/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to mark item as complete");

      toast({
        title: "Success",
        description: "Checklist item marked as complete",
      });

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Error marking item complete:", error);
      toast({
        title: "Error",
        description: "Failed to mark item as complete",
        variant: "destructive",
      });
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleDepartmentApproval = async (endpoint: string, deptName: string) => {
    setLoadingApproval(endpoint);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/hr/separation-management/${actualData.id}/${endpoint}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(`Failed to approve ${deptName}`);

      toast({
        title: "Success",
        description: `${deptName} clearance approved successfully`,
      });

      // Refresh the page to show updated data
      window.location.reload();
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

  const CategorySection = ({ category, items }: { category: string; items: SeparationChecklistItem[] }) => {
    if (items.length === 0) return null;

    const categoryCompleted = items.filter(item => item.is_completed).length;
    const categoryTotal = items.length;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{category}</h3>
          <Badge variant="outline">
            {categoryCompleted} / {categoryTotal} completed
          </Badge>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Status</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Mandatory</TableHead>
                <TableHead>Completed By</TableHead>
                <TableHead>Completed At</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className={item.is_completed ? "bg-green-50" : ""}>
                  <TableCell>
                    {item.is_completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : item.requires_signature ? (
                      <Clock className="w-5 h-5 text-orange-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.title}</div>
                      {item.description && (
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      )}
                      {item.notes && (
                        <div className="text-xs text-blue-600 mt-1">Note: {item.notes}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.is_mandatory ? (
                      <Badge variant="destructive">Required</Badge>
                    ) : (
                      <Badge variant="secondary">Optional</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.completed_by ? (
                      <div className="text-sm">
                        <div>{item.completed_by.name}</div>
                        <div className="text-muted-foreground">{item.completed_by.email}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.completed_at ? (
                      new Date(item.completed_at).toLocaleDateString()
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.requires_signature && item.approved_by ? (
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span>{item.approved_by.name}</span>
                        </div>
                        <div className="text-muted-foreground">{item.approved_by.email}</div>
                      </div>
                    ) : item.requires_signature ? (
                      <Badge variant="outline">Awaiting Signature</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {!item.is_completed && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkComplete(item.id)}
                        disabled={loadingItems.has(item.id)}
                      >
                        {loadingItems.has(item.id) ? "Marking..." : "Mark Complete"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-xl">Exit Checklist</h4>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="font-medium">{completedItems}</span> of{" "}
            <span className="font-medium">{totalItems}</span> items completed
          </div>
          <Badge variant={progressPercentage === 100 ? "default" : "secondary"}>
            {progressPercentage}% Complete
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Action Required Card */}
      {actualData.checklist_status !== "fully_approved" && (
        <Card className="p-6 border-l-4 border-l-orange-500 bg-orange-50">
          <h5 className="font-semibold text-lg mb-4">Action Required</h5>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Current Status: <span className="font-semibold">{actualData.checklist_status_display}</span>
            </p>

            {/* Department Approval Buttons */}
            <div className="flex flex-wrap gap-3">
              {!actualData.dept_cleared_by && actualData.checklist_status === "awaiting_dept_clearance" && (
                <Button
                  onClick={() => handleDepartmentApproval("approve-department", "Department")}
                  disabled={loadingApproval === "approve-department"}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loadingApproval === "approve-department" ? "Processing..." : "Approve Department Clearance"}
                </Button>
              )}

              {!actualData.it_cleared_by && actualData.checklist_status === "awaiting_it_clearance" && (
                <Button
                  onClick={() => handleDepartmentApproval("approve-it", "IT")}
                  disabled={loadingApproval === "approve-it"}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loadingApproval === "approve-it" ? "Processing..." : "Approve IT Clearance"}
                </Button>
              )}

              {!actualData.finance_cleared_by && actualData.checklist_status === "awaiting_finance_clearance" && (
                <Button
                  onClick={() => handleDepartmentApproval("approve-finance", "Finance")}
                  disabled={loadingApproval === "approve-finance"}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loadingApproval === "approve-finance" ? "Processing..." : "Approve Finance Clearance"}
                </Button>
              )}

              {!actualData.hr_cleared_by && actualData.checklist_status === "awaiting_hr_approval" && (
                <Button
                  onClick={() => handleDepartmentApproval("approve-hr", "HR")}
                  disabled={loadingApproval === "approve-hr"}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loadingApproval === "approve-hr" ? "Processing..." : "Approve HR"}
                </Button>
              )}

              {!actualData.md_approved_by && actualData.checklist_status === "awaiting_md_approval" && (
                <Button
                  onClick={() => handleDepartmentApproval("approve-md", "MD")}
                  disabled={loadingApproval === "approve-md"}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loadingApproval === "approve-md" ? "Processing..." : "Approve as MD"}
                </Button>
              )}
            </div>

            <div className="text-xs text-muted-foreground mt-2">
              <p>Next Step: {actualData.current_bottleneck}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Employee Instructions (if staff needs to submit) */}
      {actualData.checklist_status === "staff_to_submit" && (
        <Card className="p-6 border-l-4 border-l-blue-500 bg-blue-50">
          <h5 className="font-semibold text-lg mb-3">Employee Instructions</h5>
          <div className="space-y-2 text-sm">
            <p>As the exiting employee, please complete the following tasks:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Review all checklist items below and ensure they are completed</li>
              <li>Return all company property (laptop, phone, ID card, etc.)</li>
              <li>Complete handover notes to your supervisor</li>
              <li>Clear all outstanding advances with Finance</li>
              <li>Once done, notify HR to begin the approval process</li>
            </ul>
          </div>
        </Card>
      )}

      {/* Checklist Status Overview */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Checklist Status</p>
            <p className="font-semibold">{actualData.checklist_status_display}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Bottleneck</p>
            <p className="font-semibold">{actualData.current_bottleneck || "None"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Days Since Separation</p>
            <p className="font-semibold">{actualData.days_since_separation} days</p>
          </div>
        </div>
      </Card>

      {/* Department Clearance Status */}
      <Card className="p-4">
        <h5 className="font-semibold mb-4">Department Clearances</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Department</p>
            {actualData.dept_cleared_by ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">{actualData.dept_cleared_by.name}</span>
              </div>
            ) : (
              <Badge variant="outline">Pending</Badge>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">IT</p>
            {actualData.it_cleared_by ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">{actualData.it_cleared_by.name}</span>
              </div>
            ) : (
              <Badge variant="outline">Pending</Badge>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Finance</p>
            {actualData.finance_cleared_by ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">{actualData.finance_cleared_by.name}</span>
              </div>
            ) : (
              <Badge variant="outline">Pending</Badge>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">HR</p>
            {actualData.hr_cleared_by ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">{actualData.hr_cleared_by.name}</span>
              </div>
            ) : (
              <Badge variant="outline">Pending</Badge>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">MD</p>
            {actualData.md_approved_by ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">{actualData.md_approved_by.name}</span>
              </div>
            ) : (
              <Badge variant="outline">Pending</Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Checklist Items by Category */}
      <div className="space-y-8">
        <CategorySection category="DEPARTMENTAL" items={groupedItems.DEPARTMENTAL} />
        <CategorySection category="IT" items={groupedItems.IT} />
        <CategorySection category="FINANCE" items={groupedItems.FINANCE} />
        <CategorySection category="HR" items={groupedItems.HR} />
      </div>

      {totalItems === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No checklist items found</p>
        </Card>
      )}
    </div>
  );
};

export default ExitChecklist;
