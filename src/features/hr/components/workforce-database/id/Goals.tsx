import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import { Button } from "@/components/ui/button";
import { DialogType, mediumDailogScreen } from "@/constants/dialogs";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit } from "lucide-react";
import { useGetEmployeeGoals, Goal } from "@/features/hr/controllers/goalsController";
import { LoadingSpinner } from "@/components/Loading";
import { goalsStorage, StoredGoal } from "@/features/hr/utils/goalsStorage";

const Goals = () => {
  const params = useParams();
  const id = params?.id as string;
  const dispatch = useAppDispatch();
  const [localGoals, setLocalGoals] = useState<StoredGoal[]>([]);

  // Try API first, fallback to local storage
  const { data: apiGoalsData, isLoading, error, refetch } = useGetEmployeeGoals(id, !!id);

  const handleOpenDialog = () => {
    dispatch(
      openDialog({
        type: DialogType.CREATE_GOALS,
        dialogProps: {
          ...mediumDailogScreen,
          header: "Create Goals",
          data: id,
        },
      })
    );
  };

  const handleDeleteGoal = (goalId: string) => {
    const success = goalsStorage.deleteGoal(goalId);
    if (success) {
      setLocalGoals(goalsStorage.getEmployeeGoals(id));
    }
  };

  // Load goals from local storage on component mount and when id changes
  useEffect(() => {
    if (id) {
      const storedGoals = goalsStorage.getEmployeeGoals(id);
      setLocalGoals(storedGoals);
    }
  }, [id]);

  // Listen for storage changes (when goals are added from modal)
  useEffect(() => {
    const handleStorageChange = () => {
      if (id) {
        const updatedGoals = goalsStorage.getEmployeeGoals(id);
        setLocalGoals(updatedGoals);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('goals-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('goals-updated', handleStorageChange);
    };
  }, [id]);

  // Determine which goals to show: API data if available, otherwise local storage
  const goals = apiGoalsData?.data?.length ? apiGoalsData.data : localGoals;
  const hasApiData = !!apiGoalsData?.data?.length;

  console.log("API Goals:", apiGoalsData);
  console.log("Local Goals:", localGoals);
  console.log("Using API data:", hasApiData);

  // Always show create button, even if there are goals
  if (goals.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-64 space-y-4'>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Goals Found</h3>
          <p className="text-gray-500 mb-6">This employee hasn't set any goals yet.</p>
        </div>
        <Button
          className='flex gap-2 py-6'
          type='button'
          onClick={handleOpenDialog}
        >
          <AddSquareIcon />
          <p>Create Goals</p>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Employee Goals ({goals.length})</h2>
        <Button
          className='flex gap-2'
          type='button'
          onClick={handleOpenDialog}
        >
          <AddSquareIcon />
          <p>Add Goal</p>
        </Button>
      </div>

      <div className="grid gap-4">
        {goals.map((goal: any) => {
          const totalWeight = goal.total_weight || goal.narratives?.reduce((sum: number, n: any) => sum + parseFloat(n.weight || 0), 0);

          return (
            <Card key={goal.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-medium">
                        {goal.title}
                      </CardTitle>
                      <Badge variant="outline" className="whitespace-nowrap">
                        {parseFloat(totalWeight).toFixed(0)}%
                      </Badge>
                    </div>
                    {goal.description && (
                      <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 items-start">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {/* Narratives/Tasks */}
                {goal.narratives && goal.narratives.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Tasks:</p>
                    <ul className="space-y-1">
                      {goal.narratives.map((narrative: any, idx: number) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          <span className="flex-1">{narrative.description}</span>
                          <Badge variant="secondary" className="text-xs">
                            {parseFloat(narrative.weight).toFixed(0)}%
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-gray-500 border-t pt-2">
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    <span className="capitalize">{goal.status?.replace('_', ' ') || "not started"}</span>
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>{" "}
                    {new Date(goal.created_datetime || goal.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Goals;
