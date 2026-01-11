import Card from "@/components/Card";
import { IProjectSingleData } from "@/features/projects/types/project";
import PerformanceTracking from "./PerformanceTracking";
// import { formatNumberCurrency } from "@/utils/utls";

interface PerformanceProps extends IProjectSingleData {
  budget_performance_calculated?: {
    budget_performance_percentage: number;
  };
  achievement_against_target_calculated?: {
    achievement_percentage: number;
  };
  targets?: any[]; // Targets set during project creation
}

export default function Performance(props: PerformanceProps) {
  const {
    id,
    narrative,
    budget_performance_calculated,
    achievement_against_target_calculated,
    targets, // Targets set during project creation
  } = props;

  // Debug: Log what targets we're receiving from props (commented out for production)
  // console.log("📊 Performance component received targets:", targets);
  // console.log("📊 Targets type:", typeof targets);
  // console.log("📊 Is array:", Array.isArray(targets));

  return (
    <div className="space-y-6">
      {/* New Performance Tracking Section */}
      <PerformanceTracking
        projectId={id}
        projectTargets={targets || []}
      />

      {/* Legacy Performance Information */}
      <Card className='space-y-7'>
        <h4 className='font-semibold text-lg'>Additional Performance Information</h4>
        <hr />

        <div className='space-y-3'>
          <h3 className='font-semibold'>Legacy Achievement Calculation</h3>
          <p className='text-sm text-gray-500'>
            {achievement_against_target_calculated &&
              achievement_against_target_calculated?.achievement_percentage}
          </p>
        </div>

        <div className='space-y-3'>
          <h3 className='font-semibold'>Project Narrative</h3>
          <p className='text-sm text-gray-500'>{narrative}</p>
        </div>

        <div className='space-y-3'>
          <h3 className='font-semibold'>Budget Performance</h3>
          <p className='text-sm text-gray-500'>
            {budget_performance_calculated &&
              budget_performance_calculated?.budget_performance_percentage}%
          </p>
        </div>
      </Card>
    </div>
  );
}
