"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "components/ui/form";
import { Button } from "components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import { Badge } from "components/ui/badge";
import { Separator } from "components/ui/separator";
import { UsersIcon, PlusIcon, TrashIcon, UserIcon } from "lucide-react";
import { Alert, AlertDescription } from "components/ui/alert";

import {
  TSiteVisitApplicationFormValues,
  TeamMemberRole,
  TeamMemberRoleLabels,
} from "@/features/programs/types/site-visit";

interface TeamMembersSectionProps {
  allStaff: any[];
}

const TeamMembersSection: React.FC<TeamMembersSectionProps> = ({
  allStaff,
}) => {
  const { control, watch, setValue, getValues } = useFormContext<TSiteVisitApplicationFormValues>();
  const teamMembers = watch("team_members") || [];
  const [showAddForm, setShowAddForm] = useState(false);
  const [staffPopoverOpen, setStaffPopoverOpen] = useState(false);
  const [rolePopoverOpen, setRolePopoverOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    user: "",
    role: TeamMemberRole.SUPPORT_STAFF,
    per_day_allowance: 0,
    transport_cost: 0,
    accommodation_cost: 0,
    comments: "",
  });

  // Add new team member
  const handleAddMember = () => {
    if (newMember.user) {
      const currentMembers = getValues("team_members") || [];

      // Check if user is already added
      const exists = currentMembers.find(member => member.user === newMember.user);
      if (exists) {
        alert("This team member is already added to the visit.");
        return;
      }

      setValue("team_members", [...currentMembers, newMember]);

      // Reset form
      setNewMember({
        user: "",
        role: TeamMemberRole.SUPPORT_STAFF,
        per_day_allowance: 0,
        transport_cost: 0,
        accommodation_cost: 0,
        comments: "",
      });
      setShowAddForm(false);
    }
  };

  // Remove team member
  const handleRemoveMember = (index: number) => {
    const currentMembers = getValues("team_members") || [];
    const updatedMembers = currentMembers.filter((_, i) => i !== index);
    setValue("team_members", updatedMembers);
  };

  // Get staff member details
  const getStaffDetails = (userId: string) => {
    return allStaff.find(staff => staff.id === userId);
  };

  // Get available staff (excluding already added)
  const availableStaff = allStaff.filter(staff =>
    !teamMembers.find(member => member.user === staff.id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersIcon className="h-5 w-5 text-yellow-600" />
          Team Members
        </CardTitle>
        <p className="text-sm text-gray-600">
          Select AHNI staff members who will participate in this site visit. At least one team member is required.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Team Members List */}
        {teamMembers.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Selected Team Members ({teamMembers.length})</h4>
            <div className="space-y-2">
              {teamMembers.map((member, index) => {
                const staffDetails = getStaffDetails(member.user);
                return (
                  <Card key={index} className="bg-gray-50 border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {staffDetails ?
                                `${staffDetails.first_name} ${staffDetails.last_name}` :
                                'Unknown User'
                              }
                            </div>
                            <div className="text-sm text-gray-600">
                              {staffDetails?.email || 'No email available'}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {TeamMemberRoleLabels[member.role]}
                              </Badge>
                              {staffDetails?.designation && (
                                <Badge variant="outline" className="text-xs">
                                  {staffDetails.designation}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {member.comments && (
                            <Badge variant="outline" className="text-xs">
                              Has Notes
                            </Badge>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMember(index)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Cost Details (if any) */}
                      {(member.per_day_allowance > 0 || member.transport_cost > 0 || member.accommodation_cost > 0) && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            {member.per_day_allowance > 0 && (
                              <div>
                                <span className="text-gray-600">Per Day:</span>
                                <div className="font-medium">₦{member.per_day_allowance.toLocaleString()}</div>
                              </div>
                            )}
                            {member.transport_cost > 0 && (
                              <div>
                                <span className="text-gray-600">Transport:</span>
                                <div className="font-medium">₦{member.transport_cost.toLocaleString()}</div>
                              </div>
                            )}
                            {member.accommodation_cost > 0 && (
                              <div>
                                <span className="text-gray-600">Accommodation:</span>
                                <div className="font-medium">₦{member.accommodation_cost.toLocaleString()}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Comments */}
                      {member.comments && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="text-sm">
                            <span className="text-gray-600 font-medium">Notes:</span>
                            <div className="mt-1 text-gray-800">{member.comments}</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        <Separator />

        {/* Add Team Member Section */}
        {!showAddForm ? (
          <div className="text-center py-6">
            <Button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              disabled={availableStaff.length === 0}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
            {availableStaff.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                All available staff members have been added
              </p>
            )}
          </div>
        ) : (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-lg">Add Team Member</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Staff Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Select Staff Member *</label>
                <Popover open={staffPopoverOpen} onOpenChange={setStaffPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={staffPopoverOpen}
                      className="w-full justify-between font-normal"
                    >
                      <span className="truncate">
                        {newMember.user ?
                          (() => {
                            const staff = availableStaff.find(s => s.id === newMember.user);
                            return staff ? `${staff.first_name} ${staff.last_name}` : 'Choose a staff member';
                          })() :
                          'Choose a staff member'
                        }
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search staff members..." />
                      <CommandList>
                        <CommandEmpty>No staff members found.</CommandEmpty>
                        <CommandGroup>
                          {availableStaff.map((staff: any) => (
                            <CommandItem
                              key={staff.id}
                              value={`${staff.first_name} ${staff.last_name} ${staff.email} ${staff.designation || ''}`}
                              onSelect={() => {
                                setNewMember({...newMember, user: staff.id});
                                setStaffPopoverOpen(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${newMember.user === staff.id ? "opacity-100" : "opacity-0"}`}
                              />
                              <div className="flex flex-col items-start">
                                <span className="font-medium">
                                  {`${staff.first_name} ${staff.last_name}`}
                                </span>
                                <span className="text-xs text-gray-600">
                                  {staff.email}
                                  {staff.designation && ` • ${staff.designation}`}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Role Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Role *</label>
                <Select
                  value={newMember.role}
                  onValueChange={(value) => setNewMember({...newMember, role: value as TeamMemberRole})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TeamMemberRole).map(([key, value]) => (
                      <SelectItem key={value} value={value}>
                        {TeamMemberRoleLabels[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Optional Cost Fields */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Per Day Allowance</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newMember.per_day_allowance}
                    onChange={(e) => setNewMember({...newMember, per_day_allowance: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Transport Cost</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newMember.transport_cost}
                    onChange={(e) => setNewMember({...newMember, transport_cost: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Accommodation</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newMember.accommodation_cost}
                    onChange={(e) => setNewMember({...newMember, accommodation_cost: Number(e.target.value)})}
                  />
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="text-sm font-medium mb-2 block">Comments (Optional)</label>
                <Textarea
                  placeholder="Any special notes about this team member's role or requirements"
                  value={newMember.comments}
                  onChange={(e) => setNewMember({...newMember, comments: e.target.value})}
                  className="min-h-[60px]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewMember({
                      user: "",
                      role: TeamMemberRole.SUPPORT_STAFF,
                      per_day_allowance: 0,
                      transport_cost: 0,
                      accommodation_cost: 0,
                      comments: "",
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleAddMember}
                  disabled={!newMember.user}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Add Member
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Validation Message */}
        <FormField
          control={control}
          name="team_members"
          render={() => (
            <FormItem>
              <FormControl>
                <input type="hidden" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Guidelines */}
        {teamMembers.length === 0 && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertDescription className="text-yellow-800">
              <strong>Required:</strong> You must add at least one team member to proceed.
              Team size affects travel cost calculations.
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-gray-50 p-3 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-2">Team Selection Guidelines</h4>
          <ul className="text-sm text-gray-700 space-y-1 list-disc ml-4">
            <li>Include all AHNI staff who will participate in the site visit</li>
            <li>Assign appropriate roles based on visit objectives and responsibilities</li>
            <li>Team size affects accommodation arrangements and travel costs</li>
            <li>Individual cost overrides are optional - use standard rates if unsure</li>
            <li>Comments help clarify special requirements or considerations</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMembersSection;