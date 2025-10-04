import { Goal, GoalRating, PerformanceAssesment, Evaluator } from "../types/performance-assesment";

/**
 * Calculate the average rating for a single goal from all evaluator ratings
 */
export const calculateGoalAverageRating = (goalRatings: GoalRating[]): number => {
  if (!goalRatings || goalRatings.length === 0) return 0;

  const sum = goalRatings.reduce((total, rating) => total + rating.rating, 0);
  const average = sum / goalRatings.length;

  // Round to 2 decimal places
  return Math.round(average * 100) / 100;
};

/**
 * Calculate weighted average for all goals
 * Formula: Sum of (goal_rating * goal_weight) / 100
 */
export const calculateWeightedAverageRating = (goals: Goal[]): number => {
  if (!goals || goals.length === 0) return 0;

  // First, ensure all goals have average ratings
  const goalsWithAverages = goals.map(goal => ({
    ...goal,
    average_rating: goal.average_rating || calculateGoalAverageRating(goal.ratings || [])
  }));

  // Check if weights sum to 100
  const totalWeight = goalsWithAverages.reduce((sum, goal) => sum + (goal.weight || 0), 0);

  if (totalWeight !== 100) {
    console.warn(`Goal weights sum to ${totalWeight}, expected 100`);
  }

  // Calculate weighted average
  const weightedSum = goalsWithAverages.reduce((sum, goal) => {
    const weight = goal.weight || 0;
    const rating = goal.average_rating || 0;
    return sum + (rating * weight / 100);
  }, 0);

  return Math.round(weightedSum * 100) / 100;
};

/**
 * Calculate final rating for an assessment
 * This is called after all evaluators have submitted their ratings
 */
export const calculateFinalRating = (assessment: PerformanceAssesment): number => {
  const goals = assessment.goals || [];

  if (goals.length === 0) return 0;

  // Update each goal with its average rating
  const updatedGoals = goals.map(goal => ({
    ...goal,
    average_rating: calculateGoalAverageRating(goal.ratings || [])
  }));

  // Calculate overall weighted average
  return calculateWeightedAverageRating(updatedGoals);
};

/**
 * Check if all evaluators have completed their evaluations
 */
export const areAllEvaluationsComplete = (evaluators: Evaluator[]): boolean => {
  if (!evaluators || evaluators.length === 0) return false;
  return evaluators.every(ev => ev.status === 'completed');
};

/**
 * Get evaluation completion percentage
 */
export const getEvaluationProgress = (evaluators: Evaluator[]): number => {
  if (!evaluators || evaluators.length === 0) return 0;

  const completedCount = evaluators.filter(ev => ev.status === 'completed').length;
  const percentage = (completedCount / evaluators.length) * 100;

  return Math.round(percentage);
};

/**
 * Determine the next status for an assessment based on evaluator progress
 */
export const determineAssessmentStatus = (assessment: PerformanceAssesment): string => {
  const evaluators = assessment.evaluators || [];

  if (evaluators.length === 0) return 'draft';

  const completedCount = evaluators.filter(ev => ev.status === 'completed').length;
  const selfEvaluator = evaluators.find(ev => ev.evaluator_type === 'self');

  // If no one has started
  if (completedCount === 0) {
    // Check if self-evaluation should happen first
    if (selfEvaluator && selfEvaluator.status === 'pending') {
      return 'pending_self';
    }
    return 'pending_evaluators';
  }

  // If everyone is done
  if (areAllEvaluationsComplete(evaluators)) {
    return 'completed';
  }

  // Some evaluations are done
  return 'in_progress';
};

/**
 * Get rating label from numeric rating
 */
export const getRatingLabel = (rating: number): string => {
  if (rating >= 4.5) return 'Outstanding';
  if (rating >= 3.5) return 'Exceeds Expectations';
  if (rating >= 2.5) return 'Meets Expectations';
  if (rating >= 1.5) return 'Below Expectations';
  return 'Needs Improvement';
};

/**
 * Get rating color class from numeric rating
 */
export const getRatingColor = (rating: number): string => {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 3.5) return 'text-blue-600';
  if (rating >= 2.5) return 'text-yellow-600';
  if (rating >= 1.5) return 'text-orange-600';
  return 'text-red-600';
};
