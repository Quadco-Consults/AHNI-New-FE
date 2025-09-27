// Simple local storage for goals until backend is ready
export interface StoredGoal {
  id: string;
  goal: string;
  competency: string;
  weight: string;
  employee_id: string;
  created_at: string;
  updated_at: string;
}

const GOALS_STORAGE_KEY = 'employee_goals';

export const goalsStorage = {
  // Get all goals for an employee
  getEmployeeGoals: (employeeId: string): StoredGoal[] => {
    try {
      const stored = localStorage.getItem(GOALS_STORAGE_KEY);
      if (!stored) return [];

      const allGoals: StoredGoal[] = JSON.parse(stored);
      return allGoals.filter(goal => goal.employee_id === employeeId);
    } catch (error) {
      console.error('Error reading goals from storage:', error);
      return [];
    }
  },

  // Add goals for an employee
  addGoals: (employeeId: string, newGoals: Omit<StoredGoal, 'id' | 'created_at' | 'updated_at'>[]): StoredGoal[] => {
    try {
      const stored = localStorage.getItem(GOALS_STORAGE_KEY);
      const allGoals: StoredGoal[] = stored ? JSON.parse(stored) : [];

      const now = new Date().toISOString();
      const goalsWithIds: StoredGoal[] = newGoals.map(goal => ({
        ...goal,
        id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: now,
        updated_at: now,
      }));

      const updatedGoals = [...allGoals, ...goalsWithIds];
      localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(updatedGoals));

      return goalsWithIds;
    } catch (error) {
      console.error('Error saving goals to storage:', error);
      return [];
    }
  },

  // Delete a goal
  deleteGoal: (goalId: string): boolean => {
    try {
      const stored = localStorage.getItem(GOALS_STORAGE_KEY);
      if (!stored) return false;

      const allGoals: StoredGoal[] = JSON.parse(stored);
      const updatedGoals = allGoals.filter(goal => goal.id !== goalId);

      localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(updatedGoals));
      return true;
    } catch (error) {
      console.error('Error deleting goal from storage:', error);
      return false;
    }
  },

  // Clear all goals for debugging
  clearAll: () => {
    localStorage.removeItem(GOALS_STORAGE_KEY);
  }
};