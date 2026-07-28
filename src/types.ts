export type ProjectIdea = {
  title: string;
  description: string;
  problemArea: string;
  targetAudience: string;
  gradeLevel: string;
  category: string;
};

export type GeneratedProject = {
  title: string;
  problem_statement: string;
  solution_summary: string;
  why_it_matters: string;
  uniqueness: string;
  feasibility: string;
  materials: string[];
  steps: string[];
  expected_outcome: string;
  pitch: string;
  improvements: string[];
};

export type Pitches = {
  pitch30s: string;
  pitch60s: string;
};

export type SavedProject = {
  id: string;
  createdAt: number;
  updatedAt: number;
  idea: ProjectIdea;
  output: GeneratedProject;
  pitches?: Pitches;
  isDraft?: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
};
