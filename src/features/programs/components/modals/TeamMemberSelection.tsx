"use client";

import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IUser } from "@/features/auth/types/user";
import { Search } from "lucide-react";
import { useState } from "react";
import { useGetAllUsersManager } from "@/features/auth/controllers/userController";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { addTeamMembers } from "@/store/admin/team-members";
import { closeDialog } from "@/store/ui";
import { filterAhniStaffOnly } from "@/utils/userFilters";
import { useGetEmployeeOnboardings } from "@/features/hr/controllers/employeeOnboardingController";

interface TeamMemberSelectionProps {
  initialMembers?: IUser[];
  onSubmit?: (members: IUser[]) => void;
  onClose?: () => void;
}

export default function TeamMemberSelection({
  initialMembers = [],
  onSubmit,
  onClose,
}: TeamMemberSelectionProps) {
  const dispatch = useAppDispatch();
  const { teamMembers } = useAppSelector((state) => state.teamMember);
  const [selectedMembers, setSelectedMembers] =
    useState<IUser[]>(initialMembers.length ? initialMembers : teamMembers);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch from both sources: Users table AND Employee database
  const { data: user, isLoading } = useGetAllUsersManager({
    page: 1,
    size: 2000000,
  });

  const { data: employeeData } = useGetEmployeeOnboardings({
    page: 1,
    size: 2000000,
  });

  // IMPORTANT FIX: Only use users from user table, NOT employee database
  // The vehicle request backend expects user IDs, not employee IDs
  // If we include employees, their IDs won't be found in the user table
  // and will cause "Invalid pk - object does not exist" errors

  console.log("🔍 Raw user data:", {
    user,
    hasData: !!user?.data,
    hasResults: !!user?.data?.results,
    dataKeys: user?.data ? Object.keys(user.data) : [],
    resultsLength: user?.data?.results?.length || 0,
  });

  // Handle both response structures: user.data.results OR user.results
  const userResults = user?.data?.results || user?.results || [];

  const allStaff = [
    // Users from user table (filter to exclude vendors)
    ...filterAhniStaffOnly(userResults as any[]),
  ];

  // Remove duplicates based on email
  const uniqueStaff = allStaff.reduce((acc: any[], current: any) => {
    const exists = acc.find(item => item.email === current.email);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);

  const ahniStaffUsers = uniqueStaff;

  console.log("👥 Team Member Selection Debug:", {
    totalUsers: userResults.length,
    filteredAhniStaff: ahniStaffUsers.length,
    employeesIgnored: employeeData?.data?.results?.length || 0,
    sampleUser: ahniStaffUsers[0]
  });

  const filteredUsers = ahniStaffUsers.filter(
    (member: any) =>
      `${member.first_name} ${member.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (typeof member.department === 'string'
        ? member.department?.toLowerCase()
        : member.department?.name?.toLowerCase() || ''
      ).includes(searchTerm.toLowerCase()) ||
      member.designation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckboxChange = (member: IUser, isChecked: boolean | string) => {
    setSelectedMembers((prev) => {
      if (isChecked) {
        // Normalize the member data to ensure designation is a string
        const normalizedMember = {
          ...member,
          designation: (() => {
            if (member.designation) {
              return typeof member.designation === 'object'
                ? (member.designation as any)?.name || (member.designation as any)?.title || ''
                : member.designation;
            }
            if (member.position) {
              return typeof member.position === 'object'
                ? (member.position as any)?.name || (member.position as any)?.title || ''
                : member.position;
            }
            return '';
          })(),
        };
        return [...prev, normalizedMember];
      }
      return prev.filter((m) => m.id !== member.id);
    });
  };

  const handleSubmit = () => {
    dispatch(addTeamMembers(selectedMembers));
    if (onSubmit) {
      onSubmit(selectedMembers);
    }
    dispatch(closeDialog());
    if (onClose) {
      onClose();
    }
  };

  console.log({ filteredUsers, filteredUsersx: filteredUsers?.length });

  return (
    <div className='container max-w-3xl p-4 py-8 mx-auto'>
      <img src='/imgs/logo.png' alt='AHN Logo' className='mx-auto mb-4 h-14' />

      <h1 className='mb-2 text-2xl font-bold text-center'>Team Members</h1>
      <p className='mb-4 text-center text-gray-600'>
        Please select all team members
      </p>

      <div className='relative w-6/12 mx-auto mb-4'>
        <Input
          placeholder='Search team members'
          className='pl-10'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search
          className='absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2'
          size={20}
        />
      </div>

      <ScrollArea className='h-[500px] my-4 border rounded-lg'>
        <div className='grid grid-cols-3 gap-4 p-4'>
          {isLoading ? (
            <div className='flex items-center justify-center col-span-3'>
              <LoadingSpinner />
            </div>
          ) : filteredUsers?.length === 0 ? (
            <div className='flex items-center justify-center col-span-3'>
              <p>No users found</p>
            </div>
          ) : (
            filteredUsers?.map((member: IUser) => (
              <Card key={member.id} className='relative p-3'>
                <Checkbox
                  className='absolute top-4 left-2'
                  checked={selectedMembers.some((m) => m.id === member.id)}
                  onCheckedChange={(value) =>
                    handleCheckboxChange(member, value)
                  }
                />
                <div className='pl-5'>
                  <p className=''>
                    <span className='font-semibold'>Name:</span>{" "}
                    {`${member.first_name} ${member.last_name}`}
                  </p>
                  <p>
                    <span className='font-semibold'>Department:</span>{" "}
                    {typeof member.department === 'string'
                      ? member.department
                      : member.department?.name || 'N/A'}
                  </p>
                  <p>
                    <span className='font-semibold'>Position:</span>{" "}
                    {(() => {
                      if (member.designation) {
                        return typeof member.designation === 'object'
                          ? member.designation?.name || member.designation?.title || ''
                          : member.designation;
                      }
                      if (member.position) {
                        return typeof member.position === 'object'
                          ? member.position?.name || member.position?.title || ''
                          : member.position;
                      }
                      return 'N/A';
                    })()}
                  </p>
                  <p>
                    <span className='font-semibold'>Tel:</span>{" "}
                    {member.mobile_number}
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      <div className='flex items-center justify-between'>
        <p className='font-semibold text-red-500'>
          {selectedMembers.length} members Selected
        </p>
        <Button onClick={handleSubmit} className='bg-red-500 hover:bg-red-600'>
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
