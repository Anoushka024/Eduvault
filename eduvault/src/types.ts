export interface College {
  id: string;
  name: string;
  location: string;
  country: string;
  ranking: number;
  acceptanceRate: number;
  avgGPA: number;
  avgSAT: number;
  avgACT: number;
  tuition: number;
  financialAid: string;
  logo: string;
  image: string;
  description: string;
  majors: string[];
  campusLife: string;
  admissionDeadline: string;
  graduationRate: number;
  studentBodySize: number;
}

export type ApplicationStatus = 'Draft' | 'Applied' | 'Under Review' | 'Accepted' | 'Deferred' | 'Rejected';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Application {
  id: string;
  collegeId: string;
  collegeName: string;
  course: string;
  status: ApplicationStatus;
  term: string;
  deadline: string;
  checklist: ChecklistItem[];
  notes: string;
}

export interface PredictionInput {
  gpa: number;
  sat: number;
  act: number;
  extracurriculars: number; // 1-5
  apCount: number;
  major: string;
  state: string;
}

export interface PredictionDetail {
  chance: number; // 0-100
  category: 'Reach' | 'Target' | 'Safety';
  factorGPA: number;
  factorSAT: number;
  factorEC: number;
  factorAP: number;
}

export interface PredictionRecord {
  id: string;
  timestamp: string;
  input: PredictionInput;
  results: Record<string, PredictionDetail>; // collegeId -> PredictDetail
}

export interface UserSession {
  isLoggedIn: boolean;
  name: string;
  email: string;
  gpa: number;
  sat: number;
  act: number;
  extracurriculars: number;
  apCount: number;
  major: string;
  savedColleges: string[]; // college IDs
  savedCourses: string[]; // course titles/IDs, format e.g. "Harvard University - Computer Science"
}

export type ActivePage =
  | 'home'
  | 'auth'
  | 'dashboard'
  | 'tracker'
  | 'explore'
  | 'details'
  | 'compare'
  | 'saved'
  | 'predictor'
  | 'predictor-results'
  | 'predictor-history';
