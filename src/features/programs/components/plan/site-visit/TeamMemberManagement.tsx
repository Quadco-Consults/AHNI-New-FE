"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { LoadingSpinner } from "components/Loading";
import { toast } from "sonner";
import {
  Plus,
  UserMinus,
  DollarSign,
  Car,
  Home,
  FileText,
  CheckCircle2,
  XCircle,
  Users,
  Edit3,
  Trash2,
} from "lucide-react";

import {
  TeamMemberRole,
  TeamMemberRoleLabels,
  ISiteVisitTeamMember,
} from "@/features/programs/types/site-visit";

import {
  useGetSiteVisitTeamMembers,
  useAddTeamMember,
  useRemoveTeamMember,
  useGenerateTeamMemberEA,
} from "@/features/programs/controllers/siteVisitController";

import { useGetAllUsers } from "@/features/auth/controllers";

// Form validation schema
const TeamMemberSchema = z.object({
  user: z.string().min(1, "User is required"),
  role: z.nativeEnum(TeamMemberRole, {
    required_error: "Role is required",
  }),
  per_day_allowance: z.number().min(0, "Allowance must be positive").optional(),
  transport_cost: z.number().min(0, "Transport cost must be positive").optional(),
  accommodation_cost: z.number().min(0, "Accommodation cost must be positive").optional(),
  comments: z.string().optional(),
});

type TeamMemberFormData = z.infer<typeof TeamMemberSchema>;

interface TeamMemberManagementProps {
  siteVisitId: string;
  isEditable?: boolean;
  onTeamChange?: (teamSize: number) => void;
}

const TeamMemberManagement = ({
  siteVisitId,
  isEditable = true,
  onTeamChange,
}: TeamMemberManagementProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<ISiteVisitTeamMember | null>(null);

  // Fetch team members
  const {
    data: teamMembersData,
    isLoading: isTeamLoading,
    error: teamError,
  } = useGetSiteVisitTeamMembers(siteVisitId);

  // Fetch users for dropdown
  const { data: usersData, isLoading: isUsersLoading } = useGetAllUsers({
    page: 1,
    size: 1000,
  });

  // Mutations
  const addTeamMemberMutation = useAddTeamMember(siteVisitId);
  const removeTeamMemberMutation = useRemoveTeamMember(siteVisitId, selectedMember?.id || "");
  const generateEAMutation = useGenerateTeamMemberEA(selectedMember?.id || "");

  // Form setup
  const form = useForm<TeamMemberFormData>({
    resolver: zodResolver(TeamMemberSchema),
    defaultValues: {
      user: "",
      role: TeamMemberRole.TEAM_LEAD,
      per_day_allowance: 0,
      transport_cost: 0,
      accommodation_cost: 0,
      comments: "",
    },
  });

  const teamMembers = teamMembersData?.data?.results || [];
  const users = usersData?.data?.results || [];

  // Handle team size change callback
  React.useEffect(() => {
    if (onTeamChange) {
      onTeamChange(teamMembers.length);
    }
  }, [teamMembers.length, onTeamChange]);

  const handleAddTeamMember = async (data: TeamMemberFormData) => {
    try {
      await addTeamMemberMutation.mutateAsync(data);
      toast.success("Team member added successfully");
      setIsAddModalOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to add team member");
    }
  };

  const handleRemoveTeamMember = async (member: ISiteVisitTeamMember) => {
    if (!confirm(`Are you sure you want to remove ${member.user_name} from the team?`)) {
      return;
    }

    try {
      setSelectedMember(member);
      await removeTeamMemberMutation.mutateAsync();
      toast.success("Team member removed successfully");
      setSelectedMember(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to remove team member");
      setSelectedMember(null);
    }
  };

  const handleGenerateEA = async (member: ISiteVisitTeamMember) => {
    if (!confirm(`Generate Expense Authorization for ${member.user_name}?`)) {
      return;
    }

    try {
      setSelectedMember(member);
      await generateEAMutation.mutateAsync();
      toast.success("Expense Authorization generated successfully");
      setSelectedMember(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to generate EA");
      setSelectedMember(null);
    }
  };

  const getRoleBadgeColor = (role: TeamMemberRole) => {
    const colorMap = {
      [TeamMemberRole.TEAM_LEAD]: "default",
      [TeamMemberRole.SUPERVISOR]: "secondary",
      [TeamMemberRole.TECHNICAL_EXPERT]: "default",
      [TeamMemberRole.COORDINATOR]: "secondary",
      [TeamMemberRole.OBSERVER]: "outline",
      [TeamMemberRole.SUPPORT_STAFF]: "outline",
    } as const;

    return colorMap[role] || "secondary";
  };

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  if (isTeamLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (teamError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            <p>Error loading team members</p>
            <p className="text-sm mt-1">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
            <Badge variant="secondary">{teamMembers.length}</Badge>
          </CardTitle>
          {isEditable && (
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Team Member</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddTeamMember)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* User Selection */}
                      <FormField
                        control={form.control}
                        name="user"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Team Member</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select user" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {isUsersLoading ? (
                                  <SelectItem value="" disabled>
                                    Loading users...
                                  </SelectItem>
                                ) : (
                                  users.map((user: any) => (
                                    <SelectItem key={user.id} value={user.id}>
                                      {user.first_name} {user.last_name} - {user.email}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Role Selection */}
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.values(TeamMemberRole).map((role) => (
                                  <SelectItem key={role} value={role}>
                                    {TeamMemberRoleLabels[role]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Per Day Allowance */}
                      <FormField
                        control={form.control}
                        name="per_day_allowance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Per Day Allowance (₦)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Transport Cost */}
                      <FormField
                        control={form.control}
                        name="transport_cost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transport Cost (₦)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Accommodation Cost */}
                      <FormField
                        control={form.control}
                        name="accommodation_cost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Accommodation Cost (₦)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Comments */}
                    <FormField
                      control={form.control}
                      name="comments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comments (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Additional comments or requirements..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={addTeamMemberMutation.isPending}
                      >
                        {addTeamMemberMutation.isPending ? (
                          <>
                            <LoadingSpinner />
                            Adding...
                          </>
                        ) : (
                          "Add Member"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {teamMembers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No team members assigned</p>
            <p className="text-sm mt-1">Add team members to this site visit</p>
            {isEditable && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Member
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="font-medium">
                      {member.user_name || `User ID: ${member.user}`}
                    </div>
                    <Badge variant={getRoleBadgeColor(member.role)}>
                      {TeamMemberRoleLabels[member.role]}
                    </Badge>
                    {member.visit_number && (
                      <Badge variant="outline" className="font-mono text-xs">
                        #{member.visit_number}
                      </Badge>
                    )}
                  </div>

                  {/* Cost Breakdown */}
                  {(member.per_day_allowance || member.transport_cost || member.accommodation_cost) && (
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>Daily: {formatCurrency(member.per_day_allowance)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Car className="h-3 w-3" />
                        <span>Transport: {formatCurrency(member.transport_cost)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Home className="h-3 w-3" />
                        <span>Accommodation: {formatCurrency(member.accommodation_cost)}</span>
                      </div>
                    </div>
                  )}

                  {/* Total Cost */}
                  {member.total_estimated_cost && (
                    <div className="text-sm font-medium text-green-600">
                      Total Estimated Cost: {formatCurrency(member.total_estimated_cost)}
                    </div>
                  )}

                  {/* Comments */}
                  {member.comments && (
                    <div className="text-sm text-gray-600 mt-1">
                      <FileText className="inline h-3 w-3 mr-1" />
                      {member.comments}
                    </div>
                  )}

                  {/* EA Status */}
                  <div className="flex items-center gap-2 mt-2">
                    {member.ea_generated ? (
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>EA Generated</span>
                        {member.ea_number && (
                          <Badge variant="outline" className="ml-1 font-mono text-xs">
                            {member.ea_number}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <XCircle className="h-4 w-4" />
                        <span>EA Pending</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {isEditable && (
                  <div className="flex items-center gap-2">
                    {!member.ea_generated && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateEA(member)}
                        disabled={generateEAMutation.isPending && selectedMember?.id === member.id}
                      >
                        {generateEAMutation.isPending && selectedMember?.id === member.id ? (
                          <LoadingSpinner />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                        Generate EA
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveTeamMember(member)}
                      disabled={removeTeamMemberMutation.isPending && selectedMember?.id === member.id}
                    >
                      {removeTeamMemberMutation.isPending && selectedMember?.id === member.id ? (
                        <LoadingSpinner />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {/* Summary */}
            <div className="border-t pt-4 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Total Members</div>
                  <div className="font-semibold">{teamMembers.length}</div>
                </div>
                <div>
                  <div className="text-gray-500">EAs Generated</div>
                  <div className="font-semibold">
                    {teamMembers.filter(m => m.ea_generated).length}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Total Estimated Cost</div>
                  <div className="font-semibold text-green-600">
                    {formatCurrency(
                      teamMembers.reduce((sum, member) => sum + (member.total_estimated_cost || 0), 0)
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Notifications Sent</div>
                  <div className="font-semibold">
                    {teamMembers.filter(m => m.notification_sent).length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamMemberManagement;