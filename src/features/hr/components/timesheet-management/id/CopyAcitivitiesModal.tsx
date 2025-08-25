import { Checkbox } from "components/ui/checkbox";
import { Button } from "components/ui/button";
import { CardContent } from "components/ui/card";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";

type Activity = {
  name: string;
  activity: string;
};

type DialogProps = {
  // eslint-disable-next-line no-unused-vars
  onAddActivities?: (activities: Activity[]) => void;
  // You can add other props like header, data, etc.
};

const availableTimesheets: Activity[] = [
  { name: "ACEBAY", activity: "111.0004 ACE Shared" },
  { name: "BRAVOTEC", activity: "222.0008 Development" },
  { name: "OMNISOFT", activity: "333.0012 QA Testing" },
];

export default function CopyActivitiesModal() {
  const dispatch = useAppDispatch();
  const { dialogProps } = useAppSelector(dailogSelector) as {
    dialogProps: DialogProps;
  };

  const [selected, setSelected] = useState<string[]>([]);

  const onAddActivities = dialogProps?.onAddActivities;

  const toggleSelection = (activityName: string) => {
    setSelected((prev) =>
      prev.includes(activityName)
        ? prev.filter((n) => n !== activityName)
        : [...prev, activityName]
    );
  };

  const handleConfirm = () => {
    const selectedActivities = availableTimesheets.filter((a) =>
      selected.includes(a.activity)
    );

    if (typeof onAddActivities === "function") {
      onAddActivities(selectedActivities);
    }

    setSelected([]);
    dispatch(closeDialog());
  };

  return (
    <CardContent>
      <div className='space-y-2'>
        {availableTimesheets.map((activity) => (
          <div key={activity.activity} className='flex items-center gap-2'>
            <Checkbox
              checked={selected.includes(activity.activity)}
              onCheckedChange={() => toggleSelection(activity.activity)}
            />
            <div>
              <p className='font-medium'>{activity.name}</p>
              <p className='text-sm text-muted-foreground'>
                {activity.activity}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={handleConfirm} disabled={selected.length === 0}>
        Add Selected
      </Button>
    </CardContent>
  );
}
