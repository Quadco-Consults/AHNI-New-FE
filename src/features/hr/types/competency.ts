// Competency types for performance evaluation
export interface Competency {
  id?: string;
  name: string;
  category: CompetencyCategory;
  description?: string;
  weight: number; // Percentage weight in evaluation
  active: boolean;
  job_titles?: string[]; // Applicable job titles
  created_datetime?: string;
  updated_datetime?: string;
}

export type CompetencyCategory =
  | 'technical' // Technical skills and knowledge
  | 'behavioral' // Soft skills, teamwork, communication
  | 'leadership' // Leadership and management skills
  | 'core' // Core company values
  | 'custom'; // Custom categories

export interface CompetencyRating {
  id?: string;
  competency_id: string;
  competency_name?: string;
  assessment_id: string;
  evaluator_id: string;
  rating: number; // 1-5 scale
  comments?: string;
  created_datetime?: string;
  updated_datetime?: string;
}

// Default OrangeHRM-style competencies
export const DEFAULT_COMPETENCIES: Omit<Competency, 'id' | 'created_datetime' | 'updated_datetime'>[] = [
  {
    name: 'Job Knowledge',
    category: 'technical',
    description: 'Understanding of job requirements and ability to apply knowledge effectively',
    weight: 20,
    active: true,
  },
  {
    name: 'Quality of Work',
    category: 'technical',
    description: 'Accuracy, thoroughness, and completeness of work',
    weight: 15,
    active: true,
  },
  {
    name: 'Productivity',
    category: 'technical',
    description: 'Volume of work completed in given timeframe',
    weight: 15,
    active: true,
  },
  {
    name: 'Communication',
    category: 'behavioral',
    description: 'Effectiveness in written and verbal communication',
    weight: 10,
    active: true,
  },
  {
    name: 'Teamwork',
    category: 'behavioral',
    description: 'Ability to work collaboratively with others',
    weight: 10,
    active: true,
  },
  {
    name: 'Accountability',
    category: 'behavioral',
    description: 'Takes ownership and responsibility for actions and results',
    weight: 10,
    active: true,
  },
  {
    name: 'Problem Solving',
    category: 'technical',
    description: 'Ability to identify and resolve issues effectively',
    weight: 10,
    active: true,
  },
  {
    name: 'Initiative',
    category: 'behavioral',
    description: 'Self-motivation and proactive approach to work',
    weight: 10,
    active: true,
  },
];
