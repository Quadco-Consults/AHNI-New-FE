"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";
import { Search, CheckCircle, XCircle, Info, Users } from "lucide-react";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

interface CommitteeEvaluationProps {
  solicitationId: string;
  rfpData?: any;
}

const CommitteeEvaluation: React.FC<CommitteeEvaluationProps> = ({ solicitationId, rfpData }) => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [existingCBA, setExistingCBA] = useState<any>(null);
  const [committeeMembers, setCommitteeMembers] = useState<any[]>([]);

  // Fetch existing CBA and committee on mount
  useEffect(() => {
    fetchExistingCBA();
  }, [solicitationId]);

  const fetchExistingCBA = async () => {
    if (!solicitationId) return;

    setIsLoading(true);
    try {
      const response = await AxiosWithToken.get('/procurements/cbas/', {
        params: {
          solicitation: solicitationId,
          cba_type: 'COMMITTEE',
        }
      });

      const cbas = response.data?.data?.results || [];
      if (cbas.length > 0) {
        const cba = cbas[0];
        setExistingCBA(cba);

        // Fetch full committee member details
        if (cba.committee_members && cba.committee_members.length > 0) {
          setCommitteeMembers(cba.committee_members);
          setSelectedMembers(cba.committee_members.map((m: any) => m.id));
        }
      }
    } catch (error: any) {
      console.error("Error fetching CBA:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch internal users when dialog opens
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await AxiosWithToken.get('/users/', {
        params: {
          page: 1,
          size: 100,
        }
      });

      // Filter for internal AHNI staff only
      const internalUsers = response.data?.data?.results?.filter(
        (user: any) => user.user_type === 'AHNI_STAFF' || user.user_type === 'ADMIN'
      ) || [];

      setUsers(internalUsers);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const email = user.email?.toLowerCase() || "";
    return fullName.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
  });

  const handleCreateCommittee = async () => {
    if (selectedMembers.length === 0) {
      toast.error("Please select at least one committee member");
      return;
    }

    setIsLoading(true);
    try {
      // First, check if CBA exists for this solicitation
      const cbaResponse = await AxiosWithToken.get(`/procurements/cbas/`, {
        params: {
          solicitation: solicitationId,
        }
      });

      const existingCBAs = cbaResponse.data?.data?.results || [];

      if (existingCBAs.length > 0) {
        // Update existing CBA
        const cbaId = existingCBAs[0].id;
        await AxiosWithToken.patch(`/procurements/cbas/${cbaId}/`, {
          committee_members: selectedMembers,
          cba_type: "COMMITTEE"
        });
        toast.success(`Committee updated with ${selectedMembers.length} members`);
      } else {
        // Create new CBA
        await AxiosWithToken.post(`/procurements/cbas/`, {
          solicitation: solicitationId,
          committee_members: selectedMembers,
          cba_type: "COMMITTEE",
          cba_date: new Date().toISOString().split('T')[0],
          remarks: `Committee evaluation for RFP: ${rfpData?.title}`
        });
        toast.success(`Committee created with ${selectedMembers.length} members`);
      }

      setIsDialogOpen(false);
      window.location.reload(); // Refresh to show updated committee
    } catch (error: any) {
      console.error("Error creating/updating committee:", error);
      toast.error(error.response?.data?.message || "Failed to create/update committee");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAll = () => {
    setSelectedMembers(filteredUsers.map((user) => user.id));
  };

  const clearAll = () => {
    setSelectedMembers([]);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Committee Evaluation</h2>
              <p className="text-sm text-gray-600">
                Assign committee members to evaluate RFP proposals
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={fetchUsers} className="bg-purple-600 hover:bg-purple-700">
                <Icon icon="mdi:account-multiple-plus" className="w-5 h-5 mr-2" />
                Select Committee Members
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[700px] overflow-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl text-center">
                  Select Committee Members
                </DialogTitle>
                <DialogDescription className="text-center">
                  Select AHNI staff members to form the evaluation committee for this RFP
                </DialogDescription>
              </DialogHeader>

              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mx-6">
                <div className="flex items-center gap-2">
                  <Info size={16} />
                  <p className="text-xs text-blue-800">
                    <strong>Note:</strong> Only internal AHNI staff members (AHNI_STAFF and ADMIN) can be selected as committee members.
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex justify-center">
                <div className="flex items-center w-1/2 px-4 py-2 border rounded-lg">
                  <Input
                    placeholder="Search team members by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type="search"
                    className="h-6 border-none bg-none"
                  />
                  <Search size={16} />
                </div>
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border mx-6">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-700">Bulk Actions:</span>
                  <Button type="button" variant="outline" size="sm" onClick={selectAll} className="text-xs">
                    <CheckCircle size={16} className="mr-1" />
                    Select All
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={clearAll} className="text-xs">
                    <XCircle size={16} className="mr-1" />
                    Clear All
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-primary">{selectedMembers.length}</span> of {filteredUsers.length} staff selected
                </div>
              </div>

              {/* User List */}
              {usersLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="grid grid-cols-1 gap-4 bg-gray-100 p-5 rounded-lg shadow-inner md:grid-cols-2 lg:grid-cols-3 mx-6">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="space-y-3 bg-white rounded-lg text-xs p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => toggleMember(user.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedMembers.includes(user.id)}
                          onCheckedChange={() => toggleMember(user.id)}
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start">
                            <h6 className="w-20 text-xs font-medium text-gray-500">Name:</h6>
                            <h6 className="flex-1 text-xs font-medium">
                              {user.first_name} {user.last_name}
                            </h6>
                          </div>
                          <div className="flex items-start">
                            <h6 className="w-20 text-xs font-medium text-gray-500">Email:</h6>
                            <h6 className="flex-1 text-xs text-gray-700">{user.email}</h6>
                          </div>
                          <div className="flex items-start">
                            <h6 className="w-20 text-xs font-medium text-gray-500">Type:</h6>
                            <Badge className="text-xs">{user.user_type}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mx-6 mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCommittee} disabled={isLoading || selectedMembers.length === 0}>
                  {isLoading ? <LoadingSpinner /> : `Assign ${selectedMembers.length} Members`}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Committee Members Display */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon icon="mdi:account-group" className="w-5 h-5" />
          Committee Members
        </h3>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800">
            <Icon icon="mdi:information-outline" className="inline w-4 h-4 mr-1" />
            Committee members will independently evaluate all vendor proposals and their scores will be aggregated for consensus decision.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : committeeMembers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {committeeMembers.map((member: any) => (
                <div key={member.id} className="bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {member.first_name?.[0]}{member.last_name?.[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{member.first_name} {member.last_name}</p>
                      <p className="text-xs text-gray-600">{member.email}</p>
                      <Badge className="text-xs mt-1" variant="outline">{member.user_type || "Member"}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">
                <strong>{committeeMembers.length}</strong> committee member{committeeMembers.length !== 1 ? 's' : ''} assigned
              </div>
              <div className="flex gap-3">
                {existingCBA && (
                  <Link href={`/dashboard/procurement/rfp-consensus/${existingCBA.id}`}>
                    <Button variant="outline">
                      <Icon icon="mdi:chart-bar" className="w-4 h-4 mr-2" />
                      View Consensus Dashboard
                    </Button>
                  </Link>
                )}
                <Button variant="outline" onClick={() => { fetchUsers(); setIsDialogOpen(true); }}>
                  <Icon icon="mdi:pencil" className="w-4 h-4 mr-2" />
                  Edit Committee
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Icon icon="mdi:account-multiple" className="w-16 h-16 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No committee members assigned yet.</p>
            <p className="text-xs mt-1">Click "Select Committee Members" to get started</p>
          </div>
        )}
      </Card>

      {/* Evaluation Workflow Info */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon icon="mdi:timeline-check" className="w-5 h-5 text-blue-600" />
          Evaluation Workflow
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <p className="font-medium">Assign Committee</p>
              <p className="text-sm text-gray-600">Select AHNI staff members to form the evaluation committee</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <p className="font-medium text-gray-500">Independent Evaluation</p>
              <p className="text-sm text-gray-500">Each member evaluates proposals independently (Technical, Financial, Commercial)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center text-sm font-bold">3</div>
            <div>
              <p className="font-medium text-gray-500">Consensus Review</p>
              <p className="text-sm text-gray-500">View aggregated scores and reach committee consensus</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center text-sm font-bold">4</div>
            <div>
              <p className="font-medium text-gray-500">Final Decision</p>
              <p className="text-sm text-gray-500">Committee vote on pass/fail and proceed to approval workflow</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CommitteeEvaluation;
