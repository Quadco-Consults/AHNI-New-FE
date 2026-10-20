"use client";

import { useParams } from "next/navigation";
import { useGetSingleUser } from "@/features/auth/controllers/userController";
import { useGetEmployeeOnboarding } from "@/features/hr/controllers/employeeOnboardingController";
import { LoadingSpinner } from "@/components/Loading";
import Card from "@/components/Card";
import { User, Building2, ChevronUp } from "lucide-react";

interface SupervisorNode {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  position?: string | { name: string; [key: string]: any };
  department?: {
    id: string;
    name: string;
  };
  supervisor?: SupervisorNode;
}

const ReportingLine = () => {
  const { id } = useParams();

  // First try to get employee data
  const { data: employeeData, isLoading: employeeLoading, error: employeeError } = useGetEmployeeOnboarding(id as string, !!id);

  // Extract user ID from employee data
  const userId = employeeData?.data?.user?.id;

  // Get full user data with supervisor information
  const { data: userData, isLoading: userLoading } = useGetSingleUser(
    userId || "",
    !!userId
  );

  const isLoading = employeeLoading || userLoading;

  console.log("🔍 ReportingLine Debug:");
  console.log("  Employee Data:", employeeData);
  console.log("  User ID:", userId);
  console.log("  User Data:", userData);
  console.log("  User from employee:", employeeData?.data?.user);

  // Build the reporting chain from the employee up to the top
  const buildReportingChain = (user: any): SupervisorNode[] => {
    const chain: SupervisorNode[] = [];

    // Start with the current employee
    if (user) {
      chain.push({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        position: user.position,
        department: user.department,
        supervisor: user.supervisor
      });

      // Walk up the supervisor chain
      let currentSupervisor = user.supervisor;
      let maxLevels = 10; // Prevent infinite loops

      while (currentSupervisor && maxLevels > 0) {
        chain.push({
          id: currentSupervisor.id,
          first_name: currentSupervisor.first_name,
          last_name: currentSupervisor.last_name,
          email: currentSupervisor.email,
          position: currentSupervisor.position,
          department: currentSupervisor.department,
          supervisor: currentSupervisor.supervisor
        });

        currentSupervisor = currentSupervisor.supervisor;
        maxLevels--;
      }
    }

    return chain;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const user = userData?.data;

  if (!user) {
    return (
      <div className="p-8 text-center text-gray-500">
        No user data available
      </div>
    );
  }

  const reportingChain = buildReportingChain(user);

  // Reverse to show from top (MD) to bottom (employee)
  const hierarchyChain = [...reportingChain].reverse();

  return (
    <div className="space-y-6 py-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Organizational Reporting Structure</h2>
        <p className="text-gray-600">
          This chart shows the reporting hierarchy from the Managing Director down to the employee
        </p>
      </div>

      {hierarchyChain.length === 1 ? (
        <Card className="p-8 text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold mb-2">No Reporting Structure</h3>
          <p className="text-gray-500">
            This employee has no supervisor assigned
          </p>
        </Card>
      ) : (
        <div className="relative">
          {/* Vertical line connecting all boxes */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -ml-px"
               style={{ height: `calc(100% - 60px)` }} />

          <div className="space-y-6">
            {hierarchyChain.map((person, index) => {
              const isEmployee = index === hierarchyChain.length - 1;
              const isTopLevel = index === 0;
              const level = hierarchyChain.length - index - 1;

              return (
                <div key={person.id} className="relative">
                  {/* Connector from line to card */}
                  {!isTopLevel && (
                    <div className="absolute left-1/2 -top-3 w-0.5 h-3 bg-gray-200 -ml-px" />
                  )}

                  <Card
                    className={`relative mx-auto max-w-2xl p-6 transition-all ${
                      isEmployee
                        ? 'bg-blue-50 border-2 border-blue-300'
                        : 'bg-white hover:shadow-lg'
                    }`}
                  >
                    {/* Level badge */}
                    <div className="absolute -left-3 top-6 w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-600">
                      {level}
                    </div>

                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-lg ${
                        isEmployee ? 'bg-blue-500' : 'bg-gray-400'
                      }`}>
                        {person.first_name?.[0]}{person.last_name?.[0]}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">
                            {person.first_name} {person.last_name}
                          </h3>
                          {isEmployee && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                              You
                            </span>
                          )}
                          {isTopLevel && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                              Top Level
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 text-sm">
                          {person.position && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Building2 className="w-4 h-4" />
                              <span className="font-medium">
                                {typeof person.position === 'string'
                                  ? person.position
                                  : person.position.name}
                              </span>
                            </div>
                          )}

                          {person.department && (
                            <div className="text-gray-500">
                              Department: {person.department.name}
                            </div>
                          )}

                          <div className="text-gray-500">
                            {person.email}
                          </div>
                        </div>

                        {/* Role description */}
                        {!isEmployee && (
                          <div className="mt-3 text-xs text-gray-500">
                            {index === hierarchyChain.length - 2
                              ? "Direct Supervisor"
                              : `Level ${level} Manager`}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Downward arrow indicator */}
                    {!isEmployee && (
                      <div className="absolute -bottom-3 left-1/2 -ml-3 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <ChevronUp className="w-4 h-4 text-gray-500 transform rotate-180" />
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Direct Reports Section */}
      {user.direct_reports && user.direct_reports.length > 0 && (
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Direct Reports</h2>
            <p className="text-gray-600">
              People who directly report to{" "}
              {user.first_name} {user.last_name}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.direct_reports.map((report: any) => (
              <Card key={report.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                    {report.first_name?.[0]}{report.last_name?.[0]}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">
                      {report.first_name} {report.last_name}
                    </h3>

                    {report.position && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <Building2 className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                          {typeof report.position === 'string'
                            ? report.position
                            : report.position.name}
                        </span>
                      </div>
                    )}

                    {report.department && (
                      <div className="text-xs text-gray-500 mt-1 truncate">
                        {report.department.name}
                      </div>
                    )}

                    <div className="text-xs text-gray-400 mt-1 truncate">
                      {report.email}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <Card className="p-6 bg-gray-50 mt-8">
        <h3 className="font-semibold mb-4">Reporting Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-500 mb-1">Total Levels</div>
            <div className="font-semibold text-lg">{reportingChain.length}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Direct Supervisor</div>
            <div className="font-semibold">
              {reportingChain.length > 1
                ? `${reportingChain[1].first_name} ${reportingChain[1].last_name}`
                : "None"}
            </div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Direct Reports</div>
            <div className="font-semibold text-lg">
              {user.direct_reports?.length || 0}
            </div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Department</div>
            <div className="font-semibold">
              {user.department?.name || "Not assigned"}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportingLine;
