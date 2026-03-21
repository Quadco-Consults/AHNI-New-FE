import Card from "@/components/Card";
import { IProjectSingleData } from "@/features/projects/types/project";
import PerformanceTracking from "./PerformanceTracking";
import { TrendingUp, DollarSign, Target } from "lucide-react";
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

      {/* Additional Performance Information */}
      <Card className='p-6 shadow-lg'>
        <div className='border-b pb-4 mb-6'>
          <h4 className='font-semibold text-xl text-gray-800'>Additional Performance Information</h4>
          <p className='text-sm text-gray-500 mt-1'>Supplementary metrics and project details</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Legacy Achievement Card */}
          <div className='bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200'>
            <div className='flex items-center gap-2 mb-3'>
              <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
                <TrendingUp className='w-4 h-4 text-white' />
              </div>
              <h3 className='font-semibold text-green-900'>Achievement</h3>
            </div>
            <div className='space-y-2'>
              <p className='text-3xl font-bold text-green-700'>
                {achievement_against_target_calculated?.achievement_percentage || 0}%
              </p>
              <p className='text-xs text-green-600'>Legacy calculation method</p>
            </div>
          </div>

          {/* Budget Performance Card */}
          <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200'>
            <div className='flex items-center gap-2 mb-3'>
              <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
                <DollarSign className='w-4 h-4 text-white' />
              </div>
              <h3 className='font-semibold text-blue-900'>Budget Performance</h3>
            </div>
            <div className='space-y-2'>
              <p className='text-3xl font-bold text-blue-700'>
                {budget_performance_calculated?.budget_performance_percentage || 0}%
              </p>
              <div className='w-full bg-blue-200 rounded-full h-2 mt-2'>
                <div
                  className='bg-blue-600 h-2 rounded-full transition-all'
                  style={{
                    width: `${Math.min(budget_performance_calculated?.budget_performance_percentage || 0, 100)}%`
                  }}
                ></div>
              </div>
              <p className='text-xs text-blue-600'>Funds utilized vs allocated</p>
            </div>
          </div>

          {/* Project Narrative Card */}
          <div className='bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200 md:col-span-1'>
            <div className='flex items-center gap-2 mb-3'>
              <div className='w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center'>
                <Target className='w-4 h-4 text-white' />
              </div>
              <h3 className='font-semibold text-purple-900'>Status</h3>
            </div>
            <div className='space-y-2'>
              <p className='text-sm text-purple-700 leading-relaxed line-clamp-4'>
                {narrative || 'No narrative provided'}
              </p>
            </div>
          </div>
        </div>

        {/* Full Narrative Section */}
        {narrative && narrative.length > 100 && (
          <div className='mt-6 p-5 bg-gray-50 rounded-lg border border-gray-200'>
            <h3 className='font-semibold text-gray-800 mb-3'>Full Project Narrative</h3>
            <p className='text-sm text-gray-700 leading-relaxed'>{narrative}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
