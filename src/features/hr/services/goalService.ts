"use client";

import { API_CONFIG } from '../config/api';

const API_BASE = API_CONFIG.BASE_URL;

export interface Goal {
  id?: string;
  employee: string;
  title: string;
  description?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  total_weight?: number;
}

export interface GoalNarrative {
  id?: string;
  goal: string;
  description: string;
  weight: number;
  completed?: boolean;
}

export interface CreateGoalData {
  employee: string;
  title: string;
  description?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  narratives?: Omit<GoalNarrative, 'id' | 'goal'>[];
}

export class GoalService {
  private backendAvailable: boolean | null = null;
  private lastHealthCheck: number = 0;
  private readonly HEALTH_CHECK_INTERVAL = 60000; // 1 minute

  private async checkBackendHealth(): Promise<boolean> {
    const now = Date.now();

    if (this.backendAvailable !== null && (now - this.lastHealthCheck) < this.HEALTH_CHECK_INTERVAL) {
      return this.backendAvailable;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${API_BASE}/health/`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      this.backendAvailable = response.ok;
      this.lastHealthCheck = now;
      return this.backendAvailable;
    } catch (error) {
      console.warn('Backend health check failed, using localStorage fallback:', error);
      this.backendAvailable = false;
      this.lastHealthCheck = now;
      return false;
    }
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const isBackendAvailable = await this.checkBackendHealth();

    if (!isBackendAvailable) {
      throw new Error('Backend not available, falling back to localStorage');
    }

    const url = `${API_BASE}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error ${response.status}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  private saveToLocalStorage(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  private getFromLocalStorage<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get from localStorage:', error);
      return null;
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Create multiple goals using the /hr/goals/ endpoint
  async createGoals(goalsData: CreateGoalData[]): Promise<Goal[]> {
    try {
      const createdGoals: Goal[] = [];

      for (const goalData of goalsData) {
        // Ensure narrative weights sum to 100 (backend requirement)
        if (goalData.narratives && goalData.narratives.length > 0) {
          const totalWeight = goalData.narratives.reduce((sum, n) => sum + n.weight, 0);
          if (totalWeight !== 100) {
            // Normalize weights to sum to 100
            goalData.narratives = goalData.narratives.map(narrative => ({
              ...narrative,
              weight: (narrative.weight / totalWeight) * 100
            }));
          }
        } else {
          // If no narratives, create a default one with weight 100
          goalData.narratives = [{
            description: goalData.title || 'Default goal narrative',
            weight: 100,
            completed: false,
          }];
        }

        // Use the updated endpoint /hr/goals/
        const response = await this.request<Goal>('/v1/hr/goals/', {
          method: 'POST',
          body: JSON.stringify(goalData),
        });
        createdGoals.push(response);
      }

      console.log('Goals created via backend API (/hr/goals/)');
      return createdGoals;
    } catch (error) {
      console.log('Backend failed, saving goals to localStorage');

      const existingGoals = this.getFromLocalStorage<Goal[]>('hr_goals') || [];

      const newGoals: Goal[] = goalsData.map(goalData => ({
        ...goalData,
        id: this.generateId(),
        status: goalData.status || 'pending',
        total_weight: goalData.narratives?.reduce((sum, n) => sum + n.weight, 0) || 0,
      }));

      const updatedGoals = [...existingGoals, ...newGoals];
      this.saveToLocalStorage('hr_goals', updatedGoals);

      if (goalsData.some(g => g.narratives?.length)) {
        const existingNarratives = this.getFromLocalStorage<GoalNarrative[]>('hr_goal_narratives') || [];
        const newNarratives: GoalNarrative[] = [];

        newGoals.forEach((goal, goalIndex) => {
          const goalData = goalsData[goalIndex];
          if (goalData.narratives) {
            goalData.narratives.forEach(narrative => {
              newNarratives.push({
                ...narrative,
                id: this.generateId(),
                goal: goal.id!,
              });
            });
          }
        });

        this.saveToLocalStorage('hr_goal_narratives', [...existingNarratives, ...newNarratives]);
      }

      return newGoals;
    }
  }

  // Get goals for an employee
  async getEmployeeGoals(employeeId: string): Promise<Goal[]> {
    try {
      const response = await this.request<Goal[]>(`/v1/hr/goals/?employee=${employeeId}`);
      console.log('Goals fetched from backend API (/hr/goals/)');
      return response;
    } catch (error) {
      console.log('Backend failed, fetching goals from localStorage');
      const existingGoals = this.getFromLocalStorage<Goal[]>('hr_goals') || [];
      return existingGoals.filter(goal => goal.employee === employeeId);
    }
  }

  // Update a goal
  async updateGoal(goalId: string, goalData: Partial<CreateGoalData>): Promise<Goal> {
    try {
      const response = await this.request<Goal>(`/v1/hr/goals/${goalId}/`, {
        method: 'PATCH',
        body: JSON.stringify(goalData),
      });
      console.log('Goal updated via backend API');
      return response;
    } catch (error) {
      console.log('Backend failed, updating goal in localStorage');
      const existingGoals = this.getFromLocalStorage<Goal[]>('hr_goals') || [];
      const goalIndex = existingGoals.findIndex(goal => goal.id === goalId);

      if (goalIndex === -1) {
        throw new Error('Goal not found');
      }

      existingGoals[goalIndex] = { ...existingGoals[goalIndex], ...goalData };
      this.saveToLocalStorage('hr_goals', existingGoals);
      return existingGoals[goalIndex];
    }
  }

  // Delete a goal
  async deleteGoal(goalId: string): Promise<void> {
    try {
      await this.request(`/v1/hr/goals/${goalId}/`, {
        method: 'DELETE',
      });
      console.log('Goal deleted via backend API');
    } catch (error) {
      console.log('Backend failed, deleting goal from localStorage');
      const existingGoals = this.getFromLocalStorage<Goal[]>('hr_goals') || [];
      const updatedGoals = existingGoals.filter(goal => goal.id !== goalId);
      this.saveToLocalStorage('hr_goals', updatedGoals);

      const existingNarratives = this.getFromLocalStorage<GoalNarrative[]>('hr_goal_narratives') || [];
      const updatedNarratives = existingNarratives.filter(narrative => narrative.goal !== goalId);
      this.saveToLocalStorage('hr_goal_narratives', updatedNarratives);
    }
  }
}

export const goalService = new GoalService();