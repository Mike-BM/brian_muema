export type AccessLevel = 'Free' | 'Premium';

export interface LessonResource {
  name: string;
  type: 'notebook' | 'pdf' | 'dataset' | 'code' | 'link';
  url: string;
}

export interface LearningLesson {
  id: string;
  lessonNumber: number;
  title: string;
  slug: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  access: AccessLevel;
  summary: string;
  learningObjectives: string[];
  keyTopics: string[];
  practicalExercise?: {
    title: string;
    instructions: string;
    datasetHint?: string;
  };
  codeSnippet?: {
    language: string;
    code: string;
    caption: string;
  };
  resources?: LessonResource[];
}

export interface LearningPath {
  id: string;
  slug: string; // 'data-analysis' | 'data-science'
  title: string;
  shortTitle: string;
  headline: string;
  description: string;
  detailedOverview: string;
  level: string;
  duration: string;
  prerequisites: string[];
  targetAudience: string[];
  learningObjectives: string[];
  lessons: LearningLesson[];
  featuredTechnologies: string[];
  careerOpportunities: string[];
}

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  category: 'Data Analysis' | 'Data Science' | 'General';
  type: 'notes' | 'pdf' | 'notebook' | 'dataset' | 'exercise' | 'tutorial';
  access: AccessLevel;
  format: string; // e.g. "PDF", "Jupyter (.ipynb)", "CSV", "Markdown", "Video"
  fileSize?: string;
  downloadUrl?: string;
  externalUrl?: string;
  topic: string;
  tags: string[];
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  format: 'Online' | 'Physical';
  location: string; // e.g., "Google Meet / Zoom" or "Campus Lab 3, Nairobi"
  status: 'upcoming' | 'completed';
  objectives: string[];
  targetAudience: string;
  registrationOpen: boolean;
  registrationLink?: string;
  materialsLink?: string;
  access: AccessLevel;
  highlightRecap?: string;
}

export interface PracticalProject {
  id: string;
  slug: string;
  title: string;
  category: 'Data Analysis' | 'Data Science';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  access: AccessLevel;
  problemStatement: string;
  datasetName: string;
  datasetDescription: string;
  datasetUrl?: string;
  datasetSize?: string;
  technologies: string[];
  stepByStepInstructions: string[];
  expectedOutput: string[];
  githubUrl?: string;
  resourceLink?: string;
}

export interface LearnerShowcase {
  id: string;
  learnerName: string;
  role: string;
  cohort: string;
  projectTitle: string;
  description: string;
  image?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  quote: string;
  publishedWithConsent: boolean;
}

export interface LearningHubData {
  paths: LearningPath[];
  resources: LearningResource[];
  workshops: Workshop[];
  projects: PracticalProject[];
  learnerShowcase: LearnerShowcase[];
}
