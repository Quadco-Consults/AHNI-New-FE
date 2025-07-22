import Card from "components/shared/Card";
import { TProjectData } from "definations/project";
import { formatNumberCurrency } from "utils/utls";

export default function Performance(props: TProjectData) {
  const {
    achievement_against_target,
    narrative,
    budget_performance,
    currency,
  } = props;
  console.log({
    achievement_against_target,
    narrative,
    budget_performance,
    currency,
  });

  return (
    <Card className='space-y-7'>
      <h4 className='font-semibold text-lg'>Project Performance</h4>
      <hr />

      <div className='space-y-3'>
        <h3 className='font-semibold'>Achievement against the target</h3>
        <p className='text-sm text-gray-500'>
          {achievement_against_target || "N/A"}
        </p>
      </div>

      <div className='space-y-3'>
        <h3 className='font-semibold'>Narrative</h3>
        <p className='text-sm text-gray-500'>{narrative}</p>
      </div>

      <div className='space-y-3'>
        <h3 className='font-semibold'>Budget performance</h3>
        <p className='text-sm text-gray-500'>
          {budget_performance === "0"
            ? "Null"
            : formatNumberCurrency(budget_performance, currency)}
        </p>
      </div>
    </Card>
  );
}
