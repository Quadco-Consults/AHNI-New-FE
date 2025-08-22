import { useEffect, useState } from "react";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Button } from "components/ui/button";
import { DialogType, mediumDailogScreen } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import clsx from "clsx";
// import { Skeleton } from "components/ui/skeleton"; // assuming you have a Skeleton component

const Goals = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenDialog = () => {
    dispatch(
      openDialog({
        type: DialogType.CREATE_GOALS,
        dialogProps: {
          ...mediumDailogScreen,
          header: "Goals",
          data: "1",
        },
      })
    );
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full bg-muted'>
        <div
          className={clsx(
            "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"
          )}
        />
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center h-full bg-green-200'>
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
};

export default Goals;
