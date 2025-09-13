import { LoadingSpinner } from "components/Loading";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { Checkbox } from "components/ui/checkbox";
import { Input } from "components/ui/input";
import { ScrollArea } from "components/ui/scroll-area";
import { IUser } from "features/auth/types/user";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { Search } from "lucide-react";
import { useState } from "react";
import { useGetAllUsersQuery } from "@/features/auth/controllers/userController";
import { addTeamMembers } from "store/admin/team-members";
import { closeDialog } from "store/ui";

export default function TeamMemberSelection() {
  const { teamMembers } = useAppSelector((state) => state.teamMember);

  const [selectedMembers, setSelectedMembers] = useState<IUser[]>(teamMembers);

  const dispatch = useAppDispatch();

  const { data: user, isLoading } = useGetAllUsersQuery({
    page: 1,
    size: 2000000,
  });

  const handleCheckboxChange = (member: IUser, isChecked: boolean | string) => {
    setSelectedMembers((prev) =>
      isChecked ? [...prev, member] : prev.filter((m) => m.id !== member.id)
    );
  };

  const onSubmit = () => {
    dispatch(addTeamMembers(selectedMembers));
    dispatch(closeDialog());
  };

  return (
    <div className="container max-w-3xl p-4 py-8 mx-auto">
      <img src="/imgs/logo.png" alt="AHN Logo" className="mx-auto mb-4 h-14" />

      <h1 className="mb-2 text-2xl font-bold text-center">Team Members</h1>
      <p className="mb-4 text-center text-gray-600">
        Please select all team members
      </p>

      <div className="relative w-6/12 mx-auto mb-4">
        <Input placeholder="Search team members" className="pl-10" />
        <Search
          className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
          size={20}
        />
      </div>

      <ScrollArea className="h-[500px] my-4 border rounded-lg">
        <div className="grid grid-cols-3 gap-4 p-4">
          {isLoading ? (
            <LoadingSpinner />
          ) : user?.data.results.length === 0 ? (
            <div className="flex items-center justify-center w-full">
              <p>No users </p>
            </div>
          ) : (
            user?.data.results.map((member, index) => (
              <Card key={member.id} className="relative p-3 ">
                <Checkbox
                  className="absolute top-4 left-2"
                  defaultChecked={index === 0 || index === 7}
                  checked={selectedMembers.some((m) => m.id === member.id)}
                  onCheckedChange={(value) =>
                    handleCheckboxChange(member, value)
                  }
                />
                <div className="pl-5">
                  <p className="">
                    <span className="font-semibold">Name:</span>{" "}
                    {`${member.first_name} ${member.last_name}`}
                  </p>
                  <p>
                    <span className="font-semibold">Department:</span>{" "}
                    {member.department}
                  </p>
                  <p>
                    <span className="font-semibold">Position:</span>{" "}
                    {member.designation}
                  </p>
                  <p>
                    <span className="font-semibold">Tel:</span>{" "}
                    {member.mobile_number}
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="flex items-center justify-between">
        <p className="font-semibold text-red-500">
          {selectedMembers.length} members Selected
        </p>
        <Button
          onClick={() => onSubmit()}
          className="bg-red-500 hover:bg-red-600"
        >
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
